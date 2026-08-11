import { describe, expect, it } from "vitest";
import { demoProducts } from "@/lib/demo-data";
import { legacyDemoNotice, legacySiteContent } from "@/config/legacy-content";

describe("演示产品数据安全", () => {
  it("四个演示产品均明确标记为示例", () => {
    expect(demoProducts).toHaveLength(4);
    expect(demoProducts.every((product) => product.demo)).toBe(true);
  });

  it("演示产品不填入虚构检测和供货参数", () => {
    for (const product of demoProducts) {
      expect(product.downClusterContent).toBeNull();
      expect(product.fillPower).toBeNull();
      expect(product.cleanliness).toBeNull();
      expect(product.minimumOrder).toBeNull();
      expect(product.supplyCapacity).toBeNull();
    }
  });

  it("旧站图片只作为明确标识的演示素材", () => {
    for (const product of demoProducts) {
      expect(product.coverImage).toMatch(/^\/legacy-assets\//);
      expect(legacyDemoNotice).toContain("演示素材");
      expect(product.summary).not.toMatch(/70%|95%|3000|200\+|证书齐全/);
    }
  });

  it("只迁移旧站中可核对的联系方式", () => {
    expect(legacySiteContent.companyName).toBe("远方羽绒");
    expect(legacySiteContent.phone).toBe("13732583829");
    expect(legacySiteContent.email).toBe("sales@yuanfangdown.com");
    expect(legacySiteContent).not.toHaveProperty("address");
    expect(legacySiteContent).not.toHaveProperty("wechat");
  });
});
