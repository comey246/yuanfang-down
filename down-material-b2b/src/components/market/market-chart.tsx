"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { MarketPoint } from "@/types";

export function MarketChart({ points }: { points: MarketPoint[] }) {
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const { data, productNames } = useMemo(() => {
    const latestTimestamp = Math.max(
      ...points.map((point) => new Date(point.quoteDate).getTime())
    );
    const visible = points.filter(
      (point) =>
        latestTimestamp - new Date(point.quoteDate).getTime() <=
        range * 86400000
    );
    const names = [...new Set(visible.map((point) => point.productName))];
    const rows = new Map<string, Record<string, string | number>>();
    for (const point of visible) {
      const price =
        point.priceMin !== null && point.priceMax !== null
          ? (point.priceMin + point.priceMax) / 2
          : (point.priceMin ?? point.priceMax);
      if (price === null) continue;
      const date = new Date(point.quoteDate).toLocaleDateString("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
      const row = rows.get(date) || {
        date: new Date(point.quoteDate).toLocaleDateString("zh-CN", {
          timeZone: "Asia/Shanghai",
          month: "2-digit",
          day: "2-digit"
        })
      };
      row[point.productName] = price;
      rows.set(date, row);
    }
    return { data: [...rows.values()], productNames: names };
  }, [points, range]);
  if (!data.length) return null;
  const colors = ["#376859", "#dca847", "#475569", "#8b5e34"];
  return (
    <div className="rounded-xl2 border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-bold text-ink">已发布报价趋势</h3>
        <div className="flex rounded-lg bg-slate-100 p-1">
          {([7, 30, 90] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${range === item ? "bg-white text-forest-700 shadow-sm" : "text-slate-500"}`}
            >
              {item}天
            </button>
          ))}
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
              domain={["auto", "auto"]}
            />
            <Tooltip />
            {productNames.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                name={name}
                stroke={colors[index % colors.length]}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        图表仅呈现后台已发布的价格数据，不构成报价承诺。
      </p>
    </div>
  );
}
