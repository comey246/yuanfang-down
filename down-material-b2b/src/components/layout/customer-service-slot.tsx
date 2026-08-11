"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function CustomerServiceSlot({ script }: { script: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (!script || !ref.current || pathname.startsWith("/admin")) return;
    const node = ref.current;
    const fragment = document.createRange().createContextualFragment(script);
    node.appendChild(fragment);
    return () => node.replaceChildren();
  }, [pathname, script]);
  return <div ref={ref} data-customer-service-slot hidden />;
}
