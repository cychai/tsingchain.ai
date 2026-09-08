/** 每篇文章的 Markdown 版本：/insights/<slug>.md。HTML 页通过 <link rel="alternate" type="text/markdown"> 指向它。 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '@/data/site';

export async function getStaticPaths() {
  const posts = await getCollection('insights', (p) => !p.data.draft);
  return posts.map((p) => ({ params: { slug: p.id }, props: { p } }));
}

const BYLINE: Record<string, string> = {
  '李俊明': '李俊明（Jim Li），清链科技联合创始人兼副总裁，NextGenergy 创始人兼 CEO',
  '王辉': '王辉，清链科技创始人兼 CEO',
};

export const articleMarkdown = (p: { id: string; body?: string; data: { title: string; subtitle?: string; author?: string; date: Date; updated?: Date; canonical?: string; sourceUrl?: string; source: string; tags: string[] } }) => {
  const d = (x: Date) => x.toISOString().slice(0, 10);
  const body = (p.body ?? '').replace(/<!--[\s\S]*?-->/g, '').trim();
  const author = p.data.author ?? '李俊明';
  const meta = [
    `- 作者：${BYLINE[author] ?? author}`,
    `- 发布：${d(p.data.date)}` + (p.data.updated ? ` · 更新：${d(p.data.updated)}` : ''),
    `- 网页：${site.url}/insights/${p.id}`,
    p.data.source === 'wechat' && p.data.sourceUrl ? `- 首发：微信公众号「${site.wechat}」 ${p.data.sourceUrl}` : (p.data.canonical && p.data.canonical !== `${site.url}/insights/${p.id}` ? `- 首发：${p.data.canonical}` : ''),
    p.data.tags.length ? `- 标签：${p.data.tags.join('、')}` : '',
  ].filter(Boolean).join('\n');
  return `# ${p.data.title}\n\n${p.data.subtitle ? `> ${p.data.subtitle}\n\n` : ''}${meta}\n\n---\n\n${body}\n`;
};

export const GET: APIRoute = ({ props }) => new Response(articleMarkdown(props.p), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
