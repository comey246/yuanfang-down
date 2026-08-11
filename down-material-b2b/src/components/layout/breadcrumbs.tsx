import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { safeJsonLd } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function Breadcrumbs({
  items
}: {
  items: { name: string; href?: string }[];
}) {
  const list = [{ name: "首页", href: "/" }, ...items];
  return (
    <>
      <nav
        aria-label="面包屑"
        className="flex flex-wrap items-center gap-1 text-sm text-slate-500"
      >
        {list.map((item, index) => (
          <span
            key={`${item.name}-${index}`}
            className="flex items-center gap-1"
          >
            {index ? <ChevronRight className="size-3.5" /> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-forest-700">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </span>
        ))}
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: list.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: item.href
                ? new URL(item.href, siteConfig.baseUrl).toString()
                : undefined
            }))
          })
        }}
      />
    </>
  );
}
