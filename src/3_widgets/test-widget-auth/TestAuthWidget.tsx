import { useJoin } from '@/4_features/auth/model/useJoin'
import { useUserStore } from '@/5_entities/user'

// 회원가입과 로그인 로그아웃을 위한 테스트 위젯
export const TestAuthWidget = () => {
  const user = useUserStore((s) => s.user)

  const { dbUser, isLoading, isError, error } = useJoin()

  return (
    <>
      <div
        style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}
      >
        {!user ? (
          <p>로그인이 필요합니다.</p>
        ) : (
          <>
            <h2>내 프로필 정보 (DB)</h2>
            {isLoading && <p>로딩 중...</p>}
            {isError && <p>에러: {error?.message}</p>}
            {dbUser ? (
              <pre
                style={{ textAlign: 'left', background: '#eee', color: '#333' }}
              >
                {JSON.stringify(dbUser, null, 2)}
              </pre>
            ) : (
              !isLoading && <p>로그인 후 정보를 확인하세요.</p>
            )}
          </>
        )}
      </div>
    </>
  )
}
