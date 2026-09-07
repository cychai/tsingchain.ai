---
title: "华盛顿归来（上）：DCW 2026液冷与电力配电的集体换挡"
subtitle: "DCW 2026在华盛顿举行，AI数据中心基础设施全面进入能源-热力-算力-储能一体化的重工业时代。液冷CDU容量集体跨过MW门槛，电力配电则集体换轨至800VDC，对齐NVIDIA Rubin Ultra 2027年量产时点。"
author: "王辉"
date: 2026-04-26
source: wechat
sourceUrl: "https://mp.weixin.qq.com/s/pTSvK1E9i-HD_gQcl8klYA"
tags: [会议, 液冷, 配电]
related: [/approach/thermal-path, /platform/cdu]
---

<!-- wechat-body -->
2026年4月20日至23日，Walter E. Washington Convention Center。Data Center World 2026（DCW 2026）——由Informa与AFCOM联合主办、今年主题定为“Innovation at Scale”——在华盛顿特区落下帷幕。**450余家参展商**，主办方现场预估观众规模“接近12,000人”。展会第一天，AFCOM数据中心项目执行主席Bill Kleyman在开幕致辞中抛出一个让全场安静下来的数字：**到2030年，数据中心可能消耗美国全部电力的17%**。Omdia首席分析师Maxine Holt紧接着补了一刀——2026年全球IT支出预计将达到6.07万亿美元，同比增长约10%，是十年来最大增幅。

这届DCW真正在讨论的不是“下一代更省电的机房”，而是一件根本性的事——**AI算力基础设施正在从“IT”行业整体切换到一个“能源-热力-算力-储能”四位一体的重工业赛道**。

今年DCW Expo Hall的Diamond级冠名赞助商一共4家——**Schneider Electric、Vertiv、Mitsubishi Heavy Industries（三菱重工）、CATL（宁德时代）**。从发电到配电、从储能到冷却，传统西方巨头、日本重工、中国电池龙头同台的配置，在数据中心大展上前所未有。

![](/wx/dcw-2026-part-1/01.jpg)

我们按四个技术板块——**液冷与热管理、电力与配电、储能与UPS、发电与整合能源**——把主要厂商和他们的“硬货”梳理下来。这是上篇，先讲液冷与电力配电这两个传统强项板块的“集体换挡”。

## 一、液冷与热管理：CDU容量竞赛进入“MW”阶段

AI机柜功率从20KW冲到120KW再到300KW+，这届DCW上液冷CDU的容量宣告已经跨过了**MW门槛**。

### CoolIT Systems：2MW液冷CDU的标杆

CoolIT带到华盛顿的旗舰产品是 **CHx2000**，官方定位是当前同密度等级里性能最高的CDU。

![](/wx/dcw-2026-part-1/02.jpg)

CHx2000是一台**液-液CDU**，占地仅 **750mm × 1200mm**（标准机柜大小）。在这么小的占地里，它能以 **1.2 LPM/KW** 的流量提供 **2000KW** 冷却能力，二次侧压头**53psi**，支持 **12个120KW的NVIDIA GB200 NVL72机柜**——刚好是一整排。展台上CoolIT也坦率承认，2026年已经出现少数竞品宣布超过2MW的CDU，但CHx2000仍然是同等密度等级里最高性能的产品，而且既能进灰空间也能直接进白空间跟机柜同排部署。

### LG Electronics：从650KW到1.4MW的一次跳跃

LG ES（Eco Solution）业务这次是全面杀入AI数据中心冷却赛道。它带来的**主力CDU产品容量从上一代的650KW直接翻倍到1.4MW**——冷板采用“skived fin”（刨削翅片）结构优化冷液流动，泵端用变频器驱动。LG还展示了虚拟传感器技术，即使部分传感器失效仍能稳定运行。

![](/wx/dcw-2026-part-1/03.jpg)

LG这次的看点不止CDU。它展示的是**一整套端到端的AIDC方案**：

- **直接到芯片（DTC）液冷产品线** —— 包括上面提到的1.4MW CDU与冷板；
- **浸没式冷却系统** —— 与美国GRC联合开发，介电冷却液与SK Enmove联合研发；
- **CRAH（机房空气处理单元）** 配高效EC风扇和马达；
- **风冷离心冷水机组（ACC）**
- **DCCM（Data Center Cooling Management）软件** —— 整合CDU、CRAH、ACC的单一管理界面，支持虚拟传感器诊断、预测性维护、3D可视化；
- **DC Grid方案** —— 与LG Energy Solution、LS ELECTRIC、LS Cable & System联合开发，让数据中心主要设备直接跑在直流上，**相比传统AC系统约25%的能量损耗，可以把电能损耗降到约15%；如果配光伏，可以压到约10%**。LG电子ES事业部总裁 **Lee Jae-sung（李在成）** 在展会期间表示：“凭借从热管理到能源效率的整体方案能力和差异化技术，LG将持续在AI数据中心HVAC市场中扩展业务机会。”

