import { CertificateType } from "@prisma/client";
import Link from "next/link";
import { Pencil, ShieldAlert } from "lucide-react";
import {
  archiveCertificate,
  saveCertificate,
  saveCompanySettings
} from "@/app/(admin)/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { legacyHistoricalClaims } from "@/config/legacy-content";
import { siteConfig } from "@/config/site";
import type { CompanyProfile, LegacyClaims } from "@/lib/data";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminSettingsPage({
  searchParams
}: {
  searchParams: Promise<{ certificate?: string }>;
}) {
  const prisma = getPrisma();
  const { certificate } = await searchParams;
  const [
    profileSetting,
    optionSetting,
    legacySetting,
    certificates,
    currentCertificate
  ] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: "company_profile" } }),
    prisma.siteSetting.findUnique({ where: { key: "site_options" } }),
    prisma.siteSetting.findUnique({ where: { key: "legacy_claims" } }),
    prisma.certificate.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: "desc" }
    }),
    certificate
      ? prisma.certificate.findUnique({ where: { id: certificate } })
      : null
  ]);
  const profile = {
    companyName: siteConfig.companyName,
    shortName: siteConfig.shortName,
    phone: siteConfig.phone,
    mobile: siteConfig.mobile,
    wechat: siteConfig.wechat,
    email: siteConfig.email,
    address: siteConfig.address,
    businessHours: siteConfig.businessHours,
    icpNumber: siteConfig.icpNumber,
    policeRecordNumber: siteConfig.policeRecordNumber,
    creditCode: siteConfig.creditCode,
    logoUrl: siteConfig.logoUrl,
    wechatQrUrl: siteConfig.wechatQrUrl,
    ...(profileSetting?.value as Partial<CompanyProfile> | null)
  };
  const options =
    (optionSetting?.value as {
      homeModuleOrder?: string;
      customerServiceProviderName?: string;
      customerServiceUrl?: string;
      customerServiceScript?: string;
      seoKeywords?: string;
      baiduVerification?: string;
    } | null) || {};
  const legacyClaims = {
    ...legacyHistoricalClaims,
    ...(legacySetting?.value as Partial<LegacyClaims> | null)
  };
  const legacyValue = (key: string) =>
    legacyClaims.stats?.find((item) => item.key === key)?.value || "";
  return (
    <>
      <div>
        <p className="text-sm font-bold text-amber-600">SETTINGS</p>
        <h1 className="mt-1 text-3xl font-bold">企业资料、客服与 SEO</h1>
      </div>
      <form
        action={saveCompanySettings}
        className="mt-7 rounded-xl border border-slate-200 bg-white p-6"
      >
        <h2 className="font-bold">企业资料与联系方式</h2>
        <p className="mt-2 text-xs text-slate-500">
          保存后网站头部、页脚和固定客服会读取这些数据。未提供时请保留“待填写”。
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["公司名称", "companyName", profile.companyName],
            ["公司简称", "shortName", profile.shortName],
            ["服务热线", "phone", profile.phone],
            ["手机号码", "mobile", profile.mobile],
            ["微信号", "wechat", profile.wechat],
            ["业务邮箱", "email", profile.email],
            ["工厂地址", "address", profile.address],
            ["工作时间", "businessHours", profile.businessHours],
            ["统一社会信用代码", "creditCode", profile.creditCode],
            ["ICP备案号", "icpNumber", profile.icpNumber],
            ["公安备案号", "policeRecordNumber", profile.policeRecordNumber],
            ["Logo URL", "logoUrl", profile.logoUrl],
            ["微信二维码 URL", "wechatQrUrl", profile.wechatQrUrl]
          ].map(([label, name, value]) => (
            <label key={name} className="text-xs font-semibold">
              {label}
              <input
                name={name}
                defaultValue={value}
                className="admin-field mt-2"
              />
            </label>
          ))}
        </div>
        <section className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">旧站历史供应与质量声明</h2>
              <p className="mt-1 text-xs text-amber-900/70">
                内容来自旧站；核对台账、合同、证书和报告后才能勾选“企业已核验”。
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                name="legacyClaimsVerified"
                defaultChecked={legacyClaims.verified}
                className="size-4 accent-forest-700"
              />
              企业已核验
            </label>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["年供应量（吨）", "legacyAnnualSupply", "annualSupply"],
              ["合作工厂（家）", "legacyPartnerFactories", "partnerFactories"],
              ["批次质检（批次）", "legacyBatchTests", "batchTests"],
              ["出口配套地区（个）", "legacyExportRegions", "exportRegions"]
            ].map(([label, name, key]) => (
              <label key={name} className="text-xs font-semibold">
                {label}
                <input
                  name={name}
                  defaultValue={legacyValue(key)}
                  className="admin-field mt-2"
                />
              </label>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-xs font-semibold">
              认证 / 报告历史声明（每行一条）
              <textarea
                name="legacyCertificationStatements"
                defaultValue={legacyClaims.certificationStatements?.join("\n")}
                className="admin-field mt-2 min-h-24"
              />
            </label>
            <label className="text-xs font-semibold">
              质量检测历史声明
              <textarea
                name="legacyQualityStatement"
                defaultValue={legacyClaims.qualityStatement}
                className="admin-field mt-2 min-h-24"
              />
            </label>
            <label className="text-xs font-semibold md:col-span-2">
              价格说明
              <input
                name="legacyPriceStatement"
                defaultValue={legacyClaims.priceStatement}
                className="admin-field mt-2"
              />
            </label>
          </div>
        </section>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-xs font-semibold">
            SEO 关键词（逗号分隔）
            <textarea
              name="seoKeywords"
              defaultValue={
                options.seoKeywords || siteConfig.defaultKeywords.join("，")
              }
              className="admin-field mt-2 min-h-24"
            />
          </label>
          <label className="text-xs font-semibold">
            首页模块顺序
            <textarea
              name="homeModuleOrder"
              defaultValue={
                options.homeModuleOrder ||
                "行情,产品,优势,工厂,工艺,质量,媒体,合作,文章,联系"
              }
              className="admin-field mt-2 min-h-24"
            />
          </label>
          <label className="text-xs font-semibold">
            国内客服平台名称
            <input
              name="customerServiceProviderName"
              defaultValue={
                options.customerServiceProviderName || "待填写的国内客服平台"
              }
              placeholder="例如：企业微信客服"
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold">
            在线客服直聊 URL
            <input
              name="customerServiceUrl"
              type="url"
              defaultValue={options.customerServiceUrl || ""}
              placeholder="客服平台提供的 https:// 直聊链接"
              className="admin-field mt-2"
            />
          </label>
          <label className="text-xs font-semibold md:col-span-2">
            第三方客服脚本插槽
            <textarea
              name="customerServiceScript"
              defaultValue={
                options.customerServiceScript
                  ? "••••••••（敏感内容已保存，重新粘贴才会替换）"
                  : ""
              }
              placeholder="粘贴国内客服平台提供的官方脚本；未配置时显示电话、微信和邮箱联系方式"
              className="admin-field mt-2 min-h-28"
            />
            <span className="mt-2 block font-normal leading-5 text-slate-500">
              仅使用已完成安全与隐私审查的官方脚本。聊天内容由所配置的平台处理，不写入本站
              Supabase 询盘表。
            </span>
          </label>
          <label className="text-xs font-semibold">
            百度站点验证
            <input
              name="baiduVerification"
              defaultValue={options.baiduVerification ? "••••••••" : ""}
              placeholder="敏感配置不会完整回显"
              className="admin-field mt-2"
            />
          </label>
        </div>
        <button className="mt-5 min-h-11 rounded-lg bg-forest-700 px-6 text-sm font-bold text-white">
          保存网站设置
        </button>
      </form>
      <section
        id="quality-docs"
        className="mt-7 rounded-xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-center gap-3">
          <ShieldAlert className="size-5 text-amber-600" />
          <div>
            <h2 className="font-bold">检测报告与认证资料</h2>
            <p className="mt-1 text-xs text-slate-500">
              认证必须先勾选“已核验”才能安全公开。
            </p>
          </div>
        </div>
        <form
          action={saveCertificate}
          className="mt-5 rounded-xl bg-slate-50 p-5"
        >
          <input type="hidden" name="id" value={currentCertificate?.id || ""} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="text-xs font-semibold">
              资料标题 *
              <input
                name="title"
                required
                defaultValue={currentCertificate?.title || ""}
                className="admin-field mt-2"
              />
            </label>
            <label className="text-xs font-semibold">
              类型
              <select
                name="type"
                defaultValue={
                  currentCertificate?.type || CertificateType.INTERNAL_TEST
                }
                className="admin-field mt-2"
              >
                <option value="INTERNAL_TEST">企业内部检测</option>
                <option value="THIRD_PARTY_TEST">第三方检测</option>
                <option value="CERTIFICATION">认证证书</option>
              </select>
            </label>
            <label className="text-xs font-semibold">
              机构
              <input
                name="issuer"
                defaultValue={currentCertificate?.issuer || ""}
                className="admin-field mt-2"
              />
            </label>
            <label className="text-xs font-semibold">
              文件 URL
              <input
                name="fileUrl"
                type="url"
                defaultValue={currentCertificate?.fileUrl || ""}
                className="admin-field mt-2"
              />
            </label>
            <label className="text-xs font-semibold">
              出具日期
              <input
                name="issueDate"
                type="date"
                defaultValue={
                  currentCertificate?.issueDate?.toISOString().slice(0, 10) ||
                  ""
                }
                className="admin-field mt-2"
              />
            </label>
            <label className="text-xs font-semibold">
              有效期
              <input
                name="expiryDate"
                type="date"
                defaultValue={
                  currentCertificate?.expiryDate?.toISOString().slice(0, 10) ||
                  ""
                }
                className="admin-field mt-2"
              />
            </label>
            <label className="text-xs font-semibold md:col-span-2">
              说明
              <input
                name="description"
                defaultValue={currentCertificate?.description || ""}
                className="admin-field mt-2"
              />
            </label>
          </div>
          <div className="mt-4 flex gap-5 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="verified"
                defaultChecked={currentCertificate?.verified || false}
                className="size-4 accent-forest-700"
              />
              资料已核验
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="published"
                defaultChecked={currentCertificate?.published || false}
                className="size-4 accent-forest-700"
              />
              前台公开
            </label>
          </div>
          <button className="mt-4 min-h-10 rounded-lg bg-slate-800 px-5 text-xs font-bold text-white">
            保存质量资料
          </button>
        </form>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-500">
                <th className="py-3">资料</th>
                <th>类型</th>
                <th>核验</th>
                <th>公开</th>
                <th>日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="py-3 font-bold">{item.title}</td>
                  <td>{item.type}</td>
                  <td>{item.verified ? "是" : "否"}</td>
                  <td>{item.published ? "是" : "否"}</td>
                  <td>{formatDate(item.issueDate)}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/settings?certificate=${item.id}#quality-docs`}
                        className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold"
                      >
                        <Pencil className="size-3.5" />
                        编辑
                      </Link>
                      <form action={archiveCertificate}>
                        <input type="hidden" name="id" value={item.id} />
                        <ConfirmSubmit>归档</ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
