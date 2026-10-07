/** Company news. Dates are actual publication dates in Asia/Shanghai. */
export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string[]; // Trusted editorial HTML (links only).
  links?: [string, string][];
  legalAttribution?: string;
}

// Task 04 first production publication date: Asia/Shanghai, 2026-10-08.
// Keep these first publication dates when making later editorial updates.
const items: NewsItem[] = [
  {
    "slug": "nvidia-inception-membership",
    "title": "北美平台 NextGenergy 加入 NVIDIA Inception",
    "date": "2026-10-08",
    "summary": "清链科技北美平台 NextGenergy 于 2026 年 9 月 30 日加入 NVIDIA Inception，成为该项目的会员。",
    "body": [
      "清链科技北美平台 NextGenergy 于 2026 年 9 月 30 日加入 NVIDIA Inception。",
      "NVIDIA Inception 项目旨在帮助初创企业加速创新与成长。",
      "NextGenergy 位于加拿大多伦多，在北美开展预制化液冷系统与现场服务业务，包括液冷系统规划与设计，预制撬块、CDU、ORv3 机柜及冷却设备交付，以及液冷回路检测、调试与维护。需要持证的现场工作由持证合作方执行。",
      "读者可通过 NextGenergy 英文官网了解产品与服务，也可访问其运营的液冷学院和提供的液冷仿真台。"
    ],
    "links": [
      [
        "https://www.nvidia.com/en-us/startups/",
        "NVIDIA Inception"
      ],
      [
        "https://nextgenergy.ai",
        "NextGenergy 英文官网"
      ],
      [
        "https://lca.nextgenergy.ai",
        "液冷学院"
      ],
      [
        "https://sim.nextgenergy.ai",
        "液冷仿真台"
      ]
    ],
    "legalAttribution": "© 2025 NVIDIA, the NVIDIA logo, and NVIDIA Inception are trademarks and/or registered trademarks of NVIDIA Corporation in the U.S. and other countries."
  },
  {
    "slug": "liquid-cooling-academy-registration",
    "title": "液冷学院开放报名",
    "date": "2026-10-08",
    "summary": "由北美平台 NextGenergy 运营的液冷学院已开放报名。首期 L1 技术员课程免费，提供中文和英文版本。",
    "body": [
      "由清链科技北美平台 NextGenergy 运营的液冷学院（Liquid Cooling Academy，LCA）已开放报名，网址为 <a href=\"https://lca.nextgenergy.ai\">lca.nextgenergy.ai</a>。首期 L1 技术员课程免费，提供中文和英文版本，面向正在从事或希望进入数据中心液冷现场工作的人士。",
      "学员在线学习并参加阶段考核。通过考核并经本人同意后进入人才库，有液冷现场岗位时按岗位匹配优先推荐；推荐不等于录用。",
      "学院目前处于试行期，正式证书将在课程经专家审定后开放，届时须参加正式考试。证书仅证明完成学院培训并通过考核，不是执业许可或职业资格，也不自动赋予现场作业资格。需要持证的现场工作，仍须由具备当地相应资质的人员或单位执行。",
      "报名与课程详情请见液冷学院网站。"
    ],
    "links": [
      [
        "https://lca.nextgenergy.ai",
        "液冷学院：课程与报名"
      ]
    ]
  },
  {
    "slug": "liquid-cooling-simulator-online",
    "title": "液冷仿真台上线",
    "date": "2026-10-08",
    "summary": "北美平台 NextGenergy 提供的免费液冷仿真台已上线，可在浏览器中使用，支持中文和英文。",
    "body": [
      "清链科技北美平台 NextGenergy 提供的免费液冷仿真台已上线，网址为 <a href=\"https://sim.nextgenergy.ai\">sim.nextgenergy.ai</a>。仿真台可在浏览器中使用，支持中文和英文，用于方案比较与初步筛选。",
      "用户可选择机柜平台、气候条件和管路布置，观察结温、流量、压降与 pPUE 的变化，并通过负载阶跃、泵故障或结垢情景比较系统响应。",
      "所有结果均为模型值，用于方案比较与初步筛选，不替代厂家数据、项目设计计算和验收测试。",
      "欢迎通过清链科技联系页提交使用反馈。"
    ],
    "links": [
      [
        "https://sim.nextgenergy.ai",
        "打开液冷仿真台"
      ],
      [
        "/tools",
        "全部工程工具"
      ],
      [
        "/company/contact",
        "反馈与联系"
      ]
    ]
  },
  {
    "slug": "gdcc-canada-2026-booth-a20",
    "title": "北美平台 NextGenergy 将参加 GDCC Canada 2026，展位 A20",
    "date": "2026-10-08",
    "summary": "NextGenergy 将于 2026 年 10 月 20–21 日参加 GDCC Canada，地点为加拿大安大略省米西索加 International Centre，展位 A20。",
    "body": [
      "清链科技北美平台 NextGenergy 将于 2026 年 10 月 20–21 日参加 Global Data Centre & Cloud Expo Canada 2026（GDCC Canada），地点为加拿大安大略省米西索加 International Centre，展位 A20。",
      "展位将介绍液冷基础设施现场服务与预制化液冷系统，包括液冷回路调试、检查、冷却液取样和记录，以及预制撬块、CDU 与 ORv3 机柜的成套交付。服务范围可涵盖 NextGenergy 供货及其他品牌的液冷系统。需要持证的现场工作由持证合作方执行。",
      "欢迎通过 NextGenergy 联系页预约展位交流，并说明到访日期与希望讨论的问题。系统图、设备清单或已有交付资料包可作为讨论起点。"
    ],
    "links": [
      [
        "https://nextgenergy.ai/company/contact?topic=gdcc#form",
        "预约 A20 展位交流"
      ],
      [
        "https://nextgenergy.ai/company/news/gdcc-canada-2026-booth-a20",
        "NextGenergy 英文参展公告"
      ]
    ]
  }
];

export const news: NewsItem[] = [...items].sort((a, b) => b.date.localeCompare(a.date));
export const newsDate = (iso: string) => new Date(`${iso}T12:00:00+08:00`);
export const fmtNewsDate = (iso: string) => newsDate(iso).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Shanghai' });
