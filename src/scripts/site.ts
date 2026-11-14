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

// ---- Desktop dropdowns. Hover opens them in CSS; the chevron button, arrow keys and Esc are handled here.
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
  it.classList.remove('off');
  $('button', it)?.setAttribute('aria-expanded', 'true');
};
items.forEach((it) => {
  $('button', it)?.addEventListener('click', () => (it.classList.contains('open') ? shut(it) : show(it)));
  it.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'Escape') { shut(it, it.contains(d.activeElement)); it.classList.add('off'); }
    if (k !== 'ArrowDown' && k !== 'ArrowUp') return;
    e.preventDefault();
    show(it);
    const l = $$('.dd a', it), i = l.indexOf(d.activeElement as HTMLElement);
    l[(i + (k === 'ArrowDown' ? 1 : l.length - (i < 0 ? 0 : 1))) % l.length].focus();
  });
  it.addEventListener('focusout', (e) => { if (!it.contains(e.relatedTarget as Node)) shut(it); });
  for (const ev of ['mouseenter', 'mouseleave']) it.addEventListener(ev, () => it.classList.remove('off'));
});
d.addEventListener('click', (e) => items.forEach((it) => it.contains(e.target as Node) || shut(it)));
d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) { e.preventDefault(); setMenu(false, true); } });

// ---- Scroll-driven bits, one rAF-throttled handler: back-to-top, article reading progress, current-section highlight.
const toTop = $('[data-top]');
const bar = $('[data-progress]');
const art = bar && $('article');
const spies = $$('[data-spy]').map((nav) => ({
  nav,
  cur: null as HTMLElement | null,
  links: $$<HTMLAnchorElement>('a[href^="#"]', nav).map((a) => [a, d.getElementById(decodeURIComponent(a.hash.slice(1)))] as const).filter((x) => x[1]),
}));
let queued = 0;
const onScroll = () => {
  queued = 0;
  const vh = innerHeight;
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
if (toTop || bar || spies.length) {
  addEventListener('scroll', () => { queued ||= requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();
}
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
