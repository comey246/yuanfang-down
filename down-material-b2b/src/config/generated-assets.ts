export const generatedAssets = {
  hero: "/generated/hero/down-material-hero.webp",
  og: "/generated/seo/social-og.webp",
  products: {
    "white-goose-down": {
      cover: "/generated/products/white-goose-main.webp",
      gallery: [
        "/generated/products/white-goose-inspection.webp",
        "/generated/products/white-goose-sample-pack.webp"
      ]
    },
    "grey-goose-down": {
      cover: "/generated/products/grey-goose-main.webp",
      gallery: [
        "/generated/products/grey-goose-inspection.webp",
        "/generated/products/grey-goose-sample-pack.webp"
      ]
    },
    "white-duck-down": {
      cover: "/generated/products/white-duck-main.webp",
      gallery: [
        "/generated/products/white-duck-inspection.webp",
        "/generated/products/white-duck-sample-pack.webp"
      ]
    },
    "grey-duck-down": {
      cover: "/generated/products/grey-duck-main.webp",
      gallery: [
        "/generated/products/grey-duck-inspection.webp",
        "/generated/products/grey-duck-sample-pack.webp"
      ]
    }
  },
  process: [
    "/generated/process/01-raw-material-receiving.webp",
    "/generated/process/02-pre-screening.webp",
    "/generated/process/03-washing.webp",
    "/generated/process/04-dewatering.webp",
    "/generated/process/05-drying.webp",
    "/generated/process/06-fine-sorting.webp",
    "/generated/process/07-quality-inspection.webp",
    "/generated/process/08-packaging.webp",
    "/generated/process/09-dispatch.webp"
  ],
  quality: [
    {
      title: "绒子含量与成分观察",
      image: "/generated/quality/down-cluster-content.webp"
    },
    {
      title: "蓬松度观察",
      image: "/generated/quality/fill-power.webp"
    },
    {
      title: "清洁度与浊度观察",
      image: "/generated/quality/cleanliness.webp"
    },
    {
      title: "耗氧量检测说明",
      image: "/generated/quality/oxygen-number.webp"
    },
    {
      title: "水分率与残脂率分析",
      image: "/generated/quality/moisture-fat.webp"
    },
    {
      title: "成分观察与资料分级",
      image: "/generated/quality/composition-records.webp"
    }
  ],
  applications: [
    {
      title: "服装原料打样",
      image: "/generated/applications/apparel.webp"
    },
    {
      title: "家纺原料打样",
      image: "/generated/applications/home-textile.webp"
    },
    {
      title: "户外睡袋材料选型",
      image: "/generated/applications/sleeping-bag.webp"
    },
    {
      title: "贸易采购与样品确认",
      image: "/generated/applications/procurement.webp"
    }
  ],
  articleCovers: {
    "down-purchasing-indicators":
      "/generated/articles/procurement-indicators.webp",
    "goose-down-vs-duck-down": "/generated/articles/goose-vs-duck.webp",
    "fill-power-and-down-cluster-content":
      "/generated/articles/fill-power-content.webp"
  },
  posters: [
    {
      title: "工厂全景",
      image: "/generated/posters/factory-overview.webp"
    },
    {
      title: "清洗过程",
      image: "/generated/posters/washing-process.webp"
    },
    {
      title: "质量检测",
      image: "/generated/posters/quality-inspection.webp"
    }
  ]
} as const;

export type GeneratedProductSlug = keyof typeof generatedAssets.products;

export function getGeneratedProductAssets(slug: string) {
  return slug in generatedAssets.products
    ? generatedAssets.products[slug as GeneratedProductSlug]
    : null;
}

export function getGeneratedArticleCover(slug: string) {
  return slug in generatedAssets.articleCovers
    ? generatedAssets.articleCovers[
        slug as keyof typeof generatedAssets.articleCovers
      ]
    : null;
}
