import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublishedArticles } from "@/lib/data";
import { createMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

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
    "工厂动态",
    "常见问题"
  ];
  return (
    <>
      <PageHero
        eyebrow="KNOWLEDGE CENTER"
        title="羽绒知识与行业资讯"
        description="内容注明更新时间和来源，区分企业声明与第三方资料，不发布未经核验的检测结论。"
      />
      <Container className="py-14 sm:py-20">
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>
        {articles.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="flex flex-col rounded-xl2 border border-slate-200 bg-white p-6"
              >
                <p className="text-xs font-bold text-amber-600">
                  {article.category?.name || "行业资讯"}
                </p>
                <h2 className="mt-3 text-xl font-bold leading-8">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="hover:text-forest-700"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                  {article.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
                  <span>{formatDate(article.publishedAt)}</span>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="flex items-center gap-1 font-bold text-forest-700"
                  >
                    阅读全文 <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="暂无已审核发布的文章"
            description="3 篇演示文章已作为后台草稿创建，不会直接公开。请由业务或质量负责人核验内容并发布后再展示。"
            actionLabel="在线咨询采购问题"
            actionHref="/contact?source=articles-empty"
          />
        )}
      </Container>
    </>
  );
}
