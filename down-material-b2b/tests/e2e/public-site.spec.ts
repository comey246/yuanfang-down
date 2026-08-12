import { expect, test } from "@playwright/test";

test("首页展示 B2B 定位和核心询价入口", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "羽绒原料供应"
  );
  await expect(
    page.getByRole("button", { name: "获取今日报价" }).first()
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "微信咨询" }).first()
  ).toBeVisible();
});

test("产品参数不展示为 0", async ({ page }) => {
  await page.goto("/products/white-goose-down");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("白鹅绒");
  await expect(page.getByText("0", { exact: true })).toHaveCount(0);
});

test("联系页不收集表单并可查看微信二维码", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await page.getByRole("button", { name: "查看微信二维码" }).click();
  await expect(
    page.getByRole("heading", { name: "联系工厂", exact: true })
  ).toBeVisible();
  await expect(page.getByText("微信二维码").last()).toBeVisible();
});

test("旧询盘接口不再接收个人资料", async ({ request }) => {
  const response = await request.post("/api/inquiries", {
    form: {
      name: "测试姓名",
      mobile: "13800138000"
    }
  });
  expect(response.status()).toBe(410);
  expect((await response.json()).error).toContain("已停用");
});

test("后台未登录会跳转登录页", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(
    page.getByRole("heading", { name: "管理后台登录" })
  ).toBeVisible();
});

test("SEO 文件可访问", async ({ request }) => {
  expect((await request.get("/sitemap.xml")).ok()).toBe(true);
  expect((await request.get("/robots.txt")).ok()).toBe(true);
});

test("图片中心页面已下线", async ({ request }) => {
  expect((await request.get("/media")).status()).toBe(404);
});
