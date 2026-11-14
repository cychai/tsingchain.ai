import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Article images load lazily and decode off the main thread. Done on the built HTML of /insights/*
// (Astro 7's default Markdown processor takes no rehype plugins), so the article source files and
// the .md / llms-full.txt outputs are untouched. Images that already declare `loading` are left alone.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';
const lazyArticleImages = () => ({
  name: 'lazy-article-images',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const root = fileURLToPath(new URL('insights/', dir));
      for (const f of (await readdir(root).catch(() => [])).filter((n) => n.endsWith('.html'))) {
        const html = await readFile(root + f, 'utf8');
        const at = html.indexOf('article-body');
        if (at < 0) continue;
        const end = html.indexOf('</article>', at);
        const body = html.slice(at, end < 0 ? undefined : end).replace(/<img\b(?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async"');
        const out = html.slice(0, at) + body + (end < 0 ? '' : html.slice(end));
        if (out !== html) await writeFile(root + f, out);
      }
    },
  },
});

// In-page nav for long pages (V2). Done on the built HTML so page sources stay untouched: on the pages
// matched below that have three or more h2 headings inside <main>, every h2 gets an id (kept if it has one)
// and a sticky strip of links to them is inserted right after the page hero. The link text is the heading text.
const pageNav = (label) => ({
  name: 'page-nav',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const root = fileURLToPath(dir);
      const pages = ['services/field', 'company/about', ...['approach', 'evidence'].flatMap((d) => readdirSync(root + d).filter((n) => n.endsWith('.html')).map((n) => `${d}/${n.slice(0, -5)}`))];
      for (const page of pages) {
        const file = `${root}${page}.html`;
        const html = await readFile(file, 'utf8').catch(() => '');
        const from = html.indexOf('<main'), to = html.indexOf('</main>');
        const hero = html.indexOf('</section>', from);
        if (from < 0 || hero < 0 || hero > to || !/^<main[^>]*>\s*<section class="hero/.test(html.slice(from, from + 200))) continue;
        const items = [];
        const main = html.slice(from, to).replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g, (m, attrs = '', inner) => {
          const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
          const has = /\sid="([^"]+)"/.exec(attrs);
          const slug = text.toLowerCase().replace(/&[a-z#0-9]+;/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          const id = has ? has[1] : slug.length > 2 && !items.some((i) => i.id === slug) ? slug : `sec-${items.length + 1}`;
          items.push({ id, text });
          return has ? m : `<h2${attrs} id="${id}">${inner}</h2>`;
        });
        if (items.length < 3) continue;
        const nav = `<nav class="pnav" aria-label="${label}" data-spy="x" data-v2><div class="wrap">${items.map((i) => `<a href="#${i.id}">${i.text}</a>`).join('')}</div></nav>`;
        const cut = hero - from + '</section>'.length;
        await writeFile(file, html.slice(0, from) + main.slice(0, cut) + nav + main.slice(cut) + html.slice(to));
      }
    },
  },
});

// One icon set (V3). Text arrows that end a link or a "more" label, lead a previous-article link or a boundary
// question, are swapped for the sprite's line icons on the built HTML. Arrows inside running sentences stay text.
const icons = () => ({
  name: 'icons',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const root = fileURLToPath(dir);
      const ico = (n) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${n}"/></svg>`;
      const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${d}${e.name}/`) : e.name.endsWith('.html') ? [`${d}${e.name}`] : []));
      for (const file of walk(root)) {
        const html = await readFile(file, 'utf8');
        const at = html.indexOf('</head>');
        const body = html.slice(at)
          .replace(/(\s)→(<\/(?:a|span)>)/g, (m, sp, end) => `${sp}${ico('arrow-right')}${end}`)
          .replace(/<span aria-hidden="true">→<\/span>/g, ico('arrow-right'))
          .replace(/(<span class="k"[^>]*>)← /g, (m, open) => `${open}${ico('arrow-left')} `)
          .replace(/(<p class="q"[^>]*>)→ /g, (m, open) => `${open}${ico('arrow-right')} `)
          .replace(/(\s)([↓↑])(<\/span>)/g, (m, sp, a, end) => `${sp}${ico(a === '↓' ? 'arrow-down' : 'arrow-up')}${end}`);
        if (body !== html.slice(at)) await writeFile(file, html.slice(0, at) + body);
      }
    },
  },
});

export default defineConfig({
  site: 'https://www.tsingchain.cn',
  integrations: [sitemap(), lazyArticleImages(), icons(), pageNav('本页内容')],
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: { shikiConfig: { theme: 'github-light' } },
  vite: { build: { assetsInlineLimit: 0 } },
});
