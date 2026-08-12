"use client";

import { useEffect, useState } from "react";
import {
  ArrowUp,
  Check,
  Clock,
  Copy,
  MessageCircle,
  Phone,
  X
} from "lucide-react";
import {
  CUSTOMER_SERVICE_OPEN_EVENT,
  type CustomerServiceContext,
  OnlineServiceTrigger
} from "@/components/customer-service/online-service-button";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import type { CompanyProfile } from "@/lib/data";

function configured(value: string) {
  return Boolean(value && !value.startsWith("待填") && value !== "待备案");
}

export function FloatingContact({ profile }: { profile: CompanyProfile }) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<CustomerServiceContext>({});
  const [wechatCopied, setWechatCopied] = useState(false);

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

  async function copyWechat() {
    await navigator.clipboard.writeText(profile.wechat);
    setWechatCopied(true);
    window.setTimeout(() => setWechatCopied(false), 1800);
  }

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
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex size-14 items-center justify-center text-slate-500 hover:bg-slate-50"
          aria-label="返回顶部"
        >
          <ArrowUp className="size-5" />
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-slate-200 bg-white p-2 shadow-[0_-10px_30px_rgba(0,0,0,.08)] md:hidden">
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
                  联系工厂
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

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={`tel:${profile.mobile}`}
                  className="text-forest-800 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 font-bold hover:bg-forest-50"
                >
                  <Phone className="size-4" /> 电话咨询
                </a>
                <button
                  type="button"
                  disabled={!configured(profile.wechat)}
                  onClick={copyWechat}
                  className="text-forest-800 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 font-bold hover:bg-forest-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {wechatCopied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  {wechatCopied ? "已复制微信号" : "复制微信号"}
                </button>
              </div>

              <div className="grid gap-5 rounded-xl border border-slate-200 p-5 sm:grid-cols-[150px_1fr] sm:items-center">
                <MediaPlaceholder
                  label="微信二维码"
                  src={profile.wechatQrUrl}
                  fit="contain"
                  className="min-h-36 rounded-lg"
                />
                <div>
                  <p className="font-bold text-ink">微信咨询</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    微信号：{profile.wechat}。添加时可备注产品名称与采购用途。
                  </p>
                </div>
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
