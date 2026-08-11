export const siteConfig = {
  companyName: "待填写的羽绒工厂名称",
  shortName: "待填写",
  slogan: "专注优质羽绒原料供应",
  description:
    "面向家纺、服装、品牌与贸易采购客户，提供羽绒原料规格沟通、样品确认和批量交付服务。",
  phone: "待填写",
  mobile: "待填写",
  wechat: "待填写",
  email: "待填写",
  address: "待填写",
  businessHours: "周一至周六 08:30-18:00",
  icpNumber: "待备案",
  policeRecordNumber: "待备案",
  creditCode: "待填写",
  logoUrl: "",
  wechatQrUrl: "",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  defaultKeywords: [
    "羽绒原料厂家",
    "鹅绒原料供应",
    "鸭绒原料采购",
    "羽绒加工厂",
    "羽绒原料报价"
  ],
  navigation: [
    { href: "/", label: "首页" },
    { href: "/products", label: "羽绒原料" },
    { href: "/market", label: "今日行情" },
    { href: "/factory", label: "工厂实力" },
    { href: "/process", label: "生产工艺" },
    { href: "/quality", label: "质量检测" },
    { href: "/media", label: "视频实拍" },
    { href: "/articles", label: "行业资讯" },
    { href: "/contact", label: "联系咨询" }
  ]
} as const;

export type SiteConfig = typeof siteConfig;
