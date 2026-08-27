import { LinkList } from "@/components/link-list";
import { LinkListSkeleton, SearchFilterBarSkeleton } from "@/components/link-list-skeleton";
import { SaveLinkDialog } from "@/components/save-link-dialog";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { Button } from "@/components/ui/button";
import { getLinks } from "@/lib/queries/links";
import { getUserTags } from "@/lib/queries/tags";
import type { LinkFilter } from "@/types/link";
import { Plus } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

const saveLinkTrigger = (
  <Button className="rounded-none bg-[#0E6B5C] text-[#EAE2D0] hover:opacity-90 dark:bg-[#35C9A8] dark:text-[#1B1F1C]">
    <Plus className="size-4" />
    링크 저장
  </Button>
);

type LinksSearchParams = {
  q?: string | string[];
  tag?: string | string[];
  read?: string | string[];
  fav?: string | string[];
};

function toStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

async function TagsFilterBar() {
  await connection();
  const tags = await getUserTags();

  return <SearchFilterBar tags={tags} />;
}

async function LinksList({
  searchParams,
}: {
  searchParams: Promise<LinksSearchParams>;
}) {
  await connection();

  const params = await searchParams;
  const q = toStringParam(params.q);
  const tag = toStringParam(params.tag);
  const read = toStringParam(params.read);
  const fav = toStringParam(params.fav);

  const filter: LinkFilter = {
    searchQuery: q?.trim() || undefined,
    selectedTags: tag ? [tag] : undefined,
    readStatus: read === "read" || read === "unread" ? read : "all",
    favoriteOnly: fav === "true",
  };

  const hasActiveFilters = Boolean(
    filter.searchQuery ||
      (filter.selectedTags && filter.selectedTags.length > 0) ||
      filter.readStatus !== "all" ||
      filter.favoriteOnly
  );

  const { data: links, error } = await getLinks(filter);

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

  if (links.length === 0) {
    return hasActiveFilters ? (
      <div className="flex flex-col items-center gap-4 border border-dashed border-[#C7BC9E] px-6 py-20 text-center dark:border-[#3A413C]">
        <p className="font-[family-name:var(--font-display)] text-lg text-[#23282A] dark:text-[#EAE2D0]">
          검색 결과가 없어요
        </p>
        <p className="text-sm text-[#5B6360] dark:text-[#9BA39A]">
          다른 검색어나 필터를 시도해보세요.
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-2 rounded-none border-[#23282A] bg-transparent text-[#23282A] hover:bg-[#23282A] hover:text-[#EAE2D0] dark:border-[#EAE2D0] dark:text-[#EAE2D0] dark:hover:bg-[#EAE2D0] dark:hover:text-[#1B1F1C]"
        >
          <Link href="/links">필터 초기화</Link>
        </Button>
      </div>
    ) : (
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
    );
  }

  return <LinkList links={links} />;
}

export default function LinksPage({
  searchParams,
}: {
  searchParams: Promise<LinksSearchParams>;
}) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#23282A] dark:text-[#EAE2D0]">
          내 링크
        </h1>
        <SaveLinkDialog trigger={saveLinkTrigger} />
      </div>

      <Suspense fallback={<SearchFilterBarSkeleton />}>
        <TagsFilterBar />
      </Suspense>

      <Suspense fallback={<LinkListSkeleton />}>
        <LinksList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
