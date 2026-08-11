"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function ShareButtons() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
    >
      {copied ? (
        <Check className="size-4 text-green-700" />
      ) : (
        <Copy className="size-4" />
      )}
      {copied ? "链接已复制" : "复制分享链接"}
    </button>
  );
}
