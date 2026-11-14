/**
 * Diagram language (V3) — shared helpers for the inline SVG system diagrams.
 * Rules (line types and text classes are defined once, in the "System diagrams" block of global.css):
 *  - every colour comes from tokens.css through the classes in global.css (.dgm …); no colour literals here;
 *  - 1.5 px non-scaling strokes, round caps and joins, 3 px corner radius;
 *  - every word drawn in a diagram is passed in by the page from that page's own data. Nothing is written here.
 * The builders return SVG markup as strings; Frame.astro wraps them with <title>, <desc> and role="img".
 */
export const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const CJK = /[⺀-鿿　-〿＀-￯]/;
const cw = (ch: string, mono: boolean) => (CJK.test(ch) ? 1 : mono ? 0.6 : /[MW@—]/.test(ch) ? 0.9 : /[A-Z0-9]/.test(ch) ? 0.66 : /[mw]/.test(ch) ? 0.84 : /[iljtfr.,:;'|!·()\[\] \/-]/.test(ch) ? 0.34 : 0.56);
/** Estimated rendered width of a string in px. Deliberately a little generous so that wrapped lines never overrun. */
export const width = (s: string, fs = 14, mono = false) => [...s].reduce((w, ch) => w + cw(ch, mono), 0) * fs;
/** Greedy line breaking: Latin breaks at spaces, CJK between any two characters, never before closing punctuation. */
function greedy(s: string, max: number, fs: number, mono: boolean): string[] {
  const tokens = s.match(/[\u2e80-\u9fff\u3000-\u303f\uff00-\uffef]|[^\s\u2e80-\u9fff\u3000-\u303f\uff00-\uffef]+\s*|\s+/g) ?? [];
  const lines: string[] = [];
  let cur = '';
  for (const t of tokens) {
    const glue = /^[，。、；：！？）」』》·]/.test(t);
    if (cur && !glue && width((cur + t).trimEnd(), fs, mono) > max) { lines.push(cur.trimEnd()); cur = t.trimStart(); }
    else cur += t;
  }
  if (cur.trim()) lines.push(cur.trimEnd());
  return lines;
}
/** Line breaking: Latin breaks at spaces, CJK between any two characters, never before closing punctuation.
 *  Lines are then balanced: the narrowest measure that keeps the same number of lines wins, so no one-character last lines. */
export function wrap(s: string, max: number, fs = 14, mono = false): string[] {
  let best = greedy(s, max, fs, mono);
  for (let m = max - 4; m > max * 0.4 && best.length > 1; m -= 4) {
    const l = greedy(s, m, fs, mono);
    if (l.length !== best.length) break;
    best = l;
  }
  return best;
}
interface TextOpts { cls?: string; anchor?: 'start' | 'middle' | 'end'; lh?: number; }
/** Multi-line text; (x, y) is the baseline of the first line. */
export function text(x: number, y: number, lines: string | string[], { cls = '', anchor = 'start', lh = 18 }: TextOpts = {}) {
  const ls = Array.isArray(lines) ? lines : [lines];
  return `<text x="${x}" y="${y}"${cls ? ` class="${cls}"` : ''}${anchor !== 'start' ? ` text-anchor="${anchor}"` : ''}>${ls.map((l, i) => (i ? `<tspan x="${x}" dy="${lh}">${esc(l)}</tspan>` : esc(l))).join('')}</text>`;
}
export const line = (d: string, cls = '') => `<path class="ln${cls ? ' ' + cls : ''}" d="${d}"/>`;
export const rect = (x1: number, y1: number, x2: number, y2: number, cls = 'ln box', rx = 3) =>
  `<rect class="${cls}" x="${Math.min(x1, x2)}" y="${Math.min(y1, y2)}" width="${Math.abs(x2 - x1)}" height="${Math.abs(y2 - y1)}" rx="${rx}"/>`;
/** Open chevron arrowhead with its tip at (x, y); dir is the unit direction it points to. */
export const head = (x: number, y: number, dx: number, dy: number, s = 5) =>
  `M${x - dx * s - dy * s} ${y - dy * s + dx * s}L${x} ${y}L${x - dx * s + dy * s} ${y - dy * s - dx * s}`;
/** Numbered circle: 13 px radius, mono label. */
export const badge = (x: number, y: number, label: string, r = 13) =>
  `<g class="nb"><circle cx="${x}" cy="${y}" r="${r}"/><text x="${x}" y="${y + 4.2}" text-anchor="middle">${esc(label)}</text></g>`;
/** Hose: a wavy run from u1 to u2 at height v (path coordinates). */
export function wave(u1: number, u2: number, v: number, amp = 5) {
  const n = Math.max(2, Math.round(Math.abs(u2 - u1) / 11));
  const st = (u2 - u1) / n;
  let d = `M${u1} ${v}q${st / 2} ${-amp} ${st} 0`;
  for (let i = 1; i < n; i++) d += `t${st} 0`;
  return d;
}
/** Legend for the two fluid lines: a short sample of each line type followed by its name. Names come from the page. */
export function legend(x: number, y: number, names: [string, string]) {
  const second = x + 30 + width(names[0], 12) + 22;
  return line(`M${x} ${y - 4}h22`, 'sup') + text(x + 30, y, names[0], { cls: 't-sub' }) + line(`M${second} ${y - 4}h22`, 'ret') + text(second + 30, y, names[1], { cls: 't-sub' });
}
/** Heat exchanger: a plate with one U-turn on each side. The two fluids meet only through the plate; no line crosses it.
 *  (u, A, B) is where the plate sits between the return line A and the supply line B; `tech` is +1 or -1, the side the technology loop is on. */
export function exchanger(u: number, A: number, B: number, tech: number) {
  const m = (A + B) / 2;
  return rect(u - 14, A - 9, u + 14, B + 9) + line(`M${u} ${A - 9}V${B + 9}`)
    + line(`M${u + tech * 14} ${A}H${u + tech * 7}V${m}`, 'ret') + line(`M${u + tech * 7} ${m}V${B}H${u + tech * 14}`, 'sup')
    + line(`M${u - tech * 14} ${B}H${u - tech * 7}V${m}`, 'sup') + line(`M${u - tech * 7} ${m}V${A}H${u - tech * 14}`, 'ret');
}
/** Layout switch for the path diagrams: wide draws u→x, v→y; narrow swaps the axes (u→y, v→x). Line art only, no text inside. */
export const layer = (body: string, swap: boolean) => (swap ? `<g transform="matrix(0 1 1 0 0 0)">${body}</g>` : `<g>${body}</g>`);
