import {
  PrismaClient,
  AdminRole,
  ContentStatus,
  MediaType
} from "@prisma/client";
import bcrypt from "bcryptjs";

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
  ];

  for (const [name, slug, species, color] of products) {
    const category = categories.find((item) => item.slug === slug);
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        categoryId: category?.id,
        species,
        color,
        summary: `${name}原料示例条目，可选规格待后台补充。`,
        description:
          "本条目为网站结构演示数据。所有原料来源、参数、包装、起订量、供货能力与交付周期均须核实后填写。",
        qualityNote: "实际质量参数以双方确认的样品、合同及检测文件为准。",
        customization: true,
        sampleAvailable: true,
        status: ContentStatus.DRAFT,
        demoNotice: "示例数据，发布前需替换"
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
        companyName: "待填写的羽绒工厂名称",
        shortName: "待填写",
        phone: "待填写",
        mobile: "待填写",
        wechat: "待填写",
        email: "待填写",
        address: "待填写",
        businessHours: "周一至周六 08:30-18:00",
        icpNumber: "待备案",
        policeRecordNumber: "待备案",
        logoUrl: "",
        wechatQrUrl: ""
      }
    }
  });

  console.info(`Seed 完成。后台账号：${adminEmail}。请立即替换初始密码。`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
