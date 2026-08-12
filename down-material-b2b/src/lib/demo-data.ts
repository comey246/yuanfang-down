import {
  legacyDataNotice,
  legacyProductContent
} from "@/config/legacy-content";
import type { DemoProduct } from "@/types";

const shared = {
  description:
    "本条目为网站结构演示数据。原料来源、具体规格、质量指标、包装、起订量、供货能力和交付周期均须由工厂核实后在后台填写。",
  customization: true,
  sampleAvailable: true,
  showPrice: false,
  priceText: null,
  downClusterContent: null,
  downContent: null,
  fillPower: null,
  cleanliness: null,
  oxygenNumber: null,
  moisture: null,
  packaging: null,
  packageWeight: null,
  minimumOrder: null,
  supplyCapacity: null,
  leadTime: null,
  applications: [],
  customItems: [],
  qualityNote: `${legacyDataNotice}；实际质量参数以双方确认的样品、合同及检测文件为准。`,
  specifications: [],
  demo: true as const
};

export const demoProducts: DemoProduct[] = [
  {
    ...shared,
    id: "demo-white-goose",
    name: "白鹅绒",
    slug: "white-goose-down",
    category: "鹅绒原料",
    species: "鹅绒",
    color: "白色",
    ...legacyProductContent["white-goose-down"]
  },
  {
    ...shared,
    id: "demo-grey-goose",
    name: "灰鹅绒",
    slug: "grey-goose-down",
    category: "鹅绒原料",
    species: "鹅绒",
    color: "灰色",
    ...legacyProductContent["grey-goose-down"]
  },
  {
    ...shared,
    id: "demo-white-duck",
    name: "白鸭绒",
    slug: "white-duck-down",
    category: "鸭绒原料",
    species: "鸭绒",
    color: "白色",
    ...legacyProductContent["white-duck-down"]
  },
  {
    ...shared,
    id: "demo-grey-duck",
    name: "灰鸭绒",
    slug: "grey-duck-down",
    category: "鸭绒原料",
    species: "鸭绒",
    color: "灰色",
    ...legacyProductContent["grey-duck-down"]
  }
];

export const processSteps = [
  ["01", "原料入厂", "记录批次与来源说明，待工厂补充真实验收要求。"],
  ["02", "初步筛选", "去除不符合后续加工要求的原料，具体流程待补充。"],
  ["03", "清洗", "清洗设备、用水与工艺参数待工厂核实。"],
  ["04", "脱水", "脱水设备和控制要求待补充。"],
  ["05", "烘干", "烘干方式和过程控制数据待补充。"],
  ["06", "精细分拣", "按目标规格进行分拣，真实设备与能力待补充。"],
  ["07", "检测", "区分内部检测与第三方检测，报告由后台上传。"],
  ["08", "包装", "包装方式、单包重量与标签规则待补充。"],
  ["09", "出库", "按合同与双方确认标准完成复核及发运。"]
] as const;

export const advantages = [
  "原料筛选",
  "水洗加工",
  "分拣能力",
  "质量检测",
  "规格定制",
  "批量交付",
  "样品支持",
  "售后跟进"
];

export const cooperationSteps = [
  "提交需求",
  "业务沟通",
  "确认规格",
  "样品确认",
  "报价与合同",
  "批量生产",
  "质检与发货",
  "售后跟进"
];

export const articleDirections = [
  "羽绒原料采购需要关注哪些指标",
  "鹅绒和鸭绒有什么区别",
  "羽绒蓬松度和绒子含量如何理解"
];
