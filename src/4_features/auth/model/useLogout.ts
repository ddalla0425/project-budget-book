import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logoutApi } from '../api/logout'
import { useUserStore } from '@/5_entities/user'

export const useLogout = () => {
  const queryClient = useQueryClient()
  const clearUser = useUserStore((s)=>(s.clearUser))

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {

      console.log('로그아웃 성공!')
      queryClient.clear() // React Query 캐시 전체 삭제 (보안 및 데이터 초기화)
      clearUser() // user 스토어 정보 삭제

      // 추가 보완: 필요 시 로그인 페이지로 리다이렉트
      // window.location.replace('/login');
    },
    onError: (error) => {
      console.error('로그아웃 에러! : ', error)
      // 사용자에게 에러 알림(Toast 등)을 띄우는 로직을 추가하면 좋습니다.
    },
  })
}
