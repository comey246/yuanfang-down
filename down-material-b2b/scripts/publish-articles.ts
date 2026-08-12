import { ContentStatus, Prisma, PrismaClient } from "@prisma/client";
import { publishedArticles } from "../src/content/published-articles";

const prisma = new PrismaClient();
const publishedAt = new Date("2026-08-12T00:00:00.000Z");

async function main() {
  for (const item of publishedArticles) {
    const category = await prisma.articleCategory.upsert({
      where: { slug: item.category.slug },
      update: { name: item.category.name },
      create: item.category
    });
    const article = await prisma.article.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        categoryId: category.id,
        excerpt: item.excerpt,
        content: item.content,
        author: item.author,
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        status: ContentStatus.PUBLISHED,
        demoNotice: null,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        publishedAt,
        deletedAt: null
      },
      create: {
        title: item.title,
        slug: item.slug,
        categoryId: category.id,
        excerpt: item.excerpt,
        content: item.content,
        author: item.author,
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        status: ContentStatus.PUBLISHED,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        publishedAt
      }
    });

    await prisma.$transaction([
      prisma.fAQ.deleteMany({ where: { articleId: article.id } }),
      ...item.faqs.map((faq, sortOrder) =>
        prisma.fAQ.create({
          data: {
            articleId: article.id,
            question: faq.question,
            answer: faq.answer,
            category: item.category.name,
            sortOrder,
            published: true
          }
        })
      )
    ]);
  }

  const companySetting = await prisma.siteSetting.findUnique({
    where: { key: "company_profile" }
  });
  if (
    companySetting?.value &&
    typeof companySetting.value === "object" &&
    !Array.isArray(companySetting.value)
  ) {
    const publicProfile = {
      ...(companySetting.value as Prisma.JsonObject)
    };
    delete publicProfile.email;
    await prisma.siteSetting.update({
      where: { key: "company_profile" },
      data: {
        value: publicProfile
      }
    });
  }

  const published = await prisma.article.count({
    where: { status: ContentStatus.PUBLISHED, deletedAt: null }
  });
  console.info(
    `已发布 ${publishedArticles.length} 篇指定文章，已隐藏公开联系邮箱；当前公开文章总数：${published}`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
