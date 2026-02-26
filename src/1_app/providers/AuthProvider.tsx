import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/6_shared/config/firebaseConfig'
import { setTokenProvider } from '@/6_shared/api/auth-token-provider'
import { useUserStore } from '@/5_entities/user/model/userStore'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    // 🔥 Token Provider 등록
    setTokenProvider(async () => {
      const user = auth.currentUser
      if (!user) return null
      // console.log("토큰이 제대로 주입되고 있나? : ",await user.getIdToken());

      return await user.getIdToken()
    })

    // 🔥 세션 동기화
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        // console.log("user uid : ", user.uid)
      }
    })

    return () => unsubscribe()
  }, [setUser])

  return <> {children} </>
}

// NOTE
// provider 초기화 순서 보장
// 전역 세션 관리 = app 레이어
