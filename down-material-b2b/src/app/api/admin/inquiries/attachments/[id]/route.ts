import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createInquiryAttachmentUrl } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  const { id } = await params;
  const attachment = await prisma.inquiryAttachment.findUnique({
    where: { id }
  });
  if (!attachment)
    return NextResponse.json({ error: "附件不存在" }, { status: 404 });
  const url = await createInquiryAttachmentUrl(
    attachment.storageKey,
    attachment.url
  );
  if (!url)
    return NextResponse.json({ error: "附件存储尚未配置" }, { status: 503 });
  return NextResponse.redirect(new URL(url, request.url));
}
