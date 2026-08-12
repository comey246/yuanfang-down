import { NextResponse } from "next/server";
import { downNewsItemsSchema, persistDownNews } from "@/lib/down-news";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.AUTH_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const items = downNewsItemsSchema.parse(payload.items);
    const result = await persistDownNews(items);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("羽绒行业资讯同步失败", error);
    return NextResponse.json({ error: "News sync failed" }, { status: 502 });
  }
}
