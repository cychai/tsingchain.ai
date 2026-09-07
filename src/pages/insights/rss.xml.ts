import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '@/data/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('insights', (p) => !p.data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: `${site.name} · 洞察`,
    description: 'AI 算力基础设施的电力、液冷与余热利用。',
    site: context.site!,
    items: posts.map((p) => ({ title: p.data.title, description: p.data.subtitle, pubDate: p.data.date, link: `/insights/${p.id}`, categories: p.data.tags })),
  });
}
