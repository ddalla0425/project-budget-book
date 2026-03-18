import { Grid } from '@/6_shared/ui/grid';
import { Field } from '@/6_shared/ui/field';
import type { AccountSaveType } from '@/5_entities/account';
import { Select } from '@/6_shared/ui/select';
import { Alert } from '@/6_shared/ui/alert';
import { Input } from '@/6_shared/ui/input';
import { useInstitutionStore } from '@/5_entities/institution';

type AccountFormType = Extract<AccountSaveType, { type: 'CREDIT_CARD' | 'CHECK_CARD' }> & {
  tmp_cumulative_usage?: number | null;
};

interface Props {
  accounts: AccountFormType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean) => void;
  bankAccounts: { id: string; name: string; current_balance?: number }[];
}
export const CreditCardField = ({ accounts, onChange, onDetailChange, bankAccounts }: Props) => {
  const hasBankAccounts = bankAccounts.length > 0;
  const data = accounts as AccountFormType;
  const institutions = useInstitutionStore((s) => s.institutions);
  
  return (
    <>
      <Grid>
        <Field label="결제 대금 연결 계좌">
          {hasBankAccounts ? (
            <Select name="linked_account_id" value={data.linked_account_id ?? ''} onChange={onChange} required>
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
        <Field label={'카드사 선택'}>
          <Select name="institution_id" onChange={onChange} value={data.institution_id || ''}>
            <option value="">선택하세요</option>
            {institutions
              .filter((inst) => inst.type === 'CARD')
              .map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {' '}
                  {inst.name}
                </option>
              ))}
          </Select>
        </Field>
      </Grid>
      <Grid>
        <Field label="카드 이용기간 시작일">
          <Input
            type="number"
            name="start_day"
            value={data.details.start_day || ''}
            onChange={(e) => onDetailChange('start_day', Number(e.target.value))}
          />
        </Field>
        <Field label="카드 이용기간 시작월">
          <Input
            type="number"
            name="start_month_offset"
            value={data.details.start_month_offset || ''}
            onChange={(e) => onDetailChange('start_month_offset', Number(e.target.value))}
          />
        </Field>
      </Grid>
      <Grid>
        <Field label="카드 이용기간 마감일">
          <Input
            type="number"
            name="end_day"
            value={data.details.end_day || ''}
            onChange={(e) => onDetailChange('end_day', Number(e.target.value))}
          />
        </Field>
        <Field label="카드 이용기간 마감월">
          <Input
            type="number"
            name="end_month_offset"
            value={data.details.end_month_offset || ''}
            onChange={(e) => onDetailChange('end_month_offset', Number(e.target.value))}
          />
        </Field>
      </Grid>
      <Grid>
        <Field label="카드 결제일">
          <Select
            name="billing_day"
            value={data.details.billing_day || ''}
            onChange={(e) => onDetailChange('billing_day', Number(e.target.value))}
          >
            <option value="" disabled>
              날짜 선택
            </option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}일
              </option>
            ))}
          </Select>
        </Field>
      </Grid>
      <Grid>
        <Field label="카드 한도">
          <Input type="number" name="amount_limit" value={data.amount_limit || 0} onChange={onChange} />
        </Field>
        <Field label="현재까지 누적 사용액">
          <Input
            type="number"
            name="tmp_cumulative_usage" //DB 저장X 계산용 (누적 사용액 입력 인풋)
            value={data.tmp_cumulative_usage || 0}
            onChange={onChange}
          />
        </Field>
        <Input
          type="hidden"
          name="limit_remaining" // 실제 DB 저장용 (남은 한도) (amount_limit - cumulative_usage = 값 저장)
          value={data.limit_remaining || 0}
          onChange={onChange}
        />
        <Input
          type="hidden"
          name="balance_type" // 신용카드 저장용 LIABILITY
          value={'LIABILITY'}
          onChange={onChange}
        />
      </Grid>
      <Grid>
        <Field label={'다음 결제일 청구 예정 금액'}>
          <Input
            type="number"
            name="current_balance"
            value={data.current_balance ?? 0}
            onChange={onChange}
            required
            placeholder={'이번 달 명세서에 찍힌 금액'}
          />
        </Field>
      </Grid>
    </>
  );
};
