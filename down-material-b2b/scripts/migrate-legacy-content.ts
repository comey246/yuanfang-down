import { Prisma, PrismaClient } from "@prisma/client";
import {
  legacyDemoNotice,
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
        applications: [...content.applications],
        demoNotice: legacyDemoNotice
      }
    });
    updatedProducts += 1;
  }

  await prisma.auditLog.create({
    data: {
      action: "MIGRATE",
      entityType: "LegacySiteContent",
      entityId: "repository-root",
      summary: "迁移旧站品牌、联系方式及带明确演示标识的本地素材",
      metadata: {
        updatedProducts,
        preservedConfirmedSettings: true,
        migratedUnverifiedClaims: false
      }
    }
  });

  console.info(
    `旧站内容迁移完成：企业设置已合并，更新 ${updatedProducts} 个演示产品。`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
