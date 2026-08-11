import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const token = request.cookies.get("down_admin_session")?.value;
  if (!token) {
    return NextResponse.redirect(
      new URL(
        `/admin/login?next=${encodeURIComponent(request.nextUrl.pathname)}`,
        request.url
      )
    );
  }
  try {
    const authSecret = process.env.AUTH_SECRET;
    if (
      (!authSecret || authSecret.length < 32) &&
      process.env.NODE_ENV === "production"
    ) {
      throw new Error("AUTH_SECRET 未安全配置");
    }
    await jwtVerify(
      token,
      new TextEncoder().encode(
        authSecret || "development-only-secret-change-before-production"
      )
    );
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
    response.cookies.delete("down_admin_session");
    return response;
  }
}

export const config = { matcher: ["/admin/:path*"] };
