## 💰 NA BUDGETBOOK (FSD 기반 Serverless 수동 가계부)

```
🙏진행중인 프로젝트라 ReadMe 설명이 간략한 점 양해 부탁드립니다.
```

`"단순한 가계부를 넘어, 효율적인 개발 구조와 DX(Developer Experience)를 실험하는 풀스택 프로젝트입니다."`

본 프로젝트는 1인 개발 환경에서 마주하는 프로젝트 복잡도 증가 문제를 FSD(Feature-Sliced Design) 아키텍처와 AI 기반 자동화 파이프라인을 통해 어떻게 해결하고 최적화할 수 있는지에 초점을 맞추고 있습니다.

보편화되어 있는 자동 가계부 앱들은 실제 결제 금액과 카드 대금 결제 금액을 명확히 분리하지 못해, 신용카드 결제 시점과 대금 출금 시점에 2중으로 지출이 기록되는 회계적 오류를 발생시키곤 합니다. 본 프로젝트는 이러한 현금 흐름의 왜곡을 방지하고, 사용자가 본인의 자산을 완벽하게 통제할 수 있도록 정밀한 수동 트랜잭션 관리를 제공하는 데 목적이 있습니다.

---

## 🚀 Key Engineering Points

### 1. FSD (Feature-Sliced Design) 아키텍처

규모가 커질수록 복잡해지는 프론트엔드 코드의 유지보수성을 확보하기 위해 FSD 철학을 도입했습니다.

- Layers: shared, entities, features, widgets, pages로 관심사를 명확히 분리
- 장점: 모듈 간 결합도를 낮추고, 특정 기능 수정 시 영향 범위를 최소화

### 2. Serverless 생태계 구축 (Supabase)

별도의 백엔드 서버 관리 부담을 줄이고 비즈니스 로직에 집중하기 위해 Serverless 인프라를 활용합니다.

- Database: PostgreSQL 기반의 관계형 데이터 설계 및 RLS(Row Level Security) 적용
- Logic: 복잡한 서버측 연산은 **Edge Functions (Deno)**를 활용하여 처리
- Auth: Firebase Auth와 연동하여 안정적인 인증 시스템 구축

### 3. 복잡한 트랜잭션(Transaction) 무결성 설계

금융 데이터를 다루는 가계부의 특성에 맞춰 데이터의 정합성을 보장합니다.

- 채무 및 할부 관리: 신용카드 할부 및 채무 발생 시 연관된 자산 흐름을 단일 트랜잭션으로 묶어 고아 데이터(Orphan Data)를 방지하는 구조 설계

### 4. AI-Driven DX (Developer Experience)

1인 개발 생산성을 극대화하기 위해 AI 에이전트를 개발 워크플로우에 통합했습니다.

- Commit Pipeline: GEMINI.md에 정의된 룰셋을 기반으로 Gemini CLI가 git diff를 분석하여 커밋 메시지 자동 생성
- AI Pairing: GitHub Copilot 및 Gemini Code Agent를 활용한 보일러플레이트 코드 작성 및 트러블슈팅 가속화

---

## 🛠 Tech Stack

### Frontend

- Core: React, TypeScript, Vite
- State: Zustand (Client State), React Query (Server State)
- Style: Styled Components

### Backend & Infrastructure

- Serverless: Supabase (DB, Edge Functions, Storage)
- Auth: Firebase Authentication
- Deployment: Vercel(예정)

### Tools & DX

- GitHub, AI Models & API (Gemini, Copilot 등 다양한 AI 에이전트 활용을 통한 파이프라인 유연성 확보)

---

## 📂 Project Structure (FSD)

```
src/
├── app/              # 애플리케이션 설정 (Provider, Styles)
│   ├── providers/
│   ├── router/
│   ├── styles/
│   └── App.tsx
├── pages/            # 라우트별 페이지 구성
│   └── slices.../
│       └── segments.../
├── widgets/          # 여러 entity와 feature가 조합된 독립적 컴포넌트
│   ├── header/
│   ├── onboardingModal/
│   └─ slices.../
│       └── segments.../
├── features/         # 유저의 액션과 관련된 비즈니스 로직 (예: 지출 내역 추가)
│   └── slices.../
│       └── segments.../
├── entities/         # 비즈니스 도메인 모델 (예: User, Account, Transaction)
│   └── slices.../
│       └── segments.../
├── shared/           # 프로젝트 전반에 재사용되는 유틸리티, UI 키트 (API Client)
│   ├── api/
│   ├── config/
│   ├── lib/
│   ├── model/
│   ├── styles/
│   ├── types/
│   └── ui/
└── main.tsx

```

---

## 🛠 주요 구현 디테일

### 글로벌 Fetch 커스텀 (Token Refresh)

Serverless 통신 중 발생하는 401 Unauthorized 에러에 대응하기 위해, Supabase 클라이언트의 내부 fetch를 커스텀 래핑했습니다.

- Retry Logic: 토큰 만료 시 자동으로 Refresh Token을 요청
- Seamless UX: 유저의 재로그인 없이 API 요청을 재시도하여 중단 없는 서비스 경험 제공

### 견고한 Currency Formatting 유틸리티

단순한 단위 변환을 넘어, 다양한 국가별 통화 포맷과 예외 상황(Null, 음수 처리 등)에 대한 엄격한 방어 로직(Defense Logic)을 적용하여 금융 데이터 표기의 안정성과 유연성 확보.

### AI 커밋 자동화 시스템

프로젝트 루트의 .husky와 GEMINI.md 설정을 통해 일관된 Git History를 유지합니다.

- Rule: GEMINI.md 내에 커밋 타입(Feat, Fix, Refactor 등) 및 어조 정의
- Automation: Git Diff 분석을 통한 컨벤션 맞춤형 커밋 생성으로 인지적 비용 최소화

---

## 📝 진행 상황 및 로드맵

[x] FSD 아키텍처 폴더 구조 수립

[x] Supabase DB 스키마 설계 및 타입 동기화

[x] 글로벌 Fetch 인터셉터 및 인증 로직 구현

[x] 자산 등록 로직 구현 (자산 타입별 구분)

[x] AI 기반 커밋 자동화 및 페어 프로그래밍 파이프라인 세팅

[ ] 자산 통계 대시보드 위젯 개발 (In Progress)

[ ] 거래원장 등록 로직 구현 (카드 할부 시 채무도 함께 기록하여 하나의 트랜젝션으로 관리)

[ ] 고정지출 등록 로직 구현 및 Edge Function 트리거 추가 (Cron Job)

[ ] AI 지출 패턴 분석 Edge Function 추가 (Planned)
