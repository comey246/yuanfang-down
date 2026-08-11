import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, createSessionToken } from "@/lib/auth";
import { databaseConfigured, getPrisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const form = await request.formData();
  const parsed = loginSchema.safeParse({
    email: form.get("email"),
    password: form.get("password")
  });
  if (!parsed.success)
    return NextResponse.redirect(
      new URL("/admin/login?error=invalid", request.url),
      303
    );
  const rate = checkRateLimit(`login:${parsed.data.email}`, 8, 15 * 60 * 1000);
  if (!rate.allowed)
    return NextResponse.redirect(
      new URL("/admin/login?error=rate", request.url),
      303
    );
  if (!databaseConfigured())
    return NextResponse.redirect(
      new URL("/admin/login?error=database", request.url),
      303
    );
  const prisma = getPrisma();
  const user = await prisma.adminUser.findFirst({
    where: {
      email: parsed.data.email.toLowerCase(),
      active: true,
      deletedAt: null
    }
  });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash)))
    return NextResponse.redirect(
      new URL("/admin/login?error=invalid", request.url),
      303
    );
  const token = await createSessionToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });
  await prisma.auditLog.create({
    data: {
      adminId: user.id,
      adminEmail: user.email,
      action: "LOGIN",
      entityType: "AdminUser",
      entityId: user.id,
      summary: "后台登录"
    }
  });
  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 8 * 60 * 60,
    path: "/"
  });
  return response;
}
