/**
 * JSON-LD 节点构造器。每个函数返回一个节点，页面通过 Base.astro 的 `ld` 属性并入 @graph。
 */
import { site } from '@/data/site';

export type LdNode = Record<string, unknown>;
export interface FaqItem { q: string; a: string; href?: string; label?: string }
export interface Definition { term: string; alt?: string[]; text: string }

const ORG = { '@id': `${site.url}/#org` };
const abs = (path: string) => new URL(path, site.url).href;

export const PEOPLE_IDS: Record<string, string> = { '王辉': 'wang-hui', '李俊明': 'li-junming' };
export const authorRef = (name: string): LdNode =>
  PEOPLE_IDS[name] ? { '@id': `${abs('/company/leadership')}#${PEOPLE_IDS[name]}` } : { '@type': 'Person', name, worksFor: ORG };

export function definedTermLd(path: string, d: Definition): LdNode {
  return {
    '@type': 'DefinedTerm',
    '@id': `${abs(path)}#term`,
    name: d.term,
    ...(d.alt?.length ? { alternateName: d.alt } : {}),
    description: d.text,
    url: abs(path),
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: '清链科技液冷术语表', url: abs('/llms.txt') },
  };
}

export function techArticleLd(path: string, o: { headline: string; description: string; about?: string; published?: string; modified?: string }): LdNode {
  return {
    '@type': 'TechArticle',
    '@id': `${abs(path)}#article`,
    headline: o.headline,
    description: o.description,
    ...(o.about ? { about: { '@id': `${abs(path)}#term` } } : {}),
    author: authorRef('李俊明'),
    publisher: ORG,
    mainEntityOfPage: abs(path),
    inLanguage: 'zh-CN',
    datePublished: o.published ?? '2026-09-06',
    dateModified: o.modified ?? o.published ?? '2026-09-08',
  };
}

export function faqLd(path: string, items: FaqItem[]): LdNode {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(path)}#faq`,
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.href ? `${i.a} 详见 ${abs(i.href)}` : i.a },
    })),
  };
}

export function articleLd(path: string, o: { headline: string; description?: string; published: Date; modified?: Date; author?: string; canonical?: string; tags?: string[] }): LdNode {
  return {
    '@type': 'Article',
    '@id': `${abs(path)}#article`,
    headline: o.headline,
    ...(o.description ? { description: o.description } : {}),
    author: authorRef(o.author ?? '李俊明'),
    publisher: ORG,
    mainEntityOfPage: o.canonical ?? abs(path),
    url: abs(path),
    inLanguage: 'zh-CN',
    datePublished: o.published.toISOString(),
    dateModified: (o.modified ?? o.published).toISOString(),
    ...(o.tags?.length ? { keywords: o.tags.join(', ') } : {}),
    isAccessibleForFree: true,
  };
}

export function softwareLd(path: string, o: { name: string; description: string }): LdNode {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${abs(path)}#app`,
    name: o.name,
    description: o.description,
    url: abs(path),
    applicationCategory: 'EngineeringApplication',
    operatingSystem: '任意（在浏览器中运行）',
    browserRequirements: '需要 JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    author: ORG,
    publisher: ORG,
  };
}

export function personLd(p: { id: string; name: string; alternateName?: string[]; jobTitle: string; description: string; image?: string; sameAs?: string[] }): LdNode {
  return {
    '@type': 'Person',
    '@id': `${abs('/company/leadership')}#${p.id}`,
    name: p.name,
    ...(p.alternateName?.length ? { alternateName: p.alternateName } : {}),
    jobTitle: p.jobTitle,
    description: p.description,
    worksFor: ORG,
    ...(p.image ? { image: abs(p.image) } : {}),
    ...(p.sameAs?.length ? { sameAs: p.sameAs } : {}),
    url: abs('/company/leadership'),
  };
}

export function caseListLd(path: string, cases: { mw: number; type: string; title: string; detail: string[]; year: number }[]): LdNode {
  return {
    '@type': 'ItemList',
    '@id': `${abs(path)}#cases`,
    name: '清链科技液冷与余热利用项目案例',
    itemListOrder: 'https://schema.org/ItemListUnordered',
    numberOfItems: cases.length,
    itemListElement: cases.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: c.title,
        about: `${c.mw} MW · ${c.type}`,
        description: c.detail.join('；'),
        temporalCoverage: String(c.year),
        measurementTechnique: 'MW 按 IT 侧热负荷计；供热面积按合同面积计；气温为项目所在地极端气温记录',
        creator: ORG,
      },
    })),
  };
}
