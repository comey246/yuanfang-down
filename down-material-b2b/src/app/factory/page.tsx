import type { Metadata } from "next";
import {
  Factory as FactoryIcon,
  FlaskConical,
  Package,
  Send,
  Settings2,
  Warehouse
} from "lucide-react";
import { OnlineServiceButton } from "@/components/customer-service/online-service-button";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import {
  generatedAssetNotice,
  generatedAssets
} from "@/config/generated-assets";
import { getLegacyClaims } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(
  "工厂实力",
  "通过工厂环境、生产设备、检测实验室、包装仓储和发货实拍了解羽绒原料工厂。所有能力数据须经后台确认。",
  "/factory"
);

const zones = [
  [
    FactoryIcon,
    "工厂环境",
    "当前为 AI 工厂概念图；厂区边界、环境与物流动线须使用真实资料替换。",
    generatedAssets.posters[0].image
  ],
  [
    Settings2,
    "生产设备",
    "水洗、脱水、烘干、分拣设备型号和数量待核实。",
    generatedAssets.posters[1].image
  ],
  [
    FlaskConical,
    "检测实验室",
    "内部检测能力、设备与操作流程待质量负责人补充。",
    generatedAssets.posters[2].image
  ],
  [
    Warehouse,
    "包装仓储",
    "原料批次、包装、仓储与出库管理方式待补充。",
    generatedAssets.process[8]
  ],
  [
    Package,
    "包装展示",
    "包装方式、单包重量与标签规则由产品后台配置。",
    generatedAssets.process[7]
  ],
  [
    Send,
    "发货区域",
    "实际发货范围、运输方式与交期不做虚构承诺。",
    generatedAssets.process[8]
  ]
] as const;

export default async function FactoryPage() {
  const legacyClaims = await getLegacyClaims();
  return (
    <>
      <PageHero
        eyebrow="FACTORY CAPABILITY"
        title="工厂实力，以可核验资料为依据"
        description="当前图片为 AI 概念示意，不代表本工厂真实现场。本页不展示未经确认的面积、产能、员工或设备数量。"
      />
      <Container className="py-14 sm:py-20">
        {legacyClaims ? (
          <section className="mb-10 rounded-xl2 border border-amber-200 bg-amber-50 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-ink">旧站供应能力数据</h2>
              <span className="text-xs font-bold text-amber-700">
                {legacyClaims.verified ? "企业已确认" : "待企业核验"}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {legacyClaims.stats.map((item) => (
                <div key={item.key} className="rounded-xl bg-white p-4">
                  <p className="text-forest-800 text-2xl font-black">
                    {item.value}
                    <span className="ml-1 text-sm">{item.unit}</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-amber-900/70">
              来源：{legacyClaims.sourceNote}
              。这些历史数字尚无合同、台账或审计资料佐证，核验前不构成对外承诺。
            </p>
          </section>
        ) : null}
        <div className="grid gap-6 md:grid-cols-2">
          {zones.map(([Icon, title, description, image], index) => (
            <article
              key={title}
              className="overflow-hidden rounded-xl2 border border-slate-200 bg-white"
            >
              <MediaPlaceholder
                label={title}
                type={index === 0 ? "factory" : "image"}
                src={image}
                notice={generatedAssetNotice}
                className="min-h-64"
              />
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-forest-50 text-forest-700">
                    <Icon className="size-5" />
                  </span>
                  <h2 className="text-xl font-bold">{title}</h2>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 rounded-xl2 bg-forest-900 p-8 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">需要远程看厂或预约沟通？</h2>
            <p className="mt-2 text-white/65">
              可通过在线客服直接说明关注的产品、规格与参观需求。
            </p>
          </div>
          <OnlineServiceButton source="factory" className="mt-5 sm:mt-0">
            联系工厂
          </OnlineServiceButton>
        </div>
      </Container>
    </>
  );
}
