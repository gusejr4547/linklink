import { LinkList } from "@/components/link-list";
import { LinkListSkeleton } from "@/components/link-list-skeleton";
import { SaveLinkDialog } from "@/components/save-link-dialog";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { Button } from "@/components/ui/button";
import { getLinks } from "@/lib/queries/links";
import { getUserTags } from "@/lib/queries/tags";
import { Plus } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";

const saveLinkTrigger = (
  <Button className="rounded-none bg-[#0E6B5C] text-[#EAE2D0] hover:opacity-90 dark:bg-[#35C9A8] dark:text-[#1B1F1C]">
    <Plus className="size-4" />
    링크 저장
  </Button>
);

async function LinksContent({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  await connection();

  const params = await searchParams;
  const tag = typeof params.tag === "string" ? params.tag : undefined;

  const [{ data: links, error }, tags] = await Promise.all([
    getLinks(tag ? { selectedTags: [tag] } : undefined),
    getUserTags(),
  ]);

  if (error || !links) {
    return (
      <div className="flex flex-col items-center gap-4 border border-dashed border-destructive px-6 py-20 text-center">
        <p className="font-[family-name:var(--font-display)] text-lg text-destructive">
          링크 목록을 불러오지 못했어요
        </p>
        <p className="text-sm text-[#5B6360] dark:text-[#9BA39A]">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  return (
    <>
      <SearchFilterBar tags={tags} />

      {links.length === 0 ? (
        <div className="flex flex-col items-center gap-4 border border-dashed border-[#C7BC9E] px-6 py-20 text-center dark:border-[#3A413C]">
          <p className="font-[family-name:var(--font-display)] text-lg text-[#23282A] dark:text-[#EAE2D0]">
            아직 저장된 링크가 없어요
          </p>
          <p className="text-sm text-[#5B6360] dark:text-[#9BA39A]">
            나중에 다시 보고 싶은 페이지를 저장해보세요.
          </p>
          <SaveLinkDialog
            trigger={
              <Button className="mt-2 rounded-none bg-[#0E6B5C] text-[#EAE2D0] hover:opacity-90 dark:bg-[#35C9A8] dark:text-[#1B1F1C]">
                <Plus className="size-4" />
                링크 저장
              </Button>
            }
          />
        </div>
      ) : (
        <LinkList links={links} />
      )}
    </>
  );
}

export default function LinksPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#23282A] dark:text-[#EAE2D0]">
          내 링크
        </h1>
        <SaveLinkDialog trigger={saveLinkTrigger} />
      </div>

      <Suspense fallback={<LinkListSkeleton />}>
        <LinksContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
