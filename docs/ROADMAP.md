# LinkLink 개발 로드맵

흩어져 쌓이기만 하는 링크를 한곳에 저장하고, 태그·메모·읽음 상태로 다시 찾을 수 있게 하는 개인용 링크 아카이브.

## 개요

LinkLink는 "저장은 쉬운데 다시 찾기가 안 되는" 1인 사용자를 위한 링크 저장·검색 서비스로 다음 기능을 제공합니다:

- **링크 저장/삭제 (F001)**: URL을 붙여넣어 저장하고 목록에서 개별 삭제
- **메타데이터 자동 수집 (F002)**: OG 태그로 제목/설명/썸네일 자동 채움, 실패 시 제목 수동 입력
- **태그·메모 (F003, F004)**: 자유 텍스트 태그로 분류하고, 저장 이유를 메모로 남김
- **읽음/즐겨찾기 토글 (F005, F006)**: 카드에서 바로 상태 전환
- **검색 및 필터 (F007)**: 제목/메모/태그 텍스트 검색 + 태그·읽음상태·즐겨찾기 조합 필터

> 참고 문서: [`docs/PRD.md`](./PRD.md)

## 현재 상태 (시작 지점)

신규 개발 범위를 정확히 잡기 위해 기존 코드베이스에서 이미 확보된 것과 그렇지 않은 것을 구분합니다.

**이미 있는 것**
- ✅ **F000 인증**: Supabase Auth 기반 회원가입/로그인/로그아웃/비밀번호 재설정 (`app/auth/**`, `components/login-form.tsx`, `components/sign-up-form.tsx`, `components/logout-button.tsx`) — 신규 개발 대상 아님
- ✅ **세션 보호**: `proxy.ts` + `lib/supabase/proxy.ts`로 비로그인 접근 시 `/auth/login` 리다이렉트
- ✅ **Supabase 클라이언트**: `lib/supabase/client.ts`(브라우저), `lib/supabase/server.ts`(서버)
- ✅ **다크모드**: `next-themes` 기반 `components/theme-switcher.tsx`
- ✅ **기본 shadcn/ui**: `button`, `card`, `input`, `label`, `badge`, `checkbox`, `dropdown-menu`

**아직 없는 것**
- Tailwind CSS 4 (현재 `3.4.1` + `tailwind.config.ts` + `autoprefixer` 조합)
- `links` 테이블 (Supabase `public` 스키마 비어 있음)
- 링크 관련 페이지·컴포넌트·타입 일체
- 스타터 템플릿 잔여물 (`components/tutorial/**`, `hero.tsx`, `deploy-button.tsx`, `next-logo.tsx`, `supabase-logo.tsx`)

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-tailwind-v4-upgrade.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `012`라면 `011`과 `010`을 예시로 참조
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능 구현
- **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 인프라 정비 및 애플리케이션 골격 구축

기능 코드를 쓰기 전에 빌드 환경을 정리하고, 전체 화면 구조와 타입 계약을 먼저 확정합니다. 이 단계에서는 실제 데이터 연동을 하지 않습니다.

- ✅ **Task 001: Tailwind CSS 4 업그레이드 및 스타터 정리** - 우선순위
  - `tailwindcss@4` + `@tailwindcss/postcss` 설치, `autoprefixer`·`postcss.config.mjs` 정리
  - `tailwind.config.ts`의 테마 토큰을 `app/globals.css`의 `@theme inline` 블록으로 이관 후 config 파일 제거
  - `tailwindcss-animate` → `tw-animate-css` 교체, `@custom-variant dark` 로 다크모드 전환 방식 이관
  - `components.json`의 `tailwind.config` 빈 값 유지 확인 및 shadcn/ui 컴포넌트 렌더링 회귀 확인
  - 스타터 잔여 컴포넌트 제거: `components/tutorial/**`, `hero.tsx`, `deploy-button.tsx`, `next-logo.tsx`, `supabase-logo.tsx`
  - 완료 기준: `npm run build` 성공 + 기존 인증 화면 4종의 시각적 깨짐 없음

