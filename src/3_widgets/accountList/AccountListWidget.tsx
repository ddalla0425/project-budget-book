import {
  ACCOUNT_TYPE_LABELS,
  AccountTotal,
  DEBT_TYPE_LABELS,
  type AccountListType,
  type AccountType,
} from '@/5_entities/account';
import { useMemo, useState } from 'react';
import { filterData, type FilterCondition } from '@/6_shared/lib';
import type { AccountRelation } from '@/5_entities/account';
import { mapAccountRelations } from '@/5_entities/account';
import { Tab } from '@/6_shared/ui/tab';
import { Grid } from '@/6_shared/ui/grid';

import { Button } from '@/6_shared/ui/button';
import { useNavigate } from 'react-router-dom';
import * as S from './style';

interface AccountListProps {
  accounts: AccountListType[];
  totalBalance: number;
  relations: AccountRelation[]; // 구체적인 타입 정의 권장
}

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
  const navigate = useNavigate();
  return (
    <S.WidgetContainer>
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

        <S.ListContainer>
          <Grid selectCols="1fr 90px">
            <S.SubTitle>{currentTab ? currentTab.label : '전체'}</S.SubTitle>
            <Button deviceSize="sm" variant="primary" onClick={() => navigate('/account/create')}>
              자산 추가 +
            </Button>
          </Grid>
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
              {/* 포인트에 연결된 페이 */}
              {account.type === 'POINT' && relationsMap.pointToPay[account.id] && (
                <div style={{ fontSize: '12px', color: '#28a745' }}>
                  연결페이: {relationsMap.pointToPay[account.id].name}
                </div>
              )}
              {/* 부채에 연결된 자산 */}
              {account.type === 'DEBT' && (
                <div style={{ fontSize: '12px', color: '#dc3545' /* 부채니까 살짝 붉은색 추천! */ }}>
                  {/* 1. 담보 자산이 있을 때만 렌더링 */}
                  {relationsMap.debtToAsset[account.id] && (
                    <>
                      채무 출처 담보자산: {relationsMap.debtToAsset[account.id].name} <br />
                    </>
                  )}
                  {/* 2. 채무 종류는 자기 자신의 details에서 꺼내옴 (배열 방어 로직 포함) */}
                  채무 종류:{' '}
                  {Array.isArray(account.details) && account.details.length > 0
                    ? DEBT_TYPE_LABELS[account.details[0].debt_type as keyof typeof DEBT_TYPE_LABELS] ||
                      account.details[0].debt_type
                    : account.details?.debt_type
                      ? DEBT_TYPE_LABELS[account.details.debt_type as keyof typeof DEBT_TYPE_LABELS] ||
                        account.details.debt_type
                      : '기타 채무'}
                </div>
              )}
            </div>
          ))}
        </S.ListContainer>
      </Grid>
    </S.WidgetContainer>
  );
};

//  TODO : 나중에 유형별 색상 맞추기
