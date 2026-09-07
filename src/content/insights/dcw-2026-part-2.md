---
title: "华盛顿归来（下）：DCW 2026储能、发电与AI数据中心能源版图全景"
subtitle: "DCW 2026下篇看真正的“洗牌”：CATL第一次坐上Diamond主位，从电芯一路打到HVDC配电；三菱重工把发电+冷却做成一台工业级机器。AI数据中心的竞争，正从“谁能买到更多GPU”切换到“谁能更聪明地把一桶能源的每一份潜力榨干”。"
author: "王辉"
date: 2026-04-27
source: wechat
sourceUrl: "https://mp.weixin.qq.com/s/sRRyWAlqBxIQEE3soNujnA"
tags: [会议, 电力, 储能]
related: [/solutions/heat-reuse]
---

<!-- wechat-body -->
##

> 上篇我们讲了液冷与电力配电——MW门槛被推平、800VDC成为共识。下篇要讲的是这次DCW真正具有“洗牌”意义的两件事：**中国电池厂商第一次坐上Diamond主位、日本重工把发电与冷却做成一台“工业级机器”**。然后再把整张图拼起来。

## 三、储能与UPS：中国电池厂商第一次坐上Diamond主位

##

### CATL（宁德时代）—— Diamond级Expo Hall冠名赞助商

这届DCW的Expo Hall & Reception冠名赞助商一共4家——**Schneider Electric、Vertiv、Mitsubishi Heavy Industries、和CATL**。这是CATL第一次作为Diamond级赞助商出现在北美数据中心旗舰展的主位，和前三家传统电力-冷却-发电巨头并列——**本身就是一个强信号：储能厂商正在被承认为AI数据中心基础设施的“第四根支柱”**。

![](/wx/dcw-2026-part-2/01.jpg)

CATL的数据中心布局其实由三条主线组成——这些产品线在展会期间的讨论里被反复提到：

**第一，TENER Stack 9MWh超大容量储能系统**（2025年5月7日 ees Europe首发）：体积利用率比传统20尺集装箱方案提升45%、能量密度提升50%，部署800MWh储能所需集装箱数从传统6MWh方案的34个减少到23个（减少近三分之一）。CATL ESS欧洲业务CTO Hank Zhao的原话：

> “TENER Stack——巨大、灵活、可靠、安静。我们交付的不只是一个储能产品，而是一个全球适用的能源可及性解决方案。”

**第二，钠离子储能专用电芯**（2026年4月初北京ESIE 2026首发）：与587Ah锂离子电芯**同平台共享外壳**，容量超过 **300Ah**、效率 **97%**、循环寿命超过 **15,000次**，明确覆盖 **2~8小时电网储能和AIDC（AI数据中心）应用场景**，2026年内商业化。

**第三，对中恒电气母公司的战略投资**（2026年4月8日公告）：CATL通过对杭州中恒科技投资增资约**41亿人民币（约6亿美元）取得后者**49%股权，间接持有上市公司中恒电气**17.4%股权**，成为其第二大股东。中恒电气是中国头部HVDC数据中心电力供应商，服务过阿里、腾讯，并在2025年被英伟达选为AI计算中心HVDC方案的合作伙伴；中恒电气目前主流产品仍以240V/336V为主，但**已完成800V HVDC方案研发并获得英伟达认证**。

把这三步连起来看——**电芯 + BESS系统 + HVDC配电**——CATL是在向“数据中心全栈能源系统供应商”转型，这也是为什么它能坐到DCW Diamond主位的原因。

### Ampace—— “CATL系”在数据中心UPS场景的落地

Ampace（新能安科技，由ATL和CATL共同投资）这次在展台做了一个更贴地气的展品：**PU200 半固态UPS电池**，单模块 **462kW功率 / 56.52kWh容量**，UL1973认证齐全，**15年设计寿命**，可扩展至9柜。这是把“CATL系”技术直接切进机房UPS这个最紧邻GPU的电力保护环节。

![](/wx/dcw-2026-part-2/02.jpg)

## 四、发电与整合能源：三菱重工的“工业化”叙事

### 三菱重工：从“商业设施”升级到“工业设施”

