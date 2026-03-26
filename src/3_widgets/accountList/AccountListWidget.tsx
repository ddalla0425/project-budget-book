import { ACCOUNT_TYPE_LABELS, AccountTotal, type AccountListType, type AccountType } from '@/5_entities/account';
import { useMemo, useState } from 'react';
import { filterData, type FilterCondition } from '@/6_shared/lib';
import type { AccountRelation } from '@/5_entities/account';
import { mapAccountRelations } from '@/5_entities/account';
import { Tab } from '@/6_shared/ui/tab';
import { Grid } from '@/6_shared/ui/grid';
import styled from 'styled-components';

interface AccountListProps {
  accounts: AccountListType[];
  totalBalance: number;
  relations: AccountRelation[]; // 구체적인 타입 정의 권장
}

const WidgetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
`;

const SubTitle = styled.div`
  font-weight: bold;
  color: #4597f1;
  margin-bottom: 20px;
`;

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  & > div:not(${SubTitle}) {
    padding: 20px;
    background: #f1f1f1;
    border-radius: 10px;

    p {
      margin-bottom: 0;
    }
  }
`;

export const AccountListWidget = ({ accounts, totalBalance, relations }: AccountListProps) => {
  const [filter, setFilter] = useState<AccountType | 'ALL'>('ALL');
  const relationsMap = useMemo(() => mapAccountRelations(relations), [relations]);

  const TAB_OPTIONS = useMemo(() => {
    const defaultOption = { value: 'ALL', label: '전체' };

    // 필요한 유형만 필터링해서 보여주고 싶다면 여기서 선택 가능합니다.
    const types = Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    }));

    return [defaultOption, ...types];
  }, []);

  const filteredAccounts =
    filter === 'ALL'
      ? accounts
      : filterData<AccountListType>(accounts, {
          type: filter,
        } as FilterCondition<AccountListType>);

  const currentTab = TAB_OPTIONS.find((option) => option.value === filter);

  return (
    <WidgetContainer>
      <Grid>
        <AccountTotal totalAmount={totalBalance} label={'💰 총 자산 합계'} />
      </Grid>

      {/* 카테고리 탭 예시 */}
      {/* <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['ALL', 'BANK', 'CHECK_CARD', 'CREDIT_CARD', 'CASH', 'PAY'] as const).map((type) => (
          <button key={type} onClick={() => setFilter(type)}>
            {type}
          </button>
        ))}
      </div> */}
      <Grid selectCols="100px 1fr" gap={40}>
        <Tab options={TAB_OPTIONS} direction="vertical" currentValue={filter} onChange={setFilter} />

        <ListContainer>
          <SubTitle>{currentTab ? currentTab.label : '전체'}</SubTitle>
          {/* 필터 버튼 및 리스트 렌더링 로직... */}
          {filteredAccounts.map((account) => (
            <div key={account.id}>
              <div>
                <strong>{account.name}</strong>
                <span> ({account.type})</span>
              </div>
              <p>{account.type === 'CHECK_CARD' ? '' : `${account.current_balance.toLocaleString()} 원`}</p>

              {/* 이제 relations에 안전하게 접근 가능합니다. */}
              {account.type.includes('CARD') && relationsMap.cardToBank[account.id] && (
                <div style={{ fontSize: '12px', color: '#007bff' }}>
                  결제계좌: {relationsMap.cardToBank[account.id].name} <br />
                  계좌잔액: {relationsMap.cardToBank[account.id].current_balance}
                </div>
              )}

              {/* 추가: 페이머니에 연결된 포인트 계좌도 보여줄 수 있죠 */}
              {account.type === 'PAY' && relationsMap.payToPoint[account.id] && (
                <div style={{ fontSize: '12px', color: '#28a745' }}>
                  연결포인트: {relationsMap.payToPoint[account.id].name}
                </div>
              )}
            </div>
          ))}
        </ListContainer>
      </Grid>
    </WidgetContainer>
  );
};
