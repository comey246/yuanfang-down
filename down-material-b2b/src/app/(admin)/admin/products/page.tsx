import { ContentStatus } from "@prisma/client";
import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import {
  archiveProduct,
  archiveProductCategory,
  saveProduct,
  saveProductCategory
} from "@/app/(admin)/admin/actions";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const [products, categories, current] = await Promise.all([
    prisma.product.findMany({
      where: { deletedAt: null },
      include: { category: true },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.productCategory.findMany({
      where: { deletedAt: null, active: true },
      orderBy: { sortOrder: "asc" }
    }),
    edit
      ? prisma.product.findUnique({
          where: { id: edit },
          include: { specifications: { orderBy: { sortOrder: "asc" } } }
        })
      : null
  ]);
  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-bold text-amber-600">PRODUCTS</p>
          <h1 className="mt-1 text-3xl font-bold">产品管理</h1>
        </div>
        {current ? (
          <Link
            href="/admin/products"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold"
          >
            <Plus className="size-4" />
            新建产品
          </Link>
        ) : null}
      </div>
      <section className="mt-7 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-bold">产品分类</h2>
        <form
          action={saveProductCategory}
          className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
        >
          <input
            name="categoryName"
            required
            placeholder="分类名称"
            className="admin-field"
          />
          <input
            name="categorySlug"
            required
            pattern="[a-z0-9-]+"
            placeholder="英文 slug"
            className="admin-field"
          />
          <button className="min-h-11 rounded-lg bg-slate-800 px-5 text-sm font-bold text-white">
            新增/恢复分类
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <form
              key={item.id}
              action={archiveProductCategory}
              className="flex items-center rounded-full bg-slate-100 pl-3 text-xs font-semibold"
            >
              {item.name}
              <input type="hidden" name="id" value={item.id} />
              <ConfirmSubmit
                message={`确认归档分类“${item.name}”？现有产品不会删除。`}
                className="ml-2 min-h-8 rounded-full border-0 px-2"
              >
                ×
              </ConfirmSubmit>
            </form>
          ))}
        </div>
      </section>
      <form
        action={saveProduct}
        className="mt-7 rounded-xl border border-slate-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={current?.id || ""} />
        <div className="flex items-center justify-between">
          <h2 className="font-bold">
            {current ? `编辑：${current.name}` : "新建产品"}
          </h2>
          <span className="text-xs text-slate-500">空参数不会在前台显示</span>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-xs font-semibold">
            产品名称 *
            <input
              name="name"
              required
              defaultValue={current?.name || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            英文 slug *
            <input
              name="slug"
              required
              pattern="[a-z0-9-]+"
              defaultValue={current?.slug || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            分类
            <select
              name="categoryId"
              defaultValue={current?.categoryId || ""}
              className="admin-field mt-2"
            >
              <option value="">未分类</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold">
            状态
            <select
              name="status"
              defaultValue={current?.status || ContentStatus.DRAFT}
              className="admin-field mt-2"
            >
              <option value="DRAFT">草稿</option>
              <option value="PUBLISHED">发布</option>
              <option value="ARCHIVED">归档</option>
            </select>
          </label>
          <label className="text-xs font-semibold">
            种类
            <select
              name="species"
              defaultValue={current?.species || ""}
              className="admin-field mt-2"
            >
              <option value="">待填写</option>
              <option>鹅绒</option>
              <option>鸭绒</option>
              <option>其他</option>
            </select>
          </label>
          <label className="text-xs font-semibold">
            颜色
            <select
              name="color"
              defaultValue={current?.color || ""}
              className="admin-field mt-2"
            >
              <option value="">待填写</option>
              <option>白色</option>
              <option>灰色</option>
              <option>其他</option>
            </select>
          </label>
          {[
            ["绒子含量", "downClusterContent", current?.downClusterContent],
            ["羽绒含量", "downContent", current?.downContent],
            ["蓬松度", "fillPower", current?.fillPower],
            ["清洁度", "cleanliness", current?.cleanliness],
            ["耗氧量", "oxygenNumber", current?.oxygenNumber],
            ["水分率", "moisture", current?.moisture],
            ["包装方式", "packaging", current?.packaging],
            ["单包重量", "packageWeight", current?.packageWeight],
            ["最小起订量", "minimumOrder", current?.minimumOrder],
            ["供货能力", "supplyCapacity", current?.supplyCapacity],
            ["交付周期", "leadTime", current?.leadTime]
          ].map(([label, name, value]) => (
            <label key={String(name)} className="text-xs font-semibold">
              {String(label)}
              <input
                name={String(name)}
                defaultValue={String(value || "")}
                placeholder="留空则隐藏"
                className="admin-field mt-2"
              />
            </label>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-xs font-semibold">
            简介
            <textarea
              name="summary"
              defaultValue={current?.summary || ""}
              className="admin-field mt-2 min-h-24"
            />
          </label>
          <label className="text-xs font-semibold">
            详细说明
            <textarea
              name="description"
              defaultValue={current?.description || ""}
              className="admin-field mt-2 min-h-24"
            />
          </label>
          <label className="text-xs font-semibold">
            原料来源说明
            <textarea
              name="sourceDescription"
              defaultValue={current?.sourceDescription || ""}
              className="admin-field mt-2 min-h-24"
            />
          </label>
          <label className="text-xs font-semibold">
            自定义参数（每行：名称|值|单位|分组）
            <textarea
              name="specifications"
              defaultValue={
                current?.specifications
                  .map(
                    (item) =>
                      `${item.label}|${item.value || ""}|${item.unit || ""}|${item.groupName || ""}`
                  )
                  .join("\n") || ""
              }
              className="admin-field mt-2 min-h-28"
            />
          </label>
          <label className="text-xs font-semibold">
            质量说明
            <textarea
              name="qualityNote"
              defaultValue={current?.qualityNote || ""}
              className="admin-field mt-2 min-h-28"
            />
          </label>
          <label className="text-xs font-semibold">
            适用场景（逗号分隔）
            <input
              name="applications"
              defaultValue={current?.applications.join("，") || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            可定制项目（逗号分隔）
            <input
              name="customItems"
              defaultValue={current?.customItems.join("，") || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            封面图 URL
            <input
              name="coverImage"
              defaultValue={current?.coverImage || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            图集 URL（逗号或换行分隔）
            <textarea
              name="gallery"
              defaultValue={current?.gallery.join("\n") || ""}
              className="admin-field mt-2 min-h-20"
            />
          </label>
          <label className="text-xs font-semibold">
            视频 / Poster URL
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                name="videoUrl"
                defaultValue={current?.videoUrl || ""}
                className="admin-field"
                placeholder="视频 URL"
              />
              <input
                name="videoPoster"
                defaultValue={current?.videoPoster || ""}
                className="admin-field"
                placeholder="Poster URL"
              />
            </div>
          </label>
          <label className="text-xs font-semibold">
            检测报告 URL
            <input
              name="reportUrl"
              defaultValue={current?.reportUrl || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            示例提示
            <input
              name="demoNotice"
              defaultValue={current?.demoNotice || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            可显示价格文字（确认后才填写）
            <input
              name="priceText"
              defaultValue={current?.priceText || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            SEO 标题
            <input
              name="seoTitle"
              defaultValue={current?.seoTitle || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            SEO 描述
            <input
              name="seoDescription"
              defaultValue={current?.seoDescription || ""}
              className="admin-field mt-2"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-5 text-sm">
          {[
            ["customization", "支持定制", current?.customization],
            ["sampleAvailable", "支持样品", current?.sampleAvailable],
            ["featured", "首页推荐", current?.featured],
            ["showPrice", "显示价格", current?.showPrice]
          ].map(([name, label, value]) => (
            <label key={String(name)} className="flex items-center gap-2">
              <input
                type="checkbox"
                name={String(name)}
                defaultChecked={Boolean(value)}
                className="size-4 accent-forest-700"
              />
              {String(label)}
            </label>
          ))}
        </div>
        <button className="mt-6 min-h-11 rounded-lg bg-forest-700 px-6 text-sm font-bold text-white">
          保存产品
        </button>
      </form>
      <div className="mt-7 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">产品</th>
              <th>分类</th>
              <th>状态</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="p-4 font-bold">
                  {item.name}
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    /{item.slug}
                  </span>
                </td>
                <td>{item.category?.name || "未分类"}</td>
                <td>{item.status}</td>
                <td>{formatDate(item.updatedAt)}</td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products?edit=${item.id}`}
                      className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold"
                    >
                      <Pencil className="size-3.5" />
                      编辑
                    </Link>
                    <Link
                      href={`/products/${item.slug}`}
                      target="_blank"
                      className="grid size-9 place-items-center rounded-lg border border-slate-200"
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                    <form action={archiveProduct}>
                      <input type="hidden" name="id" value={item.id} />
                      <ConfirmSubmit
                        message={`确认归档“${item.name}”？数据将软删除。`}
                      >
                        归档
                      </ConfirmSubmit>
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
