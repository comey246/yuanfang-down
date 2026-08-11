"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUp,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  X
} from "lucide-react";
import {
  CUSTOMER_SERVICE_OPEN_EVENT,
  type CustomerServiceContext,
  OnlineServiceTrigger
} from "@/components/customer-service/online-service-button";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import type { CompanyProfile, SiteOptions } from "@/lib/data";

function configured(value: string) {
  return Boolean(value && !value.startsWith("待填") && value !== "待备案");
}

export function FloatingContact({
  profile,
  options
}: {
  profile: CompanyProfile;
  options: SiteOptions;
}) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<CustomerServiceContext>({});
  const [copied, setCopied] = useState<"wechat" | "request" | null>(null);

  useEffect(() => {
    function show(event: Event) {
      const detail = (event as CustomEvent<CustomerServiceContext>).detail;
      setContext(detail || {});
      setOpen(true);
    }
    window.addEventListener(CUSTOMER_SERVICE_OPEN_EVENT, show);
    return () => window.removeEventListener(CUSTOMER_SERVICE_OPEN_EVENT, show);
  }, []);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const requestText = useMemo(
    () =>
      [
        "您好，我想咨询羽绒原料采购。",
        context.product ? `产品：${context.product}` : "产品：待沟通",
        context.sample ? "需求：申请样品" : "需求：规格、报价与交期沟通"
      ].join("\n"),
    [context.product, context.sample]
  );

  async function copyText(value: string, type: "wechat" | "request") {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1800);
  }

  const providerConfigured = configured(options.customerServiceProviderName);
  const chatUrlConfigured = configured(options.customerServiceUrl);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft md:block">
        <a
          href={`tel:${profile.mobile}`}
          className="flex size-14 items-center justify-center border-b border-slate-100 text-forest-900 hover:bg-forest-50"
          aria-label="电话咨询"
        >
          <Phone className="size-5" />
        </a>
        <OnlineServiceTrigger
          source="floating-wechat"
          className="flex size-14 items-center justify-center border-b border-slate-100 text-forest-900 hover:bg-forest-50"
          ariaLabel="微信咨询"
        >
          <MessageCircle className="size-5" />
        </OnlineServiceTrigger>
        <OnlineServiceTrigger
          source="floating-online"
          className="flex size-14 items-center justify-center border-b border-slate-100 bg-amber-500 text-white hover:bg-amber-600"
          ariaLabel="在线客服"
        >
          <span className="sr-only">在线客服</span>
          <MessageCircle className="size-5" />
        </OnlineServiceTrigger>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex size-14 items-center justify-center text-slate-500 hover:bg-slate-50"
          aria-label="返回顶部"
        >
          <ArrowUp className="size-5" />
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-slate-200 bg-white p-2 shadow-[0_-10px_30px_rgba(0,0,0,.08)] md:hidden">
        <a
          href={`tel:${profile.mobile}`}
          className="flex min-h-12 flex-col items-center justify-center gap-1 text-xs font-semibold text-forest-900"
        >
          <Phone className="size-4" />
          电话
        </a>
        <OnlineServiceTrigger
          source="mobile-wechat"
          className="flex min-h-12 flex-col items-center justify-center gap-1 text-xs font-semibold text-forest-900"
        >
          <MessageCircle className="size-4" />
          微信
        </OnlineServiceTrigger>
        <OnlineServiceTrigger
          source="mobile-online"
          className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-amber-500 text-sm font-bold text-white"
        >
          <MessageCircle className="size-4" />
          在线客服
        </OnlineServiceTrigger>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-service-title"
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl"
          >
            <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-bold text-amber-600">
                  DIRECT CONTACT
                </p>
                <h2
                  id="customer-service-title"
                  className="mt-1 text-2xl font-bold text-ink"
                >
                  在线联系工厂
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                aria-label="关闭联系方式窗口"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="space-y-5 p-5 sm:p-7">
              {context.product ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                  <strong>当前咨询：</strong>
                  {context.product}
                  {context.sample ? " · 申请样品" : " · 规格与报价"}
                </div>
              ) : null}

              <div className="rounded-xl bg-forest-900 p-5 text-white">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-amber-500">
                    <MessageCircle className="size-5" />
                  </span>
                  <div>
                    <p className="font-bold">
                      {providerConfigured
                        ? options.customerServiceProviderName
                        : "在线客服平台待配置"}
                    </p>
                    <p className="mt-1 text-xs text-white/65">
                      网站不保存聊天内容，消息由所配置的国内客服平台处理。
                    </p>
                  </div>
                </div>
                {chatUrlConfigured ? (
                  <a
                    href={options.customerServiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 font-bold text-white hover:bg-amber-600"
                  >
                    进入在线客服 <ExternalLink className="size-4" />
                  </a>
                ) : options.customerServiceScript ? (
                  <p className="mt-5 rounded-lg border border-white/15 bg-white/10 p-3 text-sm leading-6 text-white/75">
                    客服脚本已加载，请使用客服平台显示的会话图标开始聊天。
                  </p>
                ) : (
                  <p className="mt-5 rounded-lg border border-white/15 bg-white/10 p-3 text-sm leading-6 text-white/75">
                    尚未配置第三方客服，请先通过电话、微信或邮箱联系。
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <a
                  href={`tel:${profile.mobile}`}
                  className="text-forest-800 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 font-bold hover:bg-forest-50"
                >
                  <Phone className="size-4" /> 电话咨询
                </a>
                <button
                  type="button"
                  disabled={!configured(profile.wechat)}
                  onClick={() => copyText(profile.wechat, "wechat")}
                  className="text-forest-800 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 font-bold hover:bg-forest-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copied === "wechat" ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  {copied === "wechat" ? "已复制微信号" : "复制微信号"}
                </button>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-forest-800 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 font-bold hover:bg-forest-50"
                >
                  <Mail className="size-4" /> 邮件联系
                </a>
              </div>

              <div className="grid gap-5 rounded-xl border border-slate-200 p-5 sm:grid-cols-[150px_1fr] sm:items-center">
                <MediaPlaceholder
                  label="企业微信二维码"
                  src={profile.wechatQrUrl}
                  className="min-h-36 rounded-lg"
                />
                <div>
                  <p className="font-bold text-ink">企业微信 / 微信咨询</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    微信号：{profile.wechat}。添加时可备注产品名称与采购用途。
                  </p>
                  <button
                    type="button"
                    onClick={() => copyText(requestText, "request")}
                    className="text-forest-800 mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-forest-50 px-4 text-sm font-bold hover:bg-forest-100"
                  >
                    {copied === "request" ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    {copied === "request"
                      ? "咨询内容已复制"
                      : "复制采购咨询内容"}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-600">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-forest-700" />
                <p>
                  本站不提供询盘表单，也不会将聊天内容或你主动提供的联系方式写入
                  Supabase。开始聊天前，请阅读
                  <Link
                    href="/privacy"
                    className="mx-1 font-bold text-forest-700 underline"
                  >
                    隐私政策
                  </Link>
                  及客服平台提示。
                </p>
              </div>

              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="size-4" /> 工作时间：{profile.businessHours}
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
