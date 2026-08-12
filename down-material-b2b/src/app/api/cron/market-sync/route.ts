import { NextResponse } from "next/server";
import {
  cnDownSnapshotsSchema,
  persistCnDownMarket
} from "@/lib/cn-down-market";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.AUTH_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const snapshots = cnDownSnapshotsSchema.parse(payload.snapshots);
    const result = await persistCnDownMarket(snapshots);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("羽绒金网行情同步失败", error);
    return NextResponse.json({ error: "Market sync failed" }, { status: 502 });
  }
}
