import { useOnboardingModal } from '@/3_widgets/onboardingModal';
import { useGetAccount } from '@/5_entities/account';
import { useUserStore } from '@/5_entities/user';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const user = useUserStore((s) => s.user);

  const { data, isLoading, isSuccess } = useGetAccount(user?.uid);
  const { openOnboarding } = useOnboardingModal();
  useEffect(() => {
    const hasNoAccount = !data?.banks || data.banks.length === 0;
    if (isSuccess && hasNoAccount) {
      openOnboarding();
    }
  }, [isSuccess, data, openOnboarding]);

  if (isLoading) return <div>데이터를 확인 중입니다...</div>;

  return (
    <>
      <h2>Dashboard</h2>
      <div>
        <Link to={'/test'}>TEST</Link>
      </div>
      <div>
        <Link to={'/account'}>Account</Link>
      </div>
      <div>
        <Link to={'/mypage'}>Mypage</Link>
      </div>
    </>
  );
};
