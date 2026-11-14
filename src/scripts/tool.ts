// Shared by the calculators (identical on both sites; every visible string is passed in or read from the markup):
// restore inputs from the URL fragment, copy a link to the current inputs, per-field range messages, phone result bar.
const d = document;
const byId = (id: string) => d.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;

/** Set inputs from #id=value&… pairs (the fragment never reaches the server or analytics). A value is used only if it is a number, or one of the options of a select. */
export function restore(ids: string[]) {
  const q = new URLSearchParams(location.hash.slice(1));
  for (const id of ids) {
    const el = byId(id), v = q.get(id);
    if (!el || v === null || v === '') continue;
    if (el instanceof HTMLSelectElement ? [...el.options].some((o) => o.value === v) : Number.isFinite(+v)) el.value = v;
  }
}

/** "Copy link" button: writes the inputs into this page's URL fragment and copies the address. */
export function share(ids: string[]) {
  const b = d.querySelector<HTMLElement>('[data-share]'), st = d.querySelector('[data-share-status]');
  b?.addEventListener('click', async () => {
    const u = new URL(location.pathname, location.origin), q = new URLSearchParams();
    ids.forEach((id) => q.set(id, byId(id)!.value));
    u.hash = q.toString();
    history.replaceState(null, '', u);
    let ok = true;
    try { await navigator.clipboard.writeText(u.href); } catch { ok = false; }
    if (!st) return;
    st.textContent = (ok ? b.dataset.done : b.dataset.fail) ?? '';
    setTimeout(() => (st.textContent = ''), 5000);
  });
}

/** Range check for a number input, with the message shown under its field. Returns true when the value is usable. */
export function inRange(el: HTMLInputElement, lo: number, hi: number, text: string) {
  let p = d.getElementById(el.id + '-err');
  if (!p) {
    p = d.createElement('p'); p.id = el.id + '-err'; p.className = 'field-err';
    el.closest('.field')!.append(p); el.setAttribute('aria-describedby', p.id);
  }
  const raw = el.value.trim(), v = Number(raw), ok = raw !== '' && Number.isFinite(v) && v >= lo && v <= hi;
  el.setAttribute('aria-invalid', String(!ok));
  p.hidden = ok; p.textContent = ok ? '' : text;
  return ok;
}

/** Phone result bar: shown while the result block is off screen; a tap scrolls to it. Returns the setter for its text. */
export function resultBar(target: Element | null) {
  const bar = d.querySelector<HTMLElement>('[data-tbar]'), text = bar?.querySelector('[data-tbar-text]');
  if (!bar || !text || !target) return () => {};
  new IntersectionObserver(([e]) => (bar.hidden = e.isIntersecting)).observe(target);
  bar.addEventListener('click', () => target.scrollIntoView());
  return (html: string) => { text.innerHTML = html; };
}
