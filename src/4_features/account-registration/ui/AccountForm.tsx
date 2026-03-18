import React, { useEffect } from 'react';
import * as S from './style';
import { Button } from '@/6_shared/ui/button';
import { AccountFields } from './fields/AccountField';
import { useAccountFormStore, type AccountFormState } from '../model/form.store';
import type { AccountInsertType, CardDetailInsert, CashDetailInsert } from '@/5_entities/account';
import { INITIAL_DETAILS } from '../constants/accountInitialValues';

interface Props {
  userId: string;
  bankAccounts: { id: string; name: string }[];
  onSubmit: (data: AccountInsertType) => void;
  isLoading?: boolean;
}

export const AccountForm = ({ userId, bankAccounts }: Props) => {
  const { form, setForm, updateForm, addQueue, resetForm, editingIndices } = useAccountFormStore();
  const isEditingAny = editingIndices.length > 0;
  const isCard = form.type === 'CREDIT_CARD' || form.type === 'CHECK_CARD';
  const hasBankAccounts = bankAccounts.length > 0;

  // 컴포넌트 마운트시 초기화
  useEffect(() => {
    resetForm(userId);
    if (hasBankAccounts) setForm({ type: 'BANK' });
  }, [userId, resetForm, hasBankAccounts, setForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? (value === '' ? null : Number(value)) : value;

    updateForm((prev): AccountFormState => {
      // 바뀔 값들을 미리 준비
      const nextType = (name === 'type' ? finalValue : prev.type) as AccountInsertType;

      // details 결정 (타입이 바뀌었으면 초기값, 아니면 기존값)
      const nextDetails = name === 'type' ? INITIAL_DETAILS[nextType] : prev.details;

      // 공통 필드 업데이트를 포함한 기본 객체 생성
      let nextForm = {
        ...prev,
        [name]: finalValue,
        type: nextType,
        details: nextDetails,
      };

      // 타입별 특수 로직 (신용카드 등) 처리 : 가상컬럼 계산 후 실제 컬럼에 넣기
      if (nextType === 'CREDIT_CARD') {
        const currentDetails = nextDetails as CardDetailInsert;

        if (name === 'tmp_cumulative_usage' || name === 'amount_limit') {
          const limit = name === 'amount_limit' ? Number(finalValue) : Number(prev.amount_limit || 0);
          const usage = name === 'tmp_cumulative_usage' ? Number(finalValue) : Number(prev.tmp_cumulative_usage || 0);

          nextForm = {
            ...nextForm,
            limit_remaining: limit - usage,
            details: {
              ...currentDetails,
              amount_limit: limit,
            } as CardDetailInsert,
          };
        }
      }

      if (name === 'type') {
        nextForm.current_balance = 0;
        if (nextType === 'CASH') nextForm.tmp_cash_input_type = 'TOTAL';
      }

      // 마지막에 'as AccountFormState'로 확신을 주어 반환합니다.
      return nextForm as AccountFormState;
    });
  };

  const handleDetailChange = (field: string, value: string | number | boolean, index?: number) => {
    updateForm((prev): AccountFormState => {
      // 1:N 관계(배열)인 경우와 1:1 관계(객체)인 경우를 모두 대응하기 위한 로직
      if (prev.type === 'CASH' && Array.isArray(prev.details)) {
        if (index === undefined) return prev; // 배열인데 인덱스가 없으면 무시
        const newDetails = [...(prev.details as CashDetailInsert[])];
        newDetails[index] = { ...newDetails[index], [field]: value };

        return { ...prev, details: newDetails } as AccountFormState;
      }

      // 가상 필드(tmp_...)를 details가 아닌 부모 레벨에서 수정해야 할 때
      if (field.startsWith('tmp_')) {
        // 그 외 1:1 관계인 타입들 (BANK, CREDIT_CARD 등) , prev.details가 배열이 아님을 보장해야 함
        return { ...prev, [field]: value } as AccountFormState;
      }

      // 만약 details가 배열인 타입(CASH 등)이라면 여기에서 적절히 처리 (현재 객체 위주)
      if (!Array.isArray(prev.details)) {
        return {
          ...prev,
          details: {
            ...prev.details,
            [field]: value,
          },
        } as AccountFormState;
      }
      return prev;
    });
  };

  // 버튼 클릭 시 DB 저장X 대기열에 추가
  const handleAddToQueue = (e: React.FormEvent) => {
    e.preventDefault();

    // 데이터 보정: 이름이 비어있다면 provider 값을 이름으로 사용
    if (!form.name.trim() && form.provider) {
      setForm({ name: form.provider });
    }

    // 카드를 선택했는데 연결 계좌가 없는 경우 방어 로직
    if (isCard && !hasBankAccounts && !form.linked_account_id) {
      alert('연결 계좌를 선택해주세요.');
      return;
    }

    addQueue();
    // TODO : 추가 후 폼 초기화 시 'name'도 깔끔하게 비워지도록 store에서 처리
  };

  return (
    <S.FormContainer onSubmit={handleAddToQueue}>
      <AccountFields
        form={form}
        onChange={handleChange}
        onDetailChange={handleDetailChange}
        bankAccounts={bankAccounts}
        isCreateMode={true}
      />

      {/* 계좌 없는데 카드를 선택한 경우 : 버튼 비활성화 */}
      <Button type="submit" disabled={isEditingAny || (isCard && !hasBankAccounts)} style={{ width: '100%' }}>
        {isEditingAny ? <p> 항목 수정을 먼저 완료해 주세요.</p> : <p>대기열에 추가</p>}
      </Button>
    </S.FormContainer>
  );
};
