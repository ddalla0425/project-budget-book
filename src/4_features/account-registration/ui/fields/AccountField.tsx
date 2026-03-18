import React from 'react';
import { Input } from '@/6_shared/ui/input';
import { Select } from '@/6_shared/ui/select';
import { Field } from '@/6_shared/ui/field';
import { Grid } from '@/6_shared/ui/grid';
import { type AccountSaveType } from '@/5_entities/account';
import { ACCOUNT_TYPE_LABELS } from '@/5_entities/account';
import { BankField } from './groups/BankField';
import { CardField } from './groups/CardField';
import { CashField } from './groups/CashField';

interface AccountFieldsProps {
  form: AccountSaveType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean, index?: number) => void;
  bankAccounts: { id: string; name: string; current_balance?: number }[];
  isCreateMode?: boolean; // true: 신규 등록, false: 대기열 수정
}

export const AccountFields = ({
  form,
  onChange,
  onDetailChange,
  bankAccounts,
  isCreateMode = true,
}: AccountFieldsProps) => {
  const isCredit = form.type === 'CREDIT_CARD';
  const isCheck = form.type === 'CHECK_CARD';
  const isCard = isCredit || isCheck;
  const isBank = form.type === 'BANK';
  const isCash = form.type === 'CASH';
  const hasBankAccounts = bankAccounts.length > 0;
  const showBankField = (isCreateMode && !hasBankAccounts) || isBank;
  console.log(' hasBankAcoounts : ', !hasBankAccounts);

  return (
    <>
      {/* 공용 필드 - 자산 유형 */}
      <Grid direction={'vertical'}>
        {/* 자산 유형: 수정 모드에서는 유형 변경을 막는 것이 데이터 무결성에 좋습니다 */}
        <Field
          label="자산 유형"
          description={isCreateMode && !hasBankAccounts ? '* 등록된 계좌가 없습니다. 계좌를 먼저 등록해 주세요.' : ''}
        >
          <Select
            name="type"
            value={form.type}
            onChange={onChange}
            disabled={!isCreateMode} // 수정 시 유형 변경 방지 (필요 시)
          >
            {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
              <option
                key={value}
                value={value}
                // BANK가 아니고, 생성 모드이면서 계좌가 없는 경우 비활성화
                disabled={value !== 'BANK' && isCreateMode && !hasBankAccounts}
              >
                {label}
              </option>
            ))}
          </Select>
        </Field>
      </Grid>

      {/* 공용 필드 - 자산 이름 */}
      <Grid>
        <Field label="자산 이름">
          <Input name="name" value={form.name} onChange={onChange} placeholder="예: 월급 통장, 생활비 카드" required />
        </Field>
      </Grid>

      {/* 은행 필드 */}
      {showBankField && isBank && <BankField accounts={form} onChange={onChange} onDetailChange={onDetailChange} />}

      {/* 카드 필드 - 신용 + 체크*/}
      {isCard && (
        <CardField accounts={form} onChange={onChange} onDetailChange={onDetailChange} bankAccounts={bankAccounts} />
      )}

      {/* 카드 필드 - 신용 + 체크*/}
      {isCash && <CashField accounts={form} onChange={onChange} onDetailChange={onDetailChange} />}
    </>
  );
};
