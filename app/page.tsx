import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Gowun_Batang, Gothic_A1, IBM_Plex_Mono } from "next/font/google";

const gowunBatang = Gowun_Batang({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-display",
});

const gothicA1 = Gothic_A1({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const navLinkClass =
  "inline-flex h-11 items-center justify-center px-4 text-xs font-medium tracking-widest uppercase border border-[#23282A] text-[#23282A] transition-colors hover:bg-[#23282A] hover:text-[#EAE2D0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E6B5C] dark:border-[#EAE2D0] dark:text-[#EAE2D0] dark:hover:bg-[#EAE2D0] dark:hover:text-[#1B1F1C] dark:focus-visible:outline-[#35C9A8]";

const ctaLinkClass =
  "inline-flex h-12 items-center justify-center gap-2 bg-[#0E6B5C] px-6 text-sm font-medium tracking-widest text-[#EAE2D0] uppercase transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E6B5C] dark:bg-[#35C9A8] dark:text-[#1B1F1C] dark:focus-visible:outline-[#35C9A8]";

async function AuthRedirect() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect("/links");
  }

  return null;
}

export default function Home() {
  return (
    <main
      className={`${gowunBatang.variable} ${gothicA1.variable} ${plexMono.variable} flex min-h-screen flex-col bg-[#EAE2D0] font-[family-name:var(--font-body)] dark:bg-[#1B1F1C]`}
    >
      {hasEnvVars && (
        <Suspense>
          <AuthRedirect />
        </Suspense>
      )}

      <nav className="flex h-16 w-full justify-center border-b border-[#C7BC9E] dark:border-[#3A413C]">
        <div className="flex w-full max-w-5xl items-center justify-between px-5 text-sm">
          <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[#23282A] dark:text-[#EAE2D0]">
            LinkLink
          </span>
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className={navLinkClass}>
                로그인
              </Link>
              <Link
                href="/auth/sign-up"
                className={`${navLinkClass} border-[#0E6B5C] bg-[#0E6B5C] text-[#EAE2D0] hover:bg-[#0E6B5C] hover:text-[#EAE2D0] hover:opacity-90 dark:border-[#35C9A8] dark:bg-[#35C9A8] dark:text-[#1B1F1C] dark:hover:bg-[#35C9A8] dark:hover:text-[#1B1F1C]`}
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="flex w-full flex-1 justify-center px-5 py-16 lg:py-24">
        <div className="flex w-full max-w-5xl flex-col items-center gap-14 lg:flex-row lg:items-center lg:gap-10">
          {/* 헤드라인 + CTA */}
          <div className="flex max-w-xl flex-1 flex-col items-start text-left">
            <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[1.15] text-[#23282A] md:text-5xl lg:text-6xl dark:text-[#EAE2D0]">
              흩어진 링크,
              <br />
              다시 찾을 수
              <br />
              있게.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-[#5B6360] md:text-lg dark:text-[#9BA39A]">
              유튜브, 깃허브, 블로그, SNS... 여기저기 저장해둔 링크를{" "}
              <br className="hidden md:block" />
              태그와 메모로 다시 찾을 수 있게 정리하세요.
            </p>
            <Link href="/auth/sign-up" className={`${ctaLinkClass} mt-10`}>
              회원가입하고 시작
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* 시그니처: 색인 카드 */}
          <div className="flex w-full max-w-sm flex-1 justify-center lg:justify-end">
            <div className="w-full border border-[#23282A] bg-[#EAE2D0] p-6 shadow-[6px_6px_0_0_#C7BC9E] lg:-rotate-2 dark:border-[#EAE2D0] dark:bg-[#1B1F1C] dark:shadow-[6px_6px_0_0_#3A413C]">
              <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-xs tracking-widest text-[#5B6360] dark:text-[#9BA39A]">
                <span>NO. 0142</span>
                <span className="text-[#0E6B5C] dark:text-[#35C9A8]">
                  ARCHIVED
                </span>
              </div>
              <div className="mt-4 h-px w-full bg-[#C7BC9E] dark:bg-[#3A413C]" />
              <p className="mt-4 font-[family-name:var(--font-mono)] text-sm break-all text-[#23282A] dark:text-[#EAE2D0]">
                youtube.com/watch?v=...
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-base text-[#23282A] italic dark:text-[#EAE2D0]">
                &ldquo;나중에 다시 보려고 저장&rdquo;
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-[#DCE9E4] px-2 py-1 text-xs text-[#0E6B5C] dark:bg-[#16302A] dark:text-[#35C9A8]">
                  #디자인
                </span>
                <span className="bg-[#DCE9E4] px-2 py-1 text-xs text-[#0E6B5C] dark:bg-[#16302A] dark:text-[#35C9A8]">
                  #레퍼런스
                </span>
              </div>
              <div className="mt-4 h-px w-full bg-[#C7BC9E] dark:bg-[#3A413C]" />
              <div className="mt-4 flex items-center gap-2 text-xs text-[#5B6360] dark:text-[#9BA39A]">
                <span className="h-2 w-2 rounded-full border border-current" />
                안읽음
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="flex w-full justify-center border-t border-[#C7BC9E] dark:border-[#3A413C]">
        <div className="flex w-full max-w-5xl items-center justify-between px-5 py-6 text-xs text-[#5B6360] dark:text-[#9BA39A]">
          <span>LinkLink · 개인용 링크 아카이브</span>
          <ThemeSwitcher />
        </div>
      </footer>
    </main>
  );
}