- ✅ **Task 002: 라우트 구조 및 공통 레이아웃 골격 구성**
  - 랜딩(`/`), 링크 목록 홈(`/links`) 라우트 확정 및 빈 껍데기 페이지 생성
  - 기존 `app/protected/**`를 링크 목록 페이지 기준으로 재구성 (또는 `/links`로 이관 후 제거)
  - `lib/supabase/proxy.ts`의 리다이렉트 규칙을 새 라우트에 맞게 수정 (로그인 후 목적지 = 링크 목록)
  - 로그인 사용자용 공통 헤더 컴포넌트 골격 구현 (서비스명, 로그아웃 버튼, 테마 스위처)
  - 랜딩 → 회원가입 → 로그인 → 링크 목록으로 이어지는 이동 경로가 클릭만으로 끊김 없이 통과되는지 확인

- ✅ **Task 003: 타입 정의 및 데이터 모델 설계**
  - `types/link.ts`에 `Link` 인터페이스 정의 (id, user_id, url, title, thumbnail_url, description, tags, memo, is_read, is_favorite, created_at)
  - 링크 생성 입력 타입(`CreateLinkInput`), 메타데이터 수집 결과 타입(`LinkMetadata`) 정의
  - 검색·필터 상태 타입(`LinkFilter`: 검색어, 선택 태그, 읽음상태, 즐겨찾기) 정의
  - Server Action 반환 규격 통일 타입(`ActionResult<T>`: 성공/실패 + 에러 메시지) 정의
  - `links` 테이블 DDL 초안 작성 (마이그레이션 실행은 Task 008에서 수행)

