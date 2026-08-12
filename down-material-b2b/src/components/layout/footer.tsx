import Link from "next/link";
import Image from "next/image";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { siteConfig } from "@/config/site";
import type { CompanyProfile } from "@/lib/data";
import { isConfiguredValue } from "@/lib/utils";

export function Footer({ profile }: { profile: CompanyProfile }) {
  return (
    <footer className="bg-[#10231f] text-white/75">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_.8fr]">
        <div>
          <div className="flex items-center gap-3">
            {profile.logoUrl ? (
              <span className="relative size-11 overflow-hidden rounded-xl bg-white">
                <Image
                  src={profile.logoUrl}
                  alt={`${profile.shortName} Logo`}
                  fill
                  sizes="44px"
                  className="object-contain"
                />
              </span>
            ) : (
              <span className="grid size-11 place-items-center rounded-xl bg-amber-500 font-black text-white">
                绒
              </span>
            )}
            <div>
              <p className="font-bold text-white">{profile.companyName}</p>
              <p className="text-xs">{siteConfig.slogan}</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-7">
            本网站用于展示羽绒原料供应能力并提供在线客服、电话、微信和邮箱直联。所有参数、价格、证书及检测文件以后台审核发布内容为准。
          </p>
        </div>
        <div>
          <p className="mb-4 font-bold text-white">联系工厂</p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-amber-400" />
              {profile.phone}
            </li>
            <li className="flex gap-2">
              <MessageCircle className="mt-0.5 size-4 shrink-0 text-amber-400" />
              {profile.wechat}
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-amber-400" />
              {profile.email}
            </li>
            {isConfiguredValue(profile.address) ? (
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-amber-400" />
                {profile.address}
              </li>
            ) : null}
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-amber-400" />
              {profile.businessHours}
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-4 font-bold text-white">网站导航</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {siteConfig.navigation.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-amber-400"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/privacy" className="hover:text-amber-400">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-amber-400">
              使用条款
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-4 font-bold text-white">微信咨询</p>
          <MediaPlaceholder
            label="微信二维码"
            src={profile.wechatQrUrl}
            fit="contain"
            className="min-h-44 rounded-xl"
          />
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.companyName}。保留所有权利。
          </p>
          {isConfiguredValue(profile.creditCode) ||
          isConfiguredValue(profile.icpNumber) ||
          isConfiguredValue(profile.policeRecordNumber) ? (
            <div className="flex flex-wrap gap-4">
              {isConfiguredValue(profile.creditCode) ? (
                <span>统一社会信用代码：{profile.creditCode}</span>
              ) : null}
              {isConfiguredValue(profile.icpNumber) ? (
                <span>{profile.icpNumber}</span>
              ) : null}
              {isConfiguredValue(profile.policeRecordNumber) ? (
                <span>{profile.policeRecordNumber}</span>
              ) : null}
            </div>
          ) : null}
        </Container>
      </div>
    </footer>
  );
}
