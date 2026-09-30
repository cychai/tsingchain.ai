export const site = {
  name: '清链科技',
  url: 'https://tsingchain.ai',
  nameEn: 'Tsingchain Global',
  legalName: '清链科技（北京）有限公司',
  tagline: 'AI 算力中心液冷综合解决方案',
  headline: 'AI 算力中心预制化液冷与现场服务',
  description:
    '清链科技规划、设计液冷 AI 算力中心，以工厂预制撬块、CDU、ORv3 与 19 英寸机柜和冷却设备交付，并为液冷回路提供现场检测、调试与运维。近 1000 MW 液冷交付；每一个交付边界都附带证据。',
  email: 'sales@tsingchain.ai',
  founded: 2018,
  wechat: '清链学堂在线',
  location: '北京',
  overseas: { name: 'NextGenergy', url: 'https://nextgenergy.ai', note: '北美平台' },
  substack: 'https://everywattcounts.substack.com',
};

export const nav: { href: string; label: string; match?: string[] }[] = [
  { href: '/platform', label: '产品' },
  { href: '/services', label: '服务' },
  { href: '/solutions', label: '解决方案' },
  { href: '/resources', label: '资源', match: ['/resources', '/approach', '/evidence', '/tools', '/insights'] },
  { href: '/company/about', label: '公司', match: ['/company', '/cases'] },
];

export const footerNav = [
  { title: '我们做什么', links: [['/platform', '产品：撬块、机柜、CDU、冷却设备'], ['/services/field', '现场检测、验证与运维'], ['/solutions', '按项目类型的解决方案'], ['/resources', '资源：方法、证据、工具、洞察']] },
  { title: '交付证据', links: [['/evidence/commissioning', '调试与验收准则'], ['/evidence/turnover', '交付资料包'], ['/evidence/samples', '记录样例'], ['/evidence/leak-points', '十大漏点'], ['/evidence/standards', '标准工作']] },
  { title: '工具', links: [['https://sim.nextgenergy.ai', '液冷仿真台'], ['/tools/return-water', '回水品位 → 余热买家'], ['/tools/approach-temp', 'CDU 趋近温差与自由冷却估算'], ['/tools/leak-checklist', '交付资料自查']] },
  { title: '公司', links: [['/company/about', '关于我们'], ['/cases', '项目案例'], ['/company/partners', '合作伙伴'], ['/company/contact', '联系我们'], ['/company/privacy', '隐私声明']] },
];
