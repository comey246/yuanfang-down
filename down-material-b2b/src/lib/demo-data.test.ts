import { describe, expect, it } from "vitest";
import { demoProducts } from "@/lib/demo-data";
import {
  legacyHistoricalClaims,
  legacySiteContent
} from "@/config/legacy-content";

describe("初始化产品数据安全", () => {
  it("四个初始化产品不在前台显示示例标记", () => {
    expect(demoProducts).toHaveLength(4);
    expect(demoProducts.every((product) => !product.demo)).toBe(true);
  });

  it("只迁移旧站明确出现的绒子含量区间", () => {
    const expected: Record<string, string> = {
      "white-goose-down": "80%-95%",
      "grey-goose-down": "80%-95%",
      "white-duck-down": "70%-95%",
      "grey-duck-down": "70%-90%"
    };
    for (const product of demoProducts) {
      expect(product.downClusterContent).toBe(expected[product.slug]);
      expect(product.fillPower).toBeNull();
      expect(product.cleanliness).toBeNull();
      expect(product.minimumOrder).toBeNull();
      expect(product.supplyCapacity).toBeNull();
    }
  });

  it("初始化产品使用独立的本地图片目录", () => {
    for (const product of demoProducts) {
      expect(product.coverImage).toMatch(/^\/generated\/products\//);
    }
  });

  it("旧站历史经营与质量声明保持未核验状态", () => {
    expect(legacyHistoricalClaims.verified).toBe(false);
    expect(legacyHistoricalClaims.stats.map((item) => item.value)).toEqual([
      "3000+",
      "200+",
      "1000+",
      "30+"
    ]);
    expect(legacyHistoricalClaims.priceStatement).toContain("未提供");
    expect(legacyHistoricalClaims.certificationStatements).toContain(
      "证书齐全"
    );
  });

  it("只迁移旧站中可核对的联系方式", () => {
    expect(legacySiteContent.companyName).toBe("远方羽绒");
    expect(legacySiteContent.phone).toBe("13732583829");
    expect(legacySiteContent.email).toBe("sales@yuanfangdown.com");
    expect(legacySiteContent).not.toHaveProperty("address");
    expect(legacySiteContent).not.toHaveProperty("wechat");
  });
});
