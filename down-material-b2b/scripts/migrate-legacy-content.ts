import { ContentStatus, Prisma, PrismaClient } from "@prisma/client";
import {
  legacyDataNotice,
  legacyHistoricalClaims,
  legacyProductContent,
  legacySiteContent
} from "../src/config/legacy-content";

const prisma = new PrismaClient();

function isPlaceholder(value: unknown) {
  return (
    typeof value !== "string" ||
    !value.trim() ||
    value.startsWith("待填") ||
    value === "待备案"
  );
}

function mergePlaceholderFields(
  current: Record<string, unknown>,
  incoming: Record<string, string>
) {
  const next = { ...current };
  for (const [key, value] of Object.entries(incoming)) {
    if (isPlaceholder(next[key])) next[key] = value;
  }
  return next;
}

async function main() {
  const profileSetting = await prisma.siteSetting.findUnique({
    where: { key: "company_profile" }
  });
  const currentProfile =
    (profileSetting?.value as Record<string, unknown> | null) || {};
  const nextProfile = mergePlaceholderFields(currentProfile, {
    companyName: legacySiteContent.companyName,
    shortName: legacySiteContent.shortName,
    phone: legacySiteContent.phone,
    mobile: legacySiteContent.mobile,
    email: legacySiteContent.email,
    logoUrl: legacySiteContent.logoUrl
  });
  await prisma.siteSetting.upsert({
    where: { key: "company_profile" },
    update: { value: nextProfile as Prisma.InputJsonValue },
    create: {
      key: "company_profile",
      description: "企业资料与联系方式",
      value: nextProfile as Prisma.InputJsonValue
    }
  });

  const optionSetting = await prisma.siteSetting.findUnique({
    where: { key: "site_options" }
  });
  const currentOptions =
    (optionSetting?.value as Record<string, unknown> | null) || {};
  const nextOptions = mergePlaceholderFields(currentOptions, {
    seoKeywords:
      "远方羽绒，羽绒原料厂家，鹅绒原料供应，鸭绒原料采购，羽绒加工厂，羽绒原料报价",
    baiduVerification: legacySiteContent.baiduVerification
  });
  await prisma.siteSetting.upsert({
    where: { key: "site_options" },
    update: { value: nextOptions as Prisma.InputJsonValue },
    create: {
      key: "site_options",
      description: "SEO、首页顺序与客服脚本",
      isSensitive: true,
      value: nextOptions as Prisma.InputJsonValue
    }
  });

  const existingClaims = await prisma.siteSetting.findUnique({
    where: { key: "legacy_claims" }
  });
  const existingClaimValue = existingClaims?.value as
    { verified?: boolean } | undefined;
  if (!existingClaimValue?.verified) {
    await prisma.siteSetting.upsert({
      where: { key: "legacy_claims" },
      update: { value: legacyHistoricalClaims },
      create: {
        key: "legacy_claims",
        description: "从旧站迁移的供应能力、质量与认证历史声明",
        value: legacyHistoricalClaims
      }
    });
  }

  let updatedProducts = 0;
  for (const [slug, content] of Object.entries(legacyProductContent)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product?.demoNotice) continue;
    await prisma.product.update({
      where: { slug },
      data: {
        coverImage: content.coverImage,
        gallery: [...content.gallery],
        summary: content.summary,
        downClusterContent: content.downClusterContent,
        applications: [...content.applications],
        sourceDescription: legacyDataNotice,
        qualityNote: `${legacyDataNotice}；实际参数以双方确认的样品、合同及检测文件为准。`,
        status: ContentStatus.PUBLISHED,
        publishedAt: product.publishedAt || new Date(),
        demoNotice: null
      }
    });
    updatedProducts += 1;
  }

  let createdQuoteRows = 0;
  for (const [slug, content] of Object.entries(legacyProductContent)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    const productName = product?.name || slug;
    const sourceNote = legacyHistoricalClaims.priceStatement;
    const existingQuote = await prisma.marketQuote.findFirst({
      where: { productName, sourceNote, deletedAt: null }
    });
    if (existingQuote) continue;
    await prisma.marketQuote.create({
      data: {
        productName,
        specification: `绒子含量 ${content.downClusterContent}（待核验）`,
        priceMin: null,
        priceMax: null,
        unit: "待业务确认",
        changeValue: null,
        quoteDate: new Date(),
        sourceNote,
        disclaimer:
          "旧站未提供具体价格，本记录仅保留历史报价入口，不构成行情或合同报价。",
        published: true
      }
    });
    createdQuoteRows += 1;
  }

  await prisma.auditLog.create({
    data: {
      action: "MIGRATE",
      entityType: "LegacySiteContent",
      entityId: "repository-root",
      summary:
        "迁移旧站品牌、联系方式、历史供应数据、产品区间及带明确标识的演示素材",
      metadata: {
        updatedProducts,
        createdQuoteRows,
        preservedConfirmedSettings: true,
        migratedUnverifiedClaims: true,
        claimsVerified: false,
        numericPricesFoundInLegacySite: false
      }
    }
  });

  console.info(
    `旧站内容迁移完成：更新 ${updatedProducts} 个产品，新增 ${createdQuoteRows} 条无数值报价记录。`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
