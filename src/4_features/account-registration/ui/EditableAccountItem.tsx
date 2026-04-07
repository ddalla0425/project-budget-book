import { AccountQueueItem } from '@/5_entities/account';
import { Button } from '@/6_shared/ui/button';
import { Grid } from '@/6_shared/ui/grid';
import * as S from './style';
import { AccountFields } from './fields/AccountField';
import { useAccountFormStore } from '../model/form.store';
import type { AccountSaveType } from '@/5_entities/account';
import { useAction } from '../lib/useAction';
import { useState } from 'react';

interface EditableAccountItemProps {
  index: number;
  data: AccountSaveType; // Entity에서 정의한 타입
  bankAccounts: { id: string; name: string; current_balance: number }[];
}

export const EditableAccountItem = ({ index, data, bankAccounts }: EditableAccountItemProps) => {
  const { updateQueueItem, setEditingMode, removeFromQueue, editingIndices } = useAccountFormStore();
  const isEditing = editingIndices.includes(index);
  const [localForm, setLocalForm] = useState<AccountSaveType>(data);
  const updateLocalForm = (callback: (prev: AccountSaveType) => AccountSaveType) => {
    setLocalForm((prev) => callback(prev));
  };
  const { addDetail, removeDetail } = useAction(updateLocalForm);

  const handleCancel = () => {
    setLocalForm(data);
    setEditingMode(index, false);
  };

  const handleSave = () => {
    if (!localForm.user_id) return;

    const isCard = ['CREDIT_CARD', 'CHECK_CARD'].includes(localForm.type);
    if (isCard && !localForm.linked_account_id) {
      alert('연결 계좌를 선택해주세요.');
      return;
    }

    updateQueueItem(index, localForm);
    setEditingMode(index, false);
  };

  return (
    <AccountQueueItem
      data={data}
      bankAccounts={bankAccounts}
      isEditing={isEditing}
      onEditClick={() => setEditingMode(index, true)}
      onRemove={() => removeFromQueue(index)}
      renderEditForm={() => (
        <S.QueueCard $isEditing={true}>
          <AccountFields
            form={localForm}
            updateForm={updateLocalForm}
            onAddDetail={() => addDetail(localForm.type)}
            onRemoveDetail={(idx) => removeDetail(idx, localForm.type)}
            bankAccounts={bankAccounts}
            isCreateMode={false}
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
      )}
    />
  );
};
