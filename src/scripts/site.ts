// Site-wide behaviour, one small module on every page (CSP: script-src 'self', so nothing is inline).
// Identical on nextgenergy.ai and tsingchain.cn: every visible string comes from the markup.
// Everything here is an enhancement: with scripts off the page reads and navigates as before.
const d = document;
const $ = <T extends HTMLElement>(s: string, r: ParentNode = d) => r.querySelector<T>(s);
const $$ = <T extends HTMLElement>(s: string, r: ParentNode = d) => [...r.querySelectorAll<T>(s)];

// ---- Phone menu: locks page scroll while open; closes on Esc, on a tap outside, when focus leaves the header, and at desktop width.
const btn = $<HTMLButtonElement>('[data-menu]');
const menu = d.getElementById('mnav');
const scrim = $('[data-menu-scrim]');
const hdr = btn?.closest('.hdr');
const isOpen = () => !!menu?.classList.contains('open');
const setMenu = (open: boolean, refocus = false) => {
  if (!btn || !menu) return;
  menu.classList.toggle('open', open);
  d.documentElement.classList.toggle('menu-open', open);
  btn.setAttribute('aria-expanded', String(open));
  const label = $('[data-menu-label]', btn);
  if (label) label.textContent = (open ? btn.dataset.labelOpen : btn.dataset.labelClosed) ?? '';
  if (scrim) scrim.hidden = !open;
  if (open) $('a', menu)?.focus({ preventScroll: true });
  else if (refocus) btn.focus();
};
btn?.addEventListener('click', () => setMenu(!isOpen(), true));
scrim?.addEventListener('click', () => setMenu(false));
hdr?.addEventListener('focusout', (e) => {
  const to = (e as FocusEvent).relatedTarget as Node | null;
  if (isOpen() && to && !hdr.contains(to)) setMenu(false);
});
matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches && isOpen()) setMenu(false); });

// ---- Desktop dropdowns. One panel at a time, opened by hover (with intent), by the caret button, or by the arrow keys.
const nav = $('.nav');
const items = $$('[data-dd]');
const shut = (it: HTMLElement, refocus = false) => {
  it.classList.remove('open');
  const b = $('button', it);
  b?.setAttribute('aria-expanded', 'false');
  if (refocus) b?.focus();
};
const show = (it: HTMLElement) => {
  items.forEach((o) => o !== it && shut(o));
  it.classList.add('open');
  $('button', it)?.setAttribute('aria-expanded', 'true');
};
const opened = () => items.find((it) => it.classList.contains('open'));
// Hover intent. A panel opens 90 ms after the pointer settles on its item and closes 240 ms after it leaves, so a pointer
// that only crosses the bar opens nothing and a small overshoot does not close what was open. While one panel is open,
// a pointer heading for it (inside the triangle from its last position to the panel's top corners) may cross a neighbour
// without switching panels; any other move to a neighbour switches almost at once.
let tOpen = 0, tShut = 0, prev = [0, 0], cur = [0, 0];
const side = (a: number[], b: number[], c: number[]) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
const aiming = (p: number[]) => {
  const on = opened();
  const dd = on && $('.dd', on)?.getBoundingClientRect();
  if (!dd || p[1] <= prev[1]) return false;
  const a = [dd.left, dd.top], b = [dd.right, dd.top];
  const s1 = side(p, prev, a), s2 = side(p, a, b), s3 = side(p, b, prev);
  return !((s1 < 0 || s2 < 0 || s3 < 0) && (s1 > 0 || s2 > 0 || s3 > 0));
};
nav?.classList.add('js');
nav?.addEventListener('pointermove', (e) => { prev = cur; cur = [e.clientX, e.clientY]; });
items.forEach((it) => {
  $('button', it)?.addEventListener('click', () => { clearTimeout(tOpen); if (it.classList.contains('open')) shut(it); else show(it); });
  it.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(tShut); clearTimeout(tOpen);
    const other = opened();
    if (other === it) return;
    tOpen = window.setTimeout(() => show(it), !other ? 90 : aiming([e.clientX, e.clientY]) ? 320 : 40);
  });
  it.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(tOpen);
    tShut = window.setTimeout(() => items.forEach((o) => o.contains(d.activeElement) || shut(o)), 240);
  });
  it.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k !== 'ArrowDown' && k !== 'ArrowUp') return;
    e.preventDefault();
    show(it);
    const l = $$('.dd a', it), i = l.indexOf(d.activeElement as HTMLElement);
    l[(i + (k === 'ArrowDown' ? 1 : l.length - (i < 0 ? 0 : 1))) % l.length].focus();
  });
  it.addEventListener('focusout', (e) => { if (!it.contains(e.relatedTarget as Node)) shut(it); });
});
d.addEventListener('click', (e) => items.forEach((it) => it.contains(e.target as Node) || shut(it)));
d.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const on = opened();
  if (on) { clearTimeout(tOpen); shut(on, on.contains(d.activeElement)); }
  else if (isOpen()) { e.preventDefault(); setMenu(false, true); }
});

