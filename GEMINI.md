# System

이 설정은 상위 폴더의 전역 `GEMINI.md` 규칙을 따르며, 현재 프로젝트(budget-book-front)의 구체적인 컨텍스트를 추가합니다.

**[프로젝트 개요 및 기술 스택]**

- 이 프로젝트는 서버리스 아키텍처를 기반으로 한 **가계부 애플리케이션 프론트엔드**야.
- 기술 스택: React, TypeScript, Vite, React Query, Zustand, Styled Components.
- 백엔드 및 인증: Supabase DB, Firebase Auth.
- 특이사항: 인증 토큰 갱신 및 401 에러 재시도 로직은 Axios 인터셉터가 아닌, Supabase 클라이언트의 전역 `fetch` 함수 내부에 커스텀으로 구현되어 있음.

AI는 코드를 제안하거나 리뷰할 때, 반드시 위 기술 스택(상태 관리는 Zustand, 데이터 패칭은 React Query 등)의 Best Practice를 반영해야 하며, 가계부 도메인의 특성(금액 계산, 날짜 처리 등)을 고려해야 해.
