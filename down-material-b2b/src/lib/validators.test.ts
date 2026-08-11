import { describe, expect, it } from "vitest";
import { loginSchema } from "@/lib/validators";

describe("后台登录服务器端校验", () => {
  it("接受有效邮箱和密码", () => {
    expect(
      loginSchema.safeParse({
        email: "admin@example.com",
        password: "safe-password"
      }).success
    ).toBe(true);
  });

  it("拒绝无效邮箱", () => {
    expect(
      loginSchema.safeParse({ email: "invalid", password: "safe-password" })
        .success
    ).toBe(false);
  });

  it("拒绝过短密码", () => {
    expect(
      loginSchema.safeParse({ email: "admin@example.com", password: "short" })
        .success
    ).toBe(false);
  });
});
