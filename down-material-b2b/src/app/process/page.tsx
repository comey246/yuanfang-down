import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { generatedAssets } from "@/config/generated-assets";
import { processSteps } from "@/lib/demo-data";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(
  "生产工艺与质量控制",
  "了解羽绒原料从入厂、筛选、清洗、脱水、烘干、分拣、检测、包装到出库的主要流程。",
  "/process"
);

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="PRODUCTION PROCESS"
        title="生产工艺与质量控制"
        description="展示羽绒原料从入厂到出库的主要工序。"
      />
      <Container className="py-14 sm:py-20">
        <div className="relative space-y-8 before:absolute before:bottom-10 before:left-6 before:top-10 before:w-px before:bg-forest-100 md:before:left-1/2">
          {processSteps.map(([number, title, description], index) => (
            <article
              key={title}
              className={`relative grid gap-6 md:grid-cols-2 md:items-center ${index % 2 ? "" : "md:[&>*:first-child]:order-2"}`}
            >
              <div className="relative">
                <MediaPlaceholder
                  label={`${title}工序`}
                  src={generatedAssets.process[index]}
                  className="min-h-64 rounded-xl2"
                />
                <span className="absolute -left-1 top-5 grid size-14 place-items-center rounded-full border-4 border-white bg-amber-500 text-sm font-black text-white md:left-auto md:right-[-2.45rem]">
                  {number}
                </span>
              </div>
              <div className="rounded-xl2 border border-slate-200 bg-white p-7">
                <p className="text-xs font-bold tracking-[.15em] text-amber-600">
                  PROCESS {number}
                </p>
                <h2 className="mt-3 text-2xl font-bold">{title}</h2>
                <p className="mt-4 leading-7 text-slate-600">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
