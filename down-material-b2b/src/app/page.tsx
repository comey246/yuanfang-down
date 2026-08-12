import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Box,
  FlaskConical,
  Handshake,
  Layers3,
  PackageCheck,
  SearchCheck,
  Sparkles,
  Truck,
  WashingMachine,
  Wind
} from "lucide-react";
import { OnlineServiceButton } from "@/components/customer-service/online-service-button";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { MarketQuotes } from "@/components/market/market-quotes";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  generatedAssets,
  getGeneratedArticleCover
} from "@/config/generated-assets";
import {
  articleDirections,
  advantages,
  cooperationSteps,
  processSteps
} from "@/lib/demo-data";
import {
  getCompanyProfile,
  getMarketQuotes,
  getPublishedArticles,
  getPublishedProducts
} from "@/lib/data";

const advantageIcons = [
  SearchCheck,
  WashingMachine,
  Layers3,
  FlaskConical,
  Sparkles,
  PackageCheck,
  Box,
  Handshake
];
const processIcons = [
  Truck,
  SearchCheck,
  WashingMachine,
  Wind,
  Wind,
  Layers3,
  FlaskConical,
  Box,
  PackageCheck
];

export default async function HomePage() {
  const [products, quotes, articles, profile] = await Promise.all([
    getPublishedProducts(),
    getMarketQuotes(),
    getPublishedArticles(),
    getCompanyProfile()
  ]);
  return (
    <>
      <section className="relative isolate overflow-hidden bg-forest-900 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_25%,rgba(220,168,71,.22),transparent_28%),radial-gradient(circle_at_15%_90%,rgba(255,255,255,.1),transparent_30%)]" />
        <Container className="grid min-h-[650px] items-center gap-10 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80">
              <BadgeCheck className="size-4 text-amber-400" /> 原料供应 ·
              规格沟通 · 样品确认 · 批量交付
            </p>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              专注优质
              <br />
              <span className="text-amber-400">羽绒原料供应</span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-white/70">
              鹅绒、鸭绒及定制规格，支持批量采购与样品确认。面向家纺、服装、品牌与贸易采购客户，提供清晰、可核验的供货信息。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <OnlineServiceButton source="hero-quote" size="lg">
                获取今日报价 <ArrowRight className="size-4" />
              </OnlineServiceButton>
              <ButtonLink
                href="/products"
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
              >
                查看羽绒原料
              </ButtonLink>
            </div>
          </div>
          <div>
            <MediaPlaceholder
              label="羽绒原料供应主图"
              src={generatedAssets.hero}
              eager
              className="min-h-[420px] rounded-[1.75rem] border border-white/10 shadow-2xl"
            />
          </div>
        </Container>
      </section>

      <section className="bg-forest-700 py-7 text-white">
        <Container className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-amber-400">
              无表单直联 · 不在本站保存访客联系方式
            </p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              准备好品类、目标规格、数量和交期，通过微信或电话直接沟通。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <OnlineServiceButton source="home-contact-strip" size="lg">
              微信咨询采购需求
              <ArrowRight className="size-4" />
            </OnlineServiceButton>
            <a
              href={`tel:${profile.mobile}`}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 px-6 font-bold text-white hover:bg-white/10"
            >
              电话联系：{profile.phone}
            </a>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Market Quote"
              title="今日羽绒行情"
              description="每日同步鹅绒、鸭绒市场行情，支持按品种和绒子含量查看价格及趋势。"
            />
            <ButtonLink href="/market" variant="outline">
              查看行情中心 <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <div className="mt-10">
            {quotes.length ? (
              <MarketQuotes quotes={quotes} compact />
            ) : (
              <EmptyState
                title="今日行情请联系业务人员获取"
                description="请通过微信或电话说明所需品类、规格与数量，业务人员将回复本次采购需求。"
                actionLabel="获取今日报价"
                actionHref="/contact?source=market-empty"
              />
            )}
          </div>
        </Container>
      </section>

      <section className="bg-warm py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Raw Materials" title="羽绒原料分类" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-xl2 border border-slate-200 bg-white shadow-sm"
              >
                <MediaPlaceholder
                  label={`${product.name}原料`}
                  src={product.coverImage}
                  className="min-h-52"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-bold text-ink">
                      {product.name}
                    </h3>
                  </div>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
                    {product.summary}
                  </p>
                  {product.downClusterContent ? (
                    <p className="mt-4 text-xs text-slate-500">
                      绒子含量：{product.downClusterContent}
                    </p>
                  ) : null}
                  <div className="mt-5 flex items-center justify-between">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-sm font-bold text-forest-700 hover:underline"
                    >
                      查看参数
                    </Link>
                    <OnlineServiceButton
                      product={product.name}
                      source="home-product"
                      variant="ghost"
                      size="sm"
                      className="min-h-0 px-0 py-0 text-amber-600 hover:bg-transparent hover:underline"
                    >
                      微信询价
                    </OnlineServiceButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/products" variant="secondary">
              查看全部原料 <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Why Us"
            title="围绕采购需求建立可验证的供应服务"
            align="center"
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl2 border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((item, index) => {
              const Icon = advantageIcons[index];
              return (
                <div key={item.title} className="bg-white p-7">
                  <span className="grid size-11 place-items-center rounded-xl bg-forest-50 text-forest-700">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Production Process"
            title="生产工艺与批次质量控制"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {processSteps.map(([number, title, description], index) => {
              const Icon = processIcons[index];
              return (
                <div
                  key={title}
                  className="relative rounded-xl2 border border-slate-200 bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-forest-50 text-forest-700">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-2xl font-black text-slate-200">
                      {number}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/process" variant="outline">
              查看完整工艺说明
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Applications"
            title="面向多类采购与应用场景"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {generatedAssets.applications.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-xl2 border border-slate-200 bg-white"
              >
                <MediaPlaceholder
                  label={item.title}
                  src={item.image}
                  className="min-h-52"
                />
                <h3 className="p-5 text-lg font-bold text-ink">{item.title}</h3>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-forest-50 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Cooperation"
            title="从需求确认到售后跟进"
            align="center"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cooperationSteps.map((item, index) => (
              <div
                key={item.title}
                className="rounded-xl border border-forest-100 bg-white p-5"
              >
                <span className="text-xs font-black text-amber-600">
                  STEP {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Knowledge Center"
              title="羽绒知识与采购指南"
              description="了解原料选型、采购参数、检测指标和常见应用场景。"
            />
            <ButtonLink href="/articles" variant="outline">
              查看全部文章
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {articles.length
              ? articles.slice(0, 3).map((article) => (
                  <article
                    key={article.id}
                    className="overflow-hidden rounded-xl2 border border-slate-200 bg-white"
                  >
                    <MediaPlaceholder
                      label={`${article.title}文章封面`}
                      src={
                        article.coverImage ||
                        getGeneratedArticleCover(article.slug)
                      }
                      className="min-h-48"
                    />
                    <div className="p-6">
                      <p className="text-xs font-bold text-amber-600">
                        {article.category?.name || "行业资讯"}
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-ink">
                        <Link href={`/articles/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {article.excerpt}
                      </p>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-forest-700"
                      >
                        阅读全文 <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </article>
                ))
              : articleDirections.map((title, index) => (
                  <article
                    key={title}
                    className="overflow-hidden rounded-xl2 border border-dashed border-slate-300 bg-white"
                  >
                    <MediaPlaceholder
                      label={`${title}文章封面`}
                      src={Object.values(generatedAssets.articleCovers)[index]}
                      className="min-h-48"
                    />
                    <div className="p-6">
                      <p className="text-xs font-bold text-slate-400">
                        内容暂时无法读取
                      </p>
                      <h3 className="mt-3 text-lg font-bold text-slate-700">
                        {title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        公开文章暂未从内容数据库加载成功，请稍后刷新。
                      </p>
                    </div>
                  </article>
                ))}
          </div>
        </Container>
      </section>
    </>
  );
}
