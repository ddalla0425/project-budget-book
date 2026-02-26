import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../api/user.api'
import type { TablesInsert } from '@/6_shared/types/supabase'

export const useGetUser = (userId?: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      console.log('--- 쿼리문 API 호출 시작 ---')
      const data = await userApi.getUser(userId!)
      return data
    },
    enabled: !!userId && userId !== '', // userId가 존재 할대만 쿼리 실행
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newUser: TablesInsert<'users'>) => {
      console.log('--- 뮤테이션문 API 호출 시작 ---')
      const data = await userApi.createUser(newUser)
      return data
    },
    onSuccess: (data) => {
      console.log('유저 생성 성공:', data)
      queryClient.invalidateQueries({ queryKey: ['user', data.id] }) // 유저 생성 성공 -> 기존 getUser 쿼리 무효화 -> 최신 데이터 다시 가져오게 트리거
    },
    onError: (error) => {
      console.error('유저 생성 중 에러 발생:', error)
    },
  })
}
