// Site search (C-02). No dependency and no third party: the index is a static JSON file written at build time
// (see `searchIndex` in astro.config.mjs). This module and the index are fetched the first time the box is opened.
// Identical on nextgenergy.ai and tsingchain.cn: every visible string comes from the markup in Header.astro.
interface Row { u: string; t: string; s: string; d: string; h: string; b: string }
interface Doc { row: Row; f: [text: string, weight: number][] }

const norm = (s: string) => s.normalize('NFKC').toLowerCase();
const CJK = /[㐀-鿿]/;
let docs: Promise<Doc[]> | null = null;
const load = () => (docs ??= fetch('/search-index.json')
  .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
  .then((rows: Row[]) => rows.map((row) => ({ row, f: [[norm(row.t), 12], [norm(row.h), 5], [norm(row.d), 4], [norm(row.s), 3], [norm(row.b), 1]] as Doc['f'] })))
  .catch((e) => { docs = null; throw e; }));

/** Query → terms. Latin splits on spaces and punctuation; a run of Chinese stays one phrase and falls back to its two-character pieces. */
const terms = (q: string) => norm(q).split(/[\s,.;:!?"'()\[\]/\\，。；：！？、“”‘’（）《》·]+/).filter(Boolean).slice(0, 8);
const grams = (t: string) => (CJK.test(t) && t.length > 2 ? Array.from({ length: t.length - 1 }, (_, i) => t.slice(i, i + 2)) : []);
const weigh = (doc: Doc, t: string) => doc.f.reduce((s, [text, w]) => s + (text.includes(t) ? w + (w === 12 && text.startsWith(t) ? 4 : 0) : 0), 0);

function search(all: Doc[], q: string) {
  const ts = terms(q);
  if (!ts.length) return { ts, hits: [] as Row[] };
  const marks = new Set(ts);
  const scored: [number, Row][] = [];
  for (const doc of all) {
    let total = 0;
    for (const t of ts) {
      let s = weigh(doc, t);
      if (!s) {
        // A Chinese phrase that is not on the page word for word still matches when at least half of its
        // two-character pieces are (there is no word segmentation: 调试准则 finds 调试与验收准则). Such matches rank low.
        const g = grams(t), w = g.map((x) => weigh(doc, x)), found = w.filter(Boolean).length;
        if (!g.length || found * 2 < g.length) { total = 0; break; }
        s = (w.reduce((a, b) => a + b, 0) / g.length) * 0.4 * (found / g.length);
        g.forEach((x, i) => w[i] && marks.add(x));
      }
      total += s;
    }
    if (total) scored.push([total, doc.row]);
  }
  scored.sort((a, b) => b[0] - a[0] || a[1].u.length - b[1].u.length);
  return { ts: [...marks].sort((a, b) => b.length - a.length), hits: scored.slice(0, 8).map((x) => x[1]) };
}

/** A line of context: the description if a term is in it, otherwise the body text around the first term found. */
function excerpt(row: Row, ts: string[]) {
  const has = (s: string) => ts.some((t) => s.toLowerCase().includes(t));
  if (has(row.d) || !has(row.b)) return row.d;
  const low = row.b.toLowerCase();
  const at = Math.min(...ts.map((t) => low.indexOf(t)).filter((i) => i >= 0));
  const from = Math.max(0, at - 50);
  return (from ? '… ' : '') + row.b.slice(from, at + 130).trim() + (at + 130 < row.b.length ? ' …' : '');
}
/** Text with the matched terms wrapped in <mark>; built from text nodes, never from HTML strings. */
function marked(text: string, ts: string[]) {
  const frag = document.createDocumentFragment();
  const low = text.toLowerCase();
  let i = 0;
  while (i < text.length) {
    let at = -1, len = 0;
    for (const t of ts) { const k = low.indexOf(t, i); if (k >= 0 && (at < 0 || k < at)) { at = k; len = t.length; } }
    if (at < 0) break;
    if (at > i) frag.append(text.slice(i, at));
    const m = document.createElement('mark');
    m.textContent = text.slice(at, at + len);
    frag.append(m);
    i = at + len;
  }
  frag.append(text.slice(i));
  return frag;
}

let ready = false;
export default function init(box: HTMLDialogElement) {
  const input = box.querySelector<HTMLInputElement>('input')!;
  const list = box.querySelector<HTMLElement>('[role="listbox"]')!;
  const msg = box.querySelector<HTMLElement>('[role="status"]')!;
  const { hint = '', none = '', count = '', error = '' } = box.dataset;
  let active = -1;
  const opts = () => [...list.querySelectorAll<HTMLAnchorElement>('a')];
  const select = (i: number) => {
    const o = opts();
    active = o.length ? (i + o.length) % o.length : -1;
    o.forEach((a, k) => a.setAttribute('aria-selected', String(k === active)));
    if (active < 0) input.removeAttribute('aria-activedescendant');
    else { input.setAttribute('aria-activedescendant', o[active].id); o[active].scrollIntoView({ block: 'nearest' }); }
  };
  const run = async () => {
    const q = input.value.trim();
    let all: Doc[];
    try { all = await load(); } catch { list.replaceChildren(); msg.textContent = error; return; }
    if (q !== input.value.trim()) return; // typed on while the index was loading
    const { ts, hits } = search(all, q);
    list.replaceChildren(...hits.map((row, i) => {
      const a = document.createElement('a');
      a.href = row.u; a.id = `srch-o${i}`; a.setAttribute('role', 'option'); a.setAttribute('aria-selected', 'false');
      const t = document.createElement('span'); t.className = 't'; t.append(marked(row.t, ts));
      a.append(t);
      if (row.s) { const s = document.createElement('span'); s.className = 's'; s.textContent = row.s; a.append(s); }
      const x = document.createElement('span'); x.className = 'x'; x.append(marked(excerpt(row, ts), ts));
      a.append(x);
      return a;
    }));
    input.setAttribute('aria-expanded', String(hits.length > 0));
    msg.textContent = !q ? hint : hits.length ? count.replace('{n}', String(hits.length)) : none.replace('{q}', q);
    select(hits.length ? 0 : -1);
  };
  if (!ready) {
    ready = true;
    input.addEventListener('input', run);
    input.addEventListener('keydown', (e) => {
      if (e.isComposing) return; // Enter that confirms an input-method candidate is not a search
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); select(active + (e.key === 'ArrowDown' ? 1 : -1)); }
      else if (e.key === 'Enter') { e.preventDefault(); opts()[Math.max(active, 0)]?.click(); }
      else if (e.key === 'Escape') { e.preventDefault(); box.close(); }
    });
    list.addEventListener('mousemove', (e) => {
      const i = opts().indexOf((e.target as HTMLElement).closest('a')!);
      if (i >= 0 && i !== active) select(i);
    });
    box.addEventListener('click', (e) => { if (e.target === box || (e.target as HTMLElement).closest('[data-search-close]')) box.close(); });
  }
  void run();
}
