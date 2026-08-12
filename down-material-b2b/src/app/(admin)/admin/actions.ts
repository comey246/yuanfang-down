"use server";

import bcrypt from "bcryptjs";
import {
  AdminRole,
  ContentStatus,
  InquiryStatus,
  MediaType,
  CertificateType
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { syncCnDownMarketFromWorker } from "@/lib/cn-down-market";
import { getPrisma } from "@/lib/prisma";

const text = (form: FormData, key: string) =>
  String(form.get(key) || "").trim();
const optional = (form: FormData, key: string) => text(form, key) || null;
const checked = (form: FormData, key: string) => form.get(key) === "on";

async function audit(
  action: string,
  entityType: string,
  entityId?: string,
  summary?: string
) {
  const admin = await requireAdmin();
  const prisma = getPrisma();
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      adminEmail: admin.email,
      action,
      entityType,
      entityId,
      summary
    }
  });
}

export async function saveProduct(form: FormData) {
  const admin = await requireAdmin();
  const prisma = getPrisma();
  const id = text(form, "id");
  const name = text(form, "name");
  const slug = text(form, "slug");
  if (!name || !slug) throw new Error("产品名称和 slug 必填");
  const data = {
    name,
    slug,
    categoryId: optional(form, "categoryId"),
    summary: optional(form, "summary"),
    description: optional(form, "description"),
    sourceDescription: optional(form, "sourceDescription"),
    species: optional(form, "species"),
    color: optional(form, "color"),
    coverImage: optional(form, "coverImage"),
    videoUrl: optional(form, "videoUrl"),
    videoPoster: optional(form, "videoPoster"),
    downClusterContent: optional(form, "downClusterContent"),
    downContent: optional(form, "downContent"),
    fillPower: optional(form, "fillPower"),
    cleanliness: optional(form, "cleanliness"),
    oxygenNumber: optional(form, "oxygenNumber"),
    moisture: optional(form, "moisture"),
    packaging: optional(form, "packaging"),
    packageWeight: optional(form, "packageWeight"),
    minimumOrder: optional(form, "minimumOrder"),
    supplyCapacity: optional(form, "supplyCapacity"),
    leadTime: optional(form, "leadTime"),
    qualityNote: optional(form, "qualityNote"),
    reportUrl: optional(form, "reportUrl"),
    customization: checked(form, "customization"),
    sampleAvailable: checked(form, "sampleAvailable"),
    featured: checked(form, "featured"),
    showPrice: checked(form, "showPrice"),
    priceText: optional(form, "priceText"),
    status: text(form, "status") as ContentStatus,
    seoTitle: optional(form, "seoTitle"),
    seoDescription: optional(form, "seoDescription"),
    demoNotice: optional(form, "demoNotice"),
    gallery: text(form, "gallery")
      .split(/[，,\n]/)
      .map((item) => item.trim())
      .filter(Boolean),
    applications: text(form, "applications")
      .split(/[，,\n]/)
      .map((item) => item.trim())
      .filter(Boolean),
    customItems: text(form, "customItems")
      .split(/[，,\n]/)
      .map((item) => item.trim())
      .filter(Boolean),
    publishedAt:
      text(form, "status") === ContentStatus.PUBLISHED ? new Date() : null
  };
  const product = id
    ? await prisma.product.update({ where: { id }, data })
    : await prisma.product.create({ data });
  const specificationLines = text(form, "specifications")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  await prisma.$transaction([
    prisma.productSpecification.deleteMany({
      where: { productId: product.id }
    }),
    ...specificationLines.map((line, index) => {
      const [label, value, unit, groupName] = line
        .split("|")
        .map((item) => item.trim());
      return prisma.productSpecification.create({
        data: {
          productId: product.id,
          label: label || `参数${index + 1}`,
          value: value || null,
          unit: unit || null,
          groupName: groupName || null,
          sortOrder: index
        }
      });
    })
  ]);
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      adminEmail: admin.email,
      action: id ? "UPDATE" : "CREATE",
      entityType: "Product",
      entityId: product.id,
      summary: name
    }
  });
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/admin/products");
}

export async function archiveProduct(form: FormData) {
  const prisma = getPrisma();
  const id = text(form, "id");
  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date(), status: ContentStatus.ARCHIVED }
  });
  await audit("ARCHIVE", "Product", id, "产品软删除");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function saveProductCategory(form: FormData) {
  const prisma = getPrisma();
  const name = text(form, "categoryName");
  const slug = text(form, "categorySlug");
  if (!name || !slug) throw new Error("分类名称和 slug 必填");
  const category = await prisma.productCategory.upsert({
    where: { slug },
    update: { name, active: true, deletedAt: null },
    create: { name, slug }
  });
  await audit("UPSERT", "ProductCategory", category.id, name);
  revalidatePath("/admin/products");
}

