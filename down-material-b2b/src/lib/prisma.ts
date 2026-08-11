import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { cache } from "react";

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

export const getPrisma = cache(() => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL 未配置");
  }
  const adapter = new PrismaPg({
    connectionString: normalizeConnectionString(connectionString),
    maxUses: 1
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });
});

export function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}
