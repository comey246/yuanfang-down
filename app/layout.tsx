import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "yuanfangdown.com";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: "远方羽绒 | 专业羽绒原料供应商",
    description: "稳定供应白鸭绒、灰鸭绒、白鹅绒和灰鹅绒，支持样品寄送、批量采购与检测报告。",
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: "远方羽绒 | 专业羽绒原料供应商",
      description: "稳定原料、严格质检、长期批量供应。",
      images: [{ url: "/og.png", width: 1536, height: 1024, alt: "远方羽绒供应商网站" }],
      locale: "zh_CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "远方羽绒 | 专业羽绒原料供应商",
      description: "稳定原料、严格质检、长期批量供应。",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
