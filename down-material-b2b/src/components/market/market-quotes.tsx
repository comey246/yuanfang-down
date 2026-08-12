"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { MarketChart } from "@/components/market/market-chart";
import type { MarketPoint } from "@/types";
import { formatDate } from "@/lib/utils";

function specificationPercentage(value: string) {
  const match = value.match(/(?:绒子含量\s*)?(\d+(?:\.\d+)?)%/);
  return match ? Number(match[1]) : null;
}

function specificationLabel(value: string) {
  const percentage = specificationPercentage(value);
  return percentage === null ? value : `绒子含量 ${percentage}%`;
}

export function MarketQuotes({
  quotes,
  history = [],
  compact = false,
  showChart = false
}: {
  quotes: MarketPoint[];
  history?: MarketPoint[];
  compact?: boolean;
  showChart?: boolean;
}) {
  const specifications = useMemo(
    () =>
      [...new Set(quotes.map((quote) => quote.specification))].sort(
        (left, right) =>
          (specificationPercentage(right) ?? -1) -
          (specificationPercentage(left) ?? -1)
      ),
    [quotes]
  );
  const initialSpecification =
    specifications.find((item) => specificationPercentage(item) === 90) ||
    specifications[0];
  const [selectedSpecification, setSelectedSpecification] = useState(
    initialSpecification || ""
  );
  const visibleQuotes = quotes
    .filter((quote) => quote.specification === selectedSpecification)
    .slice(0, compact ? 4 : undefined);
  const visibleHistory = history.filter(
    (point) => point.specification === selectedSpecification
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label
            htmlFor={
              compact ? "home-market-specification" : "market-specification"
            }
            className="text-sm font-bold text-ink"
          >
            选择绒子含量
          </label>
          <p className="mt-1 text-xs text-slate-500">
            当前标准：羽绒服装 GB/T 14272-2021
          </p>
        </div>
        <select
          id={compact ? "home-market-specification" : "market-specification"}
          value={selectedSpecification}
          onChange={(event) => setSelectedSpecification(event.target.value)}
          className="focus:border-forest-600 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-forest-100 sm:w-52"
        >
          {specifications.map((item) => (
            <option key={item} value={item}>
              {specificationLabel(item)}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl2 border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-forest-50 text-xs uppercase tracking-wider text-forest-900">
            <tr>
              <th className="p-4">产品名称</th>
              <th className="p-4">规格</th>
              <th className="p-4">参考价格</th>
              <th className="p-4">单位</th>
              <th className="p-4">涨跌</th>
              <th className="p-4">更新日期</th>
              <th className="p-4">数据来源</th>
            </tr>
          </thead>
          <tbody>
            {visibleQuotes.map((quote) => (
              <tr key={quote.id} className="border-t border-slate-100">
                <td className="p-4 font-bold text-ink">{quote.productName}</td>
                <td className="p-4">
                  {specificationLabel(quote.specification)}
                </td>
                <td className="p-4">
                  {quote.priceMin === null && quote.priceMax === null
                    ? "联系业务获取"
                    : quote.priceMin === quote.priceMax
                      ? quote.priceMin
                      : `${quote.priceMin ?? "—"} – ${quote.priceMax ?? "—"}`}
                </td>
                <td className="p-4">{quote.unit}</td>
                <td className="p-4">
                  {quote.changeValue === null ? (
                    <Minus className="size-4 text-slate-400" />
                  ) : quote.changeValue > 0 ? (
                    <span className="flex items-center gap-1 text-red-600">
                      <ArrowUp className="size-4" />+{quote.changeValue}%
                    </span>
                  ) : quote.changeValue < 0 ? (
                    <span className="flex items-center gap-1 text-green-700">
                      <ArrowDown className="size-4" />
                      {quote.changeValue}%
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Minus className="size-4" />
                      0%
                    </span>
                  )}
                </td>
                <td className="p-4">{formatDate(quote.quoteDate)}</td>
                <td className="p-4 text-slate-500">公开市场行情</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showChart ? (
        <MarketChart
          points={visibleHistory.length ? visibleHistory : visibleQuotes}
          title={`${specificationLabel(selectedSpecification)}价格趋势`}
        />
      ) : null}
    </div>
  );
}
