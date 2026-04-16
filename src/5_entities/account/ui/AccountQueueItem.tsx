import React from 'react';
import { AccountSummary } from './AccountSummary';
import type { AccountSaveType } from '../type/insert.type';

interface AccountQueueItemProps {
  data: AccountSaveType; // 구체적인 타입은 shared나 entities의 type에서 가져옵니다.
  bankAccounts: { id: string; name: string; current_balance: number }[];
  onRemove: () => void;
  // 수정 모드일 때 보여줄 컴포넌트를 외부(Feature)에서 주입받음
  renderEditForm?: (data: AccountSaveType) => React.ReactNode;
  isEditing?: boolean;
  onEditClick?: () => void;
}

export const AccountQueueItem = ({
  data,
  bankAccounts,
  onRemove = () => {},
  renderEditForm,
  isEditing,
  onEditClick = () => {},
}: AccountQueueItemProps) => {
  // 조회 모드일 때
  if (!isEditing) {
    const linkedBank = bankAccounts.find((b) => b.id === data.linked_account_id);
    return <AccountSummary data={data} linkedBank={linkedBank} onEdit={onEditClick} onRemove={onRemove} />;
  }

  // 수정 모드일 때 (Feature가 넣어준 폼을 그대로 렌더링만 함)
  return <>{renderEditForm?.(data)}</>;
};
// // TODO : 수정사항 목록
// /**
//  * 체크 카드: 금액이 보이지 않게
//  * 신용 카드: 금액이 빨간색, 앞에 "현재까지 사용 금액"
//  */
