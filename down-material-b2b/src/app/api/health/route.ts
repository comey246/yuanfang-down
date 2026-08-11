import { NextResponse } from "next/server";
import { databaseConfigured, getPrisma } from "@/lib/prisma";

export async function GET() {
  if (!databaseConfigured())
    return NextResponse.json(
      { status: "degraded", database: "not-configured" },
      { status: 503 }
    );
  try {
    const prisma = getPrisma();
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch (error) {
    return NextResponse.json(
      {
        status: "degraded",
        database: "unavailable",
        ...(process.env.NEXTJS_ENV === "development" && error instanceof Error
          ? { detail: error.message }
          : {})
      },
      { status: 503 }
    );
  }
}
