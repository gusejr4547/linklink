"use server";

import { fetchLinkMetadata } from "@/lib/metadata";
import type { ActionResult, LinkMetadata } from "@/types/link";

export async function fetchMetadataAction(url: string): Promise<ActionResult<LinkMetadata>> {
  const result = await fetchLinkMetadata(url);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, error: result.error };
}
