"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Container className="py-24 text-center">
      <AlertTriangle className="mx-auto size-14 text-amber-500" />
      <h1 className="mt-6 text-3xl font-bold">页面暂时无法加载</h1>
      <p className="mt-3 text-slate-600">
        请稍后重试；如需立即询价，可使用页面底部的电话入口。
      </p>
      <Button onClick={reset} className="mt-7">
        重新加载
      </Button>
    </Container>
  );
}
