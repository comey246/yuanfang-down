import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Box,
  Check,
  FlaskConical,
  Handshake,
  Layers3,
  PackageCheck,
  Play,
  SearchCheck,
  Send,
  ShieldCheck,
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
  getLegacyClaims,
  getMarketQuotes,
  getPublishedArticles,
  getPublishedMedia,
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
  const [products, quotes, articles, media, profile, legacyClaims] =
    await Promise.all([
      getPublishedProducts(),
      getMarketQuotes(),
      getPublishedArticles(),
      getPublishedMedia(),
      getCompanyProfile(),
      getLegacyClaims()
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
              <ButtonLink
                href="/media"
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                <Play className="size-4" />
                视频了解工厂
              </ButtonLink>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/65">
              {["产品参数由后台确认", "价格不公开虚构", "检测资料分级展示"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-amber-400" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
          <div className="relative">
            <MediaPlaceholder
              label="羽绒原料供应概念主视觉"
              type="video"
              src={generatedAssets.hero}
              eager
              className="min-h-[420px] rounded-[1.75rem] border border-white/10 shadow-2xl"
            />
            <div className="absolute -bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-white/95 p-4 text-ink shadow-xl backdrop-blur sm:left-auto sm:w-72">
              <p className="text-xs font-bold text-amber-600">素材合规提示</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                请在后台替换为自有或已获授权的真实工厂 poster 与视频。
              </p>
            </div>
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
              准备好品类、目标规格、数量和交期，通过在线客服、电话或企业微信直接沟通。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <OnlineServiceButton source="home-contact-strip" size="lg">
              在线咨询采购需求
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
              description="每日同步羽绒金网公开行情，并保留后台人工维护能力；市场数据仅供采购参考，不构成工厂报价。"
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
                description="数据库中暂无已核实发布的行情数据。请通过在线客服说明所需品类、规格与数量，业务人员将结合实际供货情况回复。"
                actionLabel="获取今日报价"
                actionHref="/contact?source=market-empty"
              />
            )}
          </div>
        </Container>
      </section>

      <section className="bg-warm py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Raw Materials"
            title="羽绒原料分类"
            description="旧站绒子含量区间已迁入并标记待企业核验；其余参数留空，后台发布真实数据后自动显示。"
          />
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
                    {product.demo ? (
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                        示例待替换
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
                    {product.summary}
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    {product.downClusterContent
                      ? `绒子含量：${product.downClusterContent}（待核验）`
                      : "可选规格：待后台补充"}
                  </p>
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
                      索取报价
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
            description="以下为可配置的业务能力方向，具体设备、产能和指标将在工厂提供资料后按事实展示。"
            align="center"
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl2 border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((item, index) => {
              const Icon = advantageIcons[index];
              return (
                <div key={item} className="bg-white p-7">
                  <span className="grid size-11 place-items-center rounded-xl bg-forest-50 text-forest-700">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-bold text-ink">{item}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    能力说明与真实数据待后台补充，经确认后公开。
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="overflow-hidden bg-forest-900 py-20 text-white sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Factory Capability"
                title="工厂实力，用可核验资料建立信任"
                description="工厂能力、经营数据与相关资料以后台核验发布内容为准。"
              />
              {legacyClaims ? (
                <div className="mt-7">
                  <p className="mb-3 text-xs font-bold text-amber-400">
                    {legacyClaims.verified
                      ? "企业已确认数据"
                      : "旧站历史数据 · 待企业核验"}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {legacyClaims.stats.map((item) => (
                      <div
                        key={item.key}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <p className="text-2xl font-black text-amber-400">
                          {item.value}
                          <span className="ml-1 text-sm">{item.unit}</span>
                        </p>
                        <p className="mt-1 text-xs text-white/65">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-white/50">
                    来源：{legacyClaims.sourceNote}
                    。未核验前不构成产能或合作承诺。
                  </p>
                </div>
              ) : null}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  "工厂航拍",
                  "水洗设备",
                  "分拣设备",
                  "检测实验室",
                  "包装仓储",
                  "发货区域"
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-white/80"
                  >
                    <Check className="mr-2 inline size-4 text-amber-400" />
                    {item}
                  </div>
                ))}
              </div>
              <ButtonLink href="/factory" className="mt-8">
                了解工厂实力
              </ButtonLink>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MediaPlaceholder
                label="工厂全景"
                type="factory"
                src={generatedAssets.posters[0].image}
                className="col-span-2 min-h-60 rounded-xl2"
              />
              <MediaPlaceholder
                label="清洗设备"
                src={generatedAssets.posters[1].image}
                className="min-h-44 rounded-xl2"
              />
              <MediaPlaceholder
                label="质量检测"
                src={generatedAssets.posters[2].image}
                className="min-h-44 rounded-xl2"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Production Process"
            title="生产工艺与批次质量控制"
            description="流程节点可配置图片、视频、标题和说明；页面不会把内部检测包装成第三方认证。"
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

      <section className="bg-warm py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Quality Control"
                title="质量参数清晰呈现，空值不显示"
                description="旧站历史声明与正式检测报告、认证证书分开显示；正式文件只有核验并发布后才会出现在前台。"
              />
              <div className="mt-7 rounded-xl2 border border-amber-200 bg-amber-50 p-5">
                <p className="flex items-center gap-2 font-bold text-amber-800">
                  <ShieldCheck className="size-5" />
                  资料分级规则
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-900/75">
                  <li>企业内部检测：明确标注内部检测</li>
                  <li>第三方检测：展示机构、日期和报告文件</li>
                  <li>认证证书：必须核验后才能公开</li>
                </ul>
              </div>
              <ButtonLink href="/quality" className="mt-7" variant="secondary">
                查看质量体系
              </ButtonLink>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "绒子含量",
                "羽绒含量",
                "蓬松度",
                "清洁度 / 浊度",
                "耗氧量",
                "气味等级",
                "水分率",
                "残脂率"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <p className="text-sm font-semibold text-slate-500">{item}</p>
                  <p className="mt-2 text-lg font-bold text-ink">待后台配置</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Applications"
            title="面向多类采购与应用场景"
            description="以下图片用于说明原料选型方向，具体成品性能与供货条件以双方确认资料为准。"
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

      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Factory Media"
              title="视频与图片"
              description="视频默认不自动加载和播放，配置 poster 后由访客点击观看。"
            />
            <ButtonLink href="/media" variant="outline">
              进入媒体中心
            </ButtonLink>
          </div>
          <div className="mt-10">
            {media.length ? (
              <div className="grid gap-6 md:grid-cols-3">
                {media.slice(0, 6).map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-xl2 border border-slate-200 bg-white"
                  >
                    <MediaPlaceholder
                      label={item.title}
                      type={item.type === "VIDEO" ? "video" : "image"}
                      src={item.type === "IMAGE" ? item.url : item.posterUrl}
                      className="min-h-56"
                    />
                    <div className="p-5">
                      <p className="text-xs font-bold text-amber-600">
                        {item.category}
                      </p>
                      <h3 className="mt-1 font-bold">{item.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {generatedAssets.posters.map((item) => (
                  <MediaPlaceholder
                    key={item.title}
                    label={`${item.title}视频封面`}
                    type="video"
                    src={item.image}
                    className="min-h-60 rounded-xl2"
                  />
                ))}
              </div>
            )}
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
                key={item}
                className="rounded-xl border border-forest-100 bg-white p-5"
              >
                <span className="text-xs font-black text-amber-600">
                  STEP {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-bold text-ink">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  具体节点与双方责任以最终沟通及合同为准。
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
              description="内容将标注更新时间与来源，并经业务或质量人员核验后发布。"
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
                        演示草稿 · 暂未公开
                      </p>
                      <h3 className="mt-3 text-lg font-bold text-slate-700">
                        {title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        文章需经核验后在后台发布，不展示未经确认的检测结论。
                      </p>
                    </div>
                  </article>
                ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-amber-500 py-16 text-white">
        <Container className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-white/75">PURCHASE INQUIRY</p>
            <h2 className="mt-3 text-balance text-3xl font-bold sm:text-4xl">
              正在寻找稳定的羽绒原料供应商？
            </h2>
            <p className="mt-3 text-white/80">
              通过在线客服、电话或企业微信说明品类、规格和数量，直接获取针对本次采购需求的回复。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <OnlineServiceButton
              source="home-bottom"
              variant="secondary"
              size="lg"
            >
              <Send className="size-4" />
              在线获取报价
            </OnlineServiceButton>
            <a
              href={`tel:${profile.mobile}`}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/40 px-6 font-bold hover:bg-white/10"
            >
              电话咨询
            </a>
            <OnlineServiceButton
              source="home-bottom-wechat"
              variant="outline"
              size="lg"
              className="border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              企业微信咨询
            </OnlineServiceButton>
            <OnlineServiceButton
              sample
              source="home-bottom-sample"
              variant="outline"
              size="lg"
              className="border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              咨询样品
            </OnlineServiceButton>
          </div>
        </Container>
      </section>
    </>
  );
}
