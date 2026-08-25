---
name: commit
description: 이모지와 컨벤셔널 커밋 메시지로 잘 포맷된 커밋을 생성한다. 사용자가 "커밋해줘", "커밋 만들어줘", "커밋 생성", "/commit" 등을 요청할 때 사용한다.
---

# Commit

이모지와 컨벤셔널 커밋 메시지로 잘 포맷된 커밋을 생성한다.

## 프로세스

1. 스테이지된 파일 확인 — 스테이지된 파일이 있으면 해당 파일만 커밋한다. 사용자가 이미 리뷰하고 골라둔 범위이므로 임의로 다른 파일을 추가하지 않는다.
2. diff를 분석해 서로 다른 관심사(기능/버그/문서 등)가 섞여 있는지 확인한다.
3. 섞여 있다면 분할해서 커밋한다 (아래 "분할 기준" 참고).
4. 이모지 컨벤셔널 포맷으로 커밋 메시지를 작성하고 커밋한다.

## 언어

커밋 메시지는 한국어로 작성한다 (이 저장소의 컨벤션).

## 커밋 포맷

`<이모지> <타입>: <설명>`

**예시:**

- Input: 로그인 시 세션 만료 오류 수정
  Output: `🐛 fix: 로그인 시 세션 만료 오류 수정`
- Input: 참여자 목록에 정렬 기능 추가
  Output: `✨ feat: 참여자 목록 정렬 기능 추가`
- Input: README의 오타 수정
  Output: `📝 docs: README 오타 수정`

**타입:**

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서화
- `style`: 포맷팅
- `refactor`: 코드 리팩토링
- `perf`: 성능 개선
- `test`: 테스트
- `chore`: 빌드/도구

**규칙과 이유:**

- 명령형 어조 ("추가" not "추가됨") — 커밋은 "이 변경을 적용하면 무엇을 하는가"를 설명하는 명령이지 완료 보고가 아니다.
- 첫 줄 72자 미만 — `git log --oneline`, GitHub 목록 뷰 등에서 잘리지 않고 한눈에 읽히게 하기 위함.
- 원자적 커밋 (단일 목적) — 커밋 하나가 하나의 이유로만 존재해야 `git revert`나 `git bisect`로 그 변경만 되돌리거나 원인을 정확히 추적할 수 있다.
- 관련 없는 변경사항은 분할 — 무관한 변경을 한 커밋에 묶으면 위와 같은 이유로 되돌리기/추적이 불가능해진다.

## 이모지 맵

✨ feat | 🐛 fix | 📝 docs | 💄 style | ♻️ refactor | ⚡ perf | ✅ test | 🔧 chore | 🚀 ci | 🚨 warnings | 🔒️ security | 🚚 move | 🏗️ architecture | ➕ add-dep | ➖ remove-dep | 🌱 seed | 🧑‍💻 dx | 🏷️ types | 👔 business | 🚸 ux | 🩹 minor-fix | 🥅 errors | 🔥 remove | 🎨 structure | 🚑️ hotfix | 🎉 init | 🔖 release | 🚧 wip | 💚 ci-fix | 📌 pin-deps | 👷 ci-build | 📈 analytics | ✏️ typos | ⏪️ revert | 📄 license | 💥 breaking | 🍱 assets | ♿️ accessibility | 💡 comments | 🗃️ db | 🔊 logs | 🔇 remove-logs | 🙈 gitignore | 📸 snapshots | ⚗️ experiment | 🚩 flags | 💫 animations | ⚰️ dead-code | 🦺 validation | ✈️ offline

## 분할 기준

다음 중 하나라도 해당하면 여러 커밋으로 나눈다: 서로 다른 관심사 | 혼합된 타입(예: feat + docs) | 무관한 파일 패턴 | 리뷰하기엔 너무 큰 변경사항

## 참고사항

- 스테이지된 파일이 있으면 해당 파일만 커밋한다.
- 분할 여부 판단을 위해 diff를 먼저 분석한다.
- 커밋에 Claude 서명이나 Co-Authored-By를 추가하지 않는다 — 이 저장소의 커밋 작성자는 항상 실제 사용자로 유지한다.