export async function archiveProductCategory(form: FormData) {
  const prisma = getPrisma();
  const id = text(form, "id");
  await prisma.productCategory.update({
    where: { id },
    data: { active: false, deletedAt: new Date() }
  });
  await audit("ARCHIVE", "ProductCategory", id, "产品分类软删除");
  revalidatePath("/admin/products");
}

export async function saveMarketQuote(form: FormData) {
  const prisma = getPrisma();
  const id = text(form, "id");
  const data = {
    productName: text(form, "productName"),
    specification: optional(form, "specification"),
    priceMin: optional(form, "priceMin"),
    priceMax: optional(form, "priceMax"),
    unit: optional(form, "unit"),
    changeValue: optional(form, "changeValue"),
    quoteDate: new Date(text(form, "quoteDate")),
    sourceNote: optional(form, "sourceNote"),
    disclaimer: optional(form, "disclaimer"),
    published: checked(form, "published")
  };
  const quote = id
    ? await prisma.marketQuote.update({ where: { id }, data })
    : await prisma.marketQuote.create({ data });
  await prisma.marketQuoteHistory.create({
    data: {
      quoteId: quote.id,
      priceMin: data.priceMin,
      priceMax: data.priceMax,
      changeValue: data.changeValue,
      recordedAt: data.quoteDate
    }
  });
  await audit(
    id ? "UPDATE" : "CREATE",
    "MarketQuote",
    quote.id,
    data.productName
  );
  revalidatePath("/market");
  revalidatePath("/admin/market");
}

export async function archiveMarketQuote(form: FormData) {
  const prisma = getPrisma();
  const id = text(form, "id");
  await prisma.marketQuote.update({
    where: { id },
    data: { deletedAt: new Date(), published: false }
  });
  await audit("ARCHIVE", "MarketQuote", id);
  revalidatePath("/market");
  revalidatePath("/admin/market");
}

export async function syncMarketQuotesFromCnDown() {
  const admin = await requireAdmin();
  const result = await syncCnDownMarketFromWorker();
  const prisma = getPrisma();
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      adminEmail: admin.email,
      action: "MANUAL_SYNC",
      entityType: "MarketQuote",
      summary: `手动同步羽绒金网行情：${result.products} 个品种`,
      metadata: result
    }
  });
  revalidatePath("/");
  revalidatePath("/market");
  revalidatePath("/admin/market");
}

export async function saveArticle(form: FormData) {
  const prisma = getPrisma();
  const id = text(form, "id");
  const data = {
    title: text(form, "title"),
    slug: text(form, "slug"),
    categoryId: optional(form, "categoryId"),
    excerpt: optional(form, "excerpt"),
    content: optional(form, "content"),
    author: optional(form, "author"),
    sourceName: optional(form, "sourceName"),
    sourceUrl: optional(form, "sourceUrl"),
    status: text(form, "status") as ContentStatus,
    demoNotice: optional(form, "demoNotice"),
    seoTitle: optional(form, "seoTitle"),
    seoDescription: optional(form, "seoDescription"),
    publishedAt:
      text(form, "status") === ContentStatus.PUBLISHED ? new Date() : null
  };
  const article = id
    ? await prisma.article.update({ where: { id }, data })
    : await prisma.article.create({ data });
  const faqs = text(form, "faqs")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  await prisma.$transaction([
    prisma.fAQ.deleteMany({ where: { articleId: article.id } }),
    ...faqs.map((line, index) => {
      const [question, answer] = line.split("|").map((item) => item.trim());
      return prisma.fAQ.create({
        data: {
          articleId: article.id,
          question: question || `问题${index + 1}`,
          answer: answer || "待补充",
          sortOrder: index,
          published: data.status === ContentStatus.PUBLISHED
        }
      });
    })
  ]);
  await audit(id ? "UPDATE" : "CREATE", "Article", article.id, data.title);
  revalidatePath("/articles");
  revalidatePath(`/articles/${data.slug}`);
  revalidatePath("/admin/articles");
}

export async function archiveArticle(form: FormData) {
  const prisma = getPrisma();
  const id = text(form, "id");
  await prisma.article.update({
    where: { id },
    data: { deletedAt: new Date(), status: ContentStatus.ARCHIVED }
  });
  await audit("ARCHIVE", "Article", id);
  revalidatePath("/articles");
  revalidatePath("/admin/articles");
}

