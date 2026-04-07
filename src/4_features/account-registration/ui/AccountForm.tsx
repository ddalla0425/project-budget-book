import React, { useEffect } from 'react';
import * as S from './style';
import { Button } from '@/6_shared/ui/button';
import { AccountFields } from './fields/AccountField';
import { useAccountFormStore } from '../model/form.store';
import type { AccountInsertType } from '@/5_entities/account';
import { useAction } from '../lib/useAction';
import { useInstitutionStore } from '@/5_entities/institution';

interface Props {
  userId: string;
  bankAccounts: { id: string; name: string }[];
  onSubmit: (data: AccountInsertType) => void;
  isLoading?: boolean;
}

export const AccountForm = ({ userId, bankAccounts }: Props) => {
  const { form, updateForm, setForm, addQueue, changeType, resetForm, editingIndices } = useAccountFormStore();
  const institutions = useInstitutionStore((s) => s.institutions);
  const currentInstitutionName = institutions.find((inst) => inst.id === form.institution_id)?.name || '';
  const { addDetail, removeDetail, handleAddToQueue } = useAction(updateForm, addQueue);
  const isEditingAny = editingIndices.length > 0;
  const isCard = form.type === 'CREDIT_CARD' || form.type === 'CHECK_CARD';
  const hasBankAccounts = bankAccounts.length > 0;

  // 컴포넌트 마운트시 초기화
  useEffect(() => {
    resetForm(userId);
    if (hasBankAccounts) setForm({ type: 'BANK' });
  }, [userId, resetForm, hasBankAccounts, setForm]);

  // 대기열에 추가
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 카드를 선택했는데 연결 계좌가 없는 경우 방어 로직
    if (isCard && !hasBankAccounts && !form.linked_account_id) {
      alert('연결 계좌를 선택해주세요.');
      return;
    }

    // 🌟 1+1 자동 생성 의사 묻기
    let shouldCreatePoint = false;
    if (form.type === 'PAY') {
      // const displayName = currentInstitutionName || '페이';
      // shouldCreatePoint = window.confirm(
      //   `💡 ${displayName} 자산을 등록하셨네요!\n연동되는 [포인트] 자산도 대기열에 함께 추가할까요?\n(예: ${displayName} 포인트)`
      // );
      // 1. 현재 폼 데이터의 디테일에서 연결된 포인트 ID가 있는지 확인합니다.
      // (배열일 수도 있고 객체일 수도 있으므로 안전하게 추출)
      const payDetails = Array.isArray(form.details) ? form.details[0] : form.details;
      const hasLinkedPoint = !!payDetails?.linked_point_account_id;

      // 2. 이미 연결된 포인트가 없다면(!hasLinkedPoint) 그때만 물어봅니다!
      if (!hasLinkedPoint) {
        const displayName = currentInstitutionName || '페이';
        shouldCreatePoint = window.confirm(
          `💡 ${displayName} 자산을 등록하셨네요!\n연동되는 [포인트] 자산도 대기열에 함께 추가할까요?\n(예: ${displayName} 포인트)`
        );
      }
    }

    // 🌟 4. 스토어의 addQueue로 옵션 객체를 전달합니다.
    handleAddToQueue(form, {
      createLinkedPoint: shouldCreatePoint,
      institutionName: currentInstitutionName,
    });
  };

  return (
    <S.FormContainer onSubmit={handleSubmit}>
      <AccountFields
        form={form}
        bankAccounts={bankAccounts}
        isCreateMode={true}
        onAddDetail={() => addDetail(form.type)}
        onRemoveDetail={(idx) => removeDetail(idx, form.type)}
        updateForm={updateForm}
        onTypeChange={changeType}
      />

      {/* 계좌 없는데 카드를 선택한 경우 : 버튼 비활성화 */}
      <Button type="submit" disabled={isEditingAny || (isCard && !hasBankAccounts)} style={{ width: '100%' }}>
        {isEditingAny ? <p> 항목 수정을 먼저 완료해 주세요.</p> : <p>대기열에 추가</p>}
      </Button>
    </S.FormContainer>
  );
};
