import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { authCardClass } from "@/lib/ui-classes";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <p className="text-sm text-[#5B6360] dark:text-[#9BA39A]">
      {params?.error
        ? `오류 코드: ${params.error}`
        : "알 수 없는 오류가 발생했습니다."}
    </p>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card className={authCardClass}>
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-[#23282A] dark:text-[#EAE2D0]">
            문제가 발생했습니다
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <ErrorContent searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
