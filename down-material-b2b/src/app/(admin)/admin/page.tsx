import { ContentStatus, InquiryStatus } from "@prisma/client";
import {
  AlertCircle,
  FileText,
  MessageSquareText,
  PackageSearch,
  TrendingUp
} from "lucide-react";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const prisma = getPrisma();
  const week = new Date();
  week.setDate(week.getDate() - 7);
  const [
    historicalInquiries,
    weekInquiries,
    pending,
    products,
    articles,
    lastQuote,
    sources,
    recentAudit
  ] = await Promise.all([
    prisma.inquiry.count({
      where: { deletedAt: null }
    }),
    prisma.inquiry.count({
      where: { createdAt: { gte: week }, deletedAt: null }
    }),
    prisma.inquiry.count({
      where: { status: InquiryStatus.NEW, deletedAt: null }
    }),
    prisma.product.count({
      where: { status: ContentStatus.PUBLISHED, deletedAt: null }
    }),
    prisma.article.count({
      where: { status: ContentStatus.PUBLISHED, deletedAt: null }
    }),
    prisma.marketQuote.findFirst({
      where: { published: true, deletedAt: null },
      orderBy: { quoteDate: "desc" }
    }),
    prisma.inquiry.groupBy({
      by: ["utmSource"],
      where: { createdAt: { gte: week }, deletedAt: null },
      _count: true,
      orderBy: { _count: { utmSource: "desc" } },
      take: 5
    }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 })
  ]);
  const cards = [
    [MessageSquareText, "历史询盘档案", historicalInquiries],
    [MessageSquareText, "本周历史新增", weekInquiries],
    [AlertCircle, "历史待联系", pending],
    [PackageSearch, "已发布产品", products],
    [FileText, "已发布文章", articles]
  ] as const;
  const completeness =
    [products > 0, articles > 0, Boolean(lastQuote), false, false].filter(
      Boolean
    ).length * 20;
  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-amber-600">DASHBOARD</p>
          <h1 className="mt-1 text-3xl font-bold">后台控制台</h1>
        </div>
        <p className="text-sm text-slate-500">
          网站内容完整度：
          <strong className="text-forest-700">{completeness}%</strong>
        </p>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([Icon, label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <Icon className="size-5 text-forest-700" />
            <p className="mt-5 text-3xl font-black">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="size-5 text-forest-700" />
            <h2 className="font-bold">行情与历史询盘来源</h2>
          </div>
          <p className="mt-5 text-sm text-slate-600">
            最新行情日期：<strong>{formatDate(lastQuote?.quoteDate)}</strong>
          </p>
          <div className="mt-5 space-y-3">
            {sources.length ? (
              sources.map((item) => (
                <div
                  key={item.utmSource || "direct"}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm"
                >
                  <span>{item.utmSource || "直接访问 / 未标记"}</span>
                  <strong>{item._count} 条</strong>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                本周暂无历史询盘来源数据。公开表单已停用。
              </p>
            )}
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold">上线前内容提醒</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            {[
              "补充真实公司名称、电话、微信、地址和备案号",
              "上传自有或已获授权的工厂照片与二维码",
              "核验产品参数、包装、起订量、供货与交期",
              "只有核验后的检测报告和认证证书才可发布"
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="mt-7 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-bold">最近后台操作</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="text-xs text-slate-500">
              <tr>
                <th className="py-3">时间</th>
                <th>管理员</th>
                <th>操作</th>
                <th>对象</th>
                <th>摘要</th>
              </tr>
            </thead>
            <tbody>
              {recentAudit.map((log) => (
                <tr key={log.id} className="border-t border-slate-100">
                  <td className="py-3">{formatDate(log.createdAt)}</td>
                  <td>{log.adminEmail || "系统"}</td>
                  <td>{log.action}</td>
                  <td>{log.entityType}</td>
                  <td>{log.summary || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
