import { AccountListWidget } from '@/3_widgets/accountList/AccountListWidget';
import { useGetDashboardQuery } from '@/5_entities/account';
import { useUserStore } from '@/5_entities/user';
import { calculateData } from '@/6_shared/lib';

export const AccountListPage = () => {
  const user = useUserStore((s) => s.user);
  const { data, isLoading, error } = useGetDashboardQuery();

  if (isLoading) return <div>로딩 중...</div>;

  if (!data || (!data.raw.bank.length && !data.raw.bank.length)) {
    return <div>등록된 자산 정보가 없습니다.</div>;
  }

  if (error) return <div>에러: {error?.message}</div>;

  const allAccounts = data.flatList;
  const totalBalance = calculateData(allAccounts, 'current_balance', 'SUM');

  return (
    <>
      <h2>Account 조회 페이지</h2>

      <div>
        {!user ? (
          <p>로그인이 필요합니다.</p>
        ) : (
          <>
            <AccountListWidget accounts={allAccounts} totalBalance={totalBalance} relations={data.raw.relations} />
          </>
        )}
      </div>
    </>
  );
};
