import { InquiryStatus, Prisma } from "@prisma/client";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import {
  addInquiryFollowUp,
  bulkUpdateInquiryStatus,
  updateInquiry
} from "@/app/(admin)/admin/actions";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

const statuses: [InquiryStatus, string][] = [
  ["NEW", "新询盘"],
  ["CONTACTED", "已联系"],
  ["QUOTED", "已报价"],
  ["SAMPLE_SENT", "已寄样"],
  ["FOLLOWING", "跟进中"],
  ["WON", "已成交"],
  ["LOST", "未成交"],
  ["INVALID", "无效询盘"]
];
const label = (value: InquiryStatus) =>
  statuses.find(([status]) => status === value)?.[1] || value;

export default async function AdminInquiriesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const prisma = getPrisma();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page || 1));
  const pageSize = 20;
  const where: Prisma.InquiryWhereInput = {
    deletedAt: null,
    ...(params.status &&
    Object.values(InquiryStatus).includes(params.status as InquiryStatus)
      ? { status: params.status as InquiryStatus }
      : {}),
    ...(params.q
      ? {
          OR: [
            { name: { contains: params.q, mode: "insensitive" } },
            { mobile: { contains: params.q } },
            { company: { contains: params.q, mode: "insensitive" } },
            { productName: { contains: params.q, mode: "insensitive" } }
          ]
        }
      : {})
  };
  const [items, total] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      include: {
        attachments: true,
        followUps: { orderBy: { createdAt: "desc" } }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.inquiry.count({ where })
  ]);
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-amber-600">INQUIRIES</p>
          <h1 className="mt-1 text-3xl font-bold">历史询盘管理</h1>
          <p className="mt-2 text-sm text-slate-500">
            共 {total} 条，仅后台授权账号可见客户资料。
          </p>
        </div>
        <Link
          href={`/api/admin/inquiries/export?status=${params.status || ""}&q=${encodeURIComponent(params.q || "")}`}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-forest-700 px-4 text-sm font-bold text-white"
        >
          <Download className="size-4" />
          导出 CSV
        </Link>
      </div>
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <strong>当前为历史询盘档案：</strong>
        公开站询盘表单与写入接口已经停用，新的在线客服会话不会同步或写入
        Supabase。此处仅用于处理停用前已有的历史记录或后台人工录入数据。
      </div>
      <form className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_180px_auto]">
        <label className="relative">
          <Search className="absolute left-3 top-3.5 size-4 text-slate-400" />
          <input
            name="q"
            defaultValue={params.q || ""}
            placeholder="搜索姓名、手机、公司或产品"
            className="admin-field pl-10"
          />
        </label>
        <select
          name="status"
          defaultValue={params.status || ""}
          className="admin-field"
        >
          <option value="">全部状态</option>
          {statuses.map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
        <button className="min-h-11 rounded-lg bg-slate-800 px-5 text-sm font-bold text-white">
          筛选
        </button>
      </form>
      <form
        id="bulk-form"
        action={bulkUpdateInquiryStatus}
        className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
      >
        <span className="text-sm font-bold">批量更新选中项：</span>
        <select
          name="bulkStatus"
          className="admin-field max-w-40"
          defaultValue="CONTACTED"
        >
          {statuses.map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
        <button className="min-h-10 rounded-lg bg-forest-700 px-4 text-sm font-bold text-white">
          应用状态
        </button>
      </form>
      <div className="mt-4 space-y-4">
        {items.length ? (
          items.map((item) => (
            <details
              key={item.id}
              className="group rounded-xl border border-slate-200 bg-white"
            >
              <summary className="grid cursor-pointer list-none gap-3 p-5 sm:grid-cols-[auto_1fr_1fr_1fr_auto] sm:items-center">
                <input
                  type="checkbox"
                  name="ids"
                  value={item.id}
                  form="bulk-form"
                  onClick={(event) => event.stopPropagation()}
                  className="size-4 accent-forest-700"
                  aria-label={`选择 ${item.company} 询盘`}
                />
                <div>
                  <p className="font-bold">{item.company}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.name} · {item.mobile}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.productName}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.quantity} · {item.specification || "规格未填"}
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    来源：{item.utmSource || "直接/未标记"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${item.status === "NEW" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-700"}`}
                >
                  {label(item.status)}
                </span>
              </summary>
              <div className="border-t border-slate-100 p-5">
                <div className="grid gap-5 lg:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-4 text-sm">
                    <p className="font-bold">采购与联系详情</p>
                    <dl className="mt-3 space-y-2 text-slate-600">
                      <div>
                        <dt className="inline">微信：</dt>
                        <dd className="inline">{item.wechat || "—"}</dd>
                      </div>
                      <div>
                        <dt className="inline">职位：</dt>
                        <dd className="inline">{item.position || "—"}</dd>
                      </div>
                      <div>
                        <dt className="inline">地区：</dt>
                        <dd className="inline">
                          {item.province || ""} {item.city || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline">用途：</dt>
                        <dd className="inline">{item.usage || "—"}</dd>
                      </div>
                      <div>
                        <dt className="inline">交期：</dt>
                        <dd className="inline">
                          {formatDate(item.deliveryDate)}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline">样品：</dt>
                        <dd className="inline">
                          {item.sampleRequired ? "需要" : "未选择"}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline">预算：</dt>
                        <dd className="inline">{item.budget || "—"}</dd>
                      </div>
                      <div>
                        <dt className="inline">备注：</dt>
                        <dd className="inline">{item.message || "—"}</dd>
                      </div>
                    </dl>
                    {item.attachments.map((file) => (
                      <a
                        key={file.id}
                        href={`/api/admin/inquiries/attachments/${file.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 block font-bold text-forest-700 underline"
                      >
                        附件：{file.fileName}
                      </a>
                    ))}
                  </div>
                  <form
                    action={updateInquiry}
                    className="rounded-lg bg-slate-50 p-4"
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <p className="font-bold">状态与指派</p>
                    <label className="mt-3 block text-xs font-semibold">
                      状态
                      <select
                        name="status"
                        defaultValue={item.status}
                        className="admin-field mt-2"
                      >
                        {statuses.map(([value, text]) => (
                          <option key={value} value={value}>
                            {text}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="mt-3 block text-xs font-semibold">
                      指派业务员
                      <input
                        name="assignee"
                        defaultValue={item.assignee || ""}
                        className="admin-field mt-2"
                      />
                    </label>
                    <label className="mt-3 block text-xs font-semibold">
                      内部备注
                      <textarea
                        name="internalNote"
                        defaultValue={item.internalNote || ""}
                        className="admin-field mt-2 min-h-20"
                      />
                    </label>
                    <button className="mt-3 min-h-10 rounded-lg bg-forest-700 px-4 text-xs font-bold text-white">
                      保存
                    </button>
                  </form>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="font-bold">跟进记录</p>
                    <div className="mt-3 max-h-40 space-y-2 overflow-y-auto">
                      {item.followUps.length ? (
                        item.followUps.map((follow) => (
                          <div
                            key={follow.id}
                            className="rounded-lg bg-white p-3 text-xs"
                          >
                            <p className="leading-5">{follow.note}</p>
                            <p className="mt-1 text-slate-400">
                              {follow.createdBy} ·{" "}
                              {formatDate(follow.createdAt)}{" "}
                              {follow.status ? `· ${label(follow.status)}` : ""}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400">暂无跟进记录</p>
                      )}
                    </div>
                    <form action={addInquiryFollowUp} className="mt-3">
                      <input type="hidden" name="id" value={item.id} />
                      <textarea
                        name="followUpNote"
                        required
                        placeholder="新增跟进内容"
                        className="admin-field min-h-20"
                      />
                      <div className="mt-2 flex gap-2">
                        <select name="followUpStatus" className="admin-field">
                          <option value="">不修改状态</option>
                          {statuses.map(([value, text]) => (
                            <option key={value} value={value}>
                              {text}
                            </option>
                          ))}
                        </select>
                        <button className="shrink-0 rounded-lg bg-slate-800 px-4 text-xs font-bold text-white">
                          添加记录
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-slate-200 p-3 text-xs text-slate-500">
                  来源页面：{item.sourceUrl || "—"}
                  <br />
                  Referrer：{item.referrer || "—"}
                  <br />
                  UTM：{item.utmSource || "—"} / {item.utmMedium || "—"} /{" "}
                  {item.utmCampaign || "—"}
                </div>
              </div>
            </details>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
            没有符合条件的询盘。
          </div>
        )}
      </div>
      {total > pageSize ? (
        <div className="mt-6 flex justify-center gap-3">
          {page > 1 ? (
            <Link
              href={`/admin/inquiries?page=${page - 1}&q=${params.q || ""}&status=${params.status || ""}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold"
            >
              上一页
            </Link>
          ) : null}
          {page * pageSize < total ? (
            <Link
              href={`/admin/inquiries?page=${page + 1}&q=${params.q || ""}&status=${params.status || ""}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold"
            >
              下一页
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
