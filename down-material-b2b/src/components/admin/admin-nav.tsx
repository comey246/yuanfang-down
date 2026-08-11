"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Gauge,
  Images,
  MessageSquareText,
  PackageSearch,
  Settings,
  TrendingUp,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  [Gauge, "控制台", "/admin"],
  [PackageSearch, "产品管理", "/admin/products"],
  [TrendingUp, "行情管理", "/admin/market"],
  [FileText, "文章管理", "/admin/articles"],
  [Images, "媒体管理", "/admin/media"],
  [MessageSquareText, "历史询盘", "/admin/inquiries"],
  [Settings, "网站设置", "/admin/settings"],
  [Users, "账号管理", "/admin/users"]
] as const;

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1" aria-label="后台导航">
      {items.map(([Icon, label, href]) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold",
            pathname === href
              ? "bg-forest-700 text-white"
              : "text-white/65 hover:bg-white/5 hover:text-white"
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
