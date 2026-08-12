import type { Metadata } from "next";
import { BadgeCheck, Building2, FlaskConical, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { generatedAssets } from "@/config/generated-assets";
import { getPublishedCertificates } from "@/lib/data";
import { createMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = createMetadata(
  "检测指标、质量标准与真实认证",
  "查看羽绒原料质量参数说明、企业内部检测、第三方检测报告与经核验认证证书。",
  "/quality"
);

const indicators = [
  "绒子含量",
  "羽绒含量",
  "蓬松度",
  "清洁度 / 浊度",
  "耗氧量",
  "气味等级",
  "水分率",
  "残脂率",
  "成分检测",
  "执行标准"
];

export default async function QualityPage() {
  const certificates = await getPublishedCertificates();
  return (
    <>
      <PageHero
        eyebrow="QUALITY & TESTING"
        title="质量指标与资料分级"
        description="检测报告不是认证证书。本站明确区分企业内部检测、第三方检测和认证证书，并只公开核验后的真实文件。"
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
              "后台填写检测机构、检测日期并上传对应报告文件。"
            ],
            [
              BadgeCheck,
              "认证证书",
              "证书经核验且后台明确发布后才展示，不默认显示认证 Logo。"
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
            下列图片用于解释指标和资料分级，不是本工厂检测现场，也不包含任何产品检测结果。
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
        <section className="mt-14">
          <h2 className="text-3xl font-bold">可配置质量指标</h2>
          <p className="mt-3 text-slate-600">
            具体值为空时前台产品页不显示，避免把未提供数据误解为“0”。
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {indicators.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <p className="font-bold">{item}</p>
                <p className="mt-2 text-xs text-slate-500">
                  实际数据待后台配置
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-14">
          <div className="flex items-center gap-3">
            <ShieldAlert className="size-7 text-amber-600" />
            <h2 className="text-3xl font-bold">公开质量文件</h2>
          </div>
          <div className="mt-7">
            {certificates.length ? (
              <div className="grid gap-5 md:grid-cols-3">
                {certificates.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-white p-6"
                  >
                    <p className="text-xs font-bold text-amber-600">
                      {item.type === "INTERNAL_TEST"
                        ? "企业内部检测"
                        : item.type === "THIRD_PARTY_TEST"
                          ? "第三方检测"
                          : "认证证书"}
                    </p>
                    <h3 className="mt-2 text-lg font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm text-slate-500">
                      机构：{item.issuer || "待补充"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      日期：{formatDate(item.issueDate)}
                    </p>
                    {item.fileUrl ? (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-block text-sm font-bold text-forest-700 underline"
                      >
                        查看文件
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="暂无已核验公开的质量文件"
                description="当前未配置可公开的检测报告或认证证书。业务人员可根据具体采购需求提供经授权的资料。"
                actionLabel="申请质量资料"
                actionHref="/contact?source=quality-empty"
              />
            )}
          </div>
        </section>
      </Container>
    </>
  );
}
