import { MediaType } from "@prisma/client";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { archiveMedia, saveMedia } from "@/app/(admin)/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

const mediaCategories = [
  "工厂环境",
  "生产设备",
  "原料实拍",
  "清洗过程",
  "分拣过程",
  "检测过程",
  "包装发货",
  "展会与客户来访"
];

export default async function AdminMediaPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const prisma = getPrisma();
  const { edit } = await searchParams;
  const [assets, current] = await Promise.all([
    prisma.mediaAsset.findMany({
      where: { type: MediaType.IMAGE, deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
    }),
    edit
      ? prisma.mediaAsset.findFirst({
          where: { id: edit, type: MediaType.IMAGE, deletedAt: null }
        })
      : null
  ]);
  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-bold text-amber-600">MEDIA</p>
          <h1 className="mt-1 text-3xl font-bold">图片管理</h1>
        </div>
        {current ? (
          <Link
            href="/admin/media"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold"
          >
            <Plus className="size-4" />
            新建素材
          </Link>
        ) : null}
      </div>
      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        只使用自有或已获得授权的图片，并优先使用中国大陆可稳定访问的 OSS / CDN。
      </div>
      <form
        action={saveMedia}
        className="mt-6 rounded-xl border border-slate-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={current?.id || ""} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-xs font-semibold">
            标题 *
            <input
              name="title"
              required
              defaultValue={current?.title || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            分类
            <select
              name="category"
              defaultValue={current?.category || mediaCategories[0]}
              className="admin-field mt-2"
            >
              {mediaCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold">
            排序
            <input
              name="sortOrder"
              type="number"
              defaultValue={current?.sortOrder || 0}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold md:col-span-2">
            素材 URL
            <input
              name="url"
              type="url"
              defaultValue={current?.url || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            Alt 文本
            <input
              name="altText"
              defaultValue={current?.altText || ""}
              className="admin-field mt-2"
            />
          </label>
        </div>
        <label className="mt-4 block text-xs font-semibold">
          描述
          <textarea
            name="description"
            defaultValue={current?.description || ""}
            className="admin-field mt-2 min-h-20"
          />
        </label>
        <label className="mt-4 block text-xs font-semibold">
          替换说明
          <input
            name="replaceNotice"
            defaultValue={current?.replaceNotice || ""}
            className="admin-field mt-2"
          />
        </label>
        <div className="mt-4 flex gap-5 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featuredOnHome"
              defaultChecked={current?.featuredOnHome || false}
              className="size-4 accent-forest-700"
            />
            首页展示
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="published"
              defaultChecked={current?.published || false}
              className="size-4 accent-forest-700"
            />
            公开发布
          </label>
        </div>
        <button className="mt-5 min-h-11 rounded-lg bg-forest-700 px-6 text-sm font-bold text-white">
          保存素材
        </button>
      </form>
      <div className="mt-7 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">标题</th>
              <th>分类</th>
              <th>公开</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="p-4 font-bold">{item.title}</td>
                <td>{item.category}</td>
                <td>{item.published ? "是" : "否"}</td>
                <td>{formatDate(item.updatedAt)}</td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/media?edit=${item.id}`}
                      className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold"
                    >
                      <Pencil className="size-3.5" />
                      编辑
                    </Link>
                    <form action={archiveMedia}>
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
