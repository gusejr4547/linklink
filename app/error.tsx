"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { gowunBatang, gothicA1, plexMono } from "@/lib/fonts";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <main
      className={`${gowunBatang.variable} ${gothicA1.variable} ${plexMono.variable} flex min-h-screen flex-col items-center justify-center gap-4 bg-[#EAE2D0] p-5 text-center font-[family-name:var(--font-body)] dark:bg-[#1B1F1C]`}
    >
      <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-destructive">
        오류가 발생했어요
      </p>
      <p className="text-sm text-[#5B6360] dark:text-[#9BA39A]">
        예상치 못한 문제가 발생했어요. 잠시 후 다시 시도해주세요.
      </p>
      <div className="mt-2 flex gap-2">
        <Button
          onClick={retry}
          className="rounded-none bg-[#0E6B5C] text-[#EAE2D0] hover:opacity-90 dark:bg-[#35C9A8] dark:text-[#1B1F1C]"
        >
          다시 시도
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-none border-[#23282A] bg-transparent text-[#23282A] hover:bg-[#23282A] hover:text-[#EAE2D0] dark:border-[#EAE2D0] dark:text-[#EAE2D0] dark:hover:bg-[#EAE2D0] dark:hover:text-[#1B1F1C]"
        >
          <Link href="/links">홈으로</Link>
        </Button>
      </div>
    </main>
  );
}
