import React from 'react';
import type { TablesInsert } from '@/6_shared/types';
import * as S from './AccountUI.style';
import { Input } from '@/6_shared/ui/input';
import { Select } from '@/6_shared/ui/select';
import { Field } from '@/6_shared/ui/field';
import { Alert } from '@/6_shared/ui/alert';
import { Grid } from '@/6_shared/ui/grid';
import { FINANCIAL_INSTITUTIONS } from '@/6_shared/constants';

interface AccountFieldsProps {
  form: TablesInsert<'accounts'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  bankAccounts: { id: string; name: string; current_balance?: number }[];
  isCreateMode?: boolean; // true: 신규 등록, false: 대기열 수정
}

export const AccountFields = ({ form, onChange, bankAccounts, isCreateMode = true }: AccountFieldsProps) => {
  const isCredit = form.type === 'CREDIT_CARD';
  const isCheck = form.type === 'CHECK_CARD';
  const isCard = isCredit || isCheck;
  const isBank = form.type === 'BANK';
  const institutionOptions = isBank ? FINANCIAL_INSTITUTIONS.BANK : isCard ? FINANCIAL_INSTITUTIONS.CARD : [];

  const hasBankAccounts = bankAccounts.length > 0;

  // 연결된 계좌의 실제 잔액 정보 찾기
  const linkedAccount = bankAccounts.find((acc) => acc.id === form.linked_account_id);
  console.log('잔액 : ', linkedAccount?.current_balance);
  return (
    <>
      <Grid>
        {/* 자산 유형: 수정 모드에서는 유형 변경을 막는 것이 데이터 무결성에 좋습니다 */}
        <Field
          label="자산 유형"
          error={isCreateMode && !hasBankAccounts ? '* 등록된 계좌가 없습니다. 계좌를 먼저 등록해 주세요.' : ''}
        >
          <Select
            name="type"
            value={form.type}
            onChange={onChange}
            disabled={!isCreateMode} // 수정 시 유형 변경 방지 (필요 시)
          >
            <option value="BANK">은행/계좌</option>
            <option value="CASH" disabled={isCreateMode && !hasBankAccounts}>
              현금
            </option>
            <option value="CREDIT_CARD" disabled={isCreateMode && !hasBankAccounts}>
              신용카드
            </option>
            <option value="CHECK_CARD" disabled={isCreateMode && !hasBankAccounts}>
              체크카드
            </option>
            <option value="PAY" disabled={isCreateMode && !hasBankAccounts}>
              간편결제
            </option>
          </Select>
        </Field>

        {isBank || isCard ? (
          <Field label={isBank ? '은행 선택' : '카드사 선택'}>
            <Select name="source" onChange={onChange} value={form.source}>
              <option value="">선택하세요</option>
              {institutionOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </Field>
        ) : (
          ''
        )}
      </Grid>

      {/* 카드 연결 계좌 로직 */}
      <Grid>
        {isCard && (
          <Field label="결제 대금 연결 계좌">
            {hasBankAccounts ? (
              <Select name="linked_account_id" value={form.linked_account_id || ''} onChange={onChange} required>
                <option value="">연결 계좌 선택</option>
                {bankAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </Select>
            ) : (
              <Alert message="⚠️ 등록된 은행 계좌가 없습니다. 계좌를 먼저 등록해 주세요." />
            )}
          </Field>
        )}
        <Field label="자산 이름">
          <Input name="name" value={form.name} onChange={onChange} placeholder="예: 월급 통장, 생활비 카드" required />
        </Field>
      </Grid>

      {/* 신용카드 상세 설정 */}
      {isCredit && (
        <Grid>
          <Field label="카드 마감일">
            <Input
              type="number"
              name="closing_day"
              min="1"
              max="31"
              value={form.closing_day || ''}
              onChange={onChange}
            />
          </Field>
          <Field label="카드 결제일">
            <Input
              type="number"
              name="billing_day"
              min="1"
              max="31"
              value={form.billing_day || ''}
              onChange={onChange}
            />
          </Field>
        </Grid>
      )}

      {!isCheck ? (
        <Field label={isCredit ? '현재 미결제 금액(사용 금액)' : '현재 잔액'}>
          <Input type="number" name="current_balance" value={form.current_balance ?? 0} onChange={onChange} required />
        </Field>
      ) : (
        /* 💡 체크카드일 때 보여줄 UI */
        <Field
          label="연결 계좌 잔액"
          error={isCheck && !form.linked_account_id ? '* 연결 계좌를 먼저 선택해 주세요.' : ''}
        >
          <S.InfoBox>
            {linkedAccount ? (
              <>
                <span>
                  🔗 <strong>{linkedAccount.name}</strong> 계좌의 잔액이 공유됩니다.
                  <br />
                  <small>(현재 잔액: {linkedAccount.current_balance?.toLocaleString()}원)</small>
                </span>
                <input type="hidden" name="current_balance" value={0} />
              </>
            ) : (
              <>
                <p>
                  ⚠️ 먼저 연결 계좌를 선택해주세요.
                  <br />
                  연결 계좌를 선택하면 잔액 정보가 표시됩니다.
                  <input type="hidden" name="current_balance" value={0} />
                </p>
              </>
            )}
          </S.InfoBox>
        </Field>
      )}
    </>
  );
};
