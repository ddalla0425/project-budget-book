import { Grid } from '@/6_shared/ui/grid';
import { Field } from '@/6_shared/ui/field';
import { type AccountSaveType } from '@/5_entities/account';
import { Input } from '@/6_shared/ui/input';
import { Select } from '@/6_shared/ui/select';
import { useInstitutionStore } from '@/5_entities/institution';
import { useState } from 'react';
import { formatNumberWithCommas } from '@/6_shared/lib';

interface Props {
  accounts: Extract<AccountSaveType, { type: 'BANK' }>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean | null) => void;
}
export const BankField = ({ accounts, onChange, onDetailChange }: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const data = accounts as Extract<AccountSaveType, { type: 'BANK' }>;
  const institutions = useInstitutionStore((s) => s.institutions);
  const isMinusAccount = accounts.details.is_minus_account || false;
  return (
    <>
      <Grid>
        <Input type={'hidden'} name={'type'} value={'BANK'} />
        <Field label="은행 선택">
          <Select
            name="institution_id"
            onChange={(e) => {
              onChange(e);
              console.log(e.target.value);
            }}
            value={data.institution_id ?? ''}
          >
            <option value="" disabled>
              선택하세요
            </option>
            {institutions
              .filter((inst) => inst.type === 'BANK')
              .map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
          </Select>
        </Field>

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
        <Field label="게좌 번호">
          <Input
            type="text"
            name="account_number"
            value={accounts.details.account_number || ''}
            onChange={(e) => onDetailChange('account_number', e.target.value)}
            placeholder="'-' 없이 숫자만 입력"
          />
        </Field>
      </Grid>

      <Grid>
        <Field label="마이너스 통장 여부">
          <Input
            type="checkbox"
            id="is_minus_account"
            checked={isMinusAccount}
            onChange={(e) => onDetailChange('is_minus_account', e.target.checked)}
          />
        </Field>
      </Grid>
      {isMinusAccount && (
        <Grid>
          <Field label="마이너스 한도">
            <Input
              data-type="number"
              name="amount_limit"
              value={formatNumberWithCommas(data.amount_limit) ?? ''}
              onChange={onChange}
              placeholder="예: 10000000 (숫자만 입력)"
            />
          </Field>
          <Field label="대출 금리(연이율)">
            <Input
              type={'number'}
              name={'loan_rate'}
              value={accounts.details.loan_rate || ''}
              placeholder="예: 1.2"
              onChange={(e) => onDetailChange('loan_rate', e.target.valueAsNumber)}
            />
          </Field>
        </Grid>
      )}
      <Grid>
        <Field label={'상세 정보 입력 (CMA등 금리, 이자 주기 설정)'}>
          <Input
            type="checkbox"
            id="toggle-details"
            checked={showDetails}
            onChange={(e) => setShowDetails(e.target.checked)}
          />
        </Field>
      </Grid>
      {showDetails && (
        <>
          <Grid>
            <Field label="예금 금리 (연이율)">
              <Input
                type={'number'}
                name={'deposit_rate'}
                value={accounts.details.deposit_rate || ''}
                onChange={(e) => onDetailChange('deposit_rate', e.target.valueAsNumber)}
                placeholder="예: 1.2"
              />
            </Field>
            <Field label="이자 지급 주기">
              <Select
                name={'interest_cycle'}
                value={accounts.details.interest_cycle || ''}
                onChange={(e) => onDetailChange('interest_cycle', e.target.value)}
              >
                <option value="DAILY">일별</option>
                <option value="WEEKLY">주별</option>
                <option value="MONTHLY">월별</option>
                <option value="QUARTERLY">분기별</option>
                <option value="MATURITY">만기시</option>
              </Select>
            </Field>
            {/* TODO : 분기별, 만기시 interest_settlement_day 처리 ㅠㅠㅠㅠ */}
            {data.details.interest_cycle !== 'DAILY' && (
              <Field label={data.details.interest_cycle === 'WEEKLY' ? '이자 지금요일' : '이자 지급일자'}>
                <Select
                  name="interest_settlement_day"
                  value={data.details.interest_settlement_day?.toString() ?? ''}
                  onChange={(e) => onDetailChange('interest_settlement_day', Number(e.target.value))}
                  required
                >
                  <option value="" disabled>
                    선택
                  </option>
                  {data.details.interest_cycle === 'WEEKLY' ? (
                    // 🌟 주별일 때는 1(월)~7(일) 로 매핑
                    <>
                      <option value="1">월요일</option>
                      <option value="2">화요일</option>
                      <option value="3">수요일</option>
                      <option value="4">목요일</option>
                      <option value="5">금요일</option>
                      <option value="6">토요일</option>
                      <option value="7">일요일</option>
                    </>
                  ) : (
                    // 🌟 월별일 때는 1일~31일
                    Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={String(day)}>
                        {day}일
                      </option>
                    ))
                  )}
                </Select>
              </Field>
            )}
          </Grid>
        </>
      )}

      <Grid>
        <Field label={'계좌 잔액'}>
          <Input
            data-type="number"
            name="current_balance"
            value={formatNumberWithCommas(data.current_balance) ?? ''}
            onChange={onChange}
            required
            placeholder={isMinusAccount ? '잔액 입력 (마이너스 금액 입력 가능) : -2000000' : '계좌 잔액 입력 : 20000'}
          />
        </Field>
      </Grid>
    </>
  );
};
/**TODO :
 * 1. 상세정보 입력 - 이자 지급일자 필드 1~31 셀렉 옵션으로 변경.
 * 2. 상세정보 입력 - 이자 지급주기에 따른 이자 지급일자 필드 설정
 *    예) 월별(지급주기) - 일자(지금일자), 주별(지급주기) - 요일(지급요일)
 *      지급주기: 분기별, 만기별 시 지급일자 처리 고민
 * */
