"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function ConfirmSubmit({
  message = "确认执行此操作？",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { message?: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className={cn(
        "min-h-9 rounded-lg border border-red-200 px-3 text-xs font-bold text-red-700 hover:bg-red-50",
        className
      )}
      {...props}
    />
  );
}
