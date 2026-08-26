import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { authCardClass, authLinkClass } from "@/lib/ui-classes";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <Card className={authCardClass}>
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-[#23282A] dark:text-[#EAE2D0]">
            가입해주셔서 감사합니다!
          </CardTitle>
          <CardDescription className="text-[#5B6360] dark:text-[#9BA39A]">
            이메일을 확인해주세요
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-[#5B6360] dark:text-[#9BA39A]">
            회원가입이 완료되었습니다. 로그인하기 전에 이메일함에서 인증
            링크를 확인해주세요.
          </p>
          <Link href="/auth/login" className={`${authLinkClass} text-sm`}>
            로그인으로 돌아가기
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
