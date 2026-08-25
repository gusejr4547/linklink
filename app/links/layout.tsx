import { LogoutButton } from "@/components/logout-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { gowunBatang, gothicA1, plexMono } from "@/lib/fonts";
import Link from "next/link";

const navButtonClass =
  "rounded-none border border-[#23282A] bg-transparent px-4 text-xs font-medium tracking-widest text-[#23282A] uppercase transition-colors hover:bg-[#23282A] hover:text-[#EAE2D0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E6B5C] dark:border-[#EAE2D0] dark:text-[#EAE2D0] dark:hover:bg-[#EAE2D0] dark:hover:text-[#1B1F1C] dark:focus-visible:outline-[#35C9A8]";

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className={`${gowunBatang.variable} ${gothicA1.variable} ${plexMono.variable} min-h-screen flex flex-col items-center bg-[#EAE2D0] font-[family-name:var(--font-body)] dark:bg-[#1B1F1C]`}
    >
      <div className="flex-1 w-full flex flex-col gap-12 items-center">
        <nav className="w-full flex justify-center border-b border-[#C7BC9E] h-16 dark:border-[#3A413C]">
          <div className="w-full max-w-5xl flex justify-between items-center px-5 text-sm">
            <Link
              href={"/links"}
              className="font-[family-name:var(--font-display)] text-lg font-bold text-[#23282A] dark:text-[#EAE2D0]"
            >
              LinkLink
            </Link>
            <div className="flex gap-2 items-center">
              <ThemeSwitcher className={navButtonClass} />
              <LogoutButton className={navButtonClass} />
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-8 max-w-5xl p-5 w-full">
          {children}
        </div>
      </div>
    </main>
  );
}
