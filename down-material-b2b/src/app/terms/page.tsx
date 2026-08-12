import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(
  "网站使用条款",
  "羽绒原料工厂网站内容、报价、检测资料、知识产权与责任限制说明。",
  "/terms"
);

export default function TermsPage() {
  return (
    <Container className="py-14 sm:py-20">
      <article className="prose-cn mx-auto max-w-3xl rounded-xl2 border border-slate-200 bg-white p-7 sm:p-10">
        <p className="text-sm font-bold text-amber-600">
          最后更新：待正式上线时填写
        </p>
        <h1 className="mt-3 text-4xl font-bold">网站使用条款</h1>
        <h2>信息用途</h2>
        <p>
          本网站用于展示羽绒原料供应方向与产品资料，并提供电话和微信直联入口。页面内容不构成合同要约、质量保证、现货承诺或投资建议。
        </p>
        <h2>产品与行情</h2>
        <p>
          产品参数、价格、交付能力和行情以后台审核发布信息为基础，最终以双方确认的样品、检测文件、报价单和合同为准。历史行情不代表未来价格。
        </p>
        <h2>检测与认证</h2>
        <p>
          企业内部检测、第三方检测和认证证书应分别理解。任何认证仅在核验并公开相应证书时有效，不应从页面配色、图标或一般性描述推断。
        </p>
        <h2>知识产权</h2>
        <p>
          上线后网站文字、照片、商标和文件应由企业自有或取得合法授权。初始占位素材不得被视为真实工厂或产品资料。
        </p>
        <h2>外部链接</h2>
        <p>
          文章来源或文件可能链接到第三方网站，我们不控制第三方内容与可用性。正式上线前应完成链接审核。
        </p>
        <h2>条款更新</h2>
        <p>
          企业可依法更新本条款，并在本页标注最新日期。公司主体信息和争议处理条款应由企业法律顾问在上线前补充。
        </p>
      </article>
    </Container>
  );
}
