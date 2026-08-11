import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <SearchX className="mx-auto size-14 text-slate-300" />
      <p className="mt-6 text-sm font-black tracking-[.2em] text-amber-600">
        404
      </p>
      <h1 className="mt-3 text-4xl font-bold">页面不存在或已下线</h1>
      <p className="mt-4 text-slate-600">
        请返回产品目录，或直接提交需要采购的羽绒原料。
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">返回首页</ButtonLink>
        <ButtonLink href="/products" variant="outline">
          查看产品
        </ButtonLink>
      </div>
    </Container>
  );
}
