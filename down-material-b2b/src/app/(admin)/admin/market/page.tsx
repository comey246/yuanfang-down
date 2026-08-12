import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import {
  archiveMarketQuote,
  saveMarketQuote
} from "@/app/(admin)/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminMarketPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const prisma = getPrisma();
  const { edit } = await searchParams;
  const [quotes, current] = await Promise.all([
    prisma.marketQuote.findMany({
      where: { deletedAt: null },
      include: { history: { orderBy: { recordedAt: "desc" }, take: 5 } },
      orderBy: { quoteDate: "desc" }
    }),
    edit ? prisma.marketQuote.findUnique({ where: { id: edit } }) : null
  ]);
  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-bold text-amber-600">MARKET</p>
          <h1 className="mt-1 text-3xl font-bold">行情管理</h1>
        </div>
        {current ? (
          <Link
            href="/admin/market"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold"
          >
            <Plus className="size-4" />
            新增行情
          </Link>
        ) : null}
      </div>
      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        系统每天北京时间 09:20 同步羽绒金网匿名公开查询接口，当前固定读取 GB/T
        14272-2021 的 90%
        规格。自动任务异常时继续保留最后一次成功数据；人工价格仍须注明真实来源。
      </div>
      <form
        action={saveMarketQuote}
        className="mt-6 rounded-xl border border-slate-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={current?.id || ""} />
        <h2 className="font-bold">
          {current ? `编辑：${current.productName}` : "新增行情"}
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-xs font-semibold">
            产品名称 *
            <input
              name="productName"
              required
              defaultValue={current?.productName || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            规格
            <input
              name="specification"
              defaultValue={current?.specification || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            最低价
            <input
              name="priceMin"
              type="number"
              min="0"
              step="0.01"
              defaultValue={current?.priceMin?.toString() || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            最高价
            <input
              name="priceMax"
              type="number"
              min="0"
              step="0.01"
              defaultValue={current?.priceMax?.toString() || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            单位
            <input
              name="unit"
              defaultValue={current?.unit || ""}
              placeholder="如：元/公斤"
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            涨跌幅（%）
            <input
              name="changeValue"
              type="number"
              step="0.01"
              defaultValue={current?.changeValue?.toString() || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            报价日期 *
            <input
              name="quoteDate"
              type="date"
              required
              defaultValue={(current?.quoteDate || new Date())
                .toISOString()
                .slice(0, 10)}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            来源说明
            <input
              name="sourceNote"
              defaultValue={current?.sourceNote || ""}
              placeholder="必须填写真实来源"
              className="admin-field mt-2"
            />
          </label>
        </div>
        <label className="mt-4 block text-xs font-semibold">
          免责声明
          <textarea
            name="disclaimer"
            defaultValue={current?.disclaimer || ""}
            className="admin-field mt-2 min-h-20"
          />
        </label>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={current?.published || false}
            className="size-4 accent-forest-700"
          />
          前台发布
        </label>
        <button className="mt-5 min-h-11 rounded-lg bg-forest-700 px-6 text-sm font-bold text-white">
          保存并记录历史
        </button>
      </form>
      <div className="mt-7 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">品类 / 规格</th>
              <th>价格</th>
              <th>日期</th>
              <th>来源</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="p-4 font-bold">
                  {item.productName}
                  <span className="ml-2 font-normal text-slate-500">
                    {item.specification}
                  </span>
                </td>
                <td>
                  {item.priceMin?.toString() || "—"} -{" "}
                  {item.priceMax?.toString() || "—"} {item.unit}
                </td>
                <td>{formatDate(item.quoteDate)}</td>
                <td>{item.sourceNote || "待补充"}</td>
                <td>{item.published ? "已发布" : "未发布"}</td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/market?edit=${item.id}`}
                      className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold"
                    >
                      <Pencil className="size-3.5" />
                      编辑
                    </Link>
                    <form action={archiveMarketQuote}>
                      <input type="hidden" name="id" value={item.id} />
                      <ConfirmSubmit>归档</ConfirmSubmit>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