Diamond赞助商keynote的最后一天压轴位置留给了MHI。**4月23日（周四）**，MHI成长战略办公室**数据中心与能源管理高级总经理 Shinichiro Gomi（五味慎一郎）** 做了题为 **《From Commercial to Industrial: Scaling AI Data Centers with Integrated Energy and Cooling Systems》**（《从商用到工业：用整合的能源与冷却系统扩展AI数据中心》）的keynote。

![](/wx/dcw-2026-part-2/03.jpg)

Gomi没有卖某一台具体产品，而是给出了三条**范式转换路径**：

- 从依赖电网 → 电网 + 现场发电的混合供电；
- 从低压配电 → 中压 + HVDC（高压直流）配电；
- 从风冷 → 高效率水冷。再叠加MHI最擅长的**工厂级（plant-level）监控与控制**——把其在电力装置和重工业中几十年积累的DCS（分布式控制系统）能力，用于数据中心的全局优化。

MHI在产品层面的武器库：

- **M501JAC先进级燃气轮机**支持50%氢气混燃，已在Georgia Power的Plant Yates完成示范；
- **H-25工业级燃气轮机**单循环输出41MW、联合循环单机组约60MW（双机组约120MW）、冷热电三联供模式下每小时提供70吨蒸汽——这些蒸汽正好可以驱动前篇提到的Johnson Controls那类吸收式冷机；
- **FT8 MOBILEPAC航改型燃气轮机**约31MW移动式集装箱方案，快速部署。背景：

**MHI今年初把燃气轮机产能目标从原计划的+30%上调到翻倍（+100%）**。CEO伊藤荣作（Eisaku Ito）在2026年初接受Bloomberg采访时表示，原计划提产30%已经不够用了，满足现有订单是首要任务。GE Vernova和Siemens Energy都宣布了类似产能扩张。Wood Mackenzie今年2月报告显示：**美国大型负荷燃气轮机的平均交付周期接近5年**——这是AI数据中心接电难题的另一面。

## 五、其他值得关注的参展方与现场观点

在4家Diamond、一众Platinum/Gold/Silver赞助商之外，这届DCW还有一些细分领域的代表性厂商和现场观点：

![](/wx/dcw-2026-part-2/04.jpg)

- **Airsys Cooling**展出 UniCool、FluidCool-X、以及专利LiquidRack喷雾冷却；
- **Chatsworth Products / CPI**VersaEdge 壁挂式边缘机柜；
- **nVent**液冷组件与电气保护生态；
- **BAC**COBALT浸没式冷却系统；
- **Brinkmann Pumps**高性能CDU专用泵，集成 Δp 智能调节；
- **AmpLink Tech Corp**机柜/行级CDU和manifold冷却方案；
- **NIMBUS Advanced Process Cooling**干式与混合式自适应绝热冷却，号称比冷却塔少用95%水、比冷机少用50%电；
- **Accelsius**两相直接芯片液冷；Johnson Controls在DCW期间宣布了对Accelsius的战略投资；
- **Digital Shovel**首发“Modular AI Pod”模块化AI舱，把time-to-token从几个月压缩到几天；
- **MiTAC Computing**面向AI/HPC/云和边缘的服务器平台。

在keynote序列上也有几个标志性场次值得一并说一下：

**4月20日（周一）9:10am——Investor Briefing**：Switch CFO **Madonna Park** 的keynote主题是“Investing at AI Scale: How Switch is Building Infrastructure that Lowers Costs and Leads the Market”，给出关键数字：**到2030年全球数据中心电力需求将超过200GW**。同日Omdia首席分析师 **Maxine Holt** 给出 **2026年全球IT支出6.07万亿美元**、**Vlad Galabov预测数据中心市场到2030年将超过1.9万亿美元** 的数字。

**![](/wx/dcw-2026-part-2/05.jpg)

4月21日（周二）—— Vertiv CPTO Scott Armul Diamond keynote**：“AI Factories: The Physical Engines Driving AI”。同日有 **C-Suite Conversation** panel，**Aligned Data Centers首席创新官（Chief Innovation Officer）Phill Lawson-Shanks** 在台上讲了一个引发整场共鸣的客户故事：

