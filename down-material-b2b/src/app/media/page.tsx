import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublishedMedia } from "@/lib/data";
import { createMetadata } from "@/lib/seo";
import { generatedAssets } from "@/config/generated-assets";

export const metadata: Metadata = createMetadata(
  "工厂图片中心",
  "查看由后台发布的工厂环境、生产设备、原料、清洗、分拣、检测和包装发货等内容。",
  "/media"
);

export default async function MediaPage() {
  const assets = await getPublishedMedia();
  const categories = [
    "工厂环境",
    "生产设备",
    "原料实拍",
    "清洗过程",
    "分拣过程",
    "检测过程",
    "包装发货",
    "展会与客户来访"
  ];
  return (
    <>
      <PageHero
        eyebrow="FACTORY MEDIA"
        title="工厂图片中心"
        description="所有图片均由后台维护，发布前确认版权和企业归属。"
      />
      <Container className="py-14 sm:py-20">
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>
        {assets.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl2 border border-slate-200 bg-white"
              >
                {item.url ? (
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <Image
                      src={item.url}
                      alt={item.altText || item.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <MediaPlaceholder label={item.title} className="min-h-56" />
                )}
                <div className="p-5">
                  <p className="text-xs font-bold text-amber-600">
                    {item.category}
                  </p>
                  <h2 className="mt-2 text-lg font-bold">{item.title}</h2>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {generatedAssets.factoryImages.map((item) => (
                <article
                  key={item.title}
                  className="overflow-hidden rounded-xl2 border border-slate-200 bg-white"
                >
                  <MediaPlaceholder
                    label={item.title}
                    src={item.image}
                    className="min-h-56"
                  />
                  <div className="p-5">
                    <p className="text-xs font-bold text-amber-600">工厂图片</p>
                    <h2 className="mt-2 text-lg font-bold">{item.title}</h2>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8">
              <EmptyState
                title="更多工厂内容待上传"
                description="后台当前没有更多已审核公开的图片，新增内容将在确认版权和企业归属后发布。"
                actionLabel="联系工厂获取资料"
                actionHref="/contact?source=media-empty"
              />
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
