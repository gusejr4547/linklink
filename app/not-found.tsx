import Link from "next/link";
import { Button } from "@/components/ui/button";
import { gowunBatang, gothicA1, plexMono } from "@/lib/fonts";

export default function NotFound() {
  return (
    <main
      className={`${gowunBatang.variable} ${gothicA1.variable} ${plexMono.variable} flex min-h-screen flex-col items-center justify-center gap-4 bg-[#EAE2D0] p-5 text-center font-[family-name:var(--font-body)] dark:bg-[#1B1F1C]`}
    >
      <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#23282A] dark:text-[#EAE2D0]">
        페이지를 찾을 수 없어요
      </p>
      <p className="text-sm text-[#5B6360] dark:text-[#9BA39A]">
        요청하신 페이지가 존재하지 않거나 이동되었어요.
      </p>
      <Button
        asChild
        className="mt-2 rounded-none bg-[#0E6B5C] text-[#EAE2D0] hover:opacity-90 dark:bg-[#35C9A8] dark:text-[#1B1F1C]"
      >
        <Link href="/links">내 링크로 이동</Link>
      </Button>
    </main>
  );
}
