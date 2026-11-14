import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Article images load lazily and decode off the main thread. Done on the built HTML of /insights/*
// (Astro 7's default Markdown processor takes no rehype plugins), so the article source files and
// the .md / llms-full.txt outputs are untouched. Images that already declare `loading` are left alone.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
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

export default defineConfig({
  site: 'https://www.tsingchain.cn',
  integrations: [sitemap(), lazyArticleImages()],
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: { shikiConfig: { theme: 'github-light' } },
  vite: { build: { assetsInlineLimit: 0 } },
});
