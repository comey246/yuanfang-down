import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

const apiBaseUrl = "https://www.cn-down.com/cndown/api/portal/featherPrice";
const sourceName = "羽绒金网公开行情（cn-down.com）";
const specification = "羽绒服装 GB/T 14272-2021 · 90%";

export const cnDownProducts = [
  { featherNameId: "1", productName: "白鹅绒", sortOrder: 0 },
  { featherNameId: "2", productName: "灰鹅绒", sortOrder: 1 },
  { featherNameId: "3", productName: "白鸭绒", sortOrder: 2 },
  { featherNameId: "4", productName: "灰鸭绒", sortOrder: 3 }
] as const;

const currentDataSchema = z.object({
  currentPrice: z.number().nonnegative(),
  priceChange: z.union([z.string(), z.number()])
});

const historyItemSchema = z.object({
  unitPrice: z.number().nonnegative(),
  publishDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

type MarketFetch = typeof fetch;
type HistoryItem = z.infer<typeof historyItemSchema>;

export const cnDownSnapshotSchema = z.object({
  featherNameId: z.string(),
  productName: z.string(),
  sortOrder: z.number().int().nonnegative(),
  currentPrice: z.number().nonnegative(),
  priceChange: z.number(),
  history: z.array(
    historyItemSchema.extend({ changeValue: z.number().nullable() })
  )
});

export const cnDownSnapshotsSchema = z.array(cnDownSnapshotSchema);
export type CnDownSnapshot = z.infer<typeof cnDownSnapshotSchema>;

export type CnDownMarketSyncResult = {
  products: number;
  historyCreated: number;
  historyUpdated: number;
  latestDate: string | null;
};

function shanghaiDate(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(value);
}

function dateDaysAgo(value: Date, days: number) {
  return shanghaiDate(new Date(value.getTime() - days * 86_400_000));
}

function dateAtShanghaiMidnight(value: string) {
  return new Date(`${value}T00:00:00+08:00`);
}

async function requestApi<T>(
  endpoint: string,
  payload: Record<string, string>,
  schema: z.ZodType<T>,
  fetcher: MarketFetch
) {
  const response = await fetcher(`${apiBaseUrl}/${endpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=UTF-8",
      Lang: "zh_CN",
      "User-Agent": "YuanfangDownMarketSync/1.0 (+https://yf-down.com/market)"
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000)
  });
  if (!response.ok) {
    throw new Error(`羽绒金网接口响应异常：HTTP ${response.status}`);
  }
  const envelope = z
    .object({
      code: z.number(),
      message: z.string().optional(),
      data: z.unknown()
    })
    .parse(await response.json());
  if (envelope.code !== 200) {
    throw new Error(
      `羽绒金网接口返回错误：${envelope.message || envelope.code}`
    );
  }
  return schema.parse(envelope.data);
}

export function addHistoryChanges(items: HistoryItem[]) {
  return [...items]
    .sort((left, right) => left.publishDate.localeCompare(right.publishDate))
    .map((item, index, ordered) => {
      const previous = ordered[index - 1]?.unitPrice;
      const changeValue =
        previous && previous > 0
          ? Math.round(((item.unitPrice - previous) / previous) * 10_000) / 100
          : null;
      return { ...item, changeValue };
    });
}

export async function fetchCnDownMarket(
  now = new Date(),
  fetcher: MarketFetch = fetch
) {
  const startDate = dateDaysAgo(now, 90);
  const endDate = shanghaiDate(now);
  const snapshots = [];

  for (const product of cnDownProducts) {
    const commonPayload = {
      standardId: "1",
      featherNameId: product.featherNameId,
      specificationId: "3",
      startDate,
      endDate
    };
    const current = await requestApi(
      "getFeatherPriceKeyDataAnalysis",
      commonPayload,
      currentDataSchema,
      fetcher
    );
    const history = await requestApi(
      "getFeatherPriceByTime",
      commonPayload,
      z.array(historyItemSchema),
      fetcher
    );
    snapshots.push({
      ...product,
      currentPrice: current.currentPrice,
      priceChange: Number(current.priceChange),
      history: addHistoryChanges(history)
    });
  }

  return cnDownSnapshotsSchema.parse(snapshots);
}

export async function persistCnDownMarket(
  snapshots: CnDownSnapshot[],
  now = new Date()
): Promise<CnDownMarketSyncResult> {
  const prisma = getPrisma();
  let historyCreated = 0;
  let historyUpdated = 0;
  let latestDate: string | null = null;

  for (const snapshot of snapshots) {
    const latestHistory = snapshot.history.at(-1);
    if (
      latestHistory &&
      (!latestDate || latestHistory.publishDate > latestDate)
    ) {
      latestDate = latestHistory.publishDate;
    }
    const quoteDate = latestHistory
      ? dateAtShanghaiMidnight(latestHistory.publishDate)
      : now;
    let quote = await prisma.marketQuote.findFirst({
      where: {
        productName: snapshot.productName,
        sourceNote: { contains: "羽绒金网" },
        deletedAt: null
      }
    });
    if (!quote) {
      quote = await prisma.marketQuote.findFirst({
        where: {
          productName: snapshot.productName,
          priceMin: null,
          priceMax: null,
          deletedAt: null
        }
      });
    }

    const quoteData = {
      productName: snapshot.productName,
      specification,
      priceMin: snapshot.currentPrice,
      priceMax: snapshot.currentPrice,
      unit: "元/公斤",
      changeValue: Number.isFinite(snapshot.priceChange)
        ? snapshot.priceChange
        : null,
      quoteDate,
      sourceNote: sourceName,
      disclaimer:
        "数据由羽绒金网匿名公开查询接口每日同步，仅作市场参考，不构成工厂报价或合同要约。",
      published: true,
      sortOrder: snapshot.sortOrder,
      deletedAt: null
    };
    quote = quote
      ? await prisma.marketQuote.update({
          where: { id: quote.id },
          data: quoteData
        })
      : await prisma.marketQuote.create({ data: quoteData });

    const firstHistoryDate = snapshot.history[0]?.publishDate;
    const existingHistory = firstHistoryDate
      ? await prisma.marketQuoteHistory.findMany({
          where: {
            quoteId: quote.id,
            recordedAt: {
              gte: dateAtShanghaiMidnight(firstHistoryDate)
            }
          }
        })
      : [];
    const existingByDate = new Map(
      existingHistory.map((item) => [shanghaiDate(item.recordedAt), item])
    );
    const creates: Array<{
      quoteId: string;
      priceMin: number;
      priceMax: number;
      changeValue: number | null;
      recordedAt: Date;
    }> = [];
    const updates = snapshot.history.flatMap((item) => {
      const existing = existingByDate.get(item.publishDate);
      const data = {
        priceMin: item.unitPrice,
        priceMax: item.unitPrice,
        changeValue: item.changeValue,
        recordedAt: dateAtShanghaiMidnight(item.publishDate)
      };
      if (existing) {
        const unchanged =
          Number(existing.priceMin) === item.unitPrice &&
          Number(existing.priceMax) === item.unitPrice &&
          (existing.changeValue === null
            ? item.changeValue === null
            : Number(existing.changeValue) === item.changeValue);
        if (unchanged) return [];
        historyUpdated += 1;
        return [
          prisma.marketQuoteHistory.update({
            where: { id: existing.id },
            data
          })
        ];
      }
      creates.push({ quoteId: quote.id, ...data });
      return [];
    });
    if (creates.length) {
      const created = await prisma.marketQuoteHistory.createMany({
        data: creates
      });
      historyCreated += created.count;
    }
    if (updates.length) await prisma.$transaction(updates);
  }

  await prisma.auditLog.create({
    data: {
      action: "SYNC",
      entityType: "MarketQuote",
      summary: `同步羽绒金网公开行情：${snapshots.length} 个品种`,
      metadata: {
        source: "https://www.cn-down.com/",
        historyCreated,
        historyUpdated,
        latestDate
      }
    }
  });

  return {
    products: snapshots.length,
    historyCreated,
    historyUpdated,
    latestDate
  };
}

export async function syncCnDownMarket(
  now = new Date(),
  fetcher: MarketFetch = fetch
) {
  return persistCnDownMarket(await fetchCnDownMarket(now, fetcher), now);
}
