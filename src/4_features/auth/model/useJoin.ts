import { useEffect } from 'react'
import { useUserStore } from '@/5_entities/user/model/userStore'
import { useCreateUser, useGetUser } from '@/5_entities/user'

export const useJoin = () => {
  const user = useUserStore((s) => s.user)
  const {
    data: dbUser,
    isLoading: isQueryLoading,
    error: queryError,
  } = useGetUser(user?.uid)
  const {
    mutate: createUser,
    isPending: isMutationLoading,
    isError: isMutationError,
    error: mutationError,
  } = useCreateUser()

  useEffect(() => {
    if (!isQueryLoading && dbUser === null && user?.uid) {
      const now = new Date().toISOString()
      createUser({
        id: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        created_at: now,
        updated_at: now,
      })
    }
  }, [dbUser, isQueryLoading, user, createUser])

  return {
    dbUser,
    isLoading: isQueryLoading || isMutationLoading,
    isError: !!queryError || isMutationError,
    error: queryError || mutationError,
  }
}
