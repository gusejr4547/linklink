import { extractDomain } from "@/lib/format-utils";
import type { LinkMetadata } from "@/types/link";

const GATED_HOST_KEYWORDS = ["instagram.com", "x.com", "twitter.com", "facebook.com"];
const GATED_PATH_KEYWORDS = ["login", "signin"];

function isGatedUrl(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  const host = parsed.hostname.toLowerCase();
  const path = parsed.pathname.toLowerCase();
  return (
    GATED_HOST_KEYWORDS.some((keyword) => host.includes(keyword)) ||
    GATED_PATH_KEYWORDS.some((keyword) => path.includes(keyword))
  );
}

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash % 1000;
}

// 더미 메타데이터 수집 시뮬레이션. 지연 시간만 랜덤이고 성공/실패 여부는
// URL에 대해 결정적으로 판정한다 — 로그인 필요 페이지, SNS 비공개 게시물 등
// 실제 OG 수집이 실패하기 쉬운 케이스(PRD 9절)를 재현해 두 경로를 QA에서
// 안정적으로 재현할 수 있게 한다.
export function simulateFetchMetadata(url: string): Promise<LinkMetadata | null> {
  const delay = 800 + Math.floor(Math.random() * 400);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (isGatedUrl(url)) {
        resolve(null);
        return;
      }
      const domain = extractDomain(url);
      resolve({
        title: `${domain}에서 저장한 페이지`,
        description: "자동으로 수집된 페이지 설명이에요. (더미 데이터)",
        thumbnail_url: `https://picsum.photos/seed/${hashSeed(url)}/400/225`,
      });
    }, delay);
  });
}
