/**
 * 站内每一个性能数字都登记在此，带条件与出处。规则：数字带边界才能出站。
 * status：published 完整可用；conditional 只能连同条件一起出现；under-review 不得作标题；retired 已撤回。
 */
export type ClaimStatus = 'published' | 'conditional' | 'under-review' | 'retired';
export interface Claim { id: string; value: string; statement: string; condition: string; source: string; verifiedBy?: string; status: ClaimStatus; note?: string; }

export const claims: Record<string, Claim> = {
  'supply-55c': { id: 'supply-55c', value: '约 55 °C', statement: '我们交付的冷板式回路，回水温度约 55 °C。', condition: '额定 IT 负荷下的二次侧回水；直触芯片冷板；不含设施侧换热端差。', source: '清链科技项目运行记录；见 Every Watt Counts《Waste Heat Becomes an Asset》(2026-06)。', verifiedBy: '运行日志；未经第三方审计。', status: 'conditional' },
  'district-heat-50-70': { id: 'district-heat-50-70', value: '50–60 °C', statement: '第四代低温区域供热管网的供水温度通常在 50–60 °C，冬季可到 70 °C。', condition: '按 Lund 等对 4GDH 的定义（<50–60 °C，冬季 70 °C）；随管网、季节与建筑末端变化，部分超低温管网低于 45 °C。', source: 'Lund et al., 4th Generation District Heating (4GDH), Energy 2014；ScienceDirect 综述。', status: 'published' },
  'capacity-1000mw': { id: 'capacity-1000mw', value: '近 1000 MW', statement: '近 1000 MW 相关产品落地。', condition: '2020 年至今，含浸没式与冷板式液冷、CDU 与热回收装置的累计交付规模，按 IT 侧热负荷计。', source: '清链科技交付台账。', verifiedBy: '公司交付台账；项目清单可在签署保密协议后提供。', status: 'conditional' },
  'heating-2m': { id: 'heating-2m', value: '超 200 万 m²', statement: '数据中心余热累计供热面积超 200 万平方米。', condition: '含城镇供热、工业楼宇供热与温室供暖项目的合同供热面积。', source: '清链科技交付台账。', verifiedBy: '公司交付台账。', status: 'conditional' },
  'cooling-tower-latent': { id: 'cooling-tower-latent', value: '约 2.4 MJ/kg', statement: '冷却塔主要靠蒸发排热，在塔的实际运行水温下约为每公斤水 2.4 MJ。', condition: '塔运行水温下的汽化潜热，非沸点值；潜热占总排热比例通常 75–90%。', source: '标准湿空气物性数据；见《当 PUE 变好，能源系统反而变差》。', status: 'published' },
  'cold-climate-minus-40': { id: 'cold-climate-minus-40', value: '−40 °C', statement: '极寒气候方案按环境温度低至 −40 °C 设计。', condition: '室外排热设备与工质选型的设计环境温度；不代表在该温度下的连续运行记录。', source: '清链科技极寒气候设计基础。', status: 'conditional' },
  'case-10mw-extreme': { id: 'case-10mw-extreme', value: '+40 °C / −30 °C', statement: '某 10 MW 液冷算力中心采用闭式冷却塔方案，经历夏季 40 °C 高温与冬季零下 30 °C 低温，稳定运行。', condition: '2022 年项目；温度为当地极端气温记录，非设备连续工况点。', source: '清链科技项目案例。', status: 'conditional' },
  'pue-1-02': { id: 'pue-1-02', value: 'PUE 1.02', statement: '旧版 NextGenergy 站点的标题数字「PUE 低至 1.02」。', condition: '未知。环境温度、湿球、IT 负载率、统计周期与计量边界均无记录。', source: '旧版 nextgenergy.ai。', status: 'under-review', note: '已从标题撤下。只有带计量边界（IT 与设施用电分表、周期、气候）时才恢复。' },
};
export const claim = (id: keyof typeof claims) => claims[id];
