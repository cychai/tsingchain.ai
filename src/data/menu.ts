/**
 * 页头菜单：每个一级栏目下的二级（桌面下拉、手机手风琴）。
 * 这里的每个名称都取自现有页面标题或现有页脚、资源页文案，不新起名。
 * 单独成文件，不改 site.ts 的 nav，由 nav 生成的内容（llms.txt、JSON-LD）保持不变。
 */
import { footerNav } from './site';
import { platform, services, solutions } from './sections';
import { corePages } from './geo';

type Link = [href: string, label: string];
export interface MenuGroup { title?: string; href?: string; links: Link[] }

const foot = (title: string) => (footerNav.find((c) => c.title === title)?.links ?? []) as Link[];
const subs = (base: string, items: { slug: string; title: string }[]): Link[] => items.map((s) => [`${base}/${s.slug}`, s.title]);

export const menu: Record<string, MenuGroup[]> = {
  '/platform': [{ links: subs('/platform', platform) }],
  '/services': [{ links: [foot('我们做什么')[1], ...subs('/services', services)] }],
  '/solutions': [{ links: subs('/solutions', solutions) }],
  '/resources': [
    { title: '技术方法', href: '/approach', links: corePages[0].pages.map(([h, t]) => [h, t]) },
    { title: '交付证据', href: '/evidence', links: foot('交付证据') },
    { title: '工具', href: '/tools', links: foot('工具') },
    { title: '洞察', href: '/insights', links: [] },
  ],
  '/company/about': [{ links: foot('公司').filter(([h]) => h !== '/company/privacy') }],
};
