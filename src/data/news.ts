/** Company news. Dates are actual publication dates in Asia/Shanghai. */
/** 正文块：字符串 = 段落（受信编辑 HTML，仅含链接）；{ h2 } = 小标题；{ img } = 配图（public/ 下的绝对路径）。 */
export type NewsImage = { img: string; alt: string; caption?: string; w?: number; h?: number };
export type NewsBlock = string | { h2: string } | NewsImage;
export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: NewsBlock[];
  /** 可选封面：列表页缩略图与 og:image。 */
  cover?: NewsImage;
  links?: [string, string][];
  legalAttribution?: string;
}
export const isPara = (b: NewsBlock): b is string => typeof b === 'string';
export const isH2 = (b: NewsBlock): b is { h2: string } => typeof b === 'object' && 'h2' in b;
export const isImg = (b: NewsBlock): b is NewsImage => typeof b === 'object' && 'img' in b;
/** 纯文本正文：只取段落，去标签。 */
export const newsPlain = (n: NewsItem) => n.body.filter(isPara).map((p) => p.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&')).join('\n\n');

// Task 04 first production publication date: Asia/Shanghai, 2026-10-08.
// Keep these first publication dates when making later editorial updates.
const items: NewsItem[] = [
  {
    slug: 'gdcc-canada-2026-recap',
    title: '北美平台 NextGenergy 亮相 GDCC 2026',
    date: '2026-10-23',
    summary: "清链科技北美平台 NextGenergy 在 GDCC Canada 2026 A20 展位展示预制化液冷与数据中心整体系统视角：从核心设备、现场验证到余热利用与仿真，连接设计、交付和运行。",
    cover: { img: '/news/gdcc-2026/booth.jpg', alt: 'GDCC Canada 2026 现场，来宾在 NextGenergy A20 展位交流', w: 1600, h: 720 },
    body: [
      { img: '/news/gdcc-2026/booth.jpg', alt: "GDCC 现场，来宾在 NextGenergy A20 展位交流，左侧电视展示液冷仿真系统", caption: "GDCC 现场，来宾在 NextGenergy A20 展位交流；左侧电视正在展示液冷仿真系统。拍摄于 GDCC Canada 2026 A20 展位，来源：NextGenergy。", w: 1600, h: 720 },
      "2026 年 10 月 20 至 21 日，Global Data Centre & Cloud Expo Canada（GDCC）在加拿大安大略省密西沙加 The International Centre 举行。大会汇聚数据中心、云计算、人工智能基础设施及能源领域的企业与专业人士，并与 POWERING AI 同期举办，围绕算力增长所需要的电力、冷却及基础设施展开交流。",
      "清链科技北美平台 NextGenergy 在 A20 展位参展，围绕预制化液冷基础设施、核心设备交付、现场调试与验收，以及系统仿真展示相关产品和服务。展位通过整体系统沙盘、液冷展示模型和交互演示，把设备层面的细节与数据中心建设、运行及余热利用联系起来。",
      "本次展示以项目如何落地为主线：设备如何形成可部署的模块，不同冷却回路如何衔接，安装完成后如何验证运行条件，以及在设计阶段如何比较不同方案。实体模型与仿真演示相结合，为来宾了解系统边界和讨论项目需求提供了直观载体。",
      { h2: "预制化液冷与核心设备交付" },
      { img: '/news/gdcc-2026/team.jpg', alt: "NextGenergy 团队结合整体系统沙盘向来宾介绍预制化液冷", caption: "NextGenergy 团队结合沙盘向来宾介绍预制化液冷与系统集成。拍摄于 GDCC Canada 2026 A20 展位，来源：NextGenergy。", w: 1532, h: 1047 },
      "高密度计算基础设施的建设，需要同时协调机柜负载、冷却能力、管路接口和交付计划。NextGenergy 展示的预制化液冷数据中心撬块，采用模块化集成思路，将相关设备与接口纳入统一配置，使设计、制造、运输及现场安装之间的关系更加清晰。",
      "根据项目范围，预制化方案可将机柜、CDU、泵组、管路、阀门及控制等相关部分进行集成。将更多组装与验证工作前移至工厂，有助于提前发现接口和布置问题，减少现场重复协调，并为分期部署、容量扩展及后续维护预留明确的模块边界。",
      "围绕项目进度，NextGenergy 同时介绍了快速交期的 ORv3 机柜、CDU 及配套冷却设备。机柜承担计算设备的承载与集成，CDU 衔接设施侧与 IT 侧冷却回路，配套冷却设备则结合热负荷、环境条件及运行要求配置，形成相互匹配的热管理链路。",
      "快速交付不仅取决于单台设备是否可供货，也取决于规格、接口和项目计划能否尽早明确。NextGenergy 将设备供应与系统配置协调结合，帮助客户统筹选型、采购和部署；具体供货范围、技术参数、数量和交期根据项目确认，使供货安排能够与现场实施相衔接。",
      { h2: "液冷系统调试与现场验收测试" },
      "设备到达现场并完成安装后，还需要通过调试和验收测试确认系统状态。NextGenergy 在大会上介绍 Liquid Cooling Commissioning & Site Acceptance Testing，即液冷系统调试与现场验收测试，将安装检查、功能验证与交付记录纳入连续的工作流程。",
      "根据项目约定，相关工作可覆盖接口与安装检查、管路冲洗及清洁度确认、压力和泄漏测试、流量与压差验证、温度控制和负载响应，以及报警、联锁和控制逻辑检查。测试内容围绕项目设计、设备要求和验收边界确定，并通过可追溯的记录支持交接。",
      "跨设备、跨供应商的接口是现场协调的重要部分。CDU、泵组、阀门、传感器和控制系统需要在实际运行条件下协同验证。明确测试程序、责任分工及验收标准，有助于项目各方识别问题、组织整改，并确认系统是否达到约定的投运条件。",
      "服务既可面向 NextGenergy 提供的设备，也可根据约定支持其他供应商的液冷系统。NextGenergy 负责协调调试、测试和验收资料；需要持证的现场工作由持证合作方执行。服务范围及各方责任在项目实施前明确，现场工作遵循项目所在地的要求。",
      "交付资料的完整性也是验证工作的一部分。测试条件、仪器信息、结果记录、遗留问题及整改状态需要对应到具体设备和回路，便于业主、工程团队与运维人员在交接后查阅。通过把验收依据与日后维护所需的信息同步整理，现场测试能够为持续运行建立可查询的基础记录。",
      { h2: "沙盘中的能源、冷却与余热利用全景" },
      { img: '/news/gdcc-2026/sandbox.jpg', alt: "来宾围绕整体系统沙盘交流", caption: "来宾围绕整体系统沙盘交流，讨论设备与应用场景的连接。拍摄于 GDCC Canada 2026 A20 展位，来源：NextGenergy。", w: 1532, h: 919 },
      "整体系统沙盘是本次展示的重要组成部分。沙盘将能源来源、供配电、计算负载、液冷和余热利用放在同一空间内，通过设备模型与连接路径呈现数据中心全景，使参观者能够沿着电力和热量的流向理解系统之间的关系。",
      "在能源与电力部分，沙盘呈现了光伏发电、风力发电、水力发电、燃气发电及柴油发电等不同来源，以及预制化电力模块、变压器和高、中、低压供配电系统之间的连接。这些内容用于说明数据中心所处的能源基础设施背景，不表示 NextGenergy 承担上述所有发电或电力系统的供货与建设。",
      "在冷却部分，展示围绕 CDU、预制化液冷撬块、冷水机及干冷塔等设备展开，说明热量如何从计算设备传递到冷却回路，再向外部冷源或热回收系统转移。将这些环节放在整体架构下，有助于讨论设备配置、温度条件、换热边界和运行策略。",
      "余热利用则把系统视角延伸到数据中心之外。沙盘展示温室大棚、工业化恒温水产养殖和楼宇供暖等应用方向。能否形成可实施方案，需要结合热量规模、供回水温度、用热距离、季节性需求和必要的热泵配置评估，并协调数据中心与用热端的运行要求。",
      "NextGenergy 的相关方案重点是液冷基础设施、系统集成和热回收环节的衔接。以沙盘呈现更广的能源全景，旨在帮助客户理解这些环节所处的位置，并围绕实际项目明确供货范围、合作接口及工程责任。",
      { h2: "仿真演示与方案探索" },
      { img: '/news/gdcc-2026/simulator-demo.jpg', alt: "NextGenergy 团队向参观者演示液冷仿真台", caption: "团队演示液冷仿真台，与参观者交流系统配置和运行工况。拍摄于 GDCC Canada 2026 A20 展位，来源：NextGenergy。", w: 1600, h: 1035 },
      "仿真演示为实体展示补充了运行层面的视角。NextGenergy <a href=\"https://sim.nextgenergy.ai\">液冷仿真台</a>可在浏览器中使用，支持中文和英文，帮助用户在明确模型假设的前提下，比较不同配置与工况对系统表现的影响，使技术交流能够从静态布置进一步延伸到动态响应。",
      "用户可结合机柜平台、气候条件和管路布置，观察结温、流量、压降及 pPUE 等模型指标的变化，也可通过负载阶跃、泵故障或结垢等情景比较系统响应。现场演示将回路、设备参数与结果联系起来，方便围绕选型、运行条件和设计取舍展开讨论。",
      "仿真台定位于方案比较与初步筛选。所有结果均为模型值，不替代厂家数据、项目设计计算和验收测试。实际项目仍需根据设备资料及设计条件开展工程核算，并通过现场调试和测试验证系统表现；模型与实测数据之间的比较，也可为后续分析提供依据。",
      "通过此次 GDCC 参展，NextGenergy 将预制化集成、核心设备供应、现场验证及系统仿真放在同一展示框架内，说明从方案探索到交付验收的关键连接。后续将继续结合客户的实际需求，与合作伙伴推进液冷基础设施及余热利用相关项目，明确各环节的技术条件和交付边界。",
      "本次展示也为后续技术沟通提供了共同语言：客户可以先借助沙盘确认系统范围，再通过仿真讨论配置选择，最后把明确的需求转化为设备、接口和测试要求。各阶段形成的信息相互衔接，有助于减少从概念方案走向工程实施过程中的理解偏差。"
    ],
    links: [
      ['https://sim.nextgenergy.ai', '液冷仿真台'],
      ['https://nextgenergy.ai', 'NextGenergy 英文官网'],
      ['/company/news/gdcc-canada-2026-booth-a20', '2026-10-08 GDCC 参展预告'],
      ['https://gdcc-expo.com', 'GDCC 大会官网']
    ]
  },
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
    "summary": "NextGenergy 将于 2026 年 10 月 20–21 日参加 GDCC Canada，地点为加拿大安大略省密西沙加 International Centre，展位 A20。",
    "body": [
      "清链科技北美平台 NextGenergy 将于 2026 年 10 月 20–21 日参加 Global Data Centre & Cloud Expo Canada 2026（GDCC Canada），地点为加拿大安大略省密西沙加 International Centre，展位 A20。",
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
