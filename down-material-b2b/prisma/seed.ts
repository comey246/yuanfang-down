import {
  PrismaClient,
  AdminRole,
  ContentStatus,
  MediaType
} from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  legacyDataNotice,
  legacyDemoNotice,
  legacyHistoricalClaims,
  legacyProductContent,
  legacySiteContent
} from "../src/config/legacy-content";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const initialPassword =
    process.env.ADMIN_INITIAL_PASSWORD || "replace-before-seeding";

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "网站管理员",
      email: adminEmail,
      passwordHash: await bcrypt.hash(initialPassword, 12),
      role: AdminRole.ADMIN
    }
  });

  const categories = await Promise.all(
    [
      ["白鹅绒", "white-goose-down"],
      ["灰鹅绒", "grey-goose-down"],
      ["白鸭绒", "white-duck-down"],
      ["灰鸭绒", "grey-duck-down"],
      ["羽毛及其他原料", "feather-and-other"],
      ["定制规格", "custom-specification"]
    ].map(([name, slug], sortOrder) =>
      prisma.productCategory.upsert({
        where: { slug },
        update: {},
        create: { name, slug, sortOrder }
      })
    )
  );

  const products = [
    ["白鹅绒", "white-goose-down", "鹅绒", "白色"],
    ["灰鹅绒", "grey-goose-down", "鹅绒", "灰色"],
    ["白鸭绒", "white-duck-down", "鸭绒", "白色"],
    ["灰鸭绒", "grey-duck-down", "鸭绒", "灰色"]
  ] as const;

  for (const [name, slug, species, color] of products) {
    const category = categories.find((item) => item.slug === slug);
    const legacyProduct = legacyProductContent[slug];
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        categoryId: category?.id,
        species,
        color,
        summary: legacyProduct.summary,
        description:
          "本条目为网站结构演示数据。所有原料来源、参数、包装、起订量、供货能力与交付周期均须核实后填写。",
        coverImage: legacyProduct.coverImage,
        gallery: [...legacyProduct.gallery],
        applications: [...legacyProduct.applications],
        downClusterContent: legacyProduct.downClusterContent,
        sourceDescription: legacyDataNotice,
        qualityNote: `${legacyDataNotice}；实际质量参数以双方确认的样品、合同及检测文件为准。`,
        customization: true,
        sampleAvailable: true,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        demoNotice: `${legacyDemoNotice}；产品参数${legacyDataNotice}`
      }
    });
  }

  const articleCategory = await prisma.articleCategory.upsert({
    where: { slug: "purchasing-guide" },
    update: {},
    create: { name: "采购指南", slug: "purchasing-guide" }
  });

  const articles = [
    ["羽绒原料采购需要关注哪些指标", "down-purchasing-indicators"],
    ["鹅绒和鸭绒有什么区别", "goose-down-vs-duck-down"],
    ["羽绒蓬松度和绒子含量如何理解", "fill-power-and-down-cluster-content"]
  ];

  for (const [title, slug] of articles) {
    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        title,
        slug,
        categoryId: articleCategory.id,
        excerpt: "演示草稿，内容需经业务与质量负责人核验后方可发布。",
        content:
          "本文为内容结构占位，不包含未经核验的检测结论。请在后台完成审核与补充。",
        author: "待填写",
        status: ContentStatus.DRAFT,
        demoNotice: "演示草稿，不直接公开发布"
      }
    });
  }

  const mediaCategories = [
    "工厂环境",
    "生产设备",
    "原料实拍",
    "清洗过程",
    "分拣过程",
    "检测过程",
    "包装发货"
  ];
  for (const [index, category] of mediaCategories.entries()) {
    const title = `${category}素材待补充`;
    const existing = await prisma.mediaAsset.findFirst({ where: { title } });
    if (!existing) {
      await prisma.mediaAsset.create({
        data: {
          title,
          type: index === 0 ? MediaType.VIDEO : MediaType.IMAGE,
          category,
          sortOrder: index,
          published: false,
          featuredOnHome: index < 3,
          altText: `${category}真实照片待替换`,
          replaceNotice: "本地占位记录，发布前必须替换为已获授权的工厂真实素材"
        }
      });
    }
  }

  await prisma.siteSetting.upsert({
    where: { key: "company_profile" },
    update: {},
    create: {
      key: "company_profile",
      description: "企业资料与联系方式",
      value: {
        companyName: legacySiteContent.companyName,
        shortName: legacySiteContent.shortName,
        phone: legacySiteContent.phone,
        mobile: legacySiteContent.mobile,
        wechat: legacySiteContent.mobile,
        email: legacySiteContent.email,
        address: "待填写",
        businessHours: "周一至周六 08:30-18:00",
        icpNumber: "待备案",
        policeRecordNumber: "待备案",
        creditCode: "待填写",
        logoUrl: legacySiteContent.logoUrl,
        wechatQrUrl: "/contact/wechat-qr.jpg"
      }
    }
  });

  await prisma.siteSetting.upsert({
    where: { key: "site_options" },
    update: {},
    create: {
      key: "site_options",
      description: "SEO、首页顺序与客服脚本",
      isSensitive: true,
      value: {
        homeModuleOrder: "",
        customerServiceProviderName: "待填写的国内客服平台",
        customerServiceUrl: "",
        customerServiceScript: "",
        seoKeywords:
          "远方羽绒，羽绒原料厂家，鹅绒原料供应，鸭绒原料采购，羽绒加工厂，羽绒原料报价",
        baiduVerification: legacySiteContent.baiduVerification
      }
    }
  });

  await prisma.siteSetting.upsert({
    where: { key: "legacy_claims" },
    update: {},
    create: {
      key: "legacy_claims",
      description: "从旧站迁移的供应能力、质量与认证历史声明",
      value: legacyHistoricalClaims
    }
  });

  for (const [, slug] of products) {
    const product = legacyProductContent[slug];
    const productName =
      categories.find((item) => item.slug === slug)?.name || slug;
    const sourceNote = legacyHistoricalClaims.priceStatement;
    const existingQuote = await prisma.marketQuote.findFirst({
      where: { productName, sourceNote, deletedAt: null }
    });
    if (!existingQuote) {
      await prisma.marketQuote.create({
        data: {
          productName,
          specification: `绒子含量 ${product.downClusterContent}（待核验）`,
          unit: "待业务确认",
          quoteDate: new Date(),
          sourceNote,
          disclaimer:
            "旧站未提供具体价格，本记录仅保留历史报价入口，不构成行情或合同报价。",
          published: true
        }
      });
    }
  }

  console.info(`Seed 完成。后台账号：${adminEmail}。请立即替换初始密码。`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
