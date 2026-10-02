# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트

LinkLink — 흩어진 링크를 한곳에 저장하고 태그·메모·읽음 상태로 다시 찾을 수 있게 하는 1인 사용자용 링크 아카이브 서비스.

- 전체 요구사항: docs/PRD.md
- 개발 로드맵 및 작업 워크플로우: docs/ROADMAP.md

## 기술 스택 관련 주의사항

- **Tailwind CSS v4** 사용 중. `tailwind.config.ts` 없음 — 테마 토큰은 `app/globals.css`의 `@theme inline` 블록, 다크모드는 `@custom-variant dark`.
- shadcn/ui는 "new-york" 스타일, `@/components`·`@/lib`·`@/hooks` 별칭 사용. 설치된 컴포넌트는 `components/ui/`에서 확인하고, 없는 것은 `npx shadcn add`로 설치.
- `next.config.ts`의 `cacheComponents: true`로 인해 Server Action에서 캐시되지 않은 데이터는 `<Suspense>`로 감싸야 함.
- `proxy.ts`(루트)가 Next.js 프록시(구 미들웨어) 역할을 하며 `lib/supabase/proxy.ts`의 `updateSession`으로 비로그인 접근을 `/auth/login`으로 리다이렉트함.
- `.mcp.json`에 Supabase MCP 서버와 `taskmaster-ai` MCP 서버가 연결되어 있고, `.claude/settings.json`에 `playwright` 플러그인이 활성화되어 있음.
- Supabase Auth의 **Email Confirm(이메일 인증)이 꺼져 있음** — 회원가입 시 실제 이메일을 받아 확인할 필요 없이 가입 즉시 로그인 가능. 관련 플로우 테스트 시 이메일 인증 대기 단계를 넣지 말 것.

## 커맨드

- `npm run dev` / `npm run build` / `npm run start` / `npm run lint`
- 별도 테스트 스크립트 없음 — 코드 레벨 검증(lint·타입체크)과 E2E 검증은 `test-verifier` 서브에이전트(`.claude/agents/test/test-verifier.md`)에 위임한다.

## 개발 워크플로우 (docs/ROADMAP.md + Taskmaster 기준)

- 작업 목록과 상태는 Taskmaster MCP(`.taskmaster/tasks/tasks.json`)로 관리한다. 새 작업을 시작할 때는 `next_task` 또는 `get_task`로 대상 태스크를 확인하고 `set_task_status`로 `in-progress`로 표시.
- 각 태스크의 `details`(구현 단계)와 `testStrategy`(검증 방법) 필드를 명세로 삼아 구현한다.
- **API 연동·비즈니스 로직 또는 사용자가 상호작용하는 UI(신규 컴포넌트·페이지·인터랙션 흐름)를 구현한 뒤에는 반드시 `test-verifier` 서브에이전트를 호출해 검증(lint·타입체크 + Playwright MCP E2E)을 위임하고, 그 리포트가 통과일 때만 다음 단계로 진행할 것.** 메인 세션이 직접 Playwright MCP를 호출하지 말고 위임할 것. 단순 스타일·텍스트 수정처럼 상호작용이 없는 변경에는 적용하지 않는다. 임의로 건너뛰지 말 것.
- `test-verifier`는 코드를 수정하지 않고 `set_task_status`도 호출하지 않는다 — 검증 결과는 `update_subtask`로 기록만 남긴다. 완료 판정(`done` 처리)은 검증 통과를 확인한 메인 세션의 몫이다.
- 진행 중 특이사항이나 발견 사항은 `update_subtask`(서브태스크가 있는 경우)로 기록한다.
- 태스크 완료 시 `set_task_status`로 `done` 표시하고, `docs/ROADMAP.md`의 해당 항목도 ✅로 동기화한다.
- 각 단계 완료 후에는 중단하고 사용자의 추가 지시를 기다릴 것 — 다음 단계로 자동으로 이어가지 말 것.

## Git

- 1인 개발 프로젝트 — 브랜치/PR 없이 `master`에 직접 커밋.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
