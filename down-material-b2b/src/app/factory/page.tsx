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
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(
  "工厂实力",
  "通过工厂环境、生产设备、检测实验室、包装仓储和发货实拍了解羽绒原料工厂。所有能力数据须经后台确认。",
  "/factory"
);

const zones = [
  [FactoryIcon, "工厂航拍", "展示厂区边界、环境与物流动线，真实素材待上传。"],
  [Settings2, "生产设备", "水洗、脱水、烘干、分拣设备型号和数量待核实。"],
  [
    FlaskConical,
    "检测实验室",
    "内部检测能力、设备与操作流程待质量负责人补充。"
  ],
  [Warehouse, "包装仓储", "原料批次、包装、仓储与出库管理方式待补充。"],
  [Package, "包装实拍", "包装方式、单包重量与标签规则由产品后台配置。"],
  [Send, "发货区域", "实际发货范围、运输方式与交期不做虚构承诺。"]
] as const;

export default function FactoryPage() {
  return (
    <>
      <PageHero
        eyebrow="FACTORY CAPABILITY"
        title="工厂实力，以真实现场为依据"
        description="本页不展示未经确认的厂房面积、年产能、员工数量或设备数量。后台填写并审核后再公开。"
      />
      <Container className="py-14 sm:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {zones.map(([Icon, title, description], index) => (
            <article
              key={title}
              className="overflow-hidden rounded-xl2 border border-slate-200 bg-white"
            >
              <MediaPlaceholder
                label={title}
                type={index === 0 ? "factory" : "image"}
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
