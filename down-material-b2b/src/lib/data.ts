import { ContentStatus, Prisma } from "@prisma/client";
import { connection } from "next/server";
import { cache } from "react";
import { demoProducts } from "@/lib/demo-data";
import { databaseConfigured, prisma } from "@/lib/prisma";
import type { DemoProduct, MarketPoint } from "@/types";
import { siteConfig } from "@/config/site";

export type CompanyProfile = {
  companyName: string;
  shortName: string;
  phone: string;
  mobile: string;
  wechat: string;
  email: string;
  address: string;
  businessHours: string;
  icpNumber: string;
  policeRecordNumber: string;
  creditCode: string;
  logoUrl: string;
  wechatQrUrl: string;
};

export type SiteOptions = {
  homeModuleOrder: string;
  customerServiceProviderName: string;
  customerServiceUrl: string;
  customerServiceScript: string;
  seoKeywords: string;
  baiduVerification: string;
};

export const getCompanyProfile = cache(async (): Promise<CompanyProfile> => {
  await connection();
  const fallback: CompanyProfile = {
    companyName: siteConfig.companyName,
    shortName: siteConfig.shortName,
    phone: siteConfig.phone,
    mobile: siteConfig.mobile,
    wechat: siteConfig.wechat,
    email: siteConfig.email,
    address: siteConfig.address,
    businessHours: siteConfig.businessHours,
    icpNumber: siteConfig.icpNumber,
    policeRecordNumber: siteConfig.policeRecordNumber,
    creditCode: siteConfig.creditCode,
    logoUrl: siteConfig.logoUrl,
    wechatQrUrl: siteConfig.wechatQrUrl
  };
  if (!databaseConfigured()) return fallback;
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "company_profile" }
    });
    return {
      ...fallback,
      ...(setting?.value as Partial<CompanyProfile> | undefined)
    };
  } catch {
    return fallback;
  }
});

export const getSiteOptions = cache(async (): Promise<SiteOptions> => {
  await connection();
  const fallback = {
    homeModuleOrder: "",
    customerServiceProviderName: "待填写的国内客服平台",
    customerServiceUrl: "",
    customerServiceScript: "",
    seoKeywords: siteConfig.defaultKeywords.join("，"),
    baiduVerification: ""
  };
  if (!databaseConfigured()) return fallback;
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "site_options" }
    });
    return {
      ...fallback,
      ...(setting?.value as Partial<SiteOptions> | undefined)
    };
  } catch {
    return fallback;
  }
});

function productToView(
  product: Prisma.ProductGetPayload<{
    include: { category: true; specifications: true };
  }>
): DemoProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category?.name || "其他原料",
    species:
      product.species === "鸭绒"
        ? "鸭绒"
        : product.species === "鹅绒"
          ? "鹅绒"
          : "其他",
    color:
      product.color === "白色"
        ? "白色"
        : product.color === "灰色"
          ? "灰色"
          : "其他",
    summary: product.summary || "",
    description: product.description || "",
    coverImage: product.coverImage,
    gallery: product.gallery,
    videoUrl: product.videoUrl,
    videoPoster: product.videoPoster,
    customization: product.customization,
    sampleAvailable: product.sampleAvailable,
    showPrice: product.showPrice,
    priceText: product.priceText,
    downClusterContent: product.downClusterContent,
    downContent: product.downContent,
    fillPower: product.fillPower,
    cleanliness: product.cleanliness,
    oxygenNumber: product.oxygenNumber,
    moisture: product.moisture,
    packaging: product.packaging,
    packageWeight: product.packageWeight,
    minimumOrder: product.minimumOrder,
    supplyCapacity: product.supplyCapacity,
    leadTime: product.leadTime,
    applications: product.applications,
    customItems: product.customItems,
    qualityNote: product.qualityNote || "",
    specifications: product.specifications
      .filter((item) => item.value?.trim())
      .map((item) => ({
        label: item.label,
        value: item.value || "",
        unit: item.unit,
        groupName: item.groupName
      })),
    demo: Boolean(product.demoNotice)
  };
}