export async function saveMedia(form: FormData) {
  const prisma = getPrisma();
  const id = text(form, "id");
  const data = {
    title: text(form, "title"),
    type: text(form, "type") as MediaType,
    url: optional(form, "url"),
    posterUrl: optional(form, "posterUrl"),
    category: text(form, "category"),
    description: optional(form, "description"),
    altText: optional(form, "altText"),
    sortOrder: Number(text(form, "sortOrder") || 0),
    featuredOnHome: checked(form, "featuredOnHome"),
    published: checked(form, "published"),
    replaceNotice: optional(form, "replaceNotice")
  };
  const media = id
    ? await prisma.mediaAsset.update({ where: { id }, data })
    : await prisma.mediaAsset.create({ data });
  await audit(id ? "UPDATE" : "CREATE", "MediaAsset", media.id, data.title);
  revalidatePath("/media");
  revalidatePath("/admin/media");
}

export async function archiveMedia(form: FormData) {
  const prisma = getPrisma();
  const id = text(form, "id");
  await prisma.mediaAsset.update({
    where: { id },
    data: { deletedAt: new Date(), published: false }
  });
  await audit("ARCHIVE", "MediaAsset", id);
  revalidatePath("/media");
  revalidatePath("/admin/media");
}

export async function saveCompanySettings(form: FormData) {
  const admin = await requireAdmin();
  const prisma = getPrisma();
  const profile = {
    companyName: text(form, "companyName") || "待填写的羽绒工厂名称",
    shortName: text(form, "shortName") || "待填写",
    phone: text(form, "phone") || "待填写",
    mobile: text(form, "mobile") || "待填写",
    wechat: text(form, "wechat") || "待填写",
    email: text(form, "email") || "待填写",
    address: text(form, "address") || "待填写",
    businessHours: text(form, "businessHours") || "待填写",
    icpNumber: text(form, "icpNumber") || "待备案",
    policeRecordNumber: text(form, "policeRecordNumber") || "待备案",
    creditCode: text(form, "creditCode") || "待填写",
    logoUrl: text(form, "logoUrl"),
    wechatQrUrl: text(form, "wechatQrUrl")
  };
  await prisma.siteSetting.upsert({
    where: { key: "company_profile" },
    update: { value: profile },
    create: {
      key: "company_profile",
      value: profile,
      description: "企业资料与联系方式"
    }
  });
  const currentOptions = await prisma.siteSetting.findUnique({
    where: { key: "site_options" }
  });
  const current =
    (currentOptions?.value as {
      customerServiceProviderName?: string;
      customerServiceUrl?: string;
      customerServiceScript?: string;
      baiduVerification?: string;
    } | null) || {};
  const submittedScript = text(form, "customerServiceScript");
  const submittedVerification = text(form, "baiduVerification");
  const other = {
    homeModuleOrder: text(form, "homeModuleOrder"),
    customerServiceProviderName:
      text(form, "customerServiceProviderName") || "待填写的国内客服平台",
    customerServiceUrl: text(form, "customerServiceUrl"),
    customerServiceScript: submittedScript.startsWith("••••")
      ? current.customerServiceScript || ""
      : submittedScript,
    seoKeywords: text(form, "seoKeywords"),
    baiduVerification: submittedVerification.startsWith("••••")
      ? current.baiduVerification || ""
      : submittedVerification
  };
  await prisma.siteSetting.upsert({
    where: { key: "site_options" },
    update: { value: other, isSensitive: true },
    create: {
      key: "site_options",
      value: other,
      description: "SEO、首页顺序与客服脚本",
      isSensitive: true
    }
  });
  const legacyClaims = {
    stats: [
      {
        key: "annualSupply",
        label: "年供应量",
        value: text(form, "legacyAnnualSupply"),
        unit: "吨"
      },
      {
        key: "partnerFactories",
        label: "合作工厂",
        value: text(form, "legacyPartnerFactories"),
        unit: "家"
      },
      {
        key: "batchTests",
        label: "批次质检",
        value: text(form, "legacyBatchTests"),
        unit: "批次"
      },
      {
        key: "exportRegions",
        label: "出口配套地区",
        value: text(form, "legacyExportRegions"),
        unit: "个"
      }
    ].filter((item) => item.value),
    certificationStatements: text(form, "legacyCertificationStatements")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    qualityStatement: text(form, "legacyQualityStatement"),
    priceStatement: text(form, "legacyPriceStatement"),
    sourceNote: "同一 Git 仓库旧站 index.html",
    verified: checked(form, "legacyClaimsVerified")
  };
  await prisma.siteSetting.upsert({
    where: { key: "legacy_claims" },
    update: { value: legacyClaims, updatedBy: admin.email },
    create: {
      key: "legacy_claims",
      value: legacyClaims,
      description: "从旧站迁移的供应能力、质量与认证历史声明",
      updatedBy: admin.email
    }
  });
  await audit("UPDATE", "SiteSetting", "company_profile", "更新网站设置");
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function saveCertificate(form: FormData) {
  const prisma = getPrisma();
  const id = text(form, "id");
  const data = {
    title: text(form, "title"),
    type: text(form, "type") as CertificateType,
    issuer: optional(form, "issuer"),
    issueDate: text(form, "issueDate")
      ? new Date(text(form, "issueDate"))
      : null,
    expiryDate: text(form, "expiryDate")
      ? new Date(text(form, "expiryDate"))
      : null,
    fileUrl: optional(form, "fileUrl"),
    description: optional(form, "description"),
    verified: checked(form, "verified"),
    published: checked(form, "published")
  };
  const item = id
    ? await prisma.certificate.update({ where: { id }, data })
    : await prisma.certificate.create({ data });
  await audit(id ? "UPDATE" : "CREATE", "Certificate", item.id, data.title);
  revalidatePath("/quality");
  revalidatePath("/admin/settings");
}

export async function archiveCertificate(form: FormData) {
  const prisma = getPrisma();
  const id = text(form, "id");
  await prisma.certificate.update({
    where: { id },
    data: { deletedAt: new Date(), published: false }
  });
  await audit("ARCHIVE", "Certificate", id);
  revalidatePath("/quality");
  revalidatePath("/admin/settings");
}

export async function createAdminUser(form: FormData) {
  const current = await requireAdmin();
  const prisma = getPrisma();
  if (current.role !== AdminRole.ADMIN)
    throw new Error("仅管理员可创建后台账号");
  const password = text(form, "password");
  if (password.length < 12) throw new Error("后台密码至少12位");
  const data = {
    name: text(form, "name"),
    email: text(form, "email").toLowerCase(),
    passwordHash: await bcrypt.hash(password, 12),
    role: text(form, "role") as AdminRole
  };
  const user = await prisma.adminUser.create({ data });
  await audit("CREATE", "AdminUser", user.id, data.email);
  revalidatePath("/admin/users");
}

export async function toggleAdminUser(form: FormData) {
  const current = await requireAdmin();
  const prisma = getPrisma();
  if (current.role !== AdminRole.ADMIN)
    throw new Error("仅管理员可修改账号状态");
  const id = text(form, "id");
  if (id === current.id) throw new Error("不能停用当前登录账号");
  const active = text(form, "active") === "true";
  await prisma.adminUser.update({ where: { id }, data: { active } });
  await audit("UPDATE", "AdminUser", id, active ? "启用账号" : "停用账号");
  revalidatePath("/admin/users");
}

export async function updateInquiry(form: FormData) {
  const prisma = getPrisma();
  const id = text(form, "id");
  const status = text(form, "status") as InquiryStatus;
  const assignee = optional(form, "assignee");
  const note = optional(form, "internalNote");
  await prisma.inquiry.update({
    where: { id },
    data: { status, assignee, internalNote: note }
  });
  await audit("UPDATE", "Inquiry", id, `状态：${status}`);
  revalidatePath("/admin/inquiries");
}

export async function addInquiryFollowUp(form: FormData) {
  const admin = await requireAdmin();
  const prisma = getPrisma();
  const inquiryId = text(form, "id");
  const note = text(form, "followUpNote");
  if (!note) return;
  const statusText = text(form, "followUpStatus");
  const status = statusText ? (statusText as InquiryStatus) : null;
  await prisma.$transaction([
    prisma.inquiryFollowUp.create({
      data: { inquiryId, note, status, createdBy: admin.email }
    }),
    ...(status
      ? [prisma.inquiry.update({ where: { id: inquiryId }, data: { status } })]
      : [])
  ]);
  await audit("FOLLOW_UP", "Inquiry", inquiryId, note.slice(0, 120));
  revalidatePath("/admin/inquiries");
}

export async function bulkUpdateInquiryStatus(form: FormData) {
  const prisma = getPrisma();
  const ids = form.getAll("ids").map(String);
  const status = text(form, "bulkStatus") as InquiryStatus;
  if (!ids.length) return;
  await prisma.inquiry.updateMany({
    where: { id: { in: ids } },
    data: { status }
  });
  await audit(
    "BULK_UPDATE",
    "Inquiry",
    undefined,
    `${ids.length} 条更新为 ${status}`
  );
  revalidatePath("/admin/inquiries");
}