### Johnson Controls：把废热变成“免费冷量”

Johnson Controls这次展的是**三款新硬货+一枚重磅思路**：

![](/wx/dcw-2026-part-1/04.jpg)

- **YORK YDAM 磁悬浮轴承风冷离心冷水机组** —— 冷量 **3.5MW**，比同级别方案密度高 **20%**，2026年2月3日发布，2026年下半年开始发货；
- **YORK YK-HT 两级经济器离心冷水机组** —— 比同类机型小 **30%**，干冷器需求最高减少 **60%**，单驱动链支持业内最宽工况范围；
- **Silent-Aire CDU平台** —— 冷量覆盖 **500kW 到 10MW以上**。但真正的C位是那台 **YORK吸收式冷机（YHAU系列）**。Johnson Controls热管理产品技术战略与业务发展总监 **Mihir Nandkeolyar** 在DCW期间专门做了一场技术分享，原话是：*“By utilizing waste heat for cooling instead of drawing electricity from the local grid, data centers can get on line faster, significantly expand compute and become better neighbors.”*（通过用废热制冷而不是从当地电网抽电，数据中心可以更快上线、大幅扩展算力，同时成为更好的邻居。）

逻辑很锋利：天然气自发电只有35%~50%变成电，剩下50%~65%以废热形式排掉；把这部分废热接进吸收式冷机，冷却侧用电可以下降**90%以上**——每生产2MW冷量，吸收式冷机只需约20~25KW电输入，传统电制冷要500KW以上。对一个100MW AI园区，这意味着**多挤出约36MW电直接喂给GPU**，相当于多出约300个NVL72机柜的算力空间。

Johnson Controls还趁势发布了《Thermal Management Reference Design Guide》系列技术指南，第一册是水冷冷机，后续覆盖风冷、吸收式、两相液冷。展会期间还宣布了对两相直冷创业公司Accelsius的战略投资，以及对液冷效率公司Alloy Enterprises的战略收购。

### Delta Electronics：电、冷、楼宇一体化

Delta（台达）的展位亮点是单柜功率1.1MW、整体效率高达98%的800VDC机柜级电力方案——把高密度DC电源架和配电一体集成，避免大规模改造现有电力基础设施就能支持超高密度算力。

![](/wx/dcw-2026-part-1/05.jpg)

冷却这一侧，Delta带来的是：

- **300kW L2A（液-气）CDU** —— 闭环液冷系统，去掉架空地板和复杂管路；
- **140kW 4U In-Rack CDU 和 250KW 6U In-Rack CDU** —— 液-液冷，配合直接芯片冷却部署；
- **微通道冷板** —— 专为新一代GPU/CPU设计。（注：Delta在 **NVIDIA GTC 2026** 上展示的更新产品——800VDC In-Row 660kW电源机柜含480KW BBU，以及 **2.4MW L2L CDU**——是GTC现场首发的，不在DCW这次。）

## 二、电力与配电：800VDC 成为这届DCW的真正共识

如果说液冷在DCW上是“继续升级”，那电力配电这边是**集体换赛道**——几乎所有主要电力厂商都在同一张声音里：**传统54VDC机柜内配电已经撑不住AI的兆瓦级需求，800VDC是下一代方向**。

### Schneider Electric：NetShelter Power Shelf + 800VDC Sidecar

Schneider带到DCW的重磅新品是 **NetShelter Power Shelf**——这是一台**专为NVIDIA GB200 NVL72设计的高密度电源架**，单架输出 **33KW @ 48VDC**，与Schneider的NetShelter Open Architecture机柜（OCP启发的开放架构）和EcoStruxure Pod Data Center for AI模块化方案整体集成。

![](/wx/dcw-2026-part-1/06.jpg)

这次DCW上Schneider真正的C位——是**4月22日（周三）上午8:30在3楼Ballrooms A & B**，Schneider安全电力与数据中心业务部高级副总裁兼CTO **Jim Simonelli** 做的keynote：**《Powering the Megawatt Era: Why 800VDC Is the Future of Data Center Energy》**（《迈入兆瓦时代：为什么800VDC是数据中心能源的未来》）。

Simonelli在台上讲得很硬——他说电力行业这几年AC/DC的辩论其实错过了重点，AI机柜真正的约束不是转换效率，而是“机柜内部的物理空间”。他原话是：

> *“There's too much stuff in that rack — copper, power supplies — things that are not driving compute. They're just getting in the way.”*“机柜里已经塞太多东西了——铜缆、电源……这些不做计算的部件挤占了本该属于GPU的空间。”

