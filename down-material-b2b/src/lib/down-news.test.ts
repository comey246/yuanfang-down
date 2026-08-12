import { describe, expect, it } from "vitest";
import {
  buildNewsExcerpt,
  downNewsItemsSchema,
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
  });

  it("生成简短原创索引摘要而不复制来源正文", () => {
    expect(buildNewsExcerpt(item)).toBe(
      "关注2026年8月第1周羽绒价格行情，了解羽绒行业近期市场变化。"
    );
  });
});
