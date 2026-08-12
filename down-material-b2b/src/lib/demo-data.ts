import {
  legacyDataNotice,
  legacyProductContent
} from "@/config/legacy-content";
import type { DemoProduct } from "@/types";

const shared = {
  description:
    "产品规格、质量指标、包装、起订量、供货能力与交付周期以双方确认的样品、检测文件、报价单及合同为准。",
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
  demo: false as const
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
  [
    "01",
    "原料入厂",
    "核对原料品类、包装和批次信息，记录来源资料，为后续加工与批次追踪建立基础。"
  ],
  [
    "02",
    "初步筛选",
    "根据原料状态进行初步整理与筛选，分离明显杂质，并按后续加工要求分类流转。"
  ],
  [
    "03",
    "清洗",
    "原料进入水洗环节，清洗流程根据原料状态与目标规格安排，具体条件记录在对应生产批次中。"
  ],
  [
    "04",
    "脱水",
    "清洗后的原料进行脱水处理，减少表面水分，为后续烘干和蓬松整理做好准备。"
  ],
  [
    "05",
    "烘干",
    "对脱水后的原料进行烘干与状态整理，过程以批次生产要求和实际原料情况为依据。"
  ],
  [
    "06",
    "精细分拣",
    "围绕订单目标规格进一步分拣和整理，使不同成分与状态的原料进入相应批次。"
  ],
  [
    "07",
    "检测",
    "按订单约定对批次进行取样和项目检测，并明确区分企业内部记录与第三方检测文件。"
  ],
  [
    "08",
    "包装",
    "完成批次确认后按约定方式包装，标注产品、批次、重量等信息，便于仓储与到货核对。"
  ],
  [
    "09",
    "出库",
    "发运前复核订单、包装、数量和批次信息，按双方确认的交付安排办理出库。"
  ]
] as const;

export const advantages = [
  {
    title: "原料筛选",
    description:
      "根据原料品类、颜色和订单目标进行分类筛选，为后续水洗、分拣与批次管理建立清晰基础。"
  },
  {
    title: "水洗加工",
    description:
      "结合原料状态与目标规格安排水洗、脱水和烘干环节，具体工艺信息以实际生产批次记录为准。"
  },
  {
    title: "分拣能力",
    description:
      "围绕成分、颜色和目标规格进行分级整理，帮助采购方按用途确认适合的原料方案。"
  },
  {
    title: "质量检测",
    description:
      "按订单约定核对检测项目和批次资料，清晰区分企业内部检测、第三方报告与认证证书。"
  },
  {
    title: "规格定制",
    description:
      "根据成品用途沟通原料类型、目标指标、包装和标签要求，确认可执行方案后安排生产。"
  },
  {
    title: "批量交付",
    description:
      "围绕订单数量、批次、包装和交期组织备货与发运，实际供货安排以双方确认的合同为准。"
  },
  {
    title: "样品支持",
    description:
      "批量采购前可先沟通样品需求，用于核对外观、规格资料及目标面料或成品的适配情况。"
  },
  {
    title: "售后跟进",
    description:
      "到货后持续跟进批次核对、使用反馈和后续补货需求，具体责任按双方合同约定执行。"
  }
] as const;

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
