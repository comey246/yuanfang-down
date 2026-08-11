import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRef = process.argv[2] || process.env.SUPABASE_PROJECT_REF;

if (!projectRef) {
  throw new Error("请传入 Supabase project ref");
}

const keys = JSON.parse(
  execFileSync(
    "npx",
    [
      "--yes",
      "supabase@2.109.1",
      "projects",
      "api-keys",
      "--project-ref",
      projectRef,
      "--reveal",
      "--output",
      "json"
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }
  )
);

const publishable =
  keys.find((key) => key.type === "publishable")?.api_key ||
  keys.find((key) => key.name === "anon")?.api_key;
const serviceRole =
  keys.find((key) => key.type === "secret" && !key.api_key.includes("····"))
    ?.api_key || keys.find((key) => key.name === "service_role")?.api_key;

if (!publishable || !serviceRole) {
  throw new Error("未能读取 Supabase publishable/service role key");
}

const envPath = path.join(process.cwd(), ".env");
let env = await readFile(envPath, "utf8");

function getEnv(name) {
  const match = env.match(new RegExp(`^${name}=(.*)$`, "m"));
  if (!match) return "";
  const raw = match[1].trim();
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function setEnv(name, value) {
  const line = `${name}=${JSON.stringify(value)}`;
  const pattern = new RegExp(`^${name}=.*$`, "m");
  env = pattern.test(env)
    ? env.replace(pattern, line)
    : `${env.trimEnd()}\n${line}\n`;
}

setEnv("SUPABASE_PROJECT_REF", projectRef);
setEnv("NEXT_PUBLIC_SUPABASE_URL", `https://${projectRef}.supabase.co`);
setEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", publishable);
setEnv("SUPABASE_SERVICE_ROLE_KEY", serviceRole);
setEnv("SUPABASE_STORAGE_BUCKET", "inquiry-attachments");

const databasePassword = getEnv("SUPABASE_DATABASE_PASSWORD");
if (databasePassword) {
  const encodedPassword = encodeURIComponent(databasePassword);
  setEnv(
    "DATABASE_URL",
    `postgresql://postgres.${projectRef}:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require&uselibpqcompat=true`
  );
  setEnv(
    "DIRECT_URL",
    `postgresql://postgres.${projectRef}:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require&uselibpqcompat=true`
  );
}

await writeFile(envPath, env, { mode: 0o600 });
console.info(
  databasePassword
    ? "Supabase 数据库、API 密钥与私有 Storage 已写入本地 .env。\n密钥值未输出。"
    : "Supabase URL、API 密钥与私有 Storage 已写入本地 .env。\n请填写 SUPABASE_DATABASE_PASSWORD 后再次运行本命令；密钥值未输出。"
);
