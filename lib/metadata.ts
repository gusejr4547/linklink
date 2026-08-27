import ogs from "open-graph-scraper";
import type { LinkMetadata } from "@/types/link";

const TIMEOUT_SECONDS = 10;

const BLOCKED_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^169\.254\./, // link-local, AWS/GCP/Azure 메타데이터 서버 포함
  /^10\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^192\.168\./,
  /^\[?::1\]?$/,
  /^\[?fc00:/i, // IPv6 unique local
  /^\[?fe80:/i, // IPv6 link-local
];

function isBlockedHostname(hostname: string): boolean {
  return BLOCKED_HOSTNAME_PATTERNS.some((pattern) => pattern.test(hostname));
}

export type MetadataFetchResult =
  | { success: true; data: LinkMetadata }
  | { success: false; error: string };

export async function fetchLinkMetadata(url: string): Promise<MetadataFetchResult> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { success: false, error: "올바른 URL 형식이 아니에요." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { success: false, error: "http/https URL만 지원해요." };
  }

  if (isBlockedHostname(parsed.hostname)) {
    return { success: false, error: "내부망 주소는 사용할 수 없어요." };
  }

  try {
    const { error, result } = await ogs({ url, timeout: TIMEOUT_SECONDS });

    if (error) {
      return { success: false, error: "메타데이터를 가져올 수 없어요." };
    }

    const title = result.ogTitle || result.twitterTitle || "";
    if (!title) {
      return { success: false, error: "제목을 찾을 수 없어요." };
    }

    return {
      success: true,
      data: {
        title,
        description: result.ogDescription || result.twitterDescription || null,
        thumbnail_url: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || null,
      },
    };
  } catch (err) {
    console.error("Metadata fetch error:", err);
    return { success: false, error: "메타데이터를 가져올 수 없어요." };
  }
}
