import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { generatedAssets } from "@/config/generated-assets";
import { getCompanyProfile } from "@/lib/data";
import { createMetadata } from "@/lib/seo";
import { isConfiguredValue } from "@/lib/utils";

export const metadata: Metadata = createMetadata(
  "关于工厂",
  "了解羽绒原料工厂的企业定位、服务客户、经营信息和联系资料。未提供的真实信息明确标记待补充。",
  "/about"
);

export default async function AboutPage() {
  const profile = await getCompanyProfile();
  return (
    <>
      <PageHero
        eyebrow="ABOUT THE FACTORY"
        title="关于工厂"
        description="我们用明确占位符标记尚未提供的信息，避免用模板化数字和未经核验的宣传代替真实企业资料。"
      />
      <Container className="py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <MediaPlaceholder
            label="企业与工厂形象"
            type="factory"
            src={generatedAssets.posters[0].image}
            className="min-h-[420px] rounded-xl2"
          />
          <div>
            <p className="text-sm font-bold text-amber-600">企业实体信息</p>
            <h2 className="mt-3 text-3xl font-bold">{profile.companyName}</h2>
            <p className="mt-5 leading-8 text-slate-600">
              企业介绍待工厂提供并核验。建议包含成立背景、主营羽绒原料范围、服务地区、业务模式和质量管理方式，不使用“行业第一”等无法验证的绝对化描述。
            </p>
            <dl className="mt-7 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-5">
              {[
                ["公司简称", profile.shortName],
                ["统一社会信用代码", profile.creditCode],
                ["工厂地址", profile.address],
                ["工作时间", profile.businessHours]
              ]
                .filter(([, value]) => isConfiguredValue(value))
                .map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[140px_1fr] py-4 text-sm"
                  >
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>
        <section className="mt-16 rounded-xl2 bg-forest-50 p-8">
          <h2 className="text-2xl font-bold">服务对象</h2>
          <p className="mt-3 leading-7 text-slate-600">
            面向家纺厂、服装厂、贸易商、品牌商和其他具有批量原料采购需求的企业客户。具体合作条件须按产品规格、数量和交期单独确认。
          </p>
        </section>
      </Container>
    </>
  );
}
