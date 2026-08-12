import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { OnlineServiceButton } from "@/components/customer-service/online-service-button";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { getCompanyProfile } from "@/lib/data";
import { createMetadata } from "@/lib/seo";
import { isConfiguredValue } from "@/lib/utils";

export const metadata: Metadata = createMetadata(
  "联系我们",
  "通过电话或微信直接联系羽绒原料工厂，网站不收集或保存访客询盘表单。",
  "/contact"
);

export default async function ContactPage({
  searchParams
}: {
  searchParams: Promise<{ product?: string; sample?: string }>;
}) {
  const [{ product, sample }, profile] = await Promise.all([
    searchParams,
    getCompanyProfile()
  ]);
  const contacts = [
    [Phone, "服务热线", profile.phone, `tel:${profile.mobile}`],
    [MessageCircle, "微信咨询", profile.wechat, ""],
    [MapPin, "工厂地址", profile.address, ""],
    [Clock, "工作时间", profile.businessHours, ""]
  ] as const;
  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title="联系我们"
        description="无需填写询盘表单。请通过电话或微信直接与工厂沟通产品、规格、数量、样品和交期。"
      />
      <Container className="grid gap-10 py-14 lg:grid-cols-[.85fr_1.15fr] lg:py-20">
        <aside>
          <h2 className="text-2xl font-bold">直接联系工厂</h2>
          <div className="mt-6 space-y-3">
            {contacts
              .filter(([, , value]) => isConfiguredValue(value))
              .map(([Icon, label, value, href]) => {
                const content = (
                  <>
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-forest-50 text-forest-700">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs text-slate-500">
                        {label}
                      </span>
                      <span className="mt-1 block font-semibold text-ink">
                        {value}
                      </span>
                    </span>
                  </>
                );
                return href ? (
                  <a
                    key={label}
                    href={href}
                    className="hover:border-forest-200 flex gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:bg-forest-50/40"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={label}
                    className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    {content}
                  </div>
                );
              })}
          </div>
          <div className="mt-6 rounded-xl2 border border-slate-200 bg-white p-5">
            <MediaPlaceholder
              label="微信二维码"
              src={profile.wechatQrUrl}
              fit="contain"
              className="min-h-52 rounded-xl"
            />
            <p className="mt-4 text-center text-sm text-slate-500">
              微信号：{profile.wechat}
            </p>
          </div>
        </aside>

        <section className="h-fit rounded-xl2 border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-bold text-amber-600">DIRECT CONTACT</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">微信或电话联系</h2>
          <p className="mt-4 leading-7 text-slate-600">
            {product ? (
              <>
                当前咨询产品：<strong className="text-ink">{product}</strong>。
              </>
            ) : null}
            添加微信时可备注产品名称、目标规格和采购数量，或直接拨打电话沟通。网站不要求填写姓名、手机号，也不会保存咨询内容。
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <OnlineServiceButton
              product={product}
              sample={sample === "true"}
              source="contact-page-wechat"
              size="lg"
            >
              <MessageCircle className="size-5" />
              查看微信二维码
            </OnlineServiceButton>
            <a
              href={`tel:${profile.mobile}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 font-bold text-forest-900 hover:bg-forest-50"
            >
              <Phone className="size-5" />
              电话咨询
            </a>
          </div>

          <div className="mt-8 rounded-xl bg-warm p-5">
            <p className="text-xs font-bold text-amber-700">联系前建议准备</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              产品名称、目标规格、预计数量、用途、交期，以及是否需要样品。
            </p>
          </div>
        </section>
      </Container>
    </>
  );
}
