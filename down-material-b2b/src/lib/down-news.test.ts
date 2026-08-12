import { describe, expect, it } from "vitest";
import {
  buildNewsExcerpt,
  downNewsItemsSchema,
  filterRecentNews,
  getNewsCategory
} from "@/lib/down-news";

const item = {
  sourceId: "3712",
  title: "2026年8月第1周羽绒价格行情",
  sourceUrl: "https://www.cfd.com.cn/index.php?s=/Web/News/detail/id/3712.html",
  sourceCategory: "市场行情",
  publishedDate: "2026-08-07"
};

describe("羽绒行业资讯同步", () => {
  it("校验白名单来源脚本提交的数据结构", () => {
    expect(downNewsItemsSchema.parse([item])).toEqual([item]);
  });

  it("按来源栏目映射网站文章分类", () => {
    expect(getNewsCategory("市场行情")).toEqual({
      name: "行业行情",
      slug: "industry-market"
    });
    expect(getNewsCategory("协会动态")).toEqual({
      name: "行业资讯",
      slug: "industry-news"
    });
    expect(getNewsCategory("羽绒知识")).toEqual({
      name: "羽绒知识",
      slug: "down-knowledge"
    });
    expect(getNewsCategory("质量标准")).toEqual({
      name: "质量检测",
      slug: "quality-testing"
    });
  });

  it("生成简短原创索引摘要而不复制来源正文", () => {
    expect(buildNewsExcerpt(item)).toBe(
      "关注2026年8月第1周羽绒价格行情，了解羽绒行业近期市场变化。"
    );
  });

  it("自动资讯只保留最近30天", () => {
    const now = new Date("2026-08-12T08:00:00Z");
    const recent = { ...item, sourceId: "3714", publishedDate: "2026-07-20" };
    const expired = { ...item, sourceId: "3600", publishedDate: "2026-06-30" };
    expect(filterRecentNews([recent, expired], now)).toEqual([recent]);
  });
});
