import { AccountForm, useAccountStore, useGetAccount } from '@/5_entities/account';
import { AccountQueueActions } from '@/5_entities/account/ui/AccountQueueActions';
import { AccountQueueItem } from '@/5_entities/account/ui/AccountQueueItem';
import { useUserStore } from '@/5_entities/user';
import type { Tables } from '@/6_shared/types';
import { Alert } from '@/6_shared/ui/alert';
import { Grid } from '@/6_shared/ui/grid';
import { useEffect, useMemo } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  h2 {
    font-size: 1.1rem;
    margin-bottom: 20px;
    padding-bottom: 10px;
    color: #333;
  }
`;

const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #999;
  border: 2px dashed #eee;
  border-radius: 12px;
  font-size: 0.9rem;
`;

export const AccountCreatePage = () => {
  const user = useUserStore((s) => s.user);

  const { queue, resetForm } = useAccountStore();
  const { data, isLoading, error } = useGetAccount(user?.uid);
  useEffect(() => {
    resetForm(user?.uid as string);
  }, [resetForm]);

  console.log('페이지 레이어에서 찍는 bankData : ', data?.banks);
  const bankData = useMemo(() => {
    return (
      data?.banks?.map((bank: Tables<'accounts'>) => ({
        id: bank.id,
        name: bank.name,
        current_balance: bank.current_balance,
      })) || []
    );
  }, [data?.banks]);

  console.log('페이지 레이어에서 찍는 bankData : ', bankData);

  if (isLoading) return <div> 데이터 로딩중 ... </div>;

  return (
    <>
      <Grid direction='vertical' gap={40}>
        {error && (
          <div style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
            <Alert message={`데이터를 불러오는 중 문제가 발생했습니다: ${error.message}`} />
          </div>
        )}
        <Grid gap={40}>
          {/* 1. 입력 영역 (AccountForm) */}
          <Section>
            <h2>내 자산 추가하기</h2>
            <AccountForm
              userId={user?.uid as string}
              bankAccounts={bankData}
              onSubmit={(data) => console.log('최종 제출 데이터:', data)}
            />
          </Section>

          {/* 2. 대기열 확인 영역 (AccountQueueItem) */}
          <Section>
            <h2>등록 대기열 ({queue.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {queue.length > 0 ? (
                queue.map((item, index) => (
                  <AccountQueueItem key={`${index}-${item.name}`} index={index} data={item} bankAccounts={bankData} />
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
