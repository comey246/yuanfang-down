import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const sourceBaseUrl = "https://www.cfd.com.cn";
const sourceIndexUrl = `${sourceBaseUrl}/yp/web/`;
const targetUrl =
  process.env.NEWS_SYNC_TARGET_URL || "https://yf-down.com/api/cron/news-sync";
const secret = process.env.NEWS_SYNC_SECRET || process.env.MARKET_SYNC_SECRET;
const dryRun = process.env.NEWS_SYNC_DRY_RUN === "1";

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

async function requestHtml(url) {
  const { stdout } = await execFileAsync(
    "curl",
    [
      "--fail-with-body",
      "--silent",
      "--show-error",
      "--location",
      "--max-time",
      "30",
      "--retry",
      "2",
      "--retry-all-errors",
      "--header",
      "Accept: text/html,application/xhtml+xml",
      "--user-agent",
      "YuanfangDownNewsIndex/1.0 (+https://yf-down.com/articles)",
      url
    ],
    { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }
  );
  return stdout;
}

function extractCandidates(html) {
  const pattern =
    /<a\s+href="([^"]*\/Web\/News\/detail\/id\/(\d+)\.html)"[^>]*title="([^"]+)"/g;
  const unique = new Map();
  for (const match of html.matchAll(pattern)) {
    const [, path, sourceId, rawTitle] = match;
    unique.set(sourceId, {
      sourceId,
      title: decodeHtml(rawTitle.replace(/<[^>]+>/g, "").trim()),
      sourceUrl: new URL(path, sourceBaseUrl).toString()
    });
  }
  return [...unique.values()]
    .sort((left, right) => Number(right.sourceId) - Number(left.sourceId))
    .slice(0, 24);
}

function extractDetail(candidate, html) {
  const metadata = html.match(
    /<div class="other">[\s\S]*?<span>\s*【([^】]+)】\s*(\d{4})\.(\d{2})\.(\d{2})\s*<\/span>/
  );
  if (!metadata) return null;
  return {
    ...candidate,
    sourceCategory: decodeHtml(metadata[1].trim()),
    publishedDate: `${metadata[2]}-${metadata[3]}-${metadata[4]}`
  };
}

async function main() {
  if (!dryRun && !secret) {
    throw new Error("NEWS_SYNC_SECRET 或 MARKET_SYNC_SECRET 未配置");
  }
  const candidates = extractCandidates(await requestHtml(sourceIndexUrl));
  const items = [];
  for (const candidate of candidates) {
    const item = extractDetail(
      candidate,
      await requestHtml(candidate.sourceUrl)
    );
    if (item) items.push(item);
  }
  items.sort((left, right) =>
    right.publishedDate.localeCompare(left.publishedDate)
  );
  const latest = items.slice(0, 12);
  if (!latest.length) throw new Error("中国羽绒信息网未返回可用资讯");

  if (dryRun) {
    console.info(
      JSON.stringify({ ok: true, dryRun: true, items: latest }, null, 2)
    );
    return;
  }

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ items: latest })
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      `生产同步接口 HTTP ${response.status}：${result.error || "未知错误"}`
    );
  }
  console.info(JSON.stringify({ source: sourceIndexUrl, ...result }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
