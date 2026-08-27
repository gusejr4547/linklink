import { LinkListSkeleton, SearchFilterBarSkeleton } from "@/components/link-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function LinksLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-24 rounded-none bg-[#C7BC9E]/30 dark:bg-[#3A413C]/30" />
        <Skeleton className="h-10 w-32 rounded-none bg-[#C7BC9E]/30 dark:bg-[#3A413C]/30" />
      </div>
      <SearchFilterBarSkeleton />
      <LinkListSkeleton />
    </div>
  );
}
