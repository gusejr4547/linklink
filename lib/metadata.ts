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

const YOUTUBE_HOSTNAMES = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
]);

function extractYoutubeVideoId(parsed: URL): string | null {
  const hostname = parsed.hostname.toLowerCase();
  if (!YOUTUBE_HOSTNAMES.has(hostname)) return null;

  if (hostname === "youtu.be") {
    return parsed.pathname.slice(1).split("/")[0] || null;
  }

  const vParam = parsed.searchParams.get("v");
  if (vParam) return vParam;

  const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/]+)/);
  if (shortsMatch) return shortsMatch[1];

  const embedMatch = parsed.pathname.match(/^\/embed\/([^/]+)/);
  if (embedMatch) return embedMatch[1];

  return null;
}

interface YoutubeOEmbedResponse {
  title?: string;
  thumbnail_url?: string;
}

async function fetchYoutubeOEmbed(url: string): Promise<LinkMetadata | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembedUrl, {
      signal: AbortSignal.timeout(TIMEOUT_SECONDS * 1000),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as YoutubeOEmbedResponse;
    if (!data.title) return null;

    return {
      title: data.title,
      description: null,
      thumbnail_url: data.thumbnail_url || null,
    };
  } catch (err) {
    console.error("YouTube oEmbed fetch error:", err);
    return null;
  }
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

  // 유튜브는 워치 페이지 스크래핑이 배포 환경(서버리스 IP)에서 봇 탐지에 걸리기 쉬워
  // 공식 oEmbed API를 우선 사용하고, 실패(비공개/삭제된 영상 등)할 때만 일반 스크래핑으로 폴백한다.
  if (extractYoutubeVideoId(parsed)) {
    const oembedResult = await fetchYoutubeOEmbed(url);
    if (oembedResult) {
      return { success: true, data: oembedResult };
    }
  }

  try {
    const { error, result } = await ogs({
      url,
      timeout: TIMEOUT_SECONDS,
      fetchOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          // 유튜브가 동의 화면(consent wall) 대신 실제 페이지의 OG 태그를 반환하도록 함
          Cookie: "CONSENT=YES+1",
        },
      },
    });

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
