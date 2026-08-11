import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";
import { databaseConfigured, prisma } from "@/lib/prisma";

export const AUTH_COOKIE = "down_admin_session";

function secret() {
  const value = process.env.AUTH_SECRET;
  if ((!value || value.length < 32) && process.env.NODE_ENV === "production") {
    throw new Error("生产环境必须配置至少 32 个字符的 AUTH_SECRET");
  }
  return new TextEncoder().encode(
    value || "development-only-secret-change-before-production"
  );
}

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export async function createSessionToken(admin: AdminSession) {
  return new SignJWT(admin)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}

export async function verifySessionToken(
  token: string
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (databaseConfigured()) {
    const user = await prisma.adminUser.findFirst({
      where: { id: session.id, active: true, deletedAt: null }
    });
    if (!user) redirect("/admin/login");
  }
  return session;
}
