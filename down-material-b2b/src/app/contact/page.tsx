import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { OnlineServiceButton } from "@/components/customer-service/online-service-button";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { getCompanyProfile, getSiteOptions } from "@/lib/data";
import { createMetadata } from "@/lib/seo";
import { isConfiguredValue } from "@/lib/utils";

export const metadata: Metadata = createMetadata(
  "联系我们与在线客服",
  "通过在线客服、电话或微信直接联系羽绒原料工厂，网站不收集或保存访客询盘表单。",
  "/contact"
);

export default async function ContactPage({
  searchParams
}: {
  searchParams: Promise<{ product?: string; sample?: string }>;
}) {
  const [{ product, sample }, profile, options] = await Promise.all([
    searchParams,
    getCompanyProfile(),
    getSiteOptions()
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
        eyebrow="CONTACT & ONLINE SERVICE"
        title="联系我们与在线客服"
        description="无需填写询盘表单。通过在线客服、电话或微信直接与工厂沟通产品、规格、数量、样品和交期。"
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
          <p className="text-sm font-bold text-amber-600">ONLINE SERVICE</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">打开在线客服窗口</h2>
          <p className="mt-4 leading-7 text-slate-600">
            {product ? (
              <>
                当前咨询产品：<strong className="text-ink">{product}</strong>。
              </>
            ) : null}
            客服在线时可直接沟通；离线时请使用电话或微信。网站不要求填写姓名、手机号，也不会保存咨询内容。
          </p>

          <OnlineServiceButton
            product={product}
            sample={sample === "true"}
            source="contact-page"
            size="lg"
            className="mt-7 w-full sm:w-auto"
          >
            <MessageCircle className="size-5" />
            开始在线咨询
          </OnlineServiceButton>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-forest-50 p-5">
              <p className="text-xs font-bold text-forest-700">客服平台</p>
              <p className="mt-2 font-bold text-ink">
                {options.customerServiceProviderName}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                真实平台名称、直聊链接和官方脚本由后台配置。
              </p>
            </div>
            <div className="rounded-xl bg-warm p-5">
              <p className="text-xs font-bold text-amber-700">建议准备</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                产品名称、目标规格、预计数量、用途、交期，以及是否需要样品。
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-200 p-5 text-sm leading-6 text-slate-600">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-forest-700" />
            <p>
              在线客服启用后，聊天消息由后台配置的国内客服平台处理。请勿发送身份证、银行卡、健康资料等与采购沟通无关的敏感信息。
            </p>
          </div>
        </section>
      </Container>
    </>
  );
}
