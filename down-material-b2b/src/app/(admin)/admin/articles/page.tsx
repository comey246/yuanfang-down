import { ContentStatus } from "@prisma/client";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { archiveArticle, saveArticle } from "@/app/(admin)/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminArticlesPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const prisma = getPrisma();
  const { edit } = await searchParams;
  const [articles, categories, current] = await Promise.all([
    prisma.article.findMany({
      where: { deletedAt: null },
      include: { category: true },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.articleCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    edit
      ? prisma.article.findUnique({
          where: { id: edit },
          include: {
            faqs: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } }
          }
        })
      : null
  ]);
  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-bold text-amber-600">ARTICLES</p>
          <h1 className="mt-1 text-3xl font-bold">文章管理</h1>
        </div>
        {current ? (
          <Link
            href="/admin/articles"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold"
          >
            <Plus className="size-4" />
            新建文章
          </Link>
        ) : null}
      </div>
      <form
        action={saveArticle}
        className="mt-7 rounded-xl border border-slate-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={current?.id || ""} />
        <h2 className="font-bold">
          {current ? `编辑：${current.title}` : "新建文章"}
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-xs font-semibold xl:col-span-2">
            标题 *
            <input
              name="title"
              required
              defaultValue={current?.title || ""}
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
            状态
            <select
              name="status"
              defaultValue={current?.status || ContentStatus.DRAFT}
              className="admin-field mt-2"
            >
              <option value="DRAFT">演示/审核草稿</option>
              <option value="PUBLISHED">公开发布</option>
              <option value="ARCHIVED">归档</option>
            </select>
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
            作者
            <input
              name="author"
              defaultValue={current?.author || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            来源名称
            <input
              name="sourceName"
              defaultValue={current?.sourceName || ""}
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            来源链接
            <input
              name="sourceUrl"
              type="url"
              defaultValue={current?.sourceUrl || ""}
              className="admin-field mt-2"
            />
          </label>
        </div>
        <label className="mt-4 block text-xs font-semibold">
          摘要
          <textarea
            name="excerpt"
            defaultValue={current?.excerpt || ""}
            className="admin-field mt-2 min-h-20"
          />
        </label>
        <label className="mt-4 block text-xs font-semibold">
          正文（使用空行分段，## 表示二级标题）
          <textarea
            name="content"
            defaultValue={current?.content || ""}
            className="admin-field mt-2 min-h-64"
          />
        </label>
        <label className="mt-4 block text-xs font-semibold">
          FAQ（每行：问题|答案）
          <textarea
            name="faqs"
            defaultValue={
              current?.faqs
                .map((faq) => `${faq.question}|${faq.answer}`)
                .join("\n") || ""
            }
            className="admin-field mt-2 min-h-28"
          />
        </label>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
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
          <label className="text-xs font-semibold">
            演示提示
            <input
              name="demoNotice"
              defaultValue={current?.demoNotice || ""}
              className="admin-field mt-2"
            />
          </label>
        </div>
        <button className="mt-5 min-h-11 rounded-lg bg-forest-700 px-6 text-sm font-bold text-white">
          保存文章
        </button>
      </form>
      <div className="mt-7 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">文章</th>
              <th>分类</th>
              <th>状态</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="p-4 font-bold">
                  {item.title}
                  <p className="mt-1 text-xs font-normal text-slate-400">
                    /{item.slug}
                  </p>
                </td>
                <td>{item.category?.name || "未分类"}</td>
                <td>{item.status}</td>
                <td>{formatDate(item.updatedAt)}</td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/articles?edit=${item.id}`}
                      className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold"
                    >
                      <Pencil className="size-3.5" />
                      编辑
                    </Link>
                    <form action={archiveArticle}>
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
