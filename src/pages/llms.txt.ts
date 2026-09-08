/** /llms.txt —— 给问答引擎看的站点地图（llmstxt.org 约定），控制在 50 行以内。 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '@/data/site';
import { corePages } from '@/data/geo';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('insights', (p) => !p.data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const lines: string[] = [
    `# ${site.name}（${site.nameEn}）`,
    '',
    `> ${site.tagline}。${site.description}`,
    '',
    `${site.name}即${site.legalName}，${site.founded} 年成立于${site.location}，创始人兼 CEO 王辉，联合创始人兼副总裁李俊明（Jim Li）。业务是为 AI 算力中心提供从液冷、CDU 到余热利用的一体化解决方案，并对整条热通路负责：对十大漏点中的每一个交付测试、验收判据与记录。海外品牌：NextGenergy，https://nextgenergy.ai（英文站）。微信公众号：${site.wechat}。联系：${site.email}。`,
    '',
    `本站固定使用的术语：整条热通路；回水品位；三个时钟（制造 / 调试 / 服役）；十大漏点；交付资料包；数字带条件。`,
    '',
  ];
  for (const g of corePages) {
    lines.push(`## ${g.section}`);
    for (const [path, title, summary] of g.pages) lines.push(`- [${title}](${site.url}${path})：${summary}`);
    lines.push('');
  }
  lines.push('## 洞察（最新）');
  for (const p of posts.slice(0, 8)) lines.push(`- [${p.data.title}](${site.url}/insights/${p.id}.md)：${p.data.date.toISOString().slice(0, 10)}${p.data.author ? `，${p.data.author}` : ''}`);
  lines.push('');
  lines.push('## 可选');
  lines.push(`- [核心页面与全部文章的全文](${site.url}/llms-full.txt)`);
  lines.push(`- [RSS](${site.url}/insights/rss.xml)`);
  lines.push(`- [站点地图](${site.url}/sitemap-index.xml)`);
  lines.push(`- 每篇文章都有 Markdown 版本：/insights/<slug>.md`);
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