export async function getPublishedProducts(): Promise<DemoProduct[]> {
  await connection();
  if (!databaseConfigured()) return demoProducts;
  try {
    const products = await prisma.product.findMany({
      where: { status: ContentStatus.PUBLISHED, deletedAt: null },
      include: {
        category: true,
        specifications: {
          where: { isPublic: true },
          orderBy: { sortOrder: "asc" }
        }
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
    });
    return products.length ? products.map(productToView) : demoProducts;
  } catch {
    return demoProducts;
  }
}

export async function getProductBySlug(
  slug: string
): Promise<DemoProduct | null> {
  await connection();
  if (!databaseConfigured())
    return demoProducts.find((item) => item.slug === slug) || null;
  try {
    const product = await prisma.product.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED, deletedAt: null },
      include: {
        category: true,
        specifications: {
          where: { isPublic: true },
          orderBy: { sortOrder: "asc" }
        }
      }
    });
    return product
      ? productToView(product)
      : demoProducts.find((item) => item.slug === slug) || null;
  } catch {
    return demoProducts.find((item) => item.slug === slug) || null;
  }
}

export async function getMarketQuotes(): Promise<MarketPoint[]> {
  await connection();
  if (!databaseConfigured()) return [];
  try {
    const quotes = await prisma.marketQuote.findMany({
      where: { published: true, deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { quoteDate: "desc" }]
    });
    return quotes.map((quote) => ({
      id: quote.id,
      productName: quote.productName,
      specification: quote.specification || "待补充",
      priceMin: quote.priceMin === null ? null : Number(quote.priceMin),
      priceMax: quote.priceMax === null ? null : Number(quote.priceMax),
      unit: quote.unit || "待补充",
      changeValue:
        quote.changeValue === null ? null : Number(quote.changeValue),
      quoteDate: quote.quoteDate.toISOString(),
      sourceNote: quote.sourceNote || "数据来源待补充"
    }));
  } catch {
    return [];
  }
}

export async function getMarketHistory(): Promise<MarketPoint[]> {
  await connection();
  if (!databaseConfigured()) return [];
  try {
    const history = await prisma.marketQuoteHistory.findMany({
      where: { quote: { published: true, deletedAt: null } },
      include: { quote: true },
      orderBy: { recordedAt: "asc" }
    });
    return history.map((item) => ({
      id: item.id,
      productName: item.quote.productName,
      specification: item.quote.specification || "待补充",
      priceMin: item.priceMin === null ? null : Number(item.priceMin),
      priceMax: item.priceMax === null ? null : Number(item.priceMax),
      unit: item.quote.unit || "待补充",
      changeValue: item.changeValue === null ? null : Number(item.changeValue),
      quoteDate: item.recordedAt.toISOString(),
      sourceNote: item.quote.sourceNote || "数据来源待补充"
    }));
  } catch {
    return [];
  }
}

export async function getPublishedArticles() {
  await connection();
  if (!databaseConfigured()) return [];
  try {
    return await prisma.article.findMany({
      where: { status: ContentStatus.PUBLISHED, deletedAt: null },
      include: {
        category: true,
        faqs: {
          where: { published: true, deletedAt: null },
          orderBy: { sortOrder: "asc" }
        }
      },
      orderBy: { publishedAt: "desc" }
    });
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string) {
  await connection();
  if (!databaseConfigured()) return null;
  try {
    return await prisma.article.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED, deletedAt: null },
      include: {
        category: true,
        faqs: {
          where: { published: true, deletedAt: null },
          orderBy: { sortOrder: "asc" }
        }
      }
    });
  } catch {
    return null;
  }
}

export async function getPublishedMedia() {
  await connection();
  if (!databaseConfigured()) return [];
  try {
    return await prisma.mediaAsset.findMany({
      where: { published: true, deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
    });
  } catch {
    return [];
  }
}

export async function getPublishedCertificates() {
  await connection();
  if (!databaseConfigured()) return [];
  try {
    return await prisma.certificate.findMany({
      where: { published: true, verified: true, deletedAt: null },
      orderBy: { updatedAt: "desc" }
    });
  } catch {
    return [];
  }
}
