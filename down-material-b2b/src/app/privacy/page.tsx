import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { getCompanyProfile, getSiteOptions } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(
  "隐私政策",
  "羽绒原料工厂网站在线客服、直接联系方式、必要访问日志及个人信息权利说明。",
  "/privacy"
);

function displayProvider(value: string) {
  return value && !value.startsWith("待填") ? value : "待正式接入后填写";
}

export default async function PrivacyPage() {
  const [profile, options] = await Promise.all([
    getCompanyProfile(),
    getSiteOptions()
  ]);
  return (
    <Container className="py-14 sm:py-20">
      <article className="prose-cn mx-auto max-w-3xl rounded-xl2 border border-slate-200 bg-white p-7 sm:p-10">
        <p className="text-sm font-bold text-amber-600">
          最后更新：待正式上线时填写
        </p>
        <h1 className="mt-3 text-4xl font-bold">隐私政策</h1>
        <p>
          本政策用于说明本网站的实际数据处理方式。正式上线前，运营企业应补齐真实主体、客服平台、部署服务商、保存期限和个人信息保护联系方式，并由专业人员结合实际业务复核。
        </p>

        <h2>1. 本站不提供公开询盘表单</h2>
        <p>
          本站不要求访客填写姓名、手机号、微信号、公司名称或采购需求，也不会将在线聊天内容或访客主动提供的联系方式写入本站使用的
          Supabase 数据库。原公开询盘写入接口已经停用。
        </p>

        <h2>2. 你可以主动选择的联系方式</h2>
        <p>
          你可以自行选择在线客服、电话、企业微信或业务邮箱联系工厂。只有在你主动发起沟通并提供信息后，对应通信渠道才会处理相关资料。建议只提供完成采购沟通所必需的产品、规格、数量、用途和交期信息。
        </p>

        <h2>3. 在线客服平台</h2>
        <p>
          当前后台配置的客服平台为：
          <strong>
            {displayProvider(options.customerServiceProviderName)}
          </strong>
          。客服平台可能根据其功能处理你的账号标识、会话内容、会话时间、网络与设备信息，用于建立会话、回复咨询、保障安全和保存沟通记录。实际处理主体、联系方式、服务器位置、保存期限和权利行使方式，应以接入时展示的客服平台隐私提示为准。
        </p>
        <p>
          在平台名称和隐私信息未补齐前，运营方不应启用其脚本。本站不会把客服平台中的会话同步至
          Supabase；如未来增加同步功能，应先更新本政策并履行适用的告知、同意和安全义务。
        </p>

        <h2>4. 必要访问日志与第三方基础设施</h2>
        <p>
          为交付网页、排查故障和防范攻击，网站托管或 CDN 服务商可能处理 IP
          地址、请求时间、访问路径、浏览器标识和安全事件等必要日志。Supabase
          仅用于网站内容、后台设置、管理员数据及停用前可能形成的历史业务记录，不接收新的公开询盘或在线客服会话。
        </p>
        <p>
          百度统计或其他分析脚本只有在运营方完成配置和合规审查后才会启用；启用时应在本政策中补充真实服务商、数据种类、用途、保存期限和退出方式。
        </p>

        <h2>5. 境外处理说明</h2>
        <p>
          本站已经通过停用公开询盘表单，避免将访客姓名、手机号、微信号和采购留言由网站直接发送至境外
          Supabase
          项目。但托管、CDN、统计或客服服务是否构成个人信息境外提供，仍应根据正式部署地区、服务商实际数据流和法律要求逐项评估。
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

        <h2>6. 保存、安全与敏感信息</h2>
        <p>
          运营方应按完成沟通、履行合同和法定义务所需的最短期限保存业务资料，并采取账号权限、密码保护、传输加密和操作审计等措施。请勿通过在线客服发送身份证件、银行卡、健康信息或其他与采购无关的敏感资料。
        </p>

        <h2>7. 你的权利与联系我们</h2>
        <p>
          你可以向相应通信渠道或运营企业申请查询、更正、复制、删除相关个人信息，或撤回基于同意的处理授权。运营主体：
          {profile.companyName}；电话：{profile.phone}；邮箱：{profile.email}
          ；地址：
          {profile.address}。以上资料仍为“待填写”时，网站不得正式对外发布。
        </p>
      </article>
    </Container>
  );
}
