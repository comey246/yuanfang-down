import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const apiBaseUrl = "https://www.cn-down.com/cndown/api/portal/featherPrice";
const targetStandardId = "1";
const targetUrl =
  process.env.MARKET_SYNC_TARGET_URL ||
  "https://yf-down.com/api/cron/market-sync";
const secret = process.env.MARKET_SYNC_SECRET;

const products = [
  { featherNameId: "1", productName: "白鹅绒", sortOrder: 0 },
  { featherNameId: "2", productName: "灰鹅绒", sortOrder: 1 },
  { featherNameId: "3", productName: "白鸭绒", sortOrder: 2 },
  { featherNameId: "4", productName: "灰鸭绒", sortOrder: 3 }
];

function shanghaiDate(value) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(value);
}

async function requestSource(endpoint, payload = null) {
  const requestArguments = [
    "--fail-with-body",
    "--silent",
    "--show-error",
    "--max-time",
    "30",
    "--retry",
    "2",
    "--retry-delay",
    "2",
    "--retry-all-errors",
    "--header",
    "Accept: application/json",
    "--header",
    "Lang: zh_CN",
    "--user-agent",
    "YuanfangDownMarketSync/1.0 (+https://yf-down.com/market)"
  ];
  if (payload) {
    requestArguments.push(
      "--request",
      "POST",
      "--header",
      "Content-Type: application/json; charset=UTF-8",
      "--data",
      JSON.stringify(payload)
    );
  }
  requestArguments.push(`${apiBaseUrl}/${endpoint}`);
  const { stdout } = await execFileAsync("curl", requestArguments, {
    encoding: "utf8",
    maxBuffer: 5 * 1024 * 1024
  });
  const envelope = JSON.parse(stdout);
  if (envelope.code !== 200) {
    throw new Error(
      `羽绒金网接口返回错误：${envelope.message || envelope.code}`
    );
  }
  return envelope.data;
}

function normalizeHistory(items) {
  if (!Array.isArray(items)) throw new Error("羽绒金网历史数据格式异常");
  return items
    .map((item) => ({
      unitPrice: Number(item.unitPrice),
      publishDate: String(item.publishDate)
    }))
    .sort((left, right) => left.publishDate.localeCompare(right.publishDate))
    .map((item, index, ordered) => {
      if (
        !Number.isFinite(item.unitPrice) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(item.publishDate)
      ) {
        throw new Error("羽绒金网历史记录字段异常");
      }
      const previous = ordered[index - 1]?.unitPrice;
      return {
        ...item,
        changeValue:
          previous !== undefined && previous > 0
            ? Math.round(((item.unitPrice - previous) / previous) * 10_000) /
              100
            : null
      };
    });
}

async function main() {
  if (!secret) throw new Error("MARKET_SYNC_SECRET 未配置");
  const now = new Date();
  const commonDates = {
    startDate: shanghaiDate(new Date(now.getTime() - 90 * 86_400_000)),
    endDate: shanghaiDate(now)
  };
  const snapshots = [];
  const priceInfo = await requestSource("getFeatherPriceInfo");
  const standard = priceInfo?.standard?.find(
    (item) => String(item.id) === targetStandardId
  );
  if (!standard || !Array.isArray(standard.specification)) {
    throw new Error("羽绒金网未返回可用的绒子含量规格");
  }

  for (const product of products) {
    for (const [
      specificationIndex,
      specification
    ] of standard.specification.entries()) {
      const specificationValue = Number(specification.specification);
      const payload = {
        standardId: String(standard.id),
        featherNameId: product.featherNameId,
        specificationId: String(specification.id),
        ...commonDates
      };
      const current = await requestSource(
        "getFeatherPriceKeyDataAnalysis",
        payload
      );
      const currentPrice = Number(current?.currentPrice);
      const priceChange = Number(current?.priceChange);
      if (
        !Number.isFinite(specificationValue) ||
        !Number.isFinite(currentPrice) ||
        !Number.isFinite(priceChange)
      ) {
        throw new Error(`羽绒金网${product.productName}当前行情字段异常`);
      }
      snapshots.push({
        ...product,
        standardId: String(standard.id),
        standardName: String(standard.standardName),
        specificationId: String(specification.id),
        specificationValue,
        sortOrder: product.sortOrder * 100 + specificationIndex,
        currentPrice,
        priceChange,
        history: normalizeHistory(
          await requestSource("getFeatherPriceByTime", payload)
        )
      });
    }
  }

  const totals = {
    products: 0,
    historyCreated: 0,
    historyUpdated: 0,
    latestDate: null
  };
  const batchSize = 4;
  for (let index = 0; index < snapshots.length; index += batchSize) {
    const batch = snapshots.slice(index, index + batchSize);
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ snapshots: batch })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        `生产同步接口 HTTP ${response.status}：${result.error || "未知错误"}`
      );
    }
    totals.products += Number(result.products || 0);
    totals.historyCreated += Number(result.historyCreated || 0);
    totals.historyUpdated += Number(result.historyUpdated || 0);
    if (
      result.latestDate &&
      (!totals.latestDate || result.latestDate > totals.latestDate)
    ) {
      totals.latestDate = result.latestDate;
    }
  }
  console.info(
    JSON.stringify(
      {
        ok: true,
        sourceProducts: snapshots.length,
        historyCounts: snapshots.map((item) => item.history.length),
        ...totals
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
