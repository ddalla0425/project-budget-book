import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    // 모든 query 옵션 정의부
    queries: {
      staleTime: 60 * 1000,
      gcTime: 1000 * 60 * 60,
      retry: 1,
    },
    // 모든 mutation 옵션 정의부
    mutations: {
      retry: 1,
    },
  },
})

// TODO : 리엑트 쿼리 버전 UP 시켜야 하는 이유가 있는가 고민 해보기
/**
 *  NOTE
 * 1. 패키지 크기 작아짐
 * 2. 가독성 향상 : useQuery 인자 전달 방식 객체 형태로 통일 -> 읽기 편해짐
 * 3. 기능 향상 : SSR 지원이 더 강력해짐, 비동기 처리가 더 안정적이어 짐.
 *
 * => ㅎㅎ 업데이트 하장 -> refetchOnWindowFocus: true 는 기본값이라 생략함.
 */
