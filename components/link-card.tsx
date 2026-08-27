"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteLink } from "@/lib/actions/links";
import { extractDomain, formatRelativeTime } from "@/lib/format-utils";
import type { Link as LinkType } from "@/types/link";
import { BookOpen, Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition, type MouseEvent } from "react";
import { toast } from "sonner";

export function LinkCard({
  link,
  variant = "grid",
  onToggleRead,
  onToggleFavorite,
}: {
  link: LinkType;
  variant?: "grid" | "list";
  onToggleRead: () => void;
  onToggleFavorite: () => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const domain = extractDomain(link.url);

  function handleConfirmDelete(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    startDeleteTransition(async () => {
      const result = await deleteLink(link.id);
      if (result.success) {
        toast.success("링크를 삭제했어요.");
        setDeleteOpen(false);
      } else {
        toast.error(result.error ?? "링크 삭제에 실패했어요.");
      }
    });
  }

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
      className={`flex gap-2 ${variant === "list" ? "flex-nowrap overflow-hidden" : "flex-wrap"}`}
    >
      {visibleTags.map((tag) => (
        <Link
          key={tag}
          href={`/links?tag=${encodeURIComponent(tag)}`}
          className="shrink-0 bg-[#DCE9E4] px-2 py-1 text-xs text-[#0E6B5C] hover:opacity-80 dark:bg-[#16302A] dark:text-[#35C9A8]"
        >
          #{tag}
        </Link>
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
      aria-label={link.is_read ? "읽음 취소" : "읽음으로 표시"}
      aria-pressed={link.is_read}
      onClick={onToggleRead}
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
      aria-label={link.is_favorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      aria-pressed={link.is_favorite}
      onClick={onToggleFavorite}
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
    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="삭제"
          className="rounded-none text-[#5B6360] hover:bg-destructive/10 hover:text-destructive dark:text-[#9BA39A]"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>링크를 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{link.title}&rdquo; 링크를 삭제하면 되돌릴 수 없어요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
            {isDeleting ? "삭제 중..." : "삭제"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (variant === "list") {
    return (
      <div className="group flex border border-[#23282A] bg-[#EAE2D0] shadow-[3px_3px_0_0_#C7BC9E] transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#C7BC9E] dark:border-[#EAE2D0] dark:bg-[#1B1F1C] dark:shadow-[3px_3px_0_0_#3A413C] dark:hover:shadow-[5px_5px_0_0_#3A413C]">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-1 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0E6B5C] dark:focus-visible:outline-[#35C9A8]"
          >
            {meta}
            {title}
            {memo}
          </a>
          {tags}
        </div>
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

        <div className="flex flex-col gap-2 p-4">
          {meta}
          {title}
          {memo}
        </div>
      </a>

      {tags && <div className="px-4 pb-2">{tags}</div>}

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
