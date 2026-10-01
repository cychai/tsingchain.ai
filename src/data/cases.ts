/**
 * 项目案例：每个案例统一六栏（项目条件、交付范围、系统架构、关键工况、运行观察期、可提供证据）。
 * 只填已经公开过的信息；没有公开的一律写「签署保密协议后提供」，不补写。
 * 结果类表述只写成「控制目标」或「项目方反馈」，不写成未经限定的连续实测结果。
 * detail 为摘要两句，供 JSON-LD 与 llms-full.txt 使用，口径与六栏一致。
 */
export interface Case {
  mw: number; type: string; title: string; detail: string[]; tag: string; year: number; region: string;
  cond: string; scope: string; arch: string; duty: string; period: string; evidence: string;
}
const NDA = '签署保密协议后提供';
const SCOPE = `清链科技在本项目中承担的分工（设备供货、设计、集成或运维）${NDA}说明`;
const EVIDENCE = `${NDA}：完整项目清单、运行记录，并可安排现场考察`;
export const cases: Case[] = [
  { mw: 10, type: '液冷算力中心', title: '闭式冷却塔方案的液冷算力中心', tag: '极端环境验证', year: 2022, region: '亚洲',
    detail: ['采用闭式冷却塔排热，干式与喷淋混合运行，冷却液在闭式回路内循环', '项目所在地极端气温夏季 40 °C、冬季零下 30 °C；项目方反馈期间运行稳定'],
    cond: '10 MW（按 IT 侧热负荷计），2022 年，亚洲；项目所在地极端气温记录为夏季 40 °C、冬季零下 30 °C',
    scope: SCOPE,
    arch: '液冷回路 + 闭式冷却塔排热，干式与喷淋混合运行，冷却液在闭式回路内循环',
    duty: `气温为当地极端气温记录，不是设备连续运行的工况点；供回水温度与负荷率${NDA}`,
    period: `项目年份 2022 年；运行记录的起止时间${NDA}。项目方反馈：经历上述极端气温期间运行稳定`,
    evidence: EVIDENCE },
  { mw: 5, type: '工业楼宇供暖', title: '数据中心余热用于某工业楼宇供暖', tag: '节能替代传统供热', year: 2023, region: '亚洲',
    detail: ['供暖面积约 7 万平方米（合同面积）', '余热替代原有燃气供热，该供热环节不再现场燃烧燃气；项目方反馈园区能耗下降'],
    cond: '5 MW（按 IT 侧热负荷计），2023 年，亚洲；供暖面积约 7 万平方米（合同面积）',
    scope: SCOPE,
    arch: '数据中心余热用于工业楼宇供暖，替代原有燃气供热环节',
    duty: `供热环节不再现场燃烧燃气；供回水温度、供热量${NDA}`,
    period: `项目年份 2023 年；运行记录的起止时间${NDA}。项目方反馈：园区能耗下降，降幅未经第三方计量`,
    evidence: EVIDENCE },
  { mw: 25, type: '城镇供热', title: '数据中心余热用于某城镇集中供热', tag: '政府级项目', year: 2021, region: '亚洲',
    detail: ['供暖面积约 25 万平方米（合同面积）', '项目方反馈：当地多年未决的冬季供热问题得到缓解'],
    cond: '25 MW（按 IT 侧热负荷计），2021 年，亚洲；供暖面积约 25 万平方米（合同面积）',
    scope: SCOPE,
    arch: '液冷系统回收的数据中心余热用于城镇集中供热',
    duty: `供回水温度、供热量与供热季运行情况${NDA}`,
    period: `项目年份 2021 年；运行记录的起止时间${NDA}。项目方反馈：当地多年未决的冬季供热问题得到缓解`,
    evidence: EVIDENCE },
  { mw: 12, type: '恒温水产养殖', title: '数据中心余热用于某恒温水产养殖', tag: '农业 + 能源融合', year: 2023, region: '亚洲',
    detail: ['控制目标：养殖水温全年保持 25 °C', '项目方反馈：缓解了当地冬季水产供应不足'],
    cond: '12 MW（按 IT 侧热负荷计），2023 年，亚洲',
    scope: SCOPE,
    arch: '数据中心余热用于工业化恒温水产养殖',
    duty: `控制目标：养殖水温全年保持 25 °C。这是设计控制目标，不是公开的连续实测结果；实测运行区间与容许波动${NDA}`,
    period: `项目年份 2023 年；运行记录的起止时间${NDA}。项目方反馈：缓解了当地冬季水产供应不足`,
    evidence: EVIDENCE },
];
export const caseFields: [keyof Case, string][] = [['cond', '项目条件'], ['scope', '交付范围'], ['arch', '系统架构'], ['duty', '关键工况'], ['period', '运行观察期'], ['evidence', '可提供证据']];
