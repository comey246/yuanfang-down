import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const sourceDir = process.env.AI_SOURCE_DIR || "/Users/gjh/Downloads";
const outputDir = join(process.cwd(), "public", "generated");

const assets = [
  ["ChatGPT Image 2026年8月11日 23_32_45.png", "hero/down-material-hero"],

  ["ChatGPT Image 2026年8月11日 23_31_31.png", "products/white-goose-main"],
  [
    "ChatGPT Image 2026年8月11日 23_31_35.png",
    "products/white-goose-inspection"
  ],
  [
    "ChatGPT Image 2026年8月11日 23_31_38.png",
    "products/white-goose-sample-pack"
  ],
  ["ChatGPT Image 2026年8月11日 23_32_11.png", "products/grey-goose-main"],
  [
    "ChatGPT Image 2026年8月11日 23_32_15.png",
    "products/grey-goose-inspection"
  ],
  [
    "ChatGPT Image 2026年8月11日 23_32_18.png",
    "products/grey-goose-sample-pack"
  ],
  ["白鸭绒原料微距展示.png", "products/white-duck-main"],
  ["白鸭绒原料检视近景.png", "products/white-duck-inspection"],
  ["透明白鸭绒样品袋.png", "products/white-duck-sample-pack"],
  ["天然灰鸭绒微距.png", "products/grey-duck-main"],
  ["灰鸭绒洁净原料近景.png", "products/grey-duck-inspection"],
  ["透明样品袋中的灰鸭绒.png", "products/grey-duck-sample-pack"],

  ["原料入厂与待检.png", "process/01-raw-material-receiving"],
  ["羽绒初步筛选流程示意.png", "process/02-pre-screening"],
  ["羽绒清洗与循环过滤.png", "process/03-washing"],
  ["羽绒离心脱水示意图.png", "process/04-dewatering"],
  ["循环暖风羽绒烘干舱.png", "process/05-drying"],
  ["羽绒多段气流分拣.png", "process/06-fine-sorting"],
  ["羽绒取样与质量检查示意图.png", "process/07-quality-inspection"],
  ["洁净羽绒装袋封装流程示意图.png", "process/08-packaging"],
  ["出库准备与装卸月台.png", "process/09-dispatch"],

  ["绒朵与羽毛片分类观察.png", "quality/down-cluster-content"],
  ["透明容器中的羽绒蓬松度.png", "quality/fill-power"],
  ["三管透明度示意.png", "quality/cleanliness"],
  ["羽绒耗氧量检测示意图.png", "quality/oxygen-number"],
  ["羽绒水分与残脂示意图.png", "quality/moisture-fat"],
  ["绒羽结构观察与文件分区.png", "quality/composition-records"],

  ["服装打样羽绒原料.png", "applications/apparel"],
  ["家纺羽绒原料打样.png", "applications/home-textile"],
  ["睡袋羽绒研发样品.png", "applications/sleeping-bag"],
  ["羽绒样品与采购桌面.png", "applications/procurement"],

  ["羽绒原料选购指南.png", "articles/procurement-indicators"],
  ["鹅绒与鸭绒的形态样本.png", "articles/goose-vs-duck"],
  ["羽绒蓬松度与绒朵结构观察.png", "articles/fill-power-content"],
  ["纯净羽绒，链接远方.png", "seo/social-og"],

  ["曙光洁净羽绒园区.png", "factory/factory-overview"],
  ["透明舱内的羽绒水洗.png", "factory/washing-process"],
  ["羽绒标准化抽样检验台.png", "factory/quality-inspection"]
];

const missing = assets
  .map(([source]) => source)
  .filter((source) => !existsSync(join(sourceDir, source)));

if (missing.length) {
  throw new Error(`缺少 ${missing.length} 个源文件：\n${missing.join("\n")}`);
}

for (const [source, stem] of assets) {
  const input = join(sourceDir, source);
  const webp = join(outputDir, `${stem}.webp`);
  const avif = join(outputDir, `${stem}.avif`);
  mkdirSync(dirname(webp), { recursive: true });

  const resizeArgs =
    stem === "seo/social-og"
      ? ["-resize", "1200x630^", "-gravity", "center", "-extent", "1200x630"]
      : ["-resize", "1800x1800>"];

  execFileSync("magick", [
    input,
    "-auto-orient",
    "-strip",
    ...resizeArgs,
    "-quality",
    "82",
    webp
  ]);
  execFileSync("magick", [
    input,
    "-auto-orient",
    "-strip",
    ...resizeArgs,
    "-quality",
    "52",
    avif
  ]);

  console.log(`${basename(source)} -> ${stem}.{webp,avif}`);
}

console.log(`已处理 ${assets.length} 张图片，输出目录：${outputDir}`);
