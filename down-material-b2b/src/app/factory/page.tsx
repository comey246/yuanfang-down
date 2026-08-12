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
import { generatedAssets } from "@/config/generated-assets";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(
  "工厂实力",
  "了解工厂环境、生产设备、检测实验室、包装仓储和发货等供应能力资料。所有能力数据须经后台确认。",
  "/factory"
);

const zones = [
  [
    FactoryIcon,
    "工厂环境",
    "厂区环境、区域规划与物流动线资料由后台维护，具体情况可联系工厂确认。",
    generatedAssets.factoryImages[0].image
  ],
  [
    Settings2,
    "生产设备",
    "水洗、脱水、烘干、分拣设备型号和数量待核实。",
    generatedAssets.factoryImages[1].image
  ],
  [
    FlaskConical,
    "检测实验室",
    "内部检测能力、设备与操作流程待质量负责人补充。",
    generatedAssets.factoryImages[2].image
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

export default function FactoryPage() {
  return (
    <>
      <PageHero
        eyebrow="FACTORY CAPABILITY"
        title="工厂实力，以可核验资料为依据"
        description="工厂能力资料以后台核验发布内容为准。本页不展示未经确认的面积、产能、员工或设备数量。"
      />
      <Container className="py-14 sm:py-20">
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
