import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPublishedArticles, getPublishedProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([
    getPublishedProducts(),
    getPublishedArticles()
  ]);
  const staticRoutes = [
    "",
    "/products",
    "/market",
    "/process",
    "/media",
    "/quality",
    "/articles",
    "/about",
    "/contact",
    "/privacy",
    "/terms"
  ];
  return [
    ...staticRoutes.map((path) => ({
      url: `${siteConfig.baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency:
        path === "/market" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : 0.7
    })),
    ...products.map((product) => ({
      url: `${siteConfig.baseUrl}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...articles.map((article) => ({
      url: `${siteConfig.baseUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];
}
