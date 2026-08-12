import type { Metadata } from "next";
import { ProductFilter } from "@/components/products/product-filter";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";
import { getPublishedProducts } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(
  "羽绒原料目录",
  "查看白鹅绒、灰鹅绒、白鸭绒、灰鸭绒及定制羽绒原料供应条目。",
  "/products"
);

export default async function ProductsPage() {
  const products = await getPublishedProducts();
  return (
    <>
      <PageHero
        eyebrow="PRODUCT CATALOG"
        title="羽绒原料目录"
        description="按种类、颜色与定制能力筛选原料，具体规格、价格和供货条件请联系业务人员确认。"
      />
      <Container className="py-14 sm:py-20">
        <ProductFilter products={products} />
      </Container>
    </>
  );
}
