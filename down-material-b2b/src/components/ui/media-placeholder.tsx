import { Factory, ImageIcon, PlayCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function MediaPlaceholder({
  label,
  type = "image",
  className,
  src
}: {
  label: string;
  type?: "image" | "video" | "factory";
  className?: string;
  src?: string | null;
}) {
  const Icon =
    type === "video" ? PlayCircle : type === "factory" ? Factory : ImageIcon;
  if (src)
    return (
      <div
        className={cn(
          "relative min-h-48 overflow-hidden bg-slate-100",
          className
        )}
      >
        <Image
          src={src}
          alt={label}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  return (
    <div
      className={cn(
        "relative flex min-h-48 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(220,168,71,.22),transparent_30%),linear-gradient(145deg,#1c4037,#102923)] text-white",
        className
      )}
      role="img"
      aria-label={`${label}，本地占位图，发布前替换`}
    >
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(120deg,transparent_45%,rgba(255,255,255,.25)_50%,transparent_55%)] [background-size:42px_42px]" />
      <div className="relative px-6 text-center">
        <Icon
          className="mx-auto mb-3 size-9 text-amber-400"
          aria-hidden="true"
        />
        <p className="font-semibold">{label}</p>
        <p className="mt-1 text-xs text-white/65">真实授权素材待替换</p>
      </div>
    </div>
  );
}
