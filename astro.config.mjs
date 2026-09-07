import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tsingchain.ai',
  integrations: [sitemap()],
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: { shikiConfig: { theme: 'github-light' } },
  vite: { build: { assetsInlineLimit: 0 } },
});
