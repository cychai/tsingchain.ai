// Mobile/responsive audit: loads every built page at 390x844 (and 1280x900) in headless Chrome,
// reports horizontal overflow, missing alt, multiple h1, console errors. Usage: node scripts/audit-mobile.mjs http://127.0.0.1:4321
import puppeteer from 'puppeteer-core';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const base = process.argv[2] || 'http://127.0.0.1:4321';
const shots = process.argv[3]; // optional dir for screenshots
const pages = [];
(function walk(d, rel = '') { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p, rel + '/' + f); else if (f.endsWith('.html')) pages.push((rel + '/' + f).replace(/\/index\.html$/, '/').replace(/\.html$/, '')); } })('dist');
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-first-run', '--disable-gpu'] });
const results = [];
for (const vp of [{ w: 390, h: 844, mobile: true }, { w: 1280, h: 900, mobile: false }]) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.w, height: vp.h, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  for (const path of pages) {
    errors.length = 0;
    await page.goto(base + path, { waitUntil: 'networkidle0', timeout: 30000 });
    const r = await page.evaluate(() => {
      const sw = document.documentElement.scrollWidth, iw = window.innerWidth;
      const wide = [...document.querySelectorAll('body *')].filter((el) => el.getBoundingClientRect().right > iw + 1).slice(0, 5).map((el) => el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''));
      const h1 = document.querySelectorAll('h1').length;
      const noAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length;
      const smallTap = [...document.querySelectorAll('a,button')].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.height < 24; }).length;
      return { sw, iw, overflow: sw > iw + 1, wide, h1, noAlt, smallTap };
    });
    results.push({ vp: vp.w, path, ...r, errors: [...errors] });
    if (shots && vp.mobile && ['/', '/tools/return-water', '/evidence/turnover', '/insights/three-clocks', '/cases', '/company/about'].includes(path)) {
      await page.screenshot({ path: `${shots}/m${path.replace(/\//g, '_') || '_home'}.png`, fullPage: true });
    }
  }
  await page.close();
}
await browser.close();
const bad = results.filter((r) => r.overflow || r.h1 !== 1 || r.noAlt || r.errors.length);
console.log(`checked ${results.length} page-views (${pages.length} pages x 2 viewports)`);
for (const r of bad) console.log(`${r.vp}px ${r.path} :: ${r.overflow ? `OVERFLOW ${r.sw}>${r.iw} ${r.wide.join(',')}` : ''} ${r.h1 !== 1 ? `h1=${r.h1}` : ''} ${r.noAlt ? `noAlt=${r.noAlt}` : ''} ${r.errors.length ? 'errors=' + r.errors.join(' | ').slice(0, 200) : ''}`);
if (!bad.length) console.log('no overflow, single h1 everywhere, all images have alt, no console errors');
const taps = results.filter((r) => r.vp === 390 && r.smallTap > 0).length; console.log(`pages with tap targets under 24px tall (mobile): ${taps}`);
