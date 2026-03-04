import React, { useEffect } from 'react';
import * as S from './AccountUI.style';
import { useAccountStore } from '../model/accountStore';
import type { TablesInsert } from '@/6_shared/types';
import { Button } from '@/6_shared/ui/button';
import { AccountFields } from './AccountField';

interface Props {
  userId: string;
  bankAccounts: { id: string; name: string }[];
  onSubmit: (data: TablesInsert<'accounts'>) => void;
  isLoading?: boolean;
}

export const AccountForm = ({ userId, bankAccounts }: Props) => {
  const { form, setField, addQueue, resetForm, editingIndices } = useAccountStore();
  const isEditingAny = editingIndices.length > 0;
  const isCard = form.type === 'CREDIT_CARD' || form.type === 'CHECK_CARD';
  const hasBankAccounts = bankAccounts.length > 0;

  // 컴포넌트 마운트시 초기화
  useEffect(() => {
    resetForm(userId);
  }, [userId, resetForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // 숫자 필드(잔액, 마감일 등)를 위한 처리
    const finalValue = type === 'number' ? (value === '' ? null : Number(value)) : value;

    setField(name as keyof TablesInsert<'accounts'>, finalValue);
  };

  // 버튼 클릭 시 DB 저장X 대기열에 추가
  const handleAddToQueue = (e: React.FormEvent) => {
    e.preventDefault();

    // 데이터 보정: 이름이 비어있다면 source 값을 이름으로 사용
    if (!form.name.trim() && form.source) {
      // 스토어의 setField를 직접 호출하여 값을 채워줌
      setField('name', form.source);
    }

    // 카드를 선택했는데 연결 계좌가 없는 경우 방어 로직
    if (isCard && !form.linked_account_id) {
      alert('연결 계좌를 선택해주세요.');
      return;
    }

    addQueue(); // 스토어의 queue 배열에 현재 form 데이터를 push 함

    // TODO : 추가 후 폼 초기화 시 'name'도 깔끔하게 비워지도록 store에서 처리
  };

  return (
    <S.FormContainer onSubmit={handleAddToQueue}>
      <AccountFields form={form} onChange={handleChange} bankAccounts={bankAccounts} isCreateMode={true} />

      {/* 계좌 없는데 카드를 선택한 경우 : 버튼 비활성화 */}
      <Button type="submit" disabled={isEditingAny || (isCard && !hasBankAccounts)} style={{ width: '100%' }}>
        {isEditingAny ? <p> 항목 수정을 먼저 완료해 주세요.</p> : <p>대기열에 추가</p>}
      </Button>
    </S.FormContainer>
  );
};
