import { useGetAccount } from "@/5_entities/account";
import { useUserStore } from "@/5_entities/user";

export const AccountListPage = () => {
     const user = useUserStore((s) => s.user);
      const { data, isLoading, error } = useGetAccount(user?.uid);
  return (
    <>
      <h2>Account 조회 페이지</h2>

      <div>
        {!user ? (
          <p>로그인이 필요합니다.</p>
        ) : (
          <>
            <h2>내 자산 정보 (DB)</h2>
            {isLoading && <p>로딩 중...</p>}
            {error && <p>에러: {error?.message}</p>}
            {data ? (
              <pre style={{ textAlign: 'left', background: '#eee', color: '#333' }}>
                <div>계좌정보</div>
                {JSON.stringify(data.banks, null, 2)}
                <div>카드 정보</div>
                {JSON.stringify(data.cards, null, 2)}
                <div>계좌에 연결된 카드 정보</div>
                {JSON.stringify(data.relations.bankToCards, null, 2)}
                <div>카드에 연결된 계좌 정보</div>
                {JSON.stringify(data.relations.cardToBank, null, 2)}
              </pre>
            ) : (
              !isLoading && <p>로그인 후 정보를 확인하세요.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};
