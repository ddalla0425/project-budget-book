import React, { useEffect, useState } from 'react';
import * as S from './AccountUI.style';
import { useAccountStore } from '../model/accountStore';
import type { TablesInsert } from '@/6_shared/types';
import { Grid } from '@/6_shared/ui/grid';
import { Button } from '@/6_shared/ui/button';
import { AccountSummary } from './AccountSummary';
import { AccountFields } from './AccountField';

interface AccountQueueItemProps {
  index: number;
  data: TablesInsert<'accounts'>;
  bankAccounts: { id: string; name: string }[];
}

export const AccountQueueItem = ({ index, data, bankAccounts }: AccountQueueItemProps) => {
  const { updateQueueItem, setEditingMode, removeFromQueue } = useAccountStore();
  const [isEditing, setIsEditing] = useState(false);
  const [localForm, setLocalForm] = useState<TablesInsert<'accounts'>>(data);

  // 💡 만약 부모로부터 전달받는 데이터가 변경될 경우 로컬 상태도 동기화
  useEffect(() => {
    setLocalForm(data);
  }, [data]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditingMode(index, true); // 스토어에 "수정 중" 상태 알림 (Form 버튼 비활성화용)
  };

  const handleCancel = () => {
    setLocalForm(data); // 원래 데이터로 복구
    setIsEditing(false);
    setEditingMode(index, false);
  };

  const handleSave = () => {
    // 저장 시점에 데이터 검증
    if (!localForm.user_id) {
      console.error('User ID missing in account data');
      return;
    }

    // 유효성 검사 (카드인 경우 연결 계좌 필수)
    const isCard = localForm.type === 'CREDIT_CARD' || localForm.type === 'CHECK_CARD';
    if (isCard && !localForm.linked_account_id) {
      alert('연결 계좌를 선택해주세요.');
      return;
    }

    updateQueueItem(index, localForm); // 스토어 업데이트
    setIsEditing(false);
    setEditingMode(index, false);
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setLocalForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value,
    }));
  };

  if (!isEditing) {
    const linkedBank = bankAccounts.find((b) => b.id === data.linked_account_id);

    return (
      <AccountSummary
        data={data}
        linkedBankName={linkedBank?.name}
        onEdit={handleEditClick}
        onRemove={() => removeFromQueue(index)}
      />
    );
  }

  // 수정 모드 (Fields + Action Buttons)
  return (
    <S.QueueCard $isEditing={true}>
      <AccountFields
        form={localForm}
        onChange={handleLocalChange}
        bankAccounts={bankAccounts}
        isCreateMode={false} // 수정 모드임을 명시
      />

      <Grid style={{ marginTop: '12px' }}>
        <Button onClick={handleSave} style={{ background: '#4dabf7' }}>
          저장
        </Button>
        <Button onClick={handleCancel} variant="secondary">
          취소
        </Button>
      </Grid>
    </S.QueueCard>
  );
};
