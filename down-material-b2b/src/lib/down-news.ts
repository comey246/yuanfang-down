import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { generatedAssets } from "@/config/generated-assets";
import { getPrisma } from "@/lib/prisma";

export const downNewsItemSchema = z.object({
  sourceId: z.string().regex(/^\d+$/),
  title: z.string().trim().min(2).max(180),
  sourceUrl: z.string().url().max(500),
  sourceCategory: z.string().trim().min(2).max(30),
  publishedDate: z.string().date()
});

export const downNewsItemsSchema = z.array(downNewsItemSchema).min(1).max(30);

export type DownNewsItem = z.infer<typeof downNewsItemSchema>;

export function getNewsCategory(sourceCategory: string) {
  return sourceCategory.includes("行情")
    ? { name: "行业行情", slug: "industry-market" }
    : { name: "行业资讯", slug: "industry-news" };
}

export function buildNewsExcerpt(item: DownNewsItem) {
  const subject = item.title.replace(/[。！？!?]+$/u, "");
  if (item.sourceCategory.includes("行情")) {
    return `关注${subject}，了解羽绒行业近期市场变化。`;
  }
  if (item.sourceCategory.includes("标准")) {
    return `关注${subject}，了解羽绒行业标准与质量要求的最新动态。`;
  }
  if (item.sourceCategory.includes("协会")) {
    return `关注${subject}，了解羽绒行业组织与产业发展的最新动态。`;
  }
  return `关注${subject}，了解羽绒产业、质量、市场与应用领域的最新动态。`;
}

function buildNewsContent(item: DownNewsItem) {
  return `本条内容为羽绒行业资讯索引，原标题为《${item.title}》。\n\n来源：中国羽绒信息网\n\n如需查看完整报道，请通过页面下方的“内容来源”进入原文。`;
}

function publishedAt(date: string) {
  return new Date(`${date}T00:00:00+08:00`);
}

export async function persistDownNews(items: DownNewsItem[]) {
  const prisma = getPrisma();
  let created = 0;
  let updated = 0;

  for (const item of items) {
    const categoryInput = getNewsCategory(item.sourceCategory);
    const category = await prisma.articleCategory.upsert({
      where: { slug: categoryInput.slug },
      update: { name: categoryInput.name },
      create: categoryInput
    });
    const slug = `cfd-news-${item.sourceId}`;
    const articleCovers = Object.values(generatedAssets.articleCovers);
    const coverImage =
      articleCovers[Number(item.sourceId) % articleCovers.length];
    const existing = await prisma.article.findUnique({
      where: { slug },
      select: { id: true }
    });
    const data = {
      title: item.title,
      categoryId: category.id,
      excerpt: buildNewsExcerpt(item),
      content: buildNewsContent(item),
      coverImage,
      author: "中国羽绒信息网",
      sourceName: "中国羽绒信息网",
      sourceUrl: item.sourceUrl,
      status: ContentStatus.PUBLISHED,
      demoNotice: null,
      seoTitle: `${item.title}｜羽绒行业资讯`,
      seoDescription: buildNewsExcerpt(item),
      publishedAt: publishedAt(item.publishedDate),
      deletedAt: null
    };
    await prisma.article.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data }
    });
    if (existing) updated += 1;
    else created += 1;
  }

  return { received: items.length, created, updated };
}
