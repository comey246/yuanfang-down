import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "公开询盘表单已停用。请使用网站在线客服、电话、企业微信或业务邮箱直接联系工厂。"
    },
    {
      status: 410,
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
