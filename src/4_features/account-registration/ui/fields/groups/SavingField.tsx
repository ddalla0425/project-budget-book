import { useGetDashboardQuery, type AccountSaveType } from '@/5_entities/account';
import type { RawDashboardResponse } from '@/5_entities/account/type/rpc.type';
import { useInstitutionStore } from '@/5_entities/institution';
import { formatNumberWithCommas, getConnectedBalanceInfo, getGroupedAssetOptions, parseNumberFromCommas } from '@/6_shared/lib';
import { calculateExpiryDate } from '@/6_shared/lib/date.utils.';
import { Alert } from '@/6_shared/ui/alert';
import { Field } from '@/6_shared/ui/field';
import { Grid } from '@/6_shared/ui/grid';
import { Input } from '@/6_shared/ui/input';
import { Select } from '@/6_shared/ui/select';
import { useMemo } from 'react';

interface Props {
  accounts: AccountSaveType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean | null) => void;
  bankAccounts: { id: string; name: string; current_balance?: number }[];
}
export const SavingField = ({ accounts, onChange, onDetailChange }: Props) => {
  const data = accounts as Extract<AccountSaveType, { type: 'SAVING' }>;
  const institutions = useInstitutionStore((s) => s.institutions);
  const { data: assetData } = useGetDashboardQuery();
  const rawData = assetData?.raw;
  const { flatAssets } = useMemo(() => getGroupedAssetOptions(rawData as RawDashboardResponse), [rawData]);
  const balanceInfo = getConnectedBalanceInfo(data.linked_account_id, flatAssets);
  const isInstallment = data.details.is_installment;
  // 🌟 [핵심 로직] 시작일이나 기간이 변경될 때 자동으로 만기일을 계산해서 쏴줍니다.
  const handleDateOrDurationChange = (field: 'start_date' | 'duration_months', value: string | number) => {
    // 1. 현재 변경된 값 업데이트
    onDetailChange(field, value);

    // 2. 계산을 위해 최신 값 세팅 (지금 방금 바꾼 값 or 기존에 입력되어 있던 값)
    const startDate = field === 'start_date' ? (value as string) : data.details.start_date;
    const duration = field === 'duration_months' ? Number(value) : Number(data.details.duration_months);

    // 3. 만능 함수 출동! (값이 다 들어있다면 알아서 계산해줌)
    const calculatedMaturityDate = calculateExpiryDate(startDate, duration, 'MONTHS');

    // 4. 결과가 나왔다면 만기일 필드('maturity_date') 자동 업데이트!
    if (calculatedMaturityDate) {
      onDetailChange('maturity_date', calculatedMaturityDate);
    }
  };

  return (
    <>
      {/* 공용 필드 - 자산 이름 */}
      <Grid direction="vertical">
        <Field>
          <Alert
            variant="secondary"
            message={
              isInstallment
                ? '적금: 돈을 여러 번에 나누어 납입하는 저축 \n(월 납입 금액에 이자가 붙는 방식)'
                : '예금 : 돈을 한번에 납입하는 저축 \n(첫 달에 전액을 입금하여, 전액에 이자가 매 달 붙는 방식)'
            }
          />
        </Field>
        <Field label="종류 구분" labelTag="span">
          <Grid gap={0}>
            {[
              { value: true, label: '💰 적금(목돈 만들기)' },
              { value: false, label: '💵 예금(목돈 굴리기)' },
            ].map((opt) => (
              <label
                key={String(opt.value)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="is_installment"
                  value={String(opt.value)} // HTML 표준을 위해 문자열로 변환
                  checked={data.details.is_installment === opt.value}
                  // 🌟 핵심: e.target.value(문자열) 대신, 처음부터 알고 있는 진짜 boolean 값(opt.value)을 그대로 던져줍니다!
                  onChange={() => onDetailChange('is_installment', opt.value)}
                />
                <span style={{ fontWeight: isInstallment === opt.value ? '600' : '400' }}>{opt.label}</span>
              </label>
            ))}
          </Grid>
        </Field>
      </Grid>

      <Grid>
        <Field label="은행 선택">
          <Select name="institution_id" onChange={onChange} value={data.institution_id || ''}>
            <option value="" disabled>
              선택하세요
            </option>
            {institutions
              .filter((inst) => inst.type === 'BANK')
              .map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {' '}
                  {inst.name}
                </option>
              ))}
          </Select>
        </Field>
        <Field label="예/적금 이름">
          <Input name="name" value={data.name} onChange={onChange} placeholder="예: ** 아이사랑 적금" required />
        </Field>
      </Grid>

      <Grid>
        <Field label="출금 계좌">
          <Select name="linked_account_id" value={data.linked_account_id || ''} onChange={onChange} required>
            <option value="" disabled>
              연결 계좌 선택
            </option>
            {rawData?.bank.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </Select>
        </Field>
        {/* 🌟 2. 깔끔해진 조건부 렌더링! */}
        {balanceInfo.isVisible && balanceInfo.balanceMessage !== '' && (
          <Field label={balanceInfo.label} labelTag="span" description={balanceInfo.accountName}>
            <Alert variant="secondary" align="right" message={balanceInfo.balanceMessage} />
          </Field>
        )}
      </Grid>

      <Grid>
        {/* 1. 가입일 (Start Date) */}
        <Field label="가입일 (시작일)">
          <Input
            type="date"
            name="start_date"
            value={data.details.start_date || ''}
            onChange={(e) => handleDateOrDurationChange('start_date', e.target.value)}
          />
        </Field>

        {/* 2. 가입 기간 (Duration) */}
        <Field label="가입 기간 (개월)">
          <Input
            type="number"
            name="duration_months"
            placeholder="예: 12"
            value={data.details.duration_months || ''}
            onChange={(e) => handleDateOrDurationChange('duration_months', Number(e.target.value))}
          />
        </Field>

        {/* 3. 만기일 (Auto Calculated) */}
        <Field label="만기일 (자동 계산)">
          <Input
            type="date"
            name="maturity_date"
            // 자동 계산된 값이 들어가고, 원한다면 유저가 직접 수정할 수도 있습니다.
            value={data.details.maturity_date || ''}
            onChange={(e) => onDetailChange('maturity_date', e.target.value)}
          />
        </Field>
      </Grid>

      <Grid direction={isInstallment ? 'vertical' : 'horizontal'}>
        <Grid selectCols={isInstallment ? '110px 1fr' : '1fr'}>
          <Field label="적용 금리 (연이율)">
            <Input
              type="number"
              name="interest_rate"
              placeholder="예: 1.2"
              onChange={(e) => onDetailChange('interest_rate', Number(e.target.value))}
              value={data.details.interest_rate || ''}
            />
          </Field>
          {isInstallment && (
            <Grid>
              <Field label="매월 이체일">
                <Select
                  name="payment_day"
                  value={data.details.payment_day?.toString() ?? ''}
                  onChange={(e) => onDetailChange('payment_day', e.target.value === '' ? null : Number(e.target.value))}
                  required
                >
                  <option value="" disabled>
                    날짜 선택
                  </option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={String(day)}>
                      {day}일
                    </option>
                  ))}
                  <option value="0">말일</option>
                </Select>
              </Field>

              <Field label="월 납입 금액">
                <Input
                  data-type="number"
                  name="payment_amount"
                  placeholder="예: 23000"
                  onChange={(e) => onDetailChange('payment_amount', parseNumberFromCommas(e.target.value))}
                  value={formatNumberWithCommas(data.details.payment_amount) || ''}
                />
              </Field>
            </Grid>
          )}
        </Grid>

        <Grid>
          <Field label={isInstallment ? '누적 납입 금액 (현재 자산 가치)' : '납입 금액'}>
            <Input
              data-type="number"
              name="current_balance"
              value={formatNumberWithCommas(data.current_balance) ?? ''}
              onChange={onChange}
              required
              placeholder={'지금까지 납입한 총 원금'}
            />
          </Field>
        </Grid>
      </Grid>

      <Grid>
        <Field label="계좌 상태 관리" labelTag="span">
          <Grid gap={0}>
            {[
              { value: 'ACTIVE', label: '정상' },
              { value: 'MATURED', label: '만기' },
              { value: 'CLOSED', label: '해지/해약' },
            ].map((statusOpt) => (
              <label
                key={statusOpt.value}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="status"
                  value={statusOpt.value}
                  checked={(data.details.status || 'ACTIVE') === statusOpt.value}
                  onChange={(e) => onDetailChange('status', e.target.value)}
                  style={{ cursor: 'pointer' }}
                />
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: (data.details.status || 'ACTIVE') === statusOpt.value ? '600' : '400',
                  }}
                >
                  {statusOpt.label}
                </span>
              </label>
            ))}
          </Grid>
        </Field>
      </Grid>
    </>
  );
};
/**TODO: 예금 이자산출 방법 생각하기 <rete_method 같은거>
 * - 정기예금[단리식,복리식]
 *    - 단리식: 매월 이자 지급
 *    - 복리식: 만기시 이자 일괄지급(매월발생 이자를 원금에 더해, 그 다음달 이자 산출)
 * - 보통예금 = 요구불예금
 *
 * 적금
 * - 정기적금
 * - 자유적금
 */
