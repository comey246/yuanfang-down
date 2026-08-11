import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function createMetadata(
  title: string,
  description: string,
  path = "/"
): Metadata {
  const url = new URL(path, siteConfig.baseUrl).toString();
  return {
    title,
    description,
    keywords: [...siteConfig.defaultKeywords],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: siteConfig.companyName,
      title,
      description,
      url,
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
      title,
      description,
      images: ["/og.png"]
    }
  };
}
