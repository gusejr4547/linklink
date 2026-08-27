"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function LinksError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Links page error:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 border border-dashed border-destructive px-6 py-20 text-center">
      <p className="font-[family-name:var(--font-display)] text-lg text-destructive">
        링크 목록을 불러오지 못했어요
      </p>
      <p className="text-sm text-[#5B6360] dark:text-[#9BA39A]">잠시 후 다시 시도해주세요.</p>
      <Button
        onClick={retry}
        variant="outline"
        className="mt-2 rounded-none border-[#23282A] bg-transparent text-[#23282A] hover:bg-[#23282A] hover:text-[#EAE2D0] dark:border-[#EAE2D0] dark:text-[#EAE2D0] dark:hover:bg-[#EAE2D0] dark:hover:text-[#1B1F1C]"
      >
        다시 시도
      </Button>
    </div>
  );
}
