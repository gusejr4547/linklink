"use client";

import { LinkCard } from "@/components/link-card";
import { Button } from "@/components/ui/button";
import type { Link } from "@/types/link";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { useState } from "react";

export function LinkList({ links }: { links: Link[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-mono)] text-xs text-[#5B6360] dark:text-[#9BA39A]">
          {links.length}개의 링크
        </span>
        <div className="flex border border-[#23282A] dark:border-[#EAE2D0]">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="그리드 보기"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
            className={`rounded-none hover:bg-[#DCE9E4] dark:hover:bg-[#16302A] ${
              view === "grid"
                ? "bg-[#DCE9E4] text-[#0E6B5C] dark:bg-[#16302A] dark:text-[#35C9A8]"
                : "text-[#5B6360] dark:text-[#9BA39A]"
            }`}
          >
            <LayoutGrid />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="리스트 보기"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={`rounded-none border-l border-[#23282A] hover:bg-[#DCE9E4] dark:border-[#EAE2D0] dark:hover:bg-[#16302A] ${
              view === "list"
                ? "bg-[#DCE9E4] text-[#0E6B5C] dark:bg-[#16302A] dark:text-[#35C9A8]"
                : "text-[#5B6360] dark:text-[#9BA39A]"
            }`}
          >
            <ListIcon />
          </Button>
        </div>
      </div>

      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col gap-3"
        }
      >
        {links.map((link) => (
          <LinkCard key={link.id} link={link} variant={view} />
        ))}
      </div>
    </div>
  );
}
