"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fieldClass } from "@/lib/ui-classes";
import { Heart, RotateCcw, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const ALL_TAGS = "all-tags";
const SEARCH_DEBOUNCE_MS = 500;

export function SearchFilterBar({ tags }: { tags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const selectedTag = searchParams.get("tag") ?? ALL_TAGS;
  const readStatus = searchParams.get("read") ?? "all";
  const favoriteOnly = searchParams.get("fav") === "true";

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);

  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setSearchQuery(urlQuery);
  }

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "all" || value === ALL_TAGS) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const query = params.toString();
    router.push(query ? `/links?${query}` : "/links", { scroll: false });
  }

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateParams({ q: value.trim() || null });
  }, SEARCH_DEBOUNCE_MS);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    debouncedSearch(value);
  }

  function handleReset() {
    debouncedSearch.cancel();
    setSearchQuery("");
    router.push("/links", { scroll: false });
  }

  return (
    <div className="flex flex-col gap-3 border border-[#C7BC9E] bg-[#EAE2D0] p-4 dark:border-[#3A413C] dark:bg-[#1B1F1C] md:flex-row md:flex-wrap md:items-center">
      <div className="relative flex-1 md:min-w-[220px]">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#5B6360] dark:text-[#9BA39A]" />
        <Input
          placeholder="제목, 메모, 태그로 검색"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={`${fieldClass} pl-9`}
        />
      </div>

      <Select value={selectedTag} onValueChange={(v) => updateParams({ tag: v })}>
        <SelectTrigger className={`${fieldClass} w-full md:w-[140px]`}>
          <SelectValue placeholder="태그" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="rounded-none border-[#23282A] bg-[#EAE2D0] text-[#23282A] dark:border-[#EAE2D0] dark:bg-[#1B1F1C] dark:text-[#EAE2D0]"
        >
          <SelectItem value={ALL_TAGS}>전체 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag} value={tag}>
              #{tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={readStatus} onValueChange={(v) => updateParams({ read: v })}>
        <SelectTrigger className={`${fieldClass} w-full md:w-[120px]`}>
          <SelectValue placeholder="읽음 상태" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="rounded-none border-[#23282A] bg-[#EAE2D0] text-[#23282A] dark:border-[#EAE2D0] dark:bg-[#1B1F1C] dark:text-[#EAE2D0]"
        >
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="read">읽음</SelectItem>
          <SelectItem value="unread">안읽음</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        aria-pressed={favoriteOnly}
        onClick={() => updateParams({ fav: favoriteOnly ? null : "true" })}
        className={`rounded-none border-[#23282A] dark:border-[#EAE2D0] ${
          favoriteOnly
            ? "bg-[#23282A] text-[#EAE2D0] dark:bg-[#EAE2D0] dark:text-[#1B1F1C]"
            : "bg-transparent text-[#23282A] hover:bg-[#23282A] hover:text-[#EAE2D0] dark:text-[#EAE2D0] dark:hover:bg-[#EAE2D0] dark:hover:text-[#1B1F1C]"
        }`}
      >
        <Heart className={favoriteOnly ? "fill-current" : ""} />
        즐겨찾기만
      </Button>

      <Button
        variant="ghost"
        onClick={handleReset}
        className="rounded-none text-[#5B6360] hover:bg-transparent hover:text-[#23282A] dark:text-[#9BA39A] dark:hover:text-[#EAE2D0]"
      >
        <RotateCcw className="size-4" />
        초기화
      </Button>
    </div>
  );
}