// ---- Site search: a native <dialog>. Its code and its index are fetched the first time it is opened.
const sbox = d.getElementById('srch') as HTMLDialogElement | null;
$$('[data-search]').forEach((b) => {
  if (!sbox?.showModal) { b.hidden = true; return; }
  b.addEventListener('click', async () => { setMenu(false); sbox.showModal(); $<HTMLInputElement>('input', sbox)?.select(); (await import('./search')).default(sbox); });
});

// ---- Printing: collapsed notes (<details data-print>) are opened for the printout and closed again afterwards.
let shut4print: HTMLDetailsElement[] = [];
addEventListener('beforeprint', () => { shut4print = $$<HTMLDetailsElement>('details[data-print]:not([open])'); shut4print.forEach((x) => (x.open = true)); });
addEventListener('afterprint', () => { shut4print.forEach((x) => (x.open = false)); shut4print = []; });

// ---- Scroll-driven bits, one rAF-throttled handler: the shorter header, back-to-top, article reading progress, current-section highlight.
const toTop = $('[data-top]');
const bar = $('[data-progress]');
const art = bar && $('article');
const spies = $$('[data-spy]').map((nav) => ({
  nav,
  cur: null as HTMLElement | null,
  links: $$<HTMLAnchorElement>('a[href^="#"]', nav).map((a) => [a, d.getElementById(decodeURIComponent(a.hash.slice(1)))] as const).filter((x) => x[1]),
}));
let queued = 0, small = false;
const onScroll = () => {
  queued = 0;
  const vh = innerHeight;
  // The header gets shorter past 72 px and full height again above 24 px; the gap between the two stops it flickering.
  if (small !== (small = scrollY > (small ? 24 : 72))) d.documentElement.classList.toggle('scrolled', small);
  if (toTop) toTop.hidden = scrollY < vh * 1.5;
  if (bar && art) {
    const r = art.getBoundingClientRect();
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, -r.top / (r.height - vh)))})`;
  }
  for (const s of spies) {
    let cur: HTMLElement | null = null;
    for (const [a, h] of s.links) if (h!.getBoundingClientRect().top < 150) cur = a;
    if (cur === s.cur) continue;
    s.cur?.removeAttribute('aria-current');
    cur?.setAttribute('aria-current', 'true');
    s.cur = cur;
    if (cur && s.nav.dataset.spy === 'x') { const row = cur.parentElement!; row.scrollLeft = cur.offsetLeft - 16; }
  }
};
addEventListener('scroll', () => { queued ||= requestAnimationFrame(onScroll); }, { passive: true });
onScroll();
toTop?.addEventListener('click', () => { scrollTo(0, 0); $('#main')?.focus({ preventScroll: true }); });

// ---- Article contents: a collapsed disclosure on phones, opened where it sits beside the text.
const toc = $<HTMLDetailsElement>('[data-toc]');
if (toc && matchMedia('(min-width: 1320px)').matches) toc.open = true;

// ---- Scroll reveal for cards and numbered blocks below the fold. Nothing is hidden unless this runs,
// and it does not run when the visitor asks for reduced motion.
if (matchMedia('(prefers-reduced-motion: no-preference)').matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.replace('rv', 'rv-in');
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -6% 0px' });
  $$('main .card, main .bounds > li').forEach((el) => {
    if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('rv'); io.observe(el); }
  });
}