- ✅ **Task 003-1: profiles 테이블 및 사용자 데이터 동기화 트리거 설계 (제안)**
  - Supabase 공식 [managing-user-data](https://supabase.com/docs/guides/auth/managing-user-data) 가이드를 따른 인프라 확장. PRD 9절 `[가정]` 항목 근거 — F001~F007 어떤 기능에도 매핑되지 않는 아키텍처 정비
  - `types/profile.ts`에 `Profile` 인터페이스 정의 (id, display_name, avatar_url, created_at, updated_at)
  - `types/database.ts`에 `PROFILES_TABLE_DDL` 추가: `profiles` 테이블 + `updated_at` 자동 갱신 트리거 + `auth.users` insert 시 자동 동기화하는 `handle_new_user()` 트리거
  - 1인 개인용 서비스 특성상 공식 예시의 `anon` SELECT 권한은 제외하고 본인 행만 select/update 가능하도록 RLS 설계 (초안 주석, 실제 적용은 links 테이블과 함께 Task 008에서 수행)

### Phase 2: UI/UX 완성 (더미 데이터 활용)

모든 화면을 하드코딩된 더미 데이터로 완성합니다. 이 단계가 끝나면 DB 없이도 전체 사용자 흐름을 클릭으로 체험할 수 있어야 합니다.

- ✅ **Task 004: 컴포넌트 기반 정비 및 더미 데이터 준비**
  - 추가 shadcn/ui 컴포넌트 설치: `dialog`, `textarea`, `select`, `skeleton`, `sonner`(토스트), `alert-dialog`(삭제 확인)
  - `lib/dummy-links.ts`에 다양한 케이스를 포함한 더미 링크 데이터 작성 (썸네일 있음/없음, 메모 있음/없음, 태그 0~5개, 읽음/안읽음, 즐겨찾기)
  - 공통 표시 유틸 작성: 상대 시간 포맷, URL → 도메인 추출, 태그 문자열 파싱(쉼표 구분 → `string[]`)
  - `next.config.ts`에 외부 썸네일 도메인 허용 설정 (또는 `next/image` 미사용 결정 후 대체 처리 명시)

- ✅ **Task 005: 랜딩 페이지 UI 구현**
  - 서비스 소개 문구 및 로그인/회원가입 진입 버튼 배치 (정적 화면, 기능 없음)
  - 비로그인 전용 헤더 구성 (로그인, 회원가입)
  - 이미 로그인된 상태로 접근 시 링크 목록으로 안내하는 동선 처리
  - 반응형 레이아웃 적용

- ✅ **Task 006: 링크 목록 페이지 UI 구현 (더미 데이터)**
  - 링크 카드 컴포넌트 구현: 썸네일, 제목, 도메인, 메모, 태그 배지, 읽음/즐겨찾기/삭제 버튼
  - 카드 클릭 시 새 탭으로 원본 URL 열기 (`target="_blank"` + `rel="noopener noreferrer"`), 버튼 클릭은 카드 클릭과 분리
  - 목록 그리드 레이아웃 및 `created_at` 내림차순 정렬 표시
  - 빈 상태(링크 0개) 안내 UI + 저장 버튼 노출
  - 검색·필터바 UI 구현: 검색 입력, 태그 선택, 읽음상태 선택, 즐겨찾기 토글 (동작은 더미 상태로만)
  - 로딩 스켈레톤 UI 준비

- ✅ **Task 007: 링크 저장 모달 UI 구현 (더미 데이터)**
  - `dialog` 기반 저장 모달 구현: URL 입력 → 메타데이터 미리보기 영역 → 태그/메모 입력 → 저장
  - 메타데이터 수집 중 로딩 상태, 수집 성공 미리보기(썸네일/제목), 수집 실패 시 제목 수동 입력 폼 전환 UI를 모두 화면상으로 구현
  - URL 형식 오류 등 인라인 에러 메시지 표시 영역 정의
  - 태그 입력 UX 확정: 쉼표 구분 자유 텍스트 입력 + 입력 중 태그 배지 미리보기
  - 반응형 및 모바일에서의 모달 동작 확인

### Phase 3: 핵심 기능 구현 (F001~F007)

더미 데이터를 실제 Supabase 데이터로 교체하며 기능을 하나씩 연결합니다. 의존성 순서상 스키마가 가장 먼저, 검색·필터가 마지막입니다.

- ✅ **Task 008: links 테이블 및 데이터 액세스 레이어 구축**
  - Supabase 마이그레이션(`create_links_table`)으로 `links` 테이블 생성 (PK `id` uuid, `user_id` → `auth.users.id` FK, `tags` text[] not null default '{}', `is_read`/`is_favorite` boolean not null default false, `created_at` timestamptz not null default now())
  - RLS 활성화 및 기본 정책 4종 적용: 본인 `user_id` 행에 대해서만 select/insert/update/delete 허용
  - 인덱스 3종 추가: `idx_links_user_id`, `idx_links_created_at`(DESC), `idx_links_tags`(GIN)
  - `types/database.types.ts` 생성 후 `types/link.ts`의 `Link` 타입을 `Database["public"]["Tables"]["links"]["Row"]`에서 파생하도록 정렬
  - `lib/queries/links.ts`에 `getLinks(filter?: LinkFilter)` 작성 — 서버 컴포넌트/액션에서 사용, 검색어·태그·읽음상태·즐겨찾기 필터 지원
  - 테스트: 실제 테스트 계정 2개로 RLS 격리 검증(각 사용자가 본인 링크만 조회됨) 후 정리, `pg_indexes`/`pg_policies`/보안 어드바이저로 스키마 확인, lint·tsc 통과

- ✅ **Task 009: F001 링크 저장/삭제 기능 구현**
  - `createLink` Server Action 구현: URL 유효성 검사 → 인증 사용자 확인 → insert → `revalidatePath`
  - `deleteLink` Server Action 구현 + 삭제 확인 다이얼로그 연결
  - 링크 목록 페이지를 더미 데이터에서 실제 조회 결과로 교체, 빈 상태 분기 연결
  - 저장/삭제 성공·실패 토스트 처리 및 모달 자동 닫힘 처리
  - 저장 중 중복 제출 방지 (pending 상태 버튼 비활성화)
  - 테스트: Playwright MCP로 저장 → 목록 노출 → 삭제 → 목록에서 사라짐 플로우 검증, 잘못된 URL 입력 시 에러 메시지 검증

- ✅ **Task 010: F002 메타데이터 자동 수집 구현**
  - `open-graph-scraper` 설치 및 서버 전용 래퍼 작성 (`lib/metadata.ts`)
  - URL 입력 후 미리보기 요청을 처리하는 Server Action 또는 Route Handler 구현
  - OG `title`/`description`/`image`를 파싱해 미리보기에 반영하고, 저장 시 `title`/`description`/`thumbnail_url`에 기록
  - 실패·타임아웃 처리: 요청 타임아웃 설정, 실패 시 제목 수동 입력 폼으로 폴백 전환 (재시도 로직은 범위 외)
  - SSRF 방지를 위한 최소 방어: `http`/`https` 스킴만 허용, 내부망 주소 차단
  - 테스트: Playwright MCP로 OG 태그가 있는 URL(수집 성공)과 없는 URL(수동 폴백) 두 경로를 모두 검증

- ✅ **Task 011: F003 태그 및 F004 메모 저장 연동**
  - 쉼표 구분 입력을 `string[]`으로 정규화 (공백 트림, 빈 값 제거, 중복 제거, 대소문자 정책 확정)
  - 태그 배열 및 메모를 `createLink`에 연결하고 카드에 실제 값 렌더링
  - 사용자가 보유한 태그 목록을 집계해 필터바 선택지에 공급 (별도 마스터 테이블 없이 `links.tags`에서 도출)
  - 카드의 태그 배지 클릭 시 해당 태그 필터가 적용되는 동선 연결
  - 테스트: Playwright MCP로 태그·메모 포함 저장 후 카드 표시 및 태그 배지 클릭 필터링 검증

- ✅ **Task 012: F005 읽음 및 F006 즐겨찾기 토글 구현**
  - `toggleRead`, `toggleFavorite` Server Action 구현 (본인 소유 행만 update)
  - 카드 버튼에 연결하고 낙관적 업데이트(`useOptimistic`) 적용, 실패 시 원상 복구 및 토스트 안내
  - 읽음/안읽음, 즐겨찾기 상태에 따른 카드 시각적 구분 확정
  - 자동 읽음 처리는 도입하지 않음 (수동 토글 유지)
  - 테스트: Playwright MCP로 토글 후 새로고침해도 상태가 유지되는지 검증

- **Task 013: F007 검색 및 필터 구현**
  - 텍스트 검색 구현: `title`, `memo`, `tags` 대상 부분 일치 검색
  - 필터 구현: 태그 선택, 읽음상태(전체/읽음/안읽음), 즐겨찾기 전용 보기
  - 검색어와 필터의 조합 동작 정의 (AND 결합) 및 URL 쿼리스트링과 동기화하여 새로고침·뒤로가기 시 상태 유지
  - 검색 입력 디바운스 처리 및 결과 없음 상태 UI 연결
  - 필터 전체 초기화 동작 제공
  - 테스트: Playwright MCP로 검색어+태그+읽음상태 조합 필터 결과 정확성, 결과 0건 상태, 필터 초기화 검증

- **Task 013-1: 핵심 기능 통합 테스트**
  - Playwright MCP로 전체 사용자 여정 E2E 검증: 회원가입 → 로그인 → 빈 상태 → 저장 → 검색·필터 → 토글 → 삭제 → 로그아웃
  - 비로그인 상태에서 링크 목록 직접 접근 시 로그인 리다이렉트 확인
  - 엣지 케이스 점검: 매우 긴 제목/URL, 썸네일 로드 실패, 태그 0개, 메모 미입력, 특수문자 검색어
  - 에러 핸들링 점검: 메타데이터 수집 타임아웃, 네트워크 실패 시 Server Action 오류 표시
  - 발견된 결함은 해당 Task 파일에 회귀 항목으로 기록 후 수정

### Phase 4: 마감 및 배포

- **Task 014: 사용자 경험 마감 및 접근성 정리**
  - 전 페이지 로딩·에러·빈 상태 일관성 정리 (`loading.tsx`, `error.tsx`)
  - 반응형 최종 점검 (모바일/태블릿/데스크톱) 및 다크모드 대비 확인
  - 키보드 접근성 및 포커스 관리 점검 (모달 포커스 트랩, 토글 버튼 `aria-label`)
  - 메타데이터·파비콘·OG 이미지 등 스타터 기본값을 LinkLink 기준으로 교체

- **Task 015: Vercel 배포 및 실사용 검증**
  - Vercel 프로젝트 연결 및 환경 변수 설정, 프로덕션 빌드 검증
  - Supabase 인증 리다이렉트 URL을 배포 도메인 기준으로 갱신
  - 배포 환경에서 Playwright MCP 스모크 테스트 수행 (저장 → 검색 → 토글 → 삭제)
  - PRD의 `[확인 필요]` 항목 재확인: OG 수집 실패 사이트(로그인 필요 페이지, SNS 비공개 게시물)에서 수동 입력 폴백이 실사용상 충분한지 판단하고 결과를 PRD에 반영

## 범위 밖 (의도적으로 미루는 것)

PRD 8절에 따라 아래 항목은 이번 로드맵에 포함하지 않습니다. 필요성이 확인되면 새 Task로 추가합니다.

- 페이지네이션·무한스크롤 등 목록 성능 최적화
- RLS 정책 세분화, Rate limiting
- 메타데이터 수집 실패 재시도/큐 처리
- 자동화 테스트 코드 커버리지 (Playwright MCP 수동 검증으로 대체)
- 모바일 앱/PWA
- 키워드 자동 추출/AI 분석, 리마인드 알림, 트리형 카테고리, 소셜 로그인, 링크 공유
