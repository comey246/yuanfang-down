import { describe, expect, it } from "vitest";
import { demoProducts } from "@/lib/demo-data";

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
});
