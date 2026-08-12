import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const productSlugs = [
  "white-goose-down",
  "grey-goose-down",
  "white-duck-down",
  "grey-duck-down"
];

async function main() {
  const result = await prisma.product.updateMany({
    where: { slug: { in: productSlugs } },
    data: {
      description:
        "产品规格、质量指标、包装、起订量、供货能力与交付周期以双方确认的样品、检测文件、报价单及合同为准。",
      demoNotice: null
    }
  });
  console.info(`已清理 ${result.count} 个产品的公开示例与待替换说明。`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
