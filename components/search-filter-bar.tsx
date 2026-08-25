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
import { Heart, RotateCcw, Search } from "lucide-react";

const fieldClass =
  "rounded-none border-[#23282A] bg-transparent text-[#23282A] placeholder:text-[#5B6360] focus-visible:ring-0 focus-visible:border-[#0E6B5C] dark:border-[#EAE2D0] dark:text-[#EAE2D0] dark:placeholder:text-[#9BA39A] dark:focus-visible:border-[#35C9A8] dark:bg-transparent";

export function SearchFilterBar({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-col gap-3 border border-[#C7BC9E] bg-[#EAE2D0] p-4 dark:border-[#3A413C] dark:bg-[#1B1F1C] md:flex-row md:flex-wrap md:items-center">
      <div className="relative flex-1 md:min-w-[220px]">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#5B6360] dark:text-[#9BA39A]" />
        <Input
          placeholder="제목, 메모, 태그로 검색"
          className={`${fieldClass} pl-9`}
        />
      </div>

      <Select defaultValue="all-tags">
        <SelectTrigger className={`${fieldClass} w-full md:w-[140px]`}>
          <SelectValue placeholder="태그" />
        </SelectTrigger>
        <SelectContent className="rounded-none border-[#23282A] bg-[#EAE2D0] text-[#23282A] dark:border-[#EAE2D0] dark:bg-[#1B1F1C] dark:text-[#EAE2D0]">
          <SelectItem value="all-tags">전체 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag} value={tag}>
              #{tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className={`${fieldClass} w-full md:w-[120px]`}>
          <SelectValue placeholder="읽음 상태" />
        </SelectTrigger>
        <SelectContent className="rounded-none border-[#23282A] bg-[#EAE2D0] text-[#23282A] dark:border-[#EAE2D0] dark:bg-[#1B1F1C] dark:text-[#EAE2D0]">
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="read">읽음</SelectItem>
          <SelectItem value="unread">안읽음</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        className="rounded-none border-[#23282A] bg-transparent text-[#23282A] hover:bg-[#23282A] hover:text-[#EAE2D0] dark:border-[#EAE2D0] dark:text-[#EAE2D0] dark:hover:bg-[#EAE2D0] dark:hover:text-[#1B1F1C]"
      >
        <Heart className="size-4" />
        즐겨찾기만
      </Button>

      <Button
        variant="ghost"
        className="rounded-none text-[#5B6360] hover:bg-transparent hover:text-[#23282A] dark:text-[#9BA39A] dark:hover:text-[#EAE2D0]"
      >
        <RotateCcw className="size-4" />
        초기화
      </Button>
    </div>
  );
}
