"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidHttpUrl } from "@/lib/format-utils";
import type { ActionResult, CreateLinkInput } from "@/types/link";

export async function createLink(
  input: CreateLinkInput
): Promise<ActionResult<{ id: string }>> {
  const url = input.url.trim();
  const title = input.title.trim();

  if (!isValidHttpUrl(url)) {
    return { success: false, error: "올바른 URL을 입력해주세요." };
  }
  if (!title) {
    return { success: false, error: "제목을 입력해주세요." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const { data, error } = await supabase
    .from("links")
    .insert({
      user_id: user.id,
      url,
      title,
      thumbnail_url: input.thumbnail_url ?? null,
      description: input.description ?? null,
      tags: input.tags ?? [],
      memo: input.memo ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, error: "링크 저장에 실패했습니다." };
  }

  revalidatePath("/links");
  return { success: true, data: { id: data.id } };
}

export async function deleteLink(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: "링크 삭제에 실패했습니다." };
  }

  revalidatePath("/links");
  return { success: true };
}
