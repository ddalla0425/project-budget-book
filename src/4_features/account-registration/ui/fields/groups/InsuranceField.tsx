import { useGetDashboardQuery, type AccountSaveType } from '@/5_entities/account';
import type { RawDashboardResponse } from '@/5_entities/account/type/rpc.type';
import { useInstitutionStore } from '@/5_entities/institution';
import { calculateExpiryDate, durationUtils, formatNumberWithCommas, getConnectedBalanceInfo, getGroupedAssetOptions, parseNumberFromCommas } from '@/6_shared/lib';
import { Alert } from '@/6_shared/ui/alert';
import { Field } from '@/6_shared/ui/field';
import { Grid } from '@/6_shared/ui/grid';
import { Input } from '@/6_shared/ui/input';
import { Select } from '@/6_shared/ui/select';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  accounts: AccountSaveType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean | null) => void;
  isAssetMode?: boolean;
}
export const InsuranceField = ({ accounts, onChange, onDetailChange, isAssetMode }: Props) => {
  const [showDetails, setShowDetails] = useState(true);
  const data = accounts as Extract<AccountSaveType, { type: 'INSURANCE' }>;
  const institutions = useInstitutionStore((s) => s.institutions);
  const { data: assetData } = useGetDashboardQuery();
  const isSaving = data.details.type === 'SAVINGS'; // 저죽성 자산 여부
  const isMonthly = data.details.payment_cycle === 'MONTHLY'; // 월납 여부
  // const isYearly = data.details.payment_cycle === 'YEARLY';
  // 🌟 화면에 보여줄 값 (연납이면 12로 나눠서 년수로 보여줌)
  // const displayDuration =
  //   isYearly && data.details.payment_duration_months
  //     ? data.details.payment_duration_months / 12
  //     : (data.details.payment_duration_months ?? '');
  const displayDuration = durationUtils.toDisplayValue(
    data.details.payment_duration_months,
    data.details.payment_cycle || 'MONTHLY'
  );
  const rawData = assetData?.raw;
  // const myAssetAccounts = [
  //   ...(rawData?.bank || []),
  //   ...(rawData?.card || []),
  //   ...(rawData?.pay || []),
  //   ...(rawData?.voucher || []),
  // ].map((acc) => {
  //   const institutionName = acc.institution?.name || '';
  //   const displayName = institutionName ? `[${institutionName}] ${acc.name}` : acc.name;

  //   return {
  //     id: acc.id,
  //     type: acc.type, // BANK, CREDIT_CARD 등으로 그룹화하기 위해 저장
  //     displayName,
  //     current_balance: acc.current_balance || 0,
  //     linked_account_id: acc.linked_account_id,
  //   };
  // });

  // const groupedAssets = {
  //   은행: myAssetAccounts.filter((a) => a.type === 'BANK'),
  //   신용카드: myAssetAccounts.filter((a) => a.type === 'CREDIT_CARD'),
  //   체크카드: myAssetAccounts.filter((a) => a.type === 'CHECK_CARD'),
  //   페이: myAssetAccounts.filter((a) => a.type === 'PAY'),
  //   포인트: myAssetAccounts.filter((a) => a.type === 'POINT'),
  // };
  const { flatAssets, groupedAssets } = useMemo(
    () => getGroupedAssetOptions(rawData as RawDashboardResponse),
    [rawData]
  );

  useEffect(() => {
    if (isAssetMode && !data.details.type) {
      onDetailChange('type', 'SAVINGS');
    }
  }, [isAssetMode, data.details.type, onDetailChange]);

  const handleDurationOrStartDateChange = (
    field: 'start_date' | 'payment_duration_months' | 'payment_cycle',
    value: string | number
  ) => {
    // 🌟 핵심 1: 납입 주기를 바꿀 때, 기존에 입력된 개월 수가 있다면 단위에 맞춰 보정해 줍니다.
    if (field === 'payment_cycle') {
      const newCycle = value as string;

      // 월납 -> 연납으로 바꿀 때: 기존 240개월 -> 20년으로 치환해야 하는데 DB엔 개월로 저장되니 그냥 둠
      // 연납 -> 월납으로 바꿀 때: 기존 120개월(화면엔 10년) -> 화면에 120개월로 보여야 하니 그냥 둠
      // 사실 값은 그대로 두고 화면(UI)단에서 `displayDuration`이 알아서 나눠서 보여주므로 건드릴 필요가 없습니다!

      onDetailChange(field, value); // 일단 주기 변경 저장

      // 🌟 TODO 1 해결: 월납이 아니면 이체일 초기화
      if (newCycle !== 'MONTHLY') {
        onDetailChange('payment_day', null);
      }
    } else {
      onDetailChange(field, value); // 일반 필드 저장
    }

    // --- 여기부터는 날짜 자동 계산 로직 ---
    const startDateValue = field === 'start_date' ? value : data.details.start_date;
    // 방금 바꾼게 duration이면 그 값을, 아니면 기존 폼에 있는 값을 가져옴
    const durationValue = field === 'payment_duration_months' ? value : data.details.payment_duration_months;
    const cycleValue = field === 'payment_cycle' ? value : data.details.payment_cycle || 'MONTHLY';

    // 🌟 가입일, 기간이 있고, 일시납이 아닐 때만 만료일 계산
    if (startDateValue && durationValue && cycleValue !== 'ONCE') {
      // const dateObj = new Date(String(startDateValue));

      // 🌟 핵심 2: 이미 위에서 (onChange) 연납이든 월납이든 durationValue를 '개월 수'로 변환해서
      // 이 함수로 넘겨주었거나, 아니면 기존 폼 데이터(이미 개월 수)를 가져왔으므로 무조건 그대로 더합니다!
      // const monthsToAdd = Number(durationValue);

      // dateObj.setMonth(dateObj.getMonth() + monthsToAdd);
      // const calculatedPaymentEnd = dateObj.toISOString().split('T')[0];

      // onDetailChange('payment_end_date', calculatedPaymentEnd);

      // onChange({
      //   target: { name: 'expiry_date', value: calculatedPaymentEnd },
      // } as unknown as React.ChangeEvent<HTMLInputElement>);
      const calculatedPaymentEnd = calculateExpiryDate(startDateValue, Number(durationValue), 'MONTHS');
      if (calculatedPaymentEnd) {
        onDetailChange('payment_end_date', calculatedPaymentEnd);
        onChange({
          target: { name: 'expiry_date', value: calculatedPaymentEnd },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  // 🌟 예상 총 납입 원금 (만기 환급금의 베이스) 계산 로직
  const getExpectedTotalAmount = () => {
    const premium = data.details.premium_amount || 0;

    // 일시납이면 곱할 필요 없이 1회 납입액 자체가 총액
    if (data.details.payment_cycle === 'ONCE') return premium;

    // 월납이든 연납이든 입력된 duration을 그대로 곱해주면 됨 (UI에서 단위를 맞춰서 받기 때문)
    const duration = data.details.payment_duration_months || 0;
    // 🌟 연납이면 (총 개월 수 / 12)를 곱하고, 월납이면 개월 수를 그대로 곱함
    const multiplier = data.details.payment_cycle === 'YEARLY' ? duration / 12 : duration;
    return premium * multiplier;
  };

  const expectedTotalAmount = getExpectedTotalAmount();

  const balanceInfo = getConnectedBalanceInfo(data.linked_account_id, flatAssets);
  // // 🌟 결제 수단에 연결된 계좌 잔액 안내 메시지 만들기
  // let connectedBalanceMessage = '';
  // let connectedAccountName = '';
  // let balanceFieldLabel = '결제 수단과 연결된 통장 잔액';

  // if (data.linked_account_id) {
  //   // 1. 현재 선택한 결제 수단(계좌/카드/페이)을 찾음
  //   const selectedAsset = myAssetAccounts.find((a) => a.id === data.linked_account_id);

  //   if (selectedAsset) {
  //     if (selectedAsset.type === 'BANK') {
  //       // 은행 통장을 직접 선택한 경우
  //       balanceFieldLabel = '선택한 통장 잔액';
  //       connectedBalanceMessage = `${Number(selectedAsset.current_balance).toLocaleString()} 원`;
  //     } else {
  //       // 카드나 페이를 선택한 경우 -> 연결된 진짜 출금 계좌(은행)를 다시 찾음
  //       balanceFieldLabel = `연결된 출금 계좌 잔액`;
  //       if (selectedAsset.linked_account_id) {
  //         const linkedBank = myAssetAccounts.find((a) => a.id === selectedAsset.linked_account_id);
  //         if (linkedBank) {
  //           connectedAccountName = linkedBank.displayName;
  //           connectedBalanceMessage = `${Number(linkedBank.current_balance).toLocaleString()} 원`;
  //         } else {
  //           connectedAccountName = '연결 계좌 알 수 없음';
  //           connectedBalanceMessage = '연결된 계좌 정보를 불러올 수 없습니다.';
  //         }
  //       } else {
  //         connectedAccountName = '출금 계좌 미지정';
  //         // connectedBalanceMessage = '결제 수단에 연결된 출금 계좌가 지정되지 않았습니다.';
  //         connectedBalanceMessage = '-';
  //       }
  //     }
  //   }
  // }

  return (
    <>
      <Input type={'hidden'} name={'type'} value={'INSURANCE'} />
      <Grid direction="vertical">
        {data.details.type === 'SAVINGS' ? (
          <Alert message="💡 저축/연금 보험은 '자산'으로 분류 됩니다" />
        ) : (
          <Alert variant="secondary" message="💡 실비/자동차 보험은 '정기 지출'로 자동 분류됩니다." />
        )}

        <Field label="보험의 목적 (종류)" labelTag="span">
          <Grid gap={0} selectCols="1fr 1fr">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="type"
                value="SAVINGS"
                checked={data.details.type === 'SAVINGS'}
                onChange={(e) => onDetailChange('type', e.target.value)}
              />
              <span>💰 저축/연금 (자산 관리용)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="type"
                value="PROTECTION"
                checked={data.details.type === 'PROTECTION'}
                onChange={(e) => {
                  onDetailChange('type', e.target.value);
                  // 보장성을 선택하면 자산 가치(잔액)를 0으로 초기화
                  onChange({
                    target: { name: 'current_balance', value: '0' } as unknown as EventTarget & HTMLSelectElement,
                  } as React.ChangeEvent<HTMLSelectElement>);
                }}
              />
              <span>🛡️ 실비/자동차 (단순 지출용)</span>
            </label>
          </Grid>
        </Field>
      </Grid>

      <Grid>
        <Field label="보험사 선택">
          <Select name="institution_id" onChange={onChange} value={data.institution_id ?? ''}>
            <option value="" disabled>
              선택하세요
            </option>
            {institutions
              .filter((inst) => inst.type === 'INSURANCE')
              .map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
          </Select>
        </Field>

        <Field label="보험 이름">
          <Input
            name="name"
            value={accounts.name}
            onChange={onChange}
            placeholder={isSaving ? '100세 연금' : '예: DB 다이렉트 자동차보험'}
            required
          />
        </Field>
      </Grid>

      <Grid>
        <Field label="자동이체 결제 수단">
          {flatAssets.length > 0 ? (
            <Select name="linked_account_id" value={data.linked_account_id ?? ''} onChange={onChange}>
              {/* TODO : 직접 납부/ 미지정 잠시 보류 */}
              <option value="" disabled>
                {' '}
                선택하세요
              </option>

              {/* 🏦 은행 그룹 */}
              {groupedAssets['은행'].length > 0 && (
                <optgroup label="🏦 은행 계좌">
                  {groupedAssets['은행'].map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.displayName}
                    </option>
                  ))}
                </optgroup>
              )}

              {/* 💳 카드 그룹 (신용) */}
              {groupedAssets['신용카드'].length > 0 && (
                <optgroup label="💳 보유 신용 카드">
                  {groupedAssets['신용카드'].map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.displayName}
                    </option>
                  ))}
                </optgroup>
              )}

              {/* 💳 카드 그룹 (체크) */}
              {groupedAssets['체크카드'].length > 0 && (
                <optgroup label="💳 보유 체크 카드">
                  {groupedAssets['체크카드'].map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.displayName}
                    </option>
                  ))}
                </optgroup>
              )}

              {/* 📱 페이 */}
              {groupedAssets['간편결제'].length > 0 && (
                <optgroup label="💳 보유 간편결제(페이)">
                  {groupedAssets['간편결제'].map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.displayName}
                    </option>
                  ))}
                </optgroup>
              )}

              {/*💰 포인트 */}
              {groupedAssets['포인트'].length > 0 && (
                <optgroup label="💳 보유 포인트">
                  {groupedAssets['포인트'].map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.displayName}
                    </option>
                  ))}
                </optgroup>
              )}
            </Select>
          ) : (
            <Alert message="등록된 결제 수단(계좌/카드)이 없습니다." />
          )}
        </Field>
        {/* 🌟 선택된 결제 수단이 있을 때만 잔액 안내 창을 띄움 */}
        {/* {!!data.linked_account_id && connectedBalanceMessage !== '' && (
          <Field label={balanceFieldLabel} labelTag="span" description={connectedAccountName}>
            <Alert variant="secondary" align="right" message={connectedBalanceMessage} />
          </Field>
        )} */}
        {/* 🌟 2. 깔끔해진 조건부 렌더링! */}
        {balanceInfo.isVisible && balanceInfo.balanceMessage !== '' && (
          <Field label={balanceInfo.label} labelTag="span" description={balanceInfo.accountName}>
            <Alert variant="secondary" align="right" message={balanceInfo.balanceMessage} />
          </Field>
        )}
      </Grid>

      <Grid selectCols={isMonthly ? '1fr .5fr .5fr' : '1fr 1fr'}>
        <Field label={isMonthly ? '월 납입 보험료' : '1회 납입 보험료'}>
          <Input
            data-type="number"
            name="premium_amount"
            value={formatNumberWithCommas(data.details.premium_amount) ?? ''}
            onChange={(e) => onDetailChange('premium_amount', parseNumberFromCommas(e.target.value))}
            placeholder="예: 100000"
          />
        </Field>
        <Field label="납입 주기">
          <Select
            name="payment_cycle"
            value={data.details.payment_cycle || 'MONTHLY'}
            onChange={(e) => handleDurationOrStartDateChange('payment_cycle', e.target.value)}
          >
            <option value="MONTHLY">월납</option>
            <option value="YEARLY">연납</option>
            <option value="ONCE">일시납</option>
          </Select>
        </Field>

        {isMonthly && (
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
        )}
      </Grid>

      <Grid
        direction={data.details.payment_cycle !== 'ONCE' ? 'vertical' : 'horizontal'}
        selectCols={data.details.payment_cycle !== 'ONCE' ? '1fr 1fr' : '.5fr 1fr'}
      >
        <Grid selectCols={data.details.payment_cycle !== 'ONCE' ? '1fr 1fr 1fr' : '1fr'}>
          <Field label="보험 가입일">
            <Input
              type="date"
              name="start_date"
              value={(data.details.start_date as string) || ''}
              onChange={(e) => handleDurationOrStartDateChange('start_date', e.target.value)}
            />
          </Field>
          {/* 일시납(ONCE)이 아닐 때만 납입 기간 표시 */}
          {data.details.payment_cycle !== 'ONCE' && (
            <>
              <Field label={isMonthly ? '총 납입 개월 수' : '총 납입 연도 수'}>
                <Input
                  type="number"
                  name="payment_duration_months"
                  value={displayDuration}
                  onChange={(e) => {
                    const monthsToSave = durationUtils.toSaveValue(
                      e.target.valueAsNumber,
                      data.details.payment_cycle || 'MONTHLY'
                    );
                    handleDurationOrStartDateChange('payment_duration_months', monthsToSave);
                  }}
                  placeholder={isMonthly ? '예: 240(개월)' : '예: 10(년)'}
                />
              </Field>
              <Field label="납입 만료일 (자동계산)">
                <Input
                  type="date"
                  name="payment_end_date"
                  value={(data.details.payment_end_date as string) || ''}
                  onChange={(e) => onDetailChange('payment_end_date', e.target.value)}
                />
              </Field>
            </>
          )}
        </Grid>

        <Grid selectCols="1fr.5fr">
          <Field label="최종 보장 종료일 (만기일)">
            <Input type="date" name="expiry_date" value={(data.expiry_date as string) || ''} onChange={onChange} />
          </Field>

          <Field label="금리 (연이율)">
            <Input
              type="number"
              name="interest_rate"
              value={data.details.interest_rate ?? ''}
              onChange={(e) => onDetailChange('interest_rate', e.target.valueAsNumber)}
              placeholder="예: 1.2 "
            />
          </Field>
        </Grid>
      </Grid>

      {/* 🌟 저축성(SAVINGS) 보험일 때만 '자산' 관련 필드 노출 */}
      {isSaving && (
        <>
          <Grid selectCols="200px 1fr">
            <Field label={'누적 납입 금액 (현재 자산 가치)'}>
              <Input
                data-type="number"
                name="current_balance"
                value={formatNumberWithCommas(data.current_balance) ?? ''}
                onChange={onChange}
                required
                placeholder={'지금까지 납입한 총 원금'}
              />
            </Field>
            <Field label="예상 총 납입 원금 (만기 기준)" labelTag="span">
              <Alert
                message={`💡 ${expectedTotalAmount > 0 ? expectedTotalAmount.toLocaleString() + '원' : '금액과 기간을 입력해보세요'}`}
              />
            </Field>
          </Grid>

          <Grid>
            <Field label={'해약 환급 가능 여부'}>
              <Input
                type="checkbox"
                id="toggle-details"
                name="is_refundable"
                checked={showDetails}
                onChange={(e) => setShowDetails(e.target.checked)}
              />
            </Field>

            {showDetails && (
              <Field label="현재 예상 해약 환급금 (선택)">
                <Input
                  data-type="number"
                  name="estimated_refund_amount"
                  value={formatNumberWithCommas(data.details.estimated_refund_amount) ?? ''}
                  onChange={(e) => onDetailChange('estimated_refund_amount', parseNumberFromCommas(e.target.value))}
                  placeholder="예: 8500000"
                />
              </Field>
            )}
          </Grid>
        </>
      )}

      {/* 보장성일 경우 current_balance를 0으로 숨겨서 서버로 보냄 */}
      {!isSaving && <Input type="hidden" name="current_balance" value="0" />}

      <Grid>
        <Field label="보험 상태 관리" labelTag="span">
          <Grid gap={0}>
            {[
              { value: 'ACTIVE', label: '정상' },
              { value: 'MATURED', label: '만기' },
              { value: 'LAPSED', label: '실효' },
              { value: 'REINSTATED', label: '부활' },
              { value: 'CANCELLED', label: '해지' },
              { value: 'PAID_UP', label: '완료' },
            ].map((statusOpt, idx) => (
              <label
                key={statusOpt.value}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name={`status_${idx}`}
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
// [x]: DB 쪽 bank_account_id 컬럼 과 관련 FK 조약 지우기 / 일괄등록 함수에서도 컬럼 지우기
/**
 * [x]. payment_cycle 이 MOPNTHLY 가 아닐경우,  payment_day에 NULL로 집어넣기. (현재 1로 들어감 체크제약. )
 * [x]. 현재 실비 쪽 보험 등록시 payment_cycle 이 YEARLY 일때, payment_duration_months 가 입력 년수로 들어감. 확인하고 변경
 */
