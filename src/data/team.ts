/** 核心团队名单。供 /company/leadership、其 Person JSON-LD 与 /llms-full.txt 使用。 */
export interface Person { name: string; role: string; linkedin: string; photo: string; bio: string }
export const people: Person[] = [
  { name: '王辉', role: '清链科技创始人兼 CEO', linkedin: '', photo: '/team/wang-hui.jpg',
    bio: '王辉于 2018 年创立清链科技（北京）有限公司，专注数据中心液冷散热与余热回收利用的研究与推广。她带领团队研发液冷散热系统与余热回收系统，取得多项专利与发明，推动余热用于城镇供热、工业楼宇、温室与恒温水产养殖等项目，2023 年获行业「年度创新人物」奖项。' },
  { name: '李俊明 Jim Li', role: '清链科技联合创始人兼副总裁 · NextGenergy 创始人兼 CEO', linkedin: 'https://www.linkedin.com/in/junming-li-liquid-cooling/', photo: '/team/jim-li.jpg',
    bio: '李俊明是清链科技联合创始人兼副总裁，也是海外品牌 NextGenergy 的创始人兼 CEO，致力于把 AI 数据中心从单点设备优化推向电力、液冷与余热回收的整体系统设计。创业前后主持建设并运营了浸没式与冷板式液冷算力设施，多个项目的余热送入区域供热、温室与水产养殖。他撰写英文专栏 Every Watt Counts，评审并评论开放液冷规范，是「三个时钟」模型与「十大漏点」清单的作者。' },
];
