import { Grid } from '@/6_shared/ui/grid';
import { Field } from '@/6_shared/ui/field';
import { type AccountSaveType } from '@/5_entities/account';
import { Input } from '@/6_shared/ui/input';
import { Select } from '@/6_shared/ui/select';
import { useInstitutionStore } from '@/5_entities/institution';

interface Props {
  accounts: Extract<AccountSaveType, { type: 'BANK' }>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean) => void;
}
export const BankField = ({ accounts, onChange, onDetailChange }: Props) => {
  const data = accounts as Extract<AccountSaveType, { type: 'BANK' }>;
  const institutions = useInstitutionStore((s) => s.institutions);

  return (
    <>
      <Grid>
        <Input type={'hidden'} name={'type'} value={'BANK'} />
        <Field label="은행 선택">
          <Select name="institution_id" onChange={onChange} value={data.institution_id || ''}>
            <option value="">선택하세요</option>
            {institutions
              .filter((inst) => inst.type === 'BANK')
              .map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {' '}
                  {/* ★ 드디어 UUID가 들어갑니다! */}
                  {inst.name}
                </option>
              ))}
          </Select>
        </Field>
      </Grid>
      <Grid>
        <Field label="게좌 번호">
          <Input
            type="text"
            name="account_number"
            value={accounts.details.account_number || ''}
            onChange={(e) => onDetailChange('account_number', Number(e.target.value))}
            placeholder="'-' 없이 숫자만 입력"
          />
        </Field>
      </Grid>

      <Grid>
        <Field label="예금 금리">
          <Input
            type={'number'}
            name={'deposit_rate'}
            value={accounts.details.deposit_rate || 0}
            onChange={(e) => onDetailChange('deposit_rate', Number(e.target.value))}
          />
        </Field>
        <Field label="대출 금리">
          <Input
            type={'number'}
            name={'loan_rate'}
            value={accounts.details.loan_rate || 0}
            onChange={(e) => onDetailChange('loan_rate', Number(e.target.value))}
          />
        </Field>
      </Grid>
      <Grid>
        <Field label="이자 지급 주기">
          <Select
            name={'interest_cycle'}
            value={accounts.details.interest_cycle || ''}
            onChange={(e) => onDetailChange('interest_cycle', e.target.value)}
          >
            <option value="MONTHLY">월별</option>
            <option value="DAILY">일별</option>
            <option value="WEEKLY">주별</option>
            <option value="QUARTERLY">분기별</option>
            <option value="MATURITY">만기시</option>
          </Select>
        </Field>
        <Field label="이자 지급일자">
          <Input
            type="number"
            name={'interest_settlement_day'}
            value={accounts.details.interest_settlement_day || ''}
            onChange={(e) => onDetailChange('interest_settlement_day', Number(e.target.value))}
          />
        </Field>
      </Grid>

      <Grid>
        <Field label={'계좌 잔액'}>
          <Input
            type="number"
            name="current_balance"
            value={data.current_balance ?? ''}
            onChange={onChange}
            required
            placeholder={'계좌 잔액 입력 : 20000'}
          />
        </Field>
      </Grid>
    </>
  );
};
