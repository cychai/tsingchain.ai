export interface Case { mw: number; type: string; title: string; detail: string[]; tag: string; year: number; }
export const cases: Case[] = [
  { mw: 10, type: '液冷算力中心', title: '闭式冷却塔方案的液冷算力中心', detail: ['采用闭式冷却塔排热，干式与喷淋混合运行，冷却液在闭式回路内循环', '经历夏季 40 °C 高温与冬季零下 30 °C 低温，稳定运行'], tag: '极端环境验证', year: 2022 },
  { mw: 5, type: '工业楼宇供暖', title: '数据中心余热用于某工业楼宇供暖', detail: ['供暖面积约 7 万平方米', '利用余热替代原有燃气供热，该供热环节不再现场燃烧燃气，并降低了园区能耗'], tag: '节能替代传统供热', year: 2023 },
  { mw: 25, type: '城镇供热', title: '数据中心余热用于某城镇集中供热', detail: ['供暖面积约 25 万平方米', '解决了当地多年未决的冬季供热问题'], tag: '政府级项目', year: 2021 },
  { mw: 12, type: '恒温水产养殖', title: '数据中心余热用于某恒温水产养殖', detail: ['全年水温恒定控制在 25 °C', '解决了当地冬季水产供应不足的问题'], tag: '农业 + 能源融合', year: 2023 },
];
