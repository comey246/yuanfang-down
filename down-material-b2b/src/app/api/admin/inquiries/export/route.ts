import { InquiryStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

const csv = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export async function GET(request: Request) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  const prisma = getPrisma();
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const q = url.searchParams.get("q");
  const where: Prisma.InquiryWhereInput = {
    deletedAt: null,
    ...(status && Object.values(InquiryStatus).includes(status as InquiryStatus)
      ? { status: status as InquiryStatus }
      : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { mobile: { contains: q } },
            { company: { contains: q, mode: "insensitive" } }
          ]
        }
      : {})
  };
  const items = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 5000
  });
  const headers = [
    "编号",
    "姓名",
    "手机",
    "微信",
    "公司",
    "职位",
    "省份",
    "城市",
    "采购产品",
    "目标规格",
    "数量",
    "用途",
    "交期",
    "样品",
    "预算",
    "备注",
    "状态",
    "指派",
    "来源页面",
    "Referrer",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "创建时间"
  ];
  const rows = items.map((item) =>
    [
      item.id,
      item.name,
      item.mobile,
      item.wechat,
      item.company,
      item.position,
      item.province,
      item.city,
      item.productName,
      item.specification,
      item.quantity,
      item.usage,
      item.deliveryDate?.toISOString(),
      item.sampleRequired ? "是" : "否",
      item.budget,
      item.message,
      item.status,
      item.assignee,
      item.sourceUrl,
      item.referrer,
      item.utmSource,
      item.utmMedium,
      item.utmCampaign,
      item.createdAt.toISOString()
    ]
      .map(csv)
      .join(",")
  );
  return new NextResponse(
    `\uFEFF${headers.map(csv).join(",")}\n${rows.join("\n")}`,
    {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="inquiries-${new Date().toISOString().slice(0, 10)}.csv"`
      }
    }
  );
}
