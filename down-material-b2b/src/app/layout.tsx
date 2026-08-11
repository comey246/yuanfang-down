import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@/app/globals.css";
import { PublicChrome } from "@/components/layout/public-chrome";
import { CustomerServiceSlot } from "@/components/layout/customer-service-slot";
import { siteConfig } from "@/config/site";
import { safeJsonLd } from "@/lib/utils";
import { getCompanyProfile, getSiteOptions } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const [profile, options] = await Promise.all([
    getCompanyProfile(),
    getSiteOptions()
  ]);
  const verificationOther = Object.fromEntries(
    [
      [
        "baidu-site-verification",
        process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION ||
          options.baiduVerification
      ],
      [
        "sogou_site_verification",
        process.env.NEXT_PUBLIC_SOGOU_SITE_VERIFICATION
      ],
      ["360-site-verification", process.env.NEXT_PUBLIC_360_SITE_VERIFICATION]
    ].filter((entry): entry is [string, string] => Boolean(entry[1]))
  );
  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: {
      default: `${siteConfig.slogan}｜${profile.companyName}`,
      template: `%s｜${profile.shortName}羽绒原料`
    },
    description: siteConfig.description,
    keywords: options.seoKeywords
      .split(/[，,]/)
      .map((item) => item.trim())
      .filter(Boolean),
    authors: [{ name: profile.companyName }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: profile.companyName,
      title: `${siteConfig.slogan}｜${profile.companyName}`,
      description: siteConfig.description,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "专注优质羽绒原料供应"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.slogan}｜${profile.companyName}`,
      description: siteConfig.description,
      images: ["/og.png"]
    },
    robots: { index: true, follow: true },
    verification: Object.keys(verificationOther).length
      ? { other: verificationOther }
      : undefined
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#142f29"
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const [profile, options] = await Promise.all([
    getCompanyProfile(),
    getSiteOptions()
  ]);
  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: profile.companyName,
    description: siteConfig.description,
    url: siteConfig.baseUrl,
    telephone: profile.phone === "待填写" ? undefined : profile.phone,
    email: profile.email === "待填写" ? undefined : profile.email,
    address:
      profile.address === "待填写"
        ? undefined
        : { "@type": "PostalAddress", streetAddress: profile.address }
  };
  return (
    <html lang="zh-CN">
      <body>
        <PublicChrome profile={profile} options={options}>
          {children}
        </PublicChrome>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organization) }}
        />
        {options.customerServiceScript ? (
          <CustomerServiceSlot script={options.customerServiceScript} />
        ) : null}
        {process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID ? (
          <Script
            id="baidu-analytics"
            strategy="afterInteractive"
          >{`var _hmt=_hmt||[];(function(){var hm=document.createElement('script');hm.src='https://hm.baidu.com/hm.js?${process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID}';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(hm,s);})();`}</Script>
        ) : null}
      </body>
    </html>
  );
}
