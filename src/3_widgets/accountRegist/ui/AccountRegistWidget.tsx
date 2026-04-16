import { EmptyMessage, Section } from './style';
import {
  AccountForm,
  AccountQueueActions,
  EditableAccountItem,
  useAccountFormStore,
} from '@/4_features/account-registration';
import { useGetDashboardQuery } from '@/5_entities/account';
import { useUserStore } from '@/5_entities/user';
// import { filterData, type FilterCondition } from "@/6_shared/lib";
import { Alert } from '@/6_shared/ui/alert';
import { Grid } from '@/6_shared/ui/grid';
import { Step } from '@/6_shared/ui/step';
import { useEffect, useMemo, useState } from 'react';

export const AccountRegistWidget = () => {
  const user = useUserStore((s) => s.user);
  const { queue, resetForm } = useAccountFormStore();
  const { data, isLoading, error } = useGetDashboardQuery();
  // const bankData = filterData<AccountListType>(data?.raw.bank,{type:'BANK'} as FilterCondition<AccountListType>)
  // const hasBankData = bankData.length > 0;
  useEffect(() => {
    if (!user?.uid) return;
    resetForm(user?.uid as string);
  }, [user?.uid, resetForm]); // 의존성에 user?.uid 추가가 안전합니다.

  const bankData = useMemo(() => {
    if (!data?.raw.bank) return [];
    return data?.raw.bank.map((bank) => ({
      id: bank.id,
      name: bank.name,
      current_balance: bank.current_balance,
    }));
  }, [data?.raw.bank]);
  const [manualStep, setManualStep] = useState<number | null>(null);
  if (isLoading) return <div> 데이터 로딩중 ... </div>;
  const currentStep = manualStep !== null ? manualStep : bankData.length > 0 ? 2 : 1;
  return (
    <>
      <Step totalSteps={3} currentStep={currentStep} />

      <Grid direction="vertical" gap={40}>
        {error && (
          <div style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
            <Alert message={`데이터를 불러오는 중 문제가 발생했습니다: ${error.message}`} />
          </div>
        )}
        <Grid gap={40}>
          <Section>
            <h2>{currentStep === 1 ? '계좌 정보 입력하기' : ' 내 자산 추가하기'}</h2>
            <AccountForm userId={user?.uid as string} bankAccounts={bankData} onSubmit={() => setManualStep(2)} />
          </Section>

          <Section>
            <h2>등록 대기열 ({queue.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {queue.length > 0 ? (
                queue.map((item, index) => (
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
