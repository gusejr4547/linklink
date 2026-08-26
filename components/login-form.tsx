"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  authCardClass,
  authLinkClass,
  fieldClass,
  primaryButtonClass,
} from "@/lib/ui-classes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/links");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className={authCardClass}>
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-[#23282A] dark:text-[#EAE2D0]">
            로그인
          </CardTitle>
          <CardDescription className="text-[#5B6360] dark:text-[#9BA39A]">
            이메일과 비밀번호를 입력해 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-[#23282A] dark:text-[#EAE2D0]"
                >
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="password"
                    className="text-[#23282A] dark:text-[#EAE2D0]"
                  >
                    비밀번호
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className={cn("ml-auto inline-block text-sm", authLinkClass)}
                  >
                    비밀번호를 잊으셨나요?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldClass}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                disabled={isLoading}
                className={cn("w-full", primaryButtonClass)}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-[#5B6360] dark:text-[#9BA39A]">
              계정이 없으신가요?{" "}
              <Link href="/auth/sign-up" className={authLinkClass}>
                회원가입
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
