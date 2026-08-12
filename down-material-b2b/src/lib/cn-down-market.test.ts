import { describe, expect, it, vi } from "vitest";
import {
  addHistoryChanges,
  cnDownProducts,
  fetchCnDownMarket
} from "@/lib/cn-down-market";

describe("羽绒金网行情同步", () => {
  it("固定映射四个公开行情品种", () => {
    expect(cnDownProducts.map((item) => item.productName)).toEqual([
      "白鹅绒",
      "灰鹅绒",
      "白鸭绒",
      "灰鸭绒"
    ]);
  });

  it("按相邻交易日计算历史涨跌幅", () => {
    expect(
      addHistoryChanges([
        { unitPrice: 102, publishDate: "2026-08-11" },
        { unitPrice: 100, publishDate: "2026-08-10" }
      ])
    ).toEqual([
      { unitPrice: 100, publishDate: "2026-08-10", changeValue: null },
      { unitPrice: 102, publishDate: "2026-08-11", changeValue: 2 }
    ]);
  });

  it("动态读取全部规格并请求当前价格和90天历史数据", async () => {
    const fetcher = vi.fn(
      async (input: string | URL | Request, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith("getFeatherPriceInfo")) {
          expect(init?.method).toBe("GET");
          return new Response(
            JSON.stringify({
              code: 200,
              message: "success",
              data: {
                standard: [
                  {
                    id: "1",
                    standardName: "羽绒服装 GB/T 14272-2021",
                    specification: [
                      { id: "2", specification: 95 },
                      { id: "3", specification: 90 }
                    ]
                  }
                ]
              }
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }
        const body = JSON.parse(String(init?.body)) as {
          featherNameId: string;
          specificationId: string;
          standardId: string;
        };
        expect(["2", "3"]).toContain(body.specificationId);
        expect(body.standardId).toBe("1");
        return new Response(
          JSON.stringify(
            url.endsWith("getFeatherPriceByTime")
              ? {
                  code: 200,
                  message: "success",
                  data: [
                    {
                      unitPrice: 500 + Number(body.featherNameId),
                      publishDate: "2026-08-11"
                    }
                  ]
                }
              : {
                  code: 200,
                  message: "success",
                  data: {
                    currentPrice: 500 + Number(body.featherNameId),
                    priceChange: "0.00"
                  }
                }
          ),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    );

    const result = await fetchCnDownMarket(
      new Date("2026-08-12T04:00:00Z"),
      fetcher as typeof fetch
    );
    expect(fetcher).toHaveBeenCalledTimes(17);
    expect(result).toHaveLength(8);
    expect(result[4]).toMatchObject({
      productName: "白鸭绒",
      specificationValue: 95,
      currentPrice: 503
    });
  });
});