> “在一个正在建设中的数据中心项目中，客户因为AI和GPU技术的发展速度，突然要求增加50%的电力——我们不得不重新调整一切，引入足够的冷却、并从电网找到更多电源。”

**4月22日（周三）8:30am——“Innovation at Hyperscale” keynote panel**：**Oracle、NVIDIA、Google** 的工程领袖同台，讨论超大规模AI工厂的工程实施；同时段是 **Schneider 的 Jim Simonelli** 讲 800VDC keynote，所以这一时段会场拆分。

**4月23日（周四）**——**MHI 五味慎一郎** 的Diamond keynote收官；**前Google数据中心副总裁Joe Kava** 获本届 **AFCOM Lifetime Achievement Award**（终身成就奖）。Kava在领奖致辞里说了一段被几乎所有人引用的话：

> “二十年前，这场对话完全不一样。那时我们被叫做'云'，只是那些让服务器不至于熔毁、让灯保持亮着的'幕后部门'。今天这场对话已经完全不同。”——Joe Kava, 前Google数据中心副总裁

**同周公共政策环节**：阿拉斯加州长Mike Dunleavy出席Public Policy Forum，讨论阿拉斯加在自然冷却、天然气、水电、地热、甚至潮汐能源方面作为下一代数据中心新前沿的潜力。

## 六、把这张图拼起来，DCW 2026说了什么

如果要把这届展会画成一张“AI数据中心能源基础设施全景图”，可以拆成四个板块、一条能量循环：

**【发电】Mitsubishi Heavy Industries**

- M501JAC / H-25 / FT8 MOBILEPAC（CHP + H2 兼容）**【电力与配电】Schneider 800VDC + Vertiv 800VDC + Eaton MV SST + ABB HVAC-R 驱动**

- Schneider NetShelter 33kW Shelf
- Vertiv 标准化建筑单元 + 800VDC 集成储能
- Eaton 中压固态变压器
- ABB 冷却系统驱动**【储能 & UPS】CATL（Diamond）**

- TENER Stack 9MWh
- 钠电池 300Ah+
- 中恒电气 HVDC（已认证英伟达800V方案）
- Ampace PU200 UPS（462kW / 56.52kWh / 15年寿命）**【液冷】CoolIT + LG + Delta + Accelsius**

- CoolIT CHx2000 2MW 液-液CDU
- LG 1.4MW CDU + DTC + 浸没式
- Delta 300kW L2A CDU + 1.1MW 800VDC 机柜
- Accelsius 两相直冷**【热回收 & 整体热管理】Johnson Controls**

- YORK 吸收式冷机（90%省电）
- YDAM 3.5MW / YK-HT
- Silent-Aire CDU 500kW~10MW+
- 热泵区域供热而把这些板块连成一个闭环的，是两条能量流：

- **发电 → 配电**从中压直接进 800VDC 骨干，绕过传统多级转换；
- **发电产生的废热 + 算力产生的发热 → 吸收式冷机 + 液冷 → 区域供热/温室/养殖**把“被动散热”变成“主动能源回收”。

DCW 2026要说的事情，浓缩成一句话就是——

> **AI数据中心的竞争，正从“谁能买到更多GPU”，切换到“谁能更聪明地把一桶能源的每一份潜力都榨干”。**

这次展会上真正值得记住的事实是：**几乎每一个主要厂商都在从“做单一产品”向“做系统”迁移**——Schneider要做EcoStruxure Pod整包、Vertiv要做标准化建筑单元、Johnson Controls把热管理做成了从芯片到园区的完整热链、LG做端到端AIDC整合、CATL从电芯扩展到HVDC、MHI做整合能源+冷却架构。

单独看任何一家，都只是“又一款省电的产品”；放在一起看，它们就是**下一代AI数据中心的新能源范式**。

离开华盛顿的时候，Joe Kava那句话一直在我脑子里回响——“今天这场对话已经完全不同了。”Kava说得对。对话确实已经不同，而且是集体不同。

*作者在DCW 2026期间走访了CoolIT、LG Electronics、Johnson Controls、Delta Electronics、Eaton Corporation、Ampace等主要展位，并与Vertiv、Schneider、MHI、CATL等赞助商深度沟通。*
