export type DemoProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  species: "鹅绒" | "鸭绒" | "其他";
  color: "白色" | "灰色" | "其他";
  summary: string;
  description: string;
  coverImage: string | null;
  gallery: string[];
  customization: boolean;
  sampleAvailable: boolean;
  showPrice: boolean;
  priceText: string | null;
  downClusterContent: string | null;
  downContent: string | null;
  fillPower: string | null;
  cleanliness: string | null;
  oxygenNumber: string | null;
  moisture: string | null;
  packaging: string | null;
  packageWeight: string | null;
  minimumOrder: string | null;
  supplyCapacity: string | null;
  leadTime: string | null;
  applications: string[];
  customItems: string[];
  qualityNote: string;
  specifications: {
    label: string;
    value: string;
    unit: string | null;
    groupName: string | null;
  }[];
  demo: boolean;
};

export type MarketPoint = {
  id: string;
  productName: string;
  specification: string;
  priceMin: number | null;
  priceMax: number | null;
  unit: string;
  changeValue: number | null;
  quoteDate: string;
  sourceNote: string;
};
