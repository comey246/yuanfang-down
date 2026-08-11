import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";

export const metadata = {
  title: { default: "管理后台", template: "%s｜管理后台" },
  robots: { index: false, follow: false }
};
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="bg-forest-900 p-5 text-white lg:sticky lg:top-0 lg:h-screen">
        <Link
          href="/admin"
          className="flex items-center gap-3 border-b border-white/10 pb-5"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-amber-500 font-black">
            绒
          </span>
          <div>
            <p className="font-bold">羽绒原料官网</p>
            <p className="text-xs text-white/50">内容管理后台</p>
          </div>
        </Link>
        <div className="mt-6">
          <AdminNav />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7">
          <div>
            <p className="text-sm font-semibold">{admin.name}</p>
            <p className="text-xs text-slate-500">
              {admin.role} · {admin.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600"
            >
              <ExternalLink className="size-4" />
              查看网站
            </Link>
            <form action="/api/admin/logout" method="post">
              <button className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600">
                <LogOut className="size-4" />
                退出
              </button>
            </form>
          </div>
        </header>
        <div className="p-4 sm:p-7">{children}</div>
      </div>
    </div>
  );
}
