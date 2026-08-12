"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, SlidersHorizontal } from "lucide-react";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { formatDate } from "@/lib/utils";

export type ArticleListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  categoryName: string;
  publishedAt: string;
};

type TimeRange = "7" | "15" | "30";
type SortOrder = "newest" | "oldest";

const dayMs = 86_400_000;

export function filterAndSortArticles(
  articles: ArticleListItem[],
  category: string,
  days: number,
  sortOrder: SortOrder,
  now: Date
) {
  const cutoff = now.getTime() - days * dayMs;
  return articles
    .filter((article) => {
      const publishedAt = new Date(article.publishedAt).getTime();
      return (
        Number.isFinite(publishedAt) &&
        publishedAt >= cutoff &&
        (category === "全部资讯" || article.categoryName === category)
      );
    })
    .sort((left, right) => {
      const difference =
        new Date(right.publishedAt).getTime() -
        new Date(left.publishedAt).getTime();
      return sortOrder === "newest" ? difference : -difference;
    });
}

export function ArticleBrowser({
  articles,
  categories,
  now
}: {
  articles: ArticleListItem[];
  categories: string[];
  now: string;
}) {
  const [category, setCategory] = useState("全部资讯");
  const [timeRange, setTimeRange] = useState<TimeRange>("30");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const filtered = useMemo(
    () =>
      filterAndSortArticles(
        articles,
        category,
        Number(timeRange),
        sortOrder,
        new Date(now)
      ),
    [articles, category, now, sortOrder, timeRange]
  );

  return (
    <div>
      <div className="flex flex-col gap-5 rounded-xl2 border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
            <SlidersHorizontal className="size-4 text-forest-700" />
            按主题筛选
          </p>
          <div className="flex flex-wrap gap-2" aria-label="资讯主题筛选">
            {["全部资讯", ...categories].map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(item)}
                  className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-forest-700 bg-forest-700 text-white"
                      : "hover:border-forest-300 border-slate-200 bg-white text-slate-600 hover:text-forest-700"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 sm:items-end">
          <label className="text-sm font-semibold text-slate-600">
            发布时间
            <select
              aria-label="发布时间范围"
              value={timeRange}
              onChange={(event) =>
                setTimeRange(event.target.value as TimeRange)
              }
              className="admin-field mt-2"
            >
              <option value="7">最近7天</option>
              <option value="15">最近15天</option>
              <option value="30">最近30天</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-600">
            排序方式
            <select
              aria-label="资讯排序方式"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as SortOrder)
              }
              className="admin-field mt-2"
            >
              <option value="newest">最新发布优先</option>
              <option value="oldest">最早发布优先</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mb-5 mt-6 flex items-center gap-2 text-sm text-slate-500">
        <CalendarDays className="size-4" />
        当前显示 {filtered.length} 条最近 {timeRange} 天的内容
      </div>

      {filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <article
              key={article.id}
              className="flex flex-col overflow-hidden rounded-xl2 border border-slate-200 bg-white"
            >
              <MediaPlaceholder
                label={`${article.title}文章封面`}
                src={article.coverImage}
                className="min-h-48"
              />
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-bold text-amber-600">
                  {article.categoryName}
                </p>
                <h2 className="mt-3 text-xl font-bold leading-8">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="hover:text-forest-700"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                  {article.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between gap-4 text-xs text-slate-500">
                  <span>{formatDate(article.publishedAt)}</span>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="flex items-center gap-1 font-bold text-forest-700"
                  >
                    阅读全文 <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl2 border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-xl font-bold text-ink">暂无符合条件的内容</h2>
          <p className="mt-3 text-sm text-slate-500">
            可以切换主题或扩大发布时间范围后查看。
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory("全部资讯");
              setTimeRange("30");
              setSortOrder("newest");
            }}
            className="mt-5 min-h-11 rounded-lg bg-forest-700 px-5 font-bold text-white"
          >
            重置筛选
          </button>
        </div>
      )}
    </div>
  );
}
