import { useGetDashboardQuery } from '@/5_entities/account';
import {
  AccountForm,
  useAccountFormStore,
  AccountQueueActions,
  EditableAccountItem, // ★ 새로 만든 feature 컴포넌트 임포트
} from '@/4_features/account-registration';

import { useEffect, useMemo, useState } from 'react';
import { useUserStore } from '@/5_entities/user';
import { Grid } from '@/6_shared/ui/grid';
import { Step } from '@/6_shared/ui/step';
import { Alert } from '@/6_shared/ui/alert';
import { EmptyMessage, Section } from './style';

export const AccountCreatePage = () => {
  const user = useUserStore((s) => s.user);
  const { queue, resetForm } = useAccountFormStore();
  const { data, isLoading, error } = useGetDashboardQuery();

  useEffect(() => {
    if (!user?.uid) return;
    resetForm(user?.uid as string);
  }, [user?.uid, resetForm]); // 의존성에 user?.uid 추가가 안전합니다.

  const bankData = useMemo(() => {
    return (
      data?.raw.bank.map((bank) => ({
        id: bank.id,
        name: bank.name,
        current_balance: bank.current_balance,
      })) || []
    );
  }, [data?.raw.bank]);

  const hasBankAccounts = bankData.length > 0;
  const [step, setStep] = useState(!hasBankAccounts ? 1 : 2);

  if (isLoading) return <div> 데이터 로딩중 ... </div>;

  // 2. 렌더링 부분 수정
  return (
    <>
      <Step totalSteps={3} currentStep={step} />

      <Grid direction="vertical" gap={40}>
        {error && (
          <div style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
            <Alert message={`데이터를 불러오는 중 문제가 발생했습니다: ${error.message}`} />
          </div>
        )}
        <Grid gap={40}>
          <Section>
            <h2>{step === 1 ? '계좌 정보 입력하기' : ' 내 자산 추가하기'}</h2>
            <AccountForm userId={user?.uid as string} bankAccounts={bankData} onSubmit={() => setStep(2)} />
          </Section>

          <Section>
            <h2>등록 대기열 ({queue.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {queue.length > 0 ? (
                queue.map((item, index) => (
                  /* ★ 여기서 EditableAccountItem으로 교체하고 key를 강화합니다 */
                  <EditableAccountItem
                    key={`${index}-${item.user_id}-${item.name}`}
                    index={index}
                    data={item}
                    bankAccounts={bankData}
                  />
                ))
              ) : (
                <EmptyMessage>
                  대기열이 비어있습니다. <br /> 왼쪽 폼에서 자산을 추가해 보세요!
                </EmptyMessage>
              )}
            </div>
          </Section>
        </Grid>

        <AccountQueueActions />
      </Grid>
    </>
  );
};
