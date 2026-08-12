import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { getCompanyProfile } from "@/lib/data";
import { createMetadata } from "@/lib/seo";
import { isConfiguredValue } from "@/lib/utils";

export const metadata: Metadata = createMetadata(
  "隐私政策",
  "羽绒原料工厂网站直接联系方式、必要访问日志及个人信息权利说明。",
  "/privacy"
);

export default async function PrivacyPage() {
  const profile = await getCompanyProfile();
  return (
    <Container className="py-14 sm:py-20">
      <article className="prose-cn mx-auto max-w-3xl rounded-xl2 border border-slate-200 bg-white p-7 sm:p-10">
        <p className="text-sm font-bold text-amber-600">
          最后更新：待正式上线时填写
        </p>
        <h1 className="mt-3 text-4xl font-bold">隐私政策</h1>
        <p>
          本政策用于说明本网站的实际数据处理方式。正式上线前，运营企业应补齐真实主体、部署服务商、保存期限和个人信息保护联系方式，并由专业人员结合实际业务复核。
        </p>

        <h2>1. 本站不提供公开询盘表单</h2>
        <p>
          本站不要求访客填写姓名、手机号、微信号、公司名称或采购需求，也不会将访客主动提供的联系方式写入本站内容数据库。原公开询盘写入接口已经停用。
        </p>

        <h2>2. 你可以主动选择的联系方式</h2>
        <p>
          你可以自行选择电话或微信联系工厂。只有在你主动发起沟通并提供信息后，对应通信渠道才会处理相关资料。建议只提供完成采购沟通所必需的产品、规格、数量、用途和交期信息。
        </p>

        <h2>3. 必要访问日志与第三方基础设施</h2>
        <p>
          为交付网页、排查故障和防范攻击，网站托管或 CDN 服务商可能处理 IP
          地址、请求时间、访问路径、浏览器标识和安全事件等必要日志。本站内容数据库仅用于网站内容、后台设置、管理员数据及停用前可能形成的历史业务记录，不接收新的公开询盘。
        </p>
        <p>
          百度统计或其他分析脚本只有在运营方完成配置和合规审查后才会启用；启用时应在本政策中补充真实服务商、数据种类、用途、保存期限和退出方式。
        </p>

        <h2>4. 境外处理说明</h2>
        <p>
          本站已经通过停用公开询盘表单，避免由网站收集并传输访客姓名、手机号、微信号和采购留言。但托管、CDN
          或统计服务是否构成个人信息境外提供，仍应根据正式部署地区、服务商实际数据流和法律要求逐项评估。
        </p>
        <p>
          如果未来确需向境外提供个人信息，运营方应在处理前补充境外接收方、联系方式、目的、方式、信息种类、权利行使程序等告知，并依法完成适用的单独同意及其他程序。可查阅
          <a
            href="https://www.npc.gov.cn/npc/c2/c30834/202108/t20210820_313088.html"
            target="_blank"
            rel="noreferrer"
          >
            《中华人民共和国个人信息保护法》
          </a>
          。
        </p>

        <h2>5. 保存、安全与敏感信息</h2>
        <p>
          运营方应按完成沟通、履行合同和法定义务所需的最短期限保存业务资料，并采取账号权限、密码保护、传输加密和操作审计等措施。请勿通过电话或微信发送身份证件、银行卡、健康信息或其他与采购无关的敏感资料。
        </p>

        <h2>6. 你的权利与联系我们</h2>
        <p>
          你可以向相应通信渠道或运营企业申请查询、更正、复制、删除相关个人信息，或撤回基于同意的处理授权。运营主体：
          {profile.companyName}；电话：{profile.phone}
          {isConfiguredValue(profile.address)
            ? `；地址：${profile.address}`
            : ""}
          。
        </p>
      </article>
    </Container>
  );
}
