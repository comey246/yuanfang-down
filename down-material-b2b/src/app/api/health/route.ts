import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/prisma";

export async function GET() {
  if (!databaseConfigured())
    return NextResponse.json(
      { status: "degraded", database: "not-configured" },
      { status: 503 }
    );
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch {
    return NextResponse.json(
      { status: "degraded", database: "unavailable" },
      { status: 503 }
    );
  }
}
