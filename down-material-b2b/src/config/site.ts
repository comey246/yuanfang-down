import { legacySiteContent } from "@/config/legacy-content";

export const siteConfig = {
  companyName: legacySiteContent.companyName,
  shortName: legacySiteContent.shortName,
  slogan: "专注优质羽绒原料供应",
  description:
    "远方羽绒面向家纺、服装、品牌与贸易采购客户，提供白鸭绒、灰鸭绒、白鹅绒、灰鹅绒等羽绒原料的规格沟通、样品确认和批量采购服务。",
  phone: legacySiteContent.phone,
  mobile: legacySiteContent.mobile,
  wechat: legacySiteContent.mobile,
  address: "待填写",
  businessHours: "周一至周六 08:30-18:00",
  icpNumber: "待备案",
  policeRecordNumber: "待备案",
  creditCode: "待填写",
  logoUrl: legacySiteContent.logoUrl,
  wechatQrUrl: "/contact/wechat-qr.jpg",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  defaultKeywords: [
    "远方羽绒",
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
    { href: "/process", label: "生产工艺" },
    { href: "/quality", label: "质量检测" },
    { href: "/articles", label: "行业资讯" },
    { href: "/contact", label: "联系咨询" }
  ]
} as const;

export type SiteConfig = typeof siteConfig;
