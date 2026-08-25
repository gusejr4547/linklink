import { Skeleton } from "@/components/ui/skeleton";

export function LinkListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col border border-[#C7BC9E] bg-[#EAE2D0] dark:border-[#3A413C] dark:bg-[#1B1F1C]"
        >
          <Skeleton className="aspect-video w-full rounded-none bg-[#C7BC9E]/30 dark:bg-[#3A413C]/30" />
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-3 w-1/3 rounded-none bg-[#C7BC9E]/30 dark:bg-[#3A413C]/30" />
            <Skeleton className="h-4 w-4/5 rounded-none bg-[#C7BC9E]/30 dark:bg-[#3A413C]/30" />
            <Skeleton className="h-3 w-2/3 rounded-none bg-[#C7BC9E]/30 dark:bg-[#3A413C]/30" />
          </div>
        </div>
      ))}
    </div>
  );
}
