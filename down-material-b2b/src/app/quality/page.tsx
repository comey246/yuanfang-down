import type { Metadata } from "next";
import { BadgeCheck, Building2, FlaskConical } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { generatedAssets } from "@/config/generated-assets";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(
  "羽绒质量检测与指标说明",
  "了解羽绒原料常见质量指标，以及企业内部检测、第三方检测和认证证书的区别。",
  "/quality"
);

export default function QualityPage() {
  return (
    <>
      <PageHero
        eyebrow="QUALITY & TESTING"
        title="羽绒质量检测与指标说明"
        description="了解羽绒原料常见质量指标，并正确区分企业内部检测、第三方检测和认证证书。"
      />
      <Container className="py-14 sm:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              FlaskConical,
              "企业内部检测",
              "展示工厂内部检测项目、日期与批次；不等同于第三方结论。"
            ],
            [
              Building2,
              "第三方检测",
              "由第三方机构出具检测报告，报告通常包含样品信息、检测项目、方法和结果。"
            ],
            [
              BadgeCheck,
              "认证证书",
              "由认证机构依据相应规则签发，查看时需关注认证范围、有效期和证书状态。"
            ]
          ].map(([Icon, title, description]) => {
            const ItemIcon = Icon as typeof FlaskConical;
            return (
              <div
                key={String(title)}
                className="rounded-xl2 border border-slate-200 bg-white p-6"
              >
                <ItemIcon className="size-8 text-forest-700" />
                <h2 className="mt-5 text-xl font-bold">{String(title)}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {String(description)}
                </p>
              </div>
            );
          })}
        </div>
        <section className="mt-14">
          <h2 className="text-3xl font-bold">质量指标说明</h2>
          <p className="mt-3 text-slate-600">
            了解绒子含量、蓬松度、清洁度、气味和水分等常见质量指标。
          </p>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {generatedAssets.quality.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-xl2 border border-slate-200 bg-white"
              >
                <MediaPlaceholder
                  label={item.title}
                  src={item.image}
                  className="min-h-56"
                />
                <h3 className="p-5 font-bold">{item.title}</h3>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