Schneider的方案路径是先做 **“800VDC sidecar”**——把电源转换设备移到计算机柜外面的“外挂机柜”，以较小的线缆接入计算机柜（已和NVIDIA合作开发，可支撑1.2MW单机柜）；然后逐步把电源转换进一步推到集中式系统，覆盖更大数据中心区域。Simonelli也明确说：“sidecar只是迈向1MW机柜路上的第一步方案，不会是唯一方案。”他预期最终会出现一个“组合架构”——小集群继续用本地化转换，大型部署转向集中化高压DC。

Schneider更完整的整体方案线还包括 **Ringmaster AirSeT紧凑型开关柜、Galaxy系列UPS、iLine母线槽、Motivair by Schneider的液冷和CDU产品线**——从中压进线到机柜末端完整打通。

### Vertiv—：800VDC + 12.5MW单元化

**4月21日（周二），Vertiv**新任**首席产品与技术官Scott Armul**（他从原Global Portfolio副总裁升任，任命日期2026年1月1日），做了主题**《AI Factories: The Physical Engines Driving AI》的keynote——核心主张：AI数据中心必须被当作“一台整合的物理AI引擎”来设计，以可重复的标准化“建筑单元”为基础**堆叠到园区规模。他在现场给出的四个关键词是：extreme densification（极致密度）、time-to-token（交付到算力的时间）、campus-scale expansion（园区级扩张）、operational risk from disparate systems（系统分散的运营风险）。

Vertiv的**800VDC电力产品线计划2026年下半年发布**，时间点对齐NVIDIA的**Rubin Ultra 平台在2027年的量产**。整个800VDC系统将包括集中式整流器、高效直流母线、机柜级DC/DC转换器，且集成储能。Vertiv有 **4000+现场工程师** 全球服务网络，是它在800VDC这种高压DC场景下的硬资产。

### Eaton Corporation：中压固态变压器（MV SST）

Eaton带到DCW的核心叙事是——**围绕中压固态变压器（Medium-Voltage Solid-State Transformer, MV SST）打造的整条800VDC电力骨干**。这套技术来自2025年Eaton收购的Resilient Power Systems。SST将位于整个DC配电体系的“心脏”，把中压AC直接转换为800VDC，省掉多级AC/DC转换损耗。

Eaton在DCW上的整体方案覆盖：模块化数据中心（电、冷、软件一体）、Envirotran Hardened Data Center变电所变压器、用于数据中心关键场景的UPS与switchgear。

行业里反复被引用的一个数字是：**一个1MW机柜，按传统AC架构，铜母线的用铜量可以达到200公斤量级**。这是800VDC路线背后最硬的工程驱动力之一。

### ABB —— 把马达、驱动、赛道孵化做进一个展位

ABB这次的定位很聪明——**不参与800VDC正面战场，而是切“冷却系统驱动侧”和“初创生态”两条侧翼**。

产品线上，ABB展出的是专门为数据中心冷却应用优化的马达与变频器组合：

- **Baldor-Reliance Cooling Tower Direct Drive（CTDD）马达** —— 冷却塔用直驱马达；
- **ERH直驱马达** —— 低压EC马达一体化方案；
- **ACH180、ACH580、ACH580 ULH 三款HVACR专用变频驱动** —— 用于空调、冷却塔、循环泵等场景。更值得关注的是ABB同时冠名了 **DCW 2026 Innovation Challenge**——**24家初创公司在4月22-23日直接向风投、加速器、公用事业、超大规模云厂商和ABB高管做pitch**。ABB电气化创投业务负责人Mads Moeller的原话是：*“Through the DCW Innovation Challenge, ABB is combining our electrification expertise with strategic partnerships to help startups scale solutions that operators can deploy in real-world data-center environments.”*

把“下一代数据中心创新入口”直接纳入自己生态位的做法，比单纯卖产品更深一层。

## 上篇小结

液冷在DCW 2026上的故事是**MW门槛被推平**——CoolIT 2MW、LG 1.4MW、Johnson Controls Silent-Aire CDU 平台 10MW+、Delta GTC 上的 2.4MW —— 整个赛道的容量天花板正在被一年一刷。

电力配电这边的故事更狠：**54VDC时代结束，800VDC成为新共识**。Schneider、Vertiv、Eaton、ABB各从不同角度切入这个共识——sidecar 过渡方案、12.5MW建筑单元、中压固态变压器、初创生态——但都在朝着同一个方向走。NVIDIA Rubin Ultra在2027年量产，800VDC产品线在2026年下半年发布，时间表已经锁定。

下篇会继续讲储能（CATL第一次坐上Diamond主位）、发电（三菱重工的“工业化”叙事）、其他值得注意的厂商，以及把整张图拼起来后DCW 2026到底想说什么。

*作者在DCW 2026期间走访了CoolIT、LG Electronics、Johnson Controls、Delta Electronics、Eaton Corporation等主要展位，并现场与Vertiv、Schneider、MHI、CATL等Diamond赞助商深度沟通。*
