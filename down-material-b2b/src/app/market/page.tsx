import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { MarketQuotes } from "@/components/market/market-quotes";
import { EmptyState } from "@/components/ui/empty-state";
import { Container } from "@/components/ui/container";
import { getMarketHistory, getMarketQuotes } from "@/lib/data";
import { createMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = createMetadata(
  "羽绒行情与市场报价",
  "查看每日同步的鹅绒、鸭绒公开市场行情与90天趋势。行情仅供参考，不构成工厂报价。",
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
        description="每日更新鹅绒、鸭绒公开市场行情，支持按品种和绒子含量查看价格及趋势。"
      />
      <Container className="space-y-8 py-14 sm:py-20">
        <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong>最后更新时间：</strong>
            {formatDate(lastUpdated)}
          </p>
          <p>数据来源：公开市场行情</p>
        </div>
        {quotes.length ? (
          <>
            <MarketQuotes quotes={quotes} history={history} showChart />
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
          羽绒金网为第三方信息来源，本网站与其不存在隶属关系。市场行情受原料批次、检测指标、数量、包装、交付地点和时间等因素影响。页面数据可能延迟或中断，不构成未来价格预测、现货承诺或合同要约，最终以双方书面确认为准。
        </div>
      </Container>
    </>
  );
}
