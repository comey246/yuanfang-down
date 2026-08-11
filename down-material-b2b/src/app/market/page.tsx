import type { Metadata } from "next";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { MarketChart } from "@/components/market/market-chart";
import { EmptyState } from "@/components/ui/empty-state";
import { Container } from "@/components/ui/container";
import { getMarketHistory, getMarketQuotes } from "@/lib/data";
import { createMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = createMetadata(
  "羽绒行情与市场报价",
  "查看后台人工维护的鹅绒、鸭绒原料行情及趋势。无已核实数据时引导联系工厂获取报价。",
  "/market"
);

export default async function MarketPage() {
  const [quotes, history] = await Promise.all([
    getMarketQuotes(),
    getMarketHistory()
  ]);
  const lastUpdated = quotes[0]?.quoteDate;
  return (
    <>
      <PageHero
        eyebrow="MARKET QUOTE"
        title="羽绒行情与市场报价"
        description="行情由后台人工维护，不自动抓取其他网站。价格仅供采购沟通参考，不构成最终合同报价。"
      />
      <Container className="space-y-8 py-14 sm:py-20">
        <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong>最后更新时间：</strong>
            {formatDate(lastUpdated)}
          </p>
          <p>数据来源、单位和免责声明随每条行情单独维护</p>
        </div>
        {quotes.length ? (
          <>
            <div className="overflow-x-auto rounded-xl2 border border-slate-200 bg-white">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-forest-50">
                  <tr>
                    <th className="p-4">品类</th>
                    <th className="p-4">规格</th>
                    <th className="p-4">价格区间</th>
                    <th className="p-4">单位</th>
                    <th className="p-4">涨跌</th>
                    <th className="p-4">日期</th>
                    <th className="p-4">来源说明</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="border-t border-slate-100">
                      <td className="p-4 font-bold">{quote.productName}</td>
                      <td className="p-4">{quote.specification}</td>
                      <td className="p-4">
                        {quote.priceMin === null && quote.priceMax === null
                          ? "联系业务获取"
                          : `${quote.priceMin ?? "—"} – ${quote.priceMax ?? "—"}`}
                      </td>
                      <td className="p-4">{quote.unit}</td>
                      <td className="p-4">
                        {quote.changeValue === null ? (
                          <Minus className="size-4 text-slate-400" />
                        ) : quote.changeValue > 0 ? (
                          <span className="flex items-center gap-1 text-red-600">
                            <ArrowUp className="size-4" />
                            {quote.changeValue}%
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-700">
                            <ArrowDown className="size-4" />
                            {quote.changeValue}%
                          </span>
                        )}
                      </td>
                      <td className="p-4">{formatDate(quote.quoteDate)}</td>
                      <td className="p-4 text-slate-500">{quote.sourceNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <MarketChart points={history.length ? history : quotes} />
          </>
        ) : (
          <EmptyState
            title="今日行情请联系业务人员获取"
            description="当前没有后台已核实并公开的行情价格。请告诉我们品类、目标规格和数量，业务人员将结合实际供货情况回复。"
            actionLabel="获取今日羽绒报价"
            actionHref="/contact?source=market-page-empty"
          />
        )}
        <div className="rounded-xl bg-slate-100 p-5 text-xs leading-6 text-slate-600">
          <strong className="text-ink">免责声明：</strong>
          市场行情受原料批次、检测指标、数量、包装、交付地点和时间等因素影响。页面历史数据不构成未来价格预测、现货承诺或合同要约，最终以双方书面确认为准。
        </div>
      </Container>
    </>
  );
}
