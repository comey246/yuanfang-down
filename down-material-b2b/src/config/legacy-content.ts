/**
 * 从同一仓库旧站中提取的、可核对的公开内容。
 *
 * 旧站图片没有随仓库提供拍摄来源或授权记录，因此只能作为演示素材使用，
 * 不能描述为本工厂实拍。上线前应由后台替换为自有或已获授权的真实素材。
 */
export const legacySiteContent = {
  companyName: "远方羽绒",
  shortName: "远方羽绒",
  phone: "13732583829",
  mobile: "13732583829",
  email: "sales@yuanfangdown.com",
  logoUrl: "/brand/yuanfang-feather.svg",
  website: "https://yf-down.com",
  baiduVerification: "codeva-6IO0Ia9h6l"
} as const;

export const legacyDemoNotice = "旧站演示素材，真实工厂照片待替换";

export const legacyDemoAssets = {
  hero: "/legacy-assets/hero-workshop-generated.webp",
  workshop: "/legacy-assets/hero-workshop.webp",
  laboratory: "/legacy-assets/hero-down-lab.webp",
  warehouse: "/legacy-assets/warehouse.webp",
  packagedWarehouse: "/legacy-assets/warehouse-blue-20kg.webp",
  rawWhite: "/legacy-assets/down-white-natural.webp",
  rawGrey: "/legacy-assets/down-grey-natural.webp",
  sample: "/legacy-assets/down-sample.webp",
  quality: {
    content: "/legacy-assets/quality-content.webp",
    loft: "/legacy-assets/quality-loft.webp",
    cleanliness: "/legacy-assets/quality-cleanliness.webp",
    odor: "/legacy-assets/quality-odor.webp",
    wash: "/legacy-assets/quality-wash.webp",
    laboratory: "/legacy-assets/quality-lab.webp"
  },
  products: {
    whiteGoose: "/legacy-assets/product-white-goose.webp",
    greyGoose: "/legacy-assets/product-grey-goose.webp",
    whiteDuck: "/legacy-assets/product-white-duck.webp",
    greyDuck: "/legacy-assets/product-grey-duck.webp"
  }
} as const;

export const legacyProductContent = {
  "white-goose-down": {
    coverImage: legacyDemoAssets.products.whiteGoose,
    gallery: [legacyDemoAssets.rawWhite, legacyDemoAssets.sample],
    summary:
      "可用于服装、户外和家纺等采购场景；蓬松度等质量指标须以样品和检测文件确认。",
    applications: ["服装", "户外用品", "家纺"]
  },
  "grey-goose-down": {
    coverImage: legacyDemoAssets.products.greyGoose,
    gallery: [legacyDemoAssets.rawGrey, legacyDemoAssets.sample],
    summary:
      "可用于户外、家纺和贸易订单等场景；具体指标、成本与交付条件须单独确认。",
    applications: ["户外用品", "家纺", "贸易采购"]
  },
  "white-duck-down": {
    coverImage: legacyDemoAssets.products.whiteDuck,
    gallery: [legacyDemoAssets.rawWhite, legacyDemoAssets.sample],
    summary:
      "可用于羽绒服、被芯和枕芯等采购场景；具体指标、包装与批次供应情况待业务确认。",
    applications: ["羽绒服", "被芯", "枕芯"]
  },
  "grey-duck-down": {
    coverImage: legacyDemoAssets.products.greyDuck,
    gallery: [legacyDemoAssets.rawGrey, legacyDemoAssets.sample],
    summary:
      "可用于深色面料制品与家纺填充等场景；具体规格与批次供应情况待业务确认。",
    applications: ["深色面料制品", "家纺", "贸易采购"]
  }
};

export type LegacyProductSlug = keyof typeof legacyProductContent;
