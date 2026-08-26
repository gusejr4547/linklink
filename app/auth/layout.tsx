import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { gowunBatang, gothicA1, plexMono } from "@/lib/fonts";

const navButtonClass =
  "rounded-none border border-[#23282A] bg-transparent px-4 text-xs font-medium tracking-widest text-[#23282A] uppercase transition-colors hover:bg-[#23282A] hover:text-[#EAE2D0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E6B5C] dark:border-[#EAE2D0] dark:text-[#EAE2D0] dark:hover:bg-[#EAE2D0] dark:hover:text-[#1B1F1C] dark:focus-visible:outline-[#35C9A8]";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className={`${gowunBatang.variable} ${gothicA1.variable} ${plexMono.variable} flex min-h-screen flex-col bg-[#EAE2D0] font-[family-name:var(--font-body)] dark:bg-[#1B1F1C]`}
    >
      <nav className="flex h-16 w-full justify-center border-b border-[#C7BC9E] dark:border-[#3A413C]">
        <div className="flex w-full max-w-5xl items-center justify-between px-5 text-sm">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-lg font-bold text-[#23282A] dark:text-[#EAE2D0]"
          >
            LinkLink
          </Link>
          <ThemeSwitcher className={navButtonClass} />
        </div>
      </nav>
      <div className="flex w-full flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </main>
  );
}
