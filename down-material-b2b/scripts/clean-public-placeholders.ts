import { PrismaClient } from "@prisma/client";
import { legacyProductContent } from "../src/config/legacy-content";

const prisma = new PrismaClient();

async function main() {
  let updated = 0;
  for (const [slug, product] of Object.entries(legacyProductContent)) {
    const result = await prisma.product.updateMany({
      where: { slug },
      data: {
        summary: product.summary,
        description:
          "适用于家纺、服装、户外用品与贸易采购等场景，支持规格沟通、样品确认和批量采购。",
        qualityNote: null,
        demoNotice: null
      }
    });
    updated += result.count;
  }
  console.info(`已清理 ${updated} 个产品的公开占位与内部维护文案。`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
