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

test("首页不显示内部维护文案并展示分步合作说明", async ({ page }) => {
  await page.goto("/");
  for (const text of [
    "工厂提供资料后按事实展示",
    "流程节点可配置图片",
    "具体节点与双方责任以最终沟通及合同为准",
    "待后台补充",
    "待核验"
  ]) {
    await expect(page.getByText(text, { exact: false })).toHaveCount(0);
  }
  await expect(
    page.getByText("告知采购品类、目标规格、预计数量、用途和期望交期。")
  ).toBeVisible();
  await expect(
    page.getByText("到货后跟进验收与使用反馈，衔接补货和后续采购需求。")
  ).toBeVisible();
});

test("行业资讯同步接口拒绝未授权请求", async ({ request }) => {
  const response = await request.post("/api/cron/news-sync", {
    data: { items: [] }
  });
  expect(response.status()).toBe(401);
});
