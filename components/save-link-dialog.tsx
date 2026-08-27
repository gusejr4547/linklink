"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { isValidHttpUrl, parseTags } from "@/lib/format-utils";
import { fetchMetadataAction } from "@/lib/actions/metadata";
import { createLink } from "@/lib/actions/links";
import { fieldClass } from "@/lib/ui-classes";
import type { CreateLinkInput, LinkMetadata } from "@/types/link";

type FetchStatus = "idle" | "loading" | "success" | "error";

export interface SaveLinkDialogProps {
  trigger: ReactNode;
}

export function SaveLinkDialog({ trigger }: SaveLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [manualTitle, setManualTitle] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [memo, setMemo] = useState("");
  const fetchIdRef = useRef(0);
  const [isSaving, startSaveTransition] = useTransition();

  const tags = useMemo(() => parseTags(tagsInput), [tagsInput]);

  const resolvedTitle =
    status === "success" ? (metadata?.title ?? "") : status === "error" ? manualTitle.trim() : "";
  const canSave = resolvedTitle.length > 0 && status !== "loading" && !isSaving;

  function resetForm() {
    fetchIdRef.current += 1;
    setUrl("");
    setUrlError(null);
    setStatus("idle");
    setMetadata(null);
    setMetadataError(null);
    setManualTitle("");
    setTagsInput("");
    setMemo("");
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetForm();
  }

  function handleUrlChange(value: string) {
    setUrl(value);
    if (status !== "idle") {
      setStatus("idle");
      setMetadata(null);
      setMetadataError(null);
      setManualTitle("");
    }
    if (urlError) setUrlError(null);
  }

  async function handlePreview() {
    if (!isValidHttpUrl(url)) {
      setUrlError(
        url.trim() === ""
          ? "저장할 링크의 URL을 입력해주세요."
          : "올바른 URL 형식이 아니에요. http:// 또는 https://로 시작하는 주소를 입력해주세요."
      );
      return;
    }
    setUrlError(null);
    setStatus("loading");
    setMetadata(null);
    setMetadataError(null);
    const requestId = fetchIdRef.current + 1;
    fetchIdRef.current = requestId;
    const result = await fetchMetadataAction(url);
    if (fetchIdRef.current !== requestId) return;
    setStatus(result.success ? "success" : "error");
    setMetadata(result.success ? (result.data ?? null) : null);
    setMetadataError(result.success ? null : (result.error ?? "메타데이터를 가져올 수 없어요."));
  }

  function handleUrlKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePreview();
    }
  }

  function handleSave() {
    if (!canSave) return;
    const payload: CreateLinkInput = {
      url,
      title: resolvedTitle,
      thumbnail_url: status === "success" ? (metadata?.thumbnail_url ?? null) : null,
      description: status === "success" ? (metadata?.description ?? null) : null,
      tags,
      memo: memo.trim() || null,
    };
    startSaveTransition(async () => {
      const result = await createLink(payload);
      if (result.success) {
        toast.success("링크를 저장했어요.");
        handleOpenChange(false);
      } else {
        toast.error(result.error ?? "링크 저장에 실패했어요.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-none border-[#23282A] bg-[#EAE2D0] dark:border-[#EAE2D0] dark:bg-[#1B1F1C]">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-display)] text-[#23282A] dark:text-[#EAE2D0]">
            링크 저장
          </DialogTitle>
          <DialogDescription className="text-[#5B6360] dark:text-[#9BA39A]">
            링크의 URL을 입력하면 미리보기를 확인하고 태그와 메모를 추가해 저장할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="save-link-url" className="text-[#23282A] dark:text-[#EAE2D0]">
              URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="save-link-url"
                autoFocus
                placeholder="https://example.com"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onKeyDown={handleUrlKeyDown}
                aria-invalid={urlError ? true : undefined}
                className={fieldClass}
              />
              <Button
                type="button"
                onClick={handlePreview}
                disabled={status === "loading"}
                className="shrink-0 rounded-none bg-[#0E6B5C] text-[#EAE2D0] hover:opacity-90 dark:bg-[#35C9A8] dark:text-[#1B1F1C]"
              >
                {status === "loading" ? "불러오는 중..." : "미리보기"}
              </Button>
            </div>
            {urlError && <p className="text-sm text-destructive">{urlError}</p>}
          </div>

          <div aria-live="polite">
            {status === "loading" && (
              <div className="space-y-2 border border-[#C7BC9E] p-4 dark:border-[#3A413C]">
                <Skeleton className="aspect-video w-full rounded-none bg-[#C7BC9E]/30 dark:bg-[#3A413C]/30" />
                <Skeleton className="h-4 w-3/4 rounded-none bg-[#C7BC9E]/30 dark:bg-[#3A413C]/30" />
                <Skeleton className="h-3 w-1/2 rounded-none bg-[#C7BC9E]/30 dark:bg-[#3A413C]/30" />
              </div>
            )}

            {status === "success" && metadata && (
              <div className="space-y-2 border border-[#C7BC9E] p-4 dark:border-[#3A413C]">
                <div className="relative aspect-video w-full overflow-hidden border border-[#C7BC9E] bg-[#DCE9E4] dark:border-[#3A413C] dark:bg-[#16302A]">
                  {metadata.thumbnail_url ? (
                    <Image
                      src={metadata.thumbnail_url}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 640px, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-[family-name:var(--font-mono)] text-xs tracking-widest text-[#5B6360] dark:text-[#9BA39A]">
                      NO IMAGE
                    </div>
                  )}
                </div>
                <h3 className="font-[family-name:var(--font-body)] font-bold text-[#23282A] dark:text-[#EAE2D0]">
                  {metadata.title}
                </h3>
                {metadata.description && (
                  <p className="text-sm text-[#5B6360] dark:text-[#9BA39A]">{metadata.description}</p>
                )}
              </div>
            )}

            {status === "error" && (
              <div role="alert" className="space-y-3 border border-destructive p-4">
                <div>
                  <p className="font-[family-name:var(--font-body)] font-bold text-destructive">
                    미리보기 정보를 가져오지 못했어요
                  </p>
                  <p className="mt-1 text-sm text-destructive">
                    {metadataError ?? "로그인이 필요하거나 비공개로 설정된 페이지일 수 있어요."} 제목을
                    직접 입력하면 저장할 수 있어요.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="save-link-manual-title" className="text-[#23282A] dark:text-[#EAE2D0]">
                    제목 (직접 입력)
                  </Label>
                  <Input
                    id="save-link-manual-title"
                    placeholder="저장할 링크의 제목을 입력해주세요"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="save-link-tags" className="text-[#23282A] dark:text-[#EAE2D0]">
              태그
            </Label>
            <Input
              id="save-link-tags"
              placeholder="쉼표(,)로 구분해 태그를 입력하세요 (예: 개발, 읽을거리)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={fieldClass}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#DCE9E4] px-2 py-1 text-xs text-[#0E6B5C] dark:bg-[#16302A] dark:text-[#35C9A8]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="save-link-memo" className="text-[#23282A] dark:text-[#EAE2D0]">
              메모
            </Label>
            <Textarea
              id="save-link-memo"
              placeholder="이 링크에 대한 메모를 남겨보세요 (선택)"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              className={fieldClass}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="rounded-none border-[#23282A] bg-transparent text-[#23282A] hover:bg-[#23282A] hover:text-[#EAE2D0] dark:border-[#EAE2D0] dark:text-[#EAE2D0] dark:hover:bg-[#EAE2D0] dark:hover:text-[#1B1F1C]"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="rounded-none bg-[#0E6B5C] text-[#EAE2D0] hover:opacity-90 dark:bg-[#35C9A8] dark:text-[#1B1F1C]"
          >
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
