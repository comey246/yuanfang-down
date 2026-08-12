import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Check,
  Download,
  MessageCircle,
  Phone,
  ShieldCheck
} from "lucide-react";
import { OnlineServiceButton } from "@/components/customer-service/online-service-button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { generatedAssets } from "@/config/generated-assets";
import { siteConfig } from "@/config/site";
import { getCompanyProfile, getProductBySlug } from "@/lib/data";
import { nonEmpty, safeJsonLd } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "产品未找到" };
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: `${product.name}原料供应`,
      description: product.summary,
      type: "website",
      images: [product.coverImage || generatedAssets.og]
    },
    twitter: {
      card: "summary_large_image",
      images: [product.coverImage || generatedAssets.og]
    }
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const [product, profile] = await Promise.all([
    getProductBySlug(slug),
    getCompanyProfile()
  ]);
  if (!product) notFound();
  const parameters = [
    ["原料种类", product.species],
    ["颜色", product.color],
    ["绒子含量", product.downClusterContent],
    ["羽绒含量", product.downContent],
    ["蓬松度", product.fillPower],
    ["清洁度 / 浊度", product.cleanliness],
    ["耗氧量", product.oxygenNumber],
    ["水分率", product.moisture],
    ["包装方式", product.packaging],
    ["单包重量", product.packageWeight],
    ["最小起订量", product.minimumOrder],
    ["供货能力", product.supplyCapacity],
    ["交付周期", product.leadTime]
  ]
    .filter((item): item is [string, string] => nonEmpty(item[1]))
    .concat(
      product.specifications.map((item) => [
        item.label,
        `${item.value}${item.unit ? ` ${item.unit}` : ""}`
      ])
    );
  const structured = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    category: product.category,
    brand: { "@type": "Organization", name: profile.companyName },
    url: new URL(`/products/${product.slug}`, siteConfig.baseUrl).toString(),
    additionalProperty: parameters.map(([name, value]) => ({
      "@type": "PropertyValue",
      name,
      value
    }))
  };
  return (
    <>
      <Container className="py-6">
        <Breadcrumbs
          items={[
            { name: "羽绒原料", href: "/products" },
            { name: product.name }
          ]}
        />
      </Container>
      <section className="pb-16 pt-5">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.12fr_.88fr]">
            <div>
              <MediaPlaceholder
                label={`${product.name}原料主图`}
                src={product.coverImage}
                className="min-h-[430px] rounded-xl2"
              />
              <div className="mt-4 grid grid-cols-2 gap-3">
                {product.gallery.map((image, index) => (
                  <MediaPlaceholder
                    key={image}
                    label={
                      index === 0
                        ? `${product.name}原料检视示意`
                        : `${product.name}无品牌样品包装示意`
                    }
                    src={image}
                    className="min-h-28 rounded-xl"
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-600">
                {product.category}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight text-ink">
                  {product.name}
                </h1>
                {product.demo ? (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                    示例数据，发布前需替换
                  </span>
                ) : null}
              </div>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                {product.summary}
              </p>
              {product.showPrice && product.priceText ? (
                <div className="mt-5 rounded-xl bg-forest-50 p-4 text-sm">
                  <span className="text-slate-500">参考报价：</span>
                  <strong className="text-forest-800 ml-2 text-lg">
                    {product.priceText}
                  </strong>
                </div>
              ) : null}
              <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
                <ShieldCheck className="mr-2 inline size-5" />
                参数、报价与交期以双方确认的样品、检测文件及合同为准；本页空参数不会显示为“0”。
              </div>
              {parameters.length ? (
                <dl className="mt-7 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {parameters.slice(0, 7).map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[130px_1fr] gap-4 px-5 py-3.5 text-sm"
                    >
                      <dt className="text-slate-500">{label}</dt>
                      <dd className="font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <div className="mt-7 rounded-xl border border-dashed border-slate-300 p-6 text-sm leading-6 text-slate-600">
                  <p className="font-bold text-ink">规格参数待补充</p>
                  <p className="mt-1">
                    请打开在线客服说明目标规格和数量，业务人员将按本次需求确认可供应参数。
                  </p>
                </div>
              )}
              <div className="mt-7 grid grid-cols-2 gap-3">
                <a
                  href={`tel:${profile.mobile}`}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-forest-900 font-bold text-white"
                >
                  <Phone className="size-4" />
                  电话咨询
                </a>
                <OnlineServiceButton
                  product={product.name}
                  source="product-detail"
                  size="lg"
                >
                  <MessageCircle className="size-4" />
                  索取报价
                </OnlineServiceButton>
                <OnlineServiceButton
                  product={product.name}
                  sample
                  source="product-sample"
                  variant="outline"
                  size="lg"
                >
                  申请样品
                </OnlineServiceButton>
                <ButtonLink href="/quality" variant="outline" size="lg">
                  <Download className="size-4" />
                  检测资料
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="bg-warm py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <h2 className="text-2xl font-bold text-ink">产品说明</h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                {product.description}
              </p>
              {parameters.length ? (
                <>
                  <h2 className="mt-10 text-2xl font-bold text-ink">
                    已确认参数
                  </h2>
                  <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <tbody>
                        {parameters.map(([label, value]) => (
                          <tr
                            key={label}
                            className="border-b border-slate-100 last:border-0"
                          >
                            <th className="w-52 bg-slate-50 p-4 font-semibold text-slate-600">
                              {label}
                            </th>
                            <td className="p-4 font-medium text-ink">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : null}
              {product.customItems.length ? (
                <>
                  <h2 className="mt-10 text-2xl font-bold">可定制项目</h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {product.customItems.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 rounded-lg bg-white p-4 text-sm"
                      >
                        <Check className="size-4 text-forest-700" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
            <aside className="h-fit rounded-xl2 border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
              <p className="text-xs font-bold text-amber-600">DIRECT CONTACT</p>
              <h2 className="mt-2 text-xl font-bold">
                在线咨询 {product.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                无需填写姓名或手机号。打开客服窗口后，可直接选择在线客服、电话或企业微信沟通。
              </p>
              <OnlineServiceButton
                product={product.name}
                source="product-sidebar"
                size="lg"
                className="mt-6 w-full"
              >
                <MessageCircle className="size-4" />
                打开在线客服
              </OnlineServiceButton>
              <OnlineServiceButton
                product={product.name}
                sample
                source="product-sidebar-sample"
                variant="outline"
                size="lg"
                className="mt-3 w-full"
              >
                申请样品
              </OnlineServiceButton>
              <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-600">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-forest-700" />
                <p>
                  本站不保存聊天内容，也不会把你主动提供的联系方式写入
                  Supabase。
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structured) }}
      />
    </>
  );
}
