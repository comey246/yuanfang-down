import type { Metadata } from "next";
import { ArticleBrowser } from "@/components/articles/article-browser";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { getGeneratedArticleCover } from "@/config/generated-assets";
import { getPublishedArticles } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(
  "羽绒知识与行业资讯",
  "羽绒知识、采购指南、质量检测、行业行情、工厂动态和常见问题内容中心。",
  "/articles"
);

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();
  const categories = [
    "羽绒知识",
    "采购指南",
    "质量检测",
    "行业行情",
    "行业资讯",
    "常见问题"
  ];
  return (
    <>
      <PageHero
        eyebrow="KNOWLEDGE CENTER"
        title="羽绒知识与行业资讯"
        description="分享羽绒原料知识、采购指南、质量指标和行业行情内容。"
      />
      <Container className="py-14 sm:py-20">
        {articles.length ? (
          <ArticleBrowser
            categories={categories}
            now={new Date().toISOString()}
            articles={articles.map((article) => ({
              id: article.id,
              title: article.title,
              slug: article.slug,
              excerpt: article.excerpt || "",
              coverImage:
                article.coverImage || getGeneratedArticleCover(article.slug),
              categoryName: article.category?.name || "行业资讯",
              publishedAt: (
                article.publishedAt || article.createdAt
              ).toISOString()
            }))}
          />
        ) : (
          <EmptyState
            title="文章内容暂时无法读取"
            description="公开文章暂未从内容数据库加载成功，请稍后刷新或通过微信、电话咨询采购问题。"
            actionLabel="微信咨询采购问题"
            actionHref="/contact?source=articles-empty"
          />
        )}
      </Container>
    </>
  );
}
