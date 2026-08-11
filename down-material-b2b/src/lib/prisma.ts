import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cache } from "react";

type AppCloudflareEnv = {
  HYPERDRIVE?: {
    connectionString: string;
  };
};

function normalizeConnectionString(value: string) {
  try {
    const url = new URL(value);
    if (
      url.searchParams.get("sslmode") === "require" &&
      !url.searchParams.has("uselibpqcompat")
    ) {
      url.searchParams.set("uselibpqcompat", "true");
    }
    return url.toString();
  } catch {
    return value;
  }
}

function getConnectionString() {
  try {
    const { env } = getCloudflareContext();
    const hyperdrive = (env as unknown as AppCloudflareEnv).HYPERDRIVE;
    if (hyperdrive?.connectionString) {
      return hyperdrive.connectionString;
    }
  } catch {
    // Node.js、本地测试和构建阶段没有 Cloudflare 请求上下文，回退到环境变量。
  }

  return process.env.DATABASE_URL
    ? normalizeConnectionString(process.env.DATABASE_URL)
    : undefined;
}

export const getPrisma = cache(() => {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error("数据库连接未配置");
  }
  const adapter = new PrismaPg({
    connectionString,
    maxUses: 1
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });
});

export function databaseConfigured() {
  return Boolean(getConnectionString());
}
