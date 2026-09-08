/** /llms-full.txt —— 核心页面（定义、FAQ、十大漏点、带条件的数字、案例、团队）与全部文章合成的一份 Markdown，构建时生成，不会与 HTML 脱节。 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '@/data/site';
import { corePages, definitions, faqs } from '@/data/geo';
import { leakPoints } from '@/data/leakPoints';
import { claims } from '@/data/claims';
import { cases } from '@/data/cases';
import { people } from '@/data/team';
import { articleMarkdown } from './insights/[slug].md';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('insights', (p) => !p.data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const out: string[] = [];
  out.push(`# ${site.name}（${site.nameEn}）—— 供语言模型阅读的全文`, '', `> ${site.tagline}。${site.description}`, '', `来源：${site.url} · 构建时生成 · 简版索引：${site.url}/llms.txt`, '');

  out.push('## 术语表（本站使用的定义）', '');
  for (const [path, d] of Object.entries(definitions)) out.push(`### ${d.term}`, '', d.text, '', `页面：${site.url}${path}`, '');

  out.push('## 核心页面', '');
  for (const g of corePages) {
    for (const [path, title, summary] of g.pages) {
      const qa = faqs[path];
      out.push(`### ${title}`, '', `${summary}（${site.url}${path}）`, '');
      if (path === '/evidence/leak-points') { for (const l of leakPoints) out.push(`${l.n}. **${l.t}**（${l.group}）。${l.p}${l.r ? ` 记录：${l.r}` : ''}`); out.push(''); }
      if (path === '/cases') { for (const c of cases) out.push(`- **${c.mw} MW · ${c.type}**（${c.year} 年）：${c.title}。${c.detail.join('；')}。`); out.push('', '口径：MW 按 IT 侧热负荷计，供热面积按合同面积计，气温为项目所在地极端气温记录；项目方名称按保密约定不公开。', ''); }
      if (qa) for (const i of qa) out.push(`**问：${i.q}**`, '', `答：${i.a}${i.href ? `（${site.url}${i.href}）` : ''}`, '');
    }
  }

  out.push('## 数字与它们的条件', '', '本站每一个性能数字都连同条件与出处发布；标注「仅随条件出现」的数字在站内只与条件一起出现。', '');
  for (const c of Object.values(claims)) {
    if (c.status === 'retired') continue;
    out.push(`- **${c.value}** —— ${c.statement} 条件：${c.condition} 出处：${c.source}${c.status === 'under-review' ? ' 状态：复核中，不作标题使用。' : ''}`);
  }
  out.push('');

  out.push('## 核心团队', '');
  for (const p of people) out.push(`- **${p.name}**，${p.role}。${p.bio}${p.linkedin ? ` LinkedIn：${p.linkedin}` : ''}`);
  out.push('');

  out.push('## 文章', '');
  for (const p of posts) out.push(articleMarkdown(p), '', '---', '');
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
