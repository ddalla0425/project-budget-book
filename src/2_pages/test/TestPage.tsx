import { useGetAccount } from '@/5_entities/account';
import { useUserStore } from '@/5_entities/user';

export const TestPage = () => {
  const user = useUserStore((s) => s.user);
  const { data, isLoading, error } = useGetAccount(user?.uid);
  console.log('가져온 bank 데이터 : ', data?.banks);
  console.log('가져온 card 데이터 : ', data?.cards);
  console.log('가져온 bankToCard 데이터 : ', data?.relations.bankToCards);
  console.log('가져온 CardToBank 데이터 : ', data?.relations.cardToBank);

  return (
    <>
      <div>로그인 : {user?.displayName}</div>
      <div>account 입력 및 조회 테스트</div>
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
      {/* <AccountForm/> */}
    </>
  );
};
