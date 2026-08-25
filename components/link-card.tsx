import { Button } from "@/components/ui/button";
import { extractDomain, formatRelativeTime } from "@/lib/format-utils";
import type { Link as LinkType } from "@/types/link";
import { BookOpen, Heart, Trash2 } from "lucide-react";
import Image from "next/image";

export function LinkCard({
  link,
  variant = "grid",
}: {
  link: LinkType;
  variant?: "grid" | "list";
}) {
  const domain = extractDomain(link.url);

  const thumbnail = link.thumbnail_url ? (
    <Image
      src={link.thumbnail_url}
      alt=""
      fill
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center font-[family-name:var(--font-mono)] text-xs tracking-widest text-[#5B6360] dark:text-[#9BA39A]">
      NO IMAGE
    </div>
  );

  const meta = (
    <div className="flex items-center justify-between gap-2 font-[family-name:var(--font-mono)] text-xs tracking-wide text-[#5B6360] dark:text-[#9BA39A]">
      <span className="truncate">{domain}</span>
      <span className="shrink-0">{formatRelativeTime(link.created_at)}</span>
    </div>
  );

  const title = (
    <h3
      className={`font-[family-name:var(--font-body)] font-bold text-[#23282A] dark:text-[#EAE2D0] ${
        variant === "list" ? "line-clamp-1 text-sm" : "line-clamp-2 text-base"
      }`}
    >
      {link.title}
    </h3>
  );

  const memo = link.memo && (
    <p
      className={`font-[family-name:var(--font-display)] text-[#5B6360] italic dark:text-[#9BA39A] ${
        variant === "list" ? "line-clamp-1 text-xs" : "line-clamp-2 text-sm"
      }`}
    >
      &ldquo;{link.memo}&rdquo;
    </p>
  );

  const LIST_TAG_LIMIT = 3;
  const visibleTags = variant === "list" ? link.tags.slice(0, LIST_TAG_LIMIT) : link.tags;
  const hiddenTagCount = link.tags.length - visibleTags.length;

  const tags = link.tags.length > 0 && (
    <div
      className={`flex gap-2 ${
        variant === "list" ? "flex-nowrap overflow-hidden" : "mt-auto flex-wrap pt-2"
      }`}
    >
      {visibleTags.map((tag) => (
        <span
          key={tag}
          className="shrink-0 bg-[#DCE9E4] px-2 py-1 text-xs text-[#0E6B5C] dark:bg-[#16302A] dark:text-[#35C9A8]"
        >
          #{tag}
        </span>
      ))}
      {hiddenTagCount > 0 && (
        <span className="shrink-0 px-2 py-1 text-xs text-[#5B6360] dark:text-[#9BA39A]">
          +{hiddenTagCount}
        </span>
      )}
    </div>
  );

  const readButton = (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="읽음으로 표시"
      className={`rounded-none hover:bg-[#DCE9E4] dark:hover:bg-[#16302A] ${
        link.is_read
          ? "bg-[#DCE9E4] text-[#0E6B5C] dark:bg-[#16302A] dark:text-[#35C9A8]"
          : "text-[#5B6360] dark:text-[#9BA39A]"
      }`}
    >
      <BookOpen />
    </Button>
  );

  const favoriteButton = (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="즐겨찾기 토글"
      className={`rounded-none hover:bg-[#F1E1DB] dark:hover:bg-[#3A2119] ${
        link.is_favorite
          ? "bg-[#F1E1DB] text-[#B5533C] dark:bg-[#3A2119] dark:text-[#E08A6C]"
          : "text-[#5B6360] dark:text-[#9BA39A]"
      }`}
    >
      <Heart className={link.is_favorite ? "fill-current" : ""} />
    </Button>
  );

  const deleteButton = (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="삭제"
      className="rounded-none text-[#5B6360] hover:bg-destructive/10 hover:text-destructive dark:text-[#9BA39A]"
    >
      <Trash2 />
    </Button>
  );

  if (variant === "list") {
    return (
      <div className="group flex border border-[#23282A] bg-[#EAE2D0] shadow-[3px_3px_0_0_#C7BC9E] transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#C7BC9E] dark:border-[#EAE2D0] dark:bg-[#1B1F1C] dark:shadow-[3px_3px_0_0_#3A413C] dark:hover:shadow-[5px_5px_0_0_#3A413C]">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0E6B5C] dark:focus-visible:outline-[#35C9A8]"
        >
          {meta}
          {title}
          {memo}
          {tags}
        </a>
        <div className="flex shrink-0 items-center gap-1 border-l border-[#C7BC9E] px-2 dark:border-[#3A413C]">
          {readButton}
          {favoriteButton}
          {deleteButton}
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col border border-[#23282A] bg-[#EAE2D0] shadow-[4px_4px_0_0_#C7BC9E] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#C7BC9E] dark:border-[#EAE2D0] dark:bg-[#1B1F1C] dark:shadow-[4px_4px_0_0_#3A413C] dark:hover:shadow-[6px_6px_0_0_#3A413C]">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0E6B5C] dark:focus-visible:outline-[#35C9A8]"
      >
        <div className="relative aspect-video w-full border-b border-[#C7BC9E] bg-[#DCE9E4] dark:border-[#3A413C] dark:bg-[#16302A]">
          {thumbnail}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          {meta}
          {title}
          {memo}
          {tags}
        </div>
      </a>

      <div className="flex items-center justify-between border-t border-[#C7BC9E] px-2 py-1 dark:border-[#3A413C]">
        <div className="flex items-center gap-1">
          {readButton}
          {favoriteButton}
        </div>
        {deleteButton}
      </div>
    </div>
  );
}
