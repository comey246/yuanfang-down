"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { CompanyProfile, SiteOptions } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingContact } from "@/components/layout/floating-contact";

export function PublicChrome({
  profile,
  options,
  children
}: {
  profile: CompanyProfile;
  options: SiteOptions;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <main>{children}</main>;
  return (
    <>
      <Header profile={profile} />
      <main>{children}</main>
      <Footer profile={profile} />
      <FloatingContact profile={profile} options={options} />
    </>
  );
}
