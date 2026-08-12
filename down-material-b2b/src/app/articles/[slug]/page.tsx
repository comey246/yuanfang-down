import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, UserRound } from "lucide-react";
import { ShareButtons } from "@/components/articles/share-buttons";
import { OnlineServiceButton } from "@/components/customer-service/online-service-button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import {
  generatedAssets,
  getGeneratedArticleCover
} from "@/config/generated-assets";
import { siteConfig } from "@/config/site";
import { getArticleBySlug, getCompanyProfile } from "@/lib/data";
import { formatDate, safeJsonLd } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "文章未找到" };
  const coverImage =
    article.coverImage || getGeneratedArticleCover(article.slug);
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt || undefined,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      images: [coverImage || generatedAssets.og]
    },
    twitter: {
      card: "summary_large_image",
      images: [coverImage || generatedAssets.og]
    }
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, profile] = await Promise.all([
    getArticleBySlug(slug),
    getCompanyProfile()
  ]);
  if (!article) notFound();
  const coverImage =
    article.coverImage || getGeneratedArticleCover(article.slug);
  const paragraphs = (article.content || "").split(/\n{2,}/).filter(Boolean);
  const tableOfContents = paragraphs.flatMap((paragraph, index) =>
    paragraph.startsWith("## ")
      ? [{ id: `section-${index}`, title: paragraph.slice(3) }]
      : []
  );
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: { "@type": "Person", name: article.author || "待填写" },
    publisher: { "@type": "Organization", name: profile.companyName },
    image: coverImage
      ? new URL(coverImage, siteConfig.baseUrl).toString()
      : undefined,
    mainEntityOfPage: new URL(
      `/articles/${article.slug}`,
      siteConfig.baseUrl
    ).toString()
  };
  const faqLd = article.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer }
        }))
      }
    : null;
  return (
    <>
      <Container className="py-6">
        <Breadcrumbs
          items={[
            { name: "行业资讯", href: "/articles" },
            { name: article.title }
          ]}
        />
      </Container>
      <article className="pb-20">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <header className="border-b border-slate-200 pb-8">
              <p className="text-sm font-bold text-amber-600">
                {article.category?.name || "行业资讯"}
              </p>
              <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                {article.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                {article.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4" />
                  发布：{formatDate(article.publishedAt)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 className="size-4" />
                  更新：{formatDate(article.updatedAt)}
                </span>
                <span className="flex items-center gap-2">
                  <UserRound className="size-4" />
                  作者：{article.author || "待填写"}
                </span>
              </div>
            </header>
            {coverImage ? (
              <MediaPlaceholder
                label={`${article.title}文章封面`}
                src={coverImage}
                className="mt-8 min-h-[320px] rounded-xl2"
              />
            ) : null}
            <div className="prose-cn py-8">
              {paragraphs.map((paragraph, index) =>
                paragraph.startsWith("## ") ? (
                  <h2
                    key={index}
                    id={`section-${index}`}
                    className="scroll-mt-28"
                  >
                    {paragraph.slice(3)}
                  </h2>
                ) : paragraph.startsWith("### ") ? (
                  <h3 key={index}>{paragraph.slice(4)}</h3>
                ) : (
                  <p key={index}>{paragraph}</p>
                )
              )}
            </div>
            {article.sourceName ? (
              <div className="rounded-xl bg-slate-100 p-5 text-sm text-slate-600">
                <strong>内容来源：</strong>
                {article.sourceUrl ? (
                  <Link
                    href={article.sourceUrl}
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="underline"
                  >
                    {article.sourceName}
                  </Link>
                ) : (
                  article.sourceName
                )}
              </div>
            ) : null}
            {article.faqs.length ? (
              <section className="mt-10">
                <h2 id="faq" className="scroll-mt-28 text-2xl font-bold">
                  常见问题
                </h2>
                <div className="mt-5 space-y-3">
                  {article.faqs.map((faq) => (
                    <details
                      key={faq.id}
                      className="rounded-xl border border-slate-200 bg-white p-5"
                    >
                      <summary className="cursor-pointer font-bold">
                        {faq.question}
                      </summary>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}
            <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
              <ShareButtons />
              <OnlineServiceButton source="article-cta" size="sm">
                微信咨询相关原料
              </OnlineServiceButton>
            </div>
          </div>
          <aside className="h-fit space-y-5 lg:sticky lg:top-28">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="font-bold">文章目录</p>
              <ol className="mt-3 space-y-2 text-sm text-slate-500">
                {tableOfContents.map((item, index) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block leading-6 hover:text-forest-700"
                    >
                      {index + 1}. {item.title}
                    </a>
                  </li>
                ))}
                {article.faqs.length ? (
                  <li>
                    <a
                      href="#faq"
                      className="block leading-6 hover:text-forest-700"
                    >
                      {tableOfContents.length + 1}. 常见问题
                    </a>
                  </li>
                ) : null}
              </ol>
            </div>
            <div className="rounded-xl bg-forest-900 p-6 text-white">
              <h2 className="text-xl font-bold">需要按实际规格询价？</h2>
              <p className="mt-3 text-sm leading-6 text-white/65">
                告诉我们产品、参数和采购数量，获取针对性回复。
              </p>
              <OnlineServiceButton
                source="article-sidebar"
                className="mt-5 w-full"
              >
                微信沟通需求
              </OnlineServiceButton>
            </div>
          </aside>
        </Container>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLd) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLd) }}
        />
      ) : null}
    </>
  );
}
