import { Home, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { OnlineServiceButton } from "@/components/customer-service/online-service-button";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getCompanyProfile } from "@/lib/data";

export default async function InquirySuccessPage() {
  const profile = await getCompanyProfile();
  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-soft sm:p-12">
        <ShieldCheck className="mx-auto size-16 text-forest-700" />
        <h1 className="mt-6 text-3xl font-bold text-ink">公开询盘表单已停用</h1>
        <p className="mt-4 leading-7 text-slate-600">
          本站不再收集或保存访客姓名、手机号和微信号。请通过电话或微信直接与工厂沟通。
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <OnlineServiceButton source="legacy-inquiry-success" size="lg">
            <MessageCircle className="size-4" />
            查看微信二维码
          </OnlineServiceButton>
          <a
            href={`tel:${profile.mobile}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 font-bold text-forest-900"
          >
            <Phone className="size-4" />
            电话联系
          </a>
          <ButtonLink href="/products" variant="outline" size="lg">
            <Home className="size-4" />
            查看产品
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
