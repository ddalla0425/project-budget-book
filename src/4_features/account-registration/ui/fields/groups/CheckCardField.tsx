import { Grid } from '@/6_shared/ui/grid';
import { Field } from '@/6_shared/ui/field';
import * as S from '../../style';
import type { AccountSaveType } from '@/5_entities/account';
import { Select } from '@/6_shared/ui/select';
import { Alert } from '@/6_shared/ui/alert';
import { Input } from '@/6_shared/ui/input';
import { useInstitutionStore } from '@/5_entities/institution';

interface Props {
  accounts: AccountSaveType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean | null) => void;
  bankAccounts: { id: string; name: string; current_balance?: number }[];
}
export const CheckCardField = ({ accounts, onChange, bankAccounts }: Props) => {
  const hasBankAccounts = bankAccounts.length > 0;
  const institutions = useInstitutionStore((s) => s.institutions);
  const linkedAccount = bankAccounts.find((acc) => acc.id === accounts.linked_account_id);

  return (
    <>
      <Grid>
        <Field label="결제 대금 연결 계좌">
          {hasBankAccounts ? (
            <Select name="linked_account_id" value={accounts.linked_account_id || ''} onChange={onChange} required>
              <option value="" disabled>
                연결 계좌 선택
              </option>
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
          <Select name="institution_id" onChange={onChange} value={accounts.institution_id || ''}>
            <option value="" disabled>
              선택하세요
            </option>
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

      {/* 공용 필드 - 자산 이름 */}
      <Grid>
        <Field label="자산 이름">
          <Input
            name="name"
            value={accounts.name}
            onChange={onChange}
            placeholder="예: 월급 통장, 생활비 카드"
            required
          />
        </Field>
      </Grid>

      <Grid>
        <Field
          labelTag="span"
          label="연결 계좌 잔액"
          error={!accounts.linked_account_id ? '* 연결 계좌를 먼저 선택해 주세요.' : ''}
        >
          <S.InfoBox>
            {linkedAccount ? (
              <>
                <span>
                  🔗 <strong>{linkedAccount.name}</strong> 계좌의 잔액이 공유됩니다.
                  <br />
                  <small>(현재 잔액: {linkedAccount.current_balance?.toLocaleString()}원)</small>
                </span>
                <Input type="hidden" name="current_balance" value={0} />
              </>
            ) : (
              <p>
                ⚠️ 먼저 연결 계좌를 선택해주세요.
                <br />
                연결 계좌를 선택하면 잔액 정보가 표시됩니다.
                <Input type="hidden" name="current_balance" value={0} />
              </p>
            )}
          </S.InfoBox>
        </Field>
      </Grid>
    </>
  );
};
