"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import type { DemoProduct } from "@/types";
import { OnlineServiceButton } from "@/components/customer-service/online-service-button";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { ButtonLink } from "@/components/ui/button";

export function ProductFilter({ products }: { products: DemoProduct[] }) {
  const [species, setSpecies] = useState("全部");
  const [color, setColor] = useState("全部");
  const [custom, setCustom] = useState(false);
  const filtered = useMemo(
    () =>
      products.filter(
        (item) =>
          (species === "全部" || item.species === species) &&
          (color === "全部" || item.color === color) &&
          (!custom || item.customization)
      ),
    [products, species, color, custom]
  );
  return (
    <div>
      <div className="mb-8 grid gap-4 rounded-xl2 border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[auto_1fr_1fr_auto] md:items-end">
        <div className="flex items-center gap-2 pb-2 font-bold text-ink">
          <SlidersHorizontal className="size-4" />
          筛选原料
        </div>
        <label className="text-xs font-semibold text-slate-500">
          种类
          <select
            className="admin-field mt-2"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          >
            <option>全部</option>
            <option>鹅绒</option>
            <option>鸭绒</option>
            <option>其他</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-500">
          颜色
          <select
            className="admin-field mt-2"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option>全部</option>
            <option>白色</option>
            <option>灰色</option>
            <option>其他</option>
          </select>
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            className="size-4 accent-forest-700"
            checked={custom}
            onChange={(e) => setCustom(e.target.checked)}
          />
          支持定制
        </label>
      </div>
      <p className="mb-5 text-sm text-slate-500">
        共找到 {filtered.length}{" "}
        项。旧站绒子含量区间会在详情页标注待核验；其他参数由后台补充真实数据。
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <article
            key={product.id}
            className="group overflow-hidden rounded-xl2 border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
          >
            <Link href={`/products/${product.slug}`}>
              <MediaPlaceholder
                label={`${product.name}原料图片`}
                src={product.coverImage}
                className="min-h-56"
              />
            </Link>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-amber-600">
                    {product.category}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-ink">
                    <Link href={`/products/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h2>
                </div>
              </div>
              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
                {product.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="rounded-full bg-slate-100 px-2.5 py-1">
                  {product.species}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">
                  {product.color}
                </span>
                {product.customization ? (
                  <span className="rounded-full bg-forest-50 px-2.5 py-1 text-forest-700">
                    可定制
                  </span>
                ) : null}
                {product.sampleAvailable ? (
                  <span className="rounded-full bg-forest-50 px-2.5 py-1 text-forest-700">
                    支持样品
                  </span>
                ) : null}
              </div>
              <div className="mt-6 flex gap-3">
                <ButtonLink
                  href={`/products/${product.slug}`}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  查看参数
                </ButtonLink>
                <OnlineServiceButton
                  product={product.name}
                  source="catalog"
                  size="sm"
                  className="flex-1"
                >
                  微信询价 <ArrowRight className="size-4" />
                </OnlineServiceButton>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
