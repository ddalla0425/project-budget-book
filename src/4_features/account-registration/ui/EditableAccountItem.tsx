import React, { useState } from 'react';
import { AccountQueueItem } from '@/5_entities/account';
import { Button } from '@/6_shared/ui/button';
import { Grid } from '@/6_shared/ui/grid';
import * as S from './style';
import { AccountFields } from './fields/AccountField';
import { useAccountFormStore } from '../model/form.store';
import type { AccountSaveType } from '@/5_entities/account';
import { normalizeAccountValue } from '../lib/utils';

interface EditableAccountItemProps {
  index: number;
  data: AccountSaveType; // Entity에서 정의한 타입
  bankAccounts: { id: string; name: string }[];
}

export const EditableAccountItem = ({ index, data, bankAccounts }: EditableAccountItemProps) => {
  const { updateQueueItem, setEditingMode, removeFromQueue, editingIndices } = useAccountFormStore();
  const isEditing = editingIndices.includes(index);
  const [localForm, setLocalForm] = useState<AccountSaveType>(data);

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

  const handleDetailChange = (field: string, value: string | number | boolean) => {
    setLocalForm((prev) => {
      if (Array.isArray(prev.details)) return prev;

      return {
        ...prev,
        details: { ...prev.details, [field]: value },
      } as AccountSaveType;
    });
  };

  const handleMainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    const finalValue =
      type === 'number' ? normalizeAccountValue(name, (e.target as HTMLInputElement).valueAsNumber) : value;

    setLocalForm((prev) => ({ ...prev, [name]: finalValue }) as AccountSaveType);
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
            onChange={handleMainChange}
            onDetailChange={handleDetailChange}
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
