import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { syncCnDownMarket } from "../src/lib/cn-down-market";
import { getPrisma } from "../src/lib/prisma";

const execFileAsync = promisify(execFile);

const curlFetch = (async (
  input: string | URL | Request,
  init?: RequestInit
) => {
  const { stdout } = await execFileAsync(
    "curl",
    [
      "--fail-with-body",
      "--silent",
      "--show-error",
      "--max-time",
      "20",
      "--request",
      init?.method || "GET",
      "--header",
      "Accept: application/json",
      "--header",
      "Content-Type: application/json; charset=UTF-8",
      "--header",
      "Lang: zh_CN",
      "--data",
      String(init?.body || ""),
      String(input)
    ],
    { encoding: "utf8", maxBuffer: 5 * 1024 * 1024 }
  );
  return new Response(stdout, {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}) as typeof fetch;

async function main() {
  const result = await syncCnDownMarket(new Date(), curlFetch);
  console.info(JSON.stringify(result, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await getPrisma().$disconnect();
  });
