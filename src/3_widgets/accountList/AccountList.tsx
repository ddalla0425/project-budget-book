import { AccountTotal, type AccountListType, type AccountType } from '@/5_entities/account';
import { useMemo, useState } from 'react';
import { filterData, type FilterCondition } from '@/6_shared/lib';
import type { AccountRelation } from '@/5_entities/account';
import { mapAccountRelations } from '@/5_entities/account';

interface AccountListProps {
  accounts: AccountListType[];
  totalBalance: number;
  relations: AccountRelation[]; // 구체적인 타입 정의 권장
}

export const AccountListWidget = ({ accounts, totalBalance, relations }: AccountListProps) => {
  const [filter, setFilter] = useState<AccountType | 'ALL'>('ALL');
  const relationsMap = useMemo(() => mapAccountRelations(relations), [relations]);
  const filteredAccounts =
    filter === 'ALL'
      ? accounts
      : filterData<AccountListType>(accounts, {
          type: filter,
        } as FilterCondition<AccountListType>);

  return (
    <div>
      <section>
        <AccountTotal totalAmount={totalBalance} label={'💰 총 자산 합계'} />
      </section>

      {/* 카테고리 탭 예시 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['ALL', 'BANK', 'CHECK_CARD', 'CREDIT_CARD', 'CASH', 'PAY'] as const).map((type) => (
          <button key={type} onClick={() => setFilter(type)}>
            {type}
          </button>
        ))}
      </div>

      {/* 필터 버튼 및 리스트 렌더링 로직... */}
      {filteredAccounts.map((account) => (
        <div key={account.id}>
          <div>
            <strong>{account.name}</strong>
            <span> ({account.type})</span>
          </div>
          <p>{account.current_balance.toLocaleString()}원</p>

          {/* 이제 relations에 안전하게 접근 가능합니다. */}
          {account.type.includes('CARD') && relationsMap.cardToBank[account.id] && (
            <div style={{ fontSize: '12px', color: '#007bff' }}>
              결제계좌: {relationsMap.cardToBank[account.id].name}
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
    </div>
  );
};
