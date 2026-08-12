"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronRight,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X
} from "lucide-react";
import { siteConfig } from "@/config/site";
import type { CompanyProfile } from "@/lib/data";
import {
  OnlineServiceButton,
  OnlineServiceTrigger
} from "@/components/customer-service/online-service-button";
import { Container } from "@/components/ui/container";
import { cn, isConfiguredValue } from "@/lib/utils";

export function Header({ profile }: { profile: CompanyProfile }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="hidden bg-forest-900 py-2 text-xs text-white/85 lg:block">
        <Container className="flex items-center justify-between">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <Phone className="size-3.5" />
              服务热线：{profile.phone}
            </span>
            <span className="flex items-center gap-2">
              <MessageCircle className="size-3.5" />
              微信咨询：{profile.wechat}
            </span>
            {isConfiguredValue(profile.address) ? (
              <span className="flex items-center gap-2">
                <MapPin className="size-3.5" />
                工厂地址：{profile.address}
              </span>
            ) : null}
          </div>
          <OnlineServiceTrigger
            source="top-quote"
            className="font-semibold text-amber-400 hover:text-amber-300"
          >
            获取今日羽绒报价 <ChevronRight className="inline size-3.5" />
          </OnlineServiceTrigger>
        </Container>
      </div>
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="返回首页"
        >
          {profile.logoUrl ? (
            <span className="relative size-10 overflow-hidden rounded-xl">
              <Image
                src={profile.logoUrl}
                alt={`${profile.shortName} Logo`}
                fill
                sizes="40px"
                className="object-contain"
              />
            </span>
          ) : (
            <span className="grid size-10 place-items-center rounded-xl bg-forest-900 text-sm font-black text-white">
              绒
            </span>
          )}
          <span>
            <span className="block text-base font-bold text-ink">
              {profile.shortName}
            </span>
            <span className="block text-[11px] tracking-wider text-slate-500">
              羽绒原料供应
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="主导航">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-forest-50 hover:text-forest-700",
                pathname === item.href
                  ? "bg-forest-50 text-forest-700"
                  : "text-slate-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${profile.mobile}`}
            className="grid size-11 place-items-center rounded-lg border border-slate-200 text-forest-900 xl:hidden"
            aria-label="电话咨询"
          >
            <Phone className="size-5" />
          </a>
          <OnlineServiceButton
            source="nav"
            size="sm"
            className="hidden sm:inline-flex"
          >
            微信咨询
          </OnlineServiceButton>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="grid size-11 place-items-center rounded-lg border border-slate-200 xl:hidden"
            aria-expanded={open}
            aria-label={open ? "关闭导航" : "打开导航"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </Container>
      {open ? (
        <div className="border-t border-slate-200 bg-white xl:hidden">
          <Container className="grid gap-1 py-4">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-forest-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <a
                href={`tel:${profile.mobile}`}
                className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-forest-900 text-sm font-semibold text-white"
              >
                <Phone className="size-4" />
                电话咨询
              </a>
              <OnlineServiceTrigger
                source="mobile-nav"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-500 text-sm font-semibold text-white"
              >
                <MessageCircle className="size-4" />
                微信咨询
              </OnlineServiceTrigger>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
