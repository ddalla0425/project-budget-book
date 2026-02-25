import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/6_shared/types/supabase'
import { auth } from '@/6_shared/config/firebaseConfig'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// RequestInit 확장 
interface FetchWithAuthOptions extends RequestInit {
  _retry?: boolean
}

// 401시 토큰 갱신용 인증 함수
const fetchWithAuth = async (
  url: string | URL | Request,
  options?: FetchWithAuthOptions,
): Promise<Response> => {
  const token = await auth.currentUser?.getIdToken()
  const headers = new Headers(options?.headers)

  if (token) headers.set('Authorization', `Bearer ${token}`)

  const { _retry, ...restOptions } = options || {} // fetch 가 모르는 속성(_retry)제외 후 전달
  const response = await fetch(url, { ...restOptions, headers })

  // 401 처리 토큰 재발급 후 재요청
  if (response.status === 401 && !_retry) {
    const newToken = await auth.currentUser?.getIdToken(true)
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`)
      return fetch(url, { ...options, headers, _retry: true } as RequestInit)
    }
  }
  return response
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  global: { fetch: fetchWithAuth },
})

/**
 * NOTE
 * - axios를 사용하기로 결정했던 이유는 interceptor로 firebaseSDK의 불안정한 오류등(401시 토큰재발급 맟 재요청 등)을 처리하기 위함이었는데.
 * - supabase로 interceptor 비슷하게 처리할 수 있다면, supabase를 사용하는게 현재 상황(가계부 특성상 복잡한 쿼리사용)에서 더 이점이 있을 것으로 판단! 갈.아.타.자.
 * - 이점 : 메서드 체이닝사용 -> 가독성 증가 / 반환 데이터 타입 실시간 추론 가능
 */
