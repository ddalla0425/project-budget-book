import { LoginButton, LogoutButton } from '@/4_features/auth'
import { TestAuthWidget } from '@/3_widgets/test-widget-auth/TestAuthWidget'
import { useUserStore } from '@/5_entities/user'

// 회원가입 을 위한 테스트 페이지
export const TestPage = () => {
  const user = useUserStore((s) => s.user)
  return (
    <>
      <h1>Vite + React</h1>
      {!user ? <LoginButton /> : <LogoutButton />}
      <TestAuthWidget />
    </>
  )
}
