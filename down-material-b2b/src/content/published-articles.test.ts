import { describe, expect, it } from "vitest";
import { publishedArticles } from "@/content/published-articles";

describe("公开文章内容", () => {
  it("包含三篇完整且唯一的文章", () => {
    expect(publishedArticles).toHaveLength(3);
    expect(new Set(publishedArticles.map((item) => item.slug)).size).toBe(3);
    for (const article of publishedArticles) {
      expect(article.content.length).toBeGreaterThan(900);
      expect(article.content.match(/^## /gm)?.length).toBeGreaterThanOrEqual(6);
      expect(article.faqs.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("正文不包含草稿占位或虚构工厂参数", () => {
    for (const article of publishedArticles) {
      expect(article.content).not.toContain("演示草稿");
      expect(article.content).not.toContain("待后台配置");
      expect(article.content).not.toMatch(/年产能|合作客户数量|认证齐全/);
      expect(article.author).toBe("远方羽绒内容组");
      expect(article.sourceUrl).toMatch(/^https:\/\/openstd\.samr\.gov\.cn/);
    }
  });
});
