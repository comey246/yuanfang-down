// @ts-expect-error `cloudflare:sockets` is provided by the Workers runtime.
import { connect } from "cloudflare:sockets";
// @ts-expect-error `.open-next/worker.js` is generated during the Cloudflare build.
import handler from "./.open-next/worker.js";

type WorkerEnv = {
  AUTH_SECRET?: string;
  NEXT_PUBLIC_SITE_URL?: string;
};

type WorkerContext = {
  waitUntil(promise: Promise<unknown>): void;
};

type HistoryItem = {
  unitPrice: number;
  publishDate: string;
  changeValue: number | null;
};

type Snapshot = {
  featherNameId: string;
  productName: string;
  sortOrder: number;
  currentPrice: number;
  priceChange: number;
  history: HistoryItem[];
};

const products = [
  { featherNameId: "1", productName: "白鹅绒", sortOrder: 0 },
  { featherNameId: "2", productName: "灰鹅绒", sortOrder: 1 },
  { featherNameId: "3", productName: "白鸭绒", sortOrder: 2 },
  { featherNameId: "4", productName: "灰鸭绒", sortOrder: 3 }
] as const;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function shanghaiDate(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(value);
}

function findHeaderEnd(bytes: Uint8Array) {
  for (let index = 0; index <= bytes.length - 4; index += 1) {
    if (
      bytes[index] === 13 &&
      bytes[index + 1] === 10 &&
      bytes[index + 2] === 13 &&
      bytes[index + 3] === 10
    ) {
      return index;
    }
  }
  return -1;
}

async function postWithTolerantHttp(path: string, payload: unknown) {
  const body = JSON.stringify(payload);
  const bodyBytes = encoder.encode(body);
  const socket = connect(
    { hostname: "www.cn-down.com", port: 443 },
    { secureTransport: "on" }
  );
  const writer = socket.writable.getWriter();
  await writer.write(
    encoder.encode(
      `POST ${path} HTTP/1.1\r\n` +
        "Host: www.cn-down.com\r\n" +
        "Accept: application/json\r\n" +
        "Content-Type: application/json; charset=UTF-8\r\n" +
        "Lang: zh_CN\r\n" +
        "User-Agent: YuanfangDownMarketSync/1.0 (+https://yf-down.com/market)\r\n" +
        `Content-Length: ${bodyBytes.byteLength}\r\n` +
        "Connection: close\r\n\r\n"
    )
  );
  await writer.write(bodyBytes);
  await writer.close();

  const reader = socket.readable.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      totalLength += value.byteLength;
    }
  } catch (error) {
    // 该站点在响应结束时直接关闭 TLS，没有发送 close_notify。Workerd 会把这种
    // 已收到完整 HTTP 响应后的关闭报告为 Network connection lost。
    if (!totalLength) throw error;
  }
  const responseBytes = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    responseBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const headerEnd = findHeaderEnd(responseBytes);
  if (headerEnd < 0) throw new Error("羽绒金网接口响应格式异常");
  const headers = decoder.decode(responseBytes.subarray(0, headerEnd));
  const status = Number(headers.match(/^HTTP\/\d\.\d\s+(\d{3})/)?.[1]);
  if (status !== 200) throw new Error(`羽绒金网接口 HTTP ${status}`);
  if (/content-encoding:\s*gzip/i.test(headers)) {
    throw new Error("羽绒金网接口返回了未预期的压缩响应");
  }
  const json = JSON.parse(
    decoder.decode(responseBytes.subarray(headerEnd + 4))
  );
  if (json.code !== 200) {
    throw new Error(`羽绒金网接口返回错误：${json.message || json.code}`);
  }
  return json.data;
}

function addHistoryChanges(items: Array<Omit<HistoryItem, "changeValue">>) {
  return [...items]
    .sort((left, right) => left.publishDate.localeCompare(right.publishDate))
    .map((item, index, ordered) => {
      const previous = ordered[index - 1]?.unitPrice;
      return {
        ...item,
        changeValue:
          previous && previous > 0
            ? Math.round(((item.unitPrice - previous) / previous) * 10_000) /
              100
            : null
      };
    });
}

async function fetchCnDownSnapshots(): Promise<Snapshot[]> {
  const now = new Date();
  const endDate = shanghaiDate(now);
  const startDate = shanghaiDate(new Date(now.getTime() - 90 * 86_400_000));
  const snapshots: Snapshot[] = [];

  for (const product of products) {
    const payload = {
      standardId: "1",
      featherNameId: product.featherNameId,
      specificationId: "3",
      startDate,
      endDate
    };
    const current = await postWithTolerantHttp(
      "/cndown/api/portal/featherPrice/getFeatherPriceKeyDataAnalysis",
      payload
    );
    const history = await postWithTolerantHttp(
      "/cndown/api/portal/featherPrice/getFeatherPriceByTime",
      payload
    );
    if (typeof current?.currentPrice !== "number" || !Array.isArray(history)) {
      throw new Error("羽绒金网接口数据结构异常");
    }
    snapshots.push({
      ...product,
      currentPrice: current.currentPrice,
      priceChange: Number(current.priceChange),
      history: addHistoryChanges(history)
    });
  }

  return snapshots;
}

function authorized(request: Request, env: WorkerEnv) {
  return Boolean(
    env.AUTH_SECRET &&
    request.headers.get("authorization") === `Bearer ${env.AUTH_SECRET}`
  );
}

async function runMarketSync(env: WorkerEnv, ctx: WorkerContext) {
  if (!env.AUTH_SECRET) throw new Error("AUTH_SECRET is not configured");
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://yf-down.com";
  const request = new Request(new URL("/api/cron/market-sync", siteUrl), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.AUTH_SECRET}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ snapshots: await fetchCnDownSnapshots() })
  });
  const response = await handler.fetch(request, env, ctx);
  if (!response.ok) {
    throw new Error(`Market sync failed with HTTP ${response.status}`);
  }
}

const worker = {
  async fetch(request: Request, env: WorkerEnv, ctx: WorkerContext) {
    const url = new URL(request.url);
    if (url.pathname === "/api/internal/cn-down-source") {
      if (request.method !== "POST" || !authorized(request, env)) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      try {
        return Response.json({ snapshots: await fetchCnDownSnapshots() });
      } catch (error) {
        console.error("羽绒金网行情源读取失败", error);
        return Response.json(
          { error: "Market source failed" },
          { status: 502 }
        );
      }
    }
    return handler.fetch(request, env, ctx);
  },
  async scheduled(
    _event: { cron: string; scheduledTime: number },
    env: WorkerEnv,
    ctx: WorkerContext
  ) {
    ctx.waitUntil(runMarketSync(env, ctx));
  }
};

export default worker;

// @ts-expect-error `.open-next/worker.js` is generated during the Cloudflare build.
export { DOQueueHandler, DOShardedTagCache } from "./.open-next/worker.js";
