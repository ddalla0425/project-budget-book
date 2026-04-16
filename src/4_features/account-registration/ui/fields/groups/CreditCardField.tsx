import { Grid } from '@/6_shared/ui/grid';
import { Field } from '@/6_shared/ui/field';
import type { AccountSaveType } from '@/5_entities/account';
import { Select } from '@/6_shared/ui/select';
import { Alert } from '@/6_shared/ui/alert';
import { Input } from '@/6_shared/ui/input';
import { useInstitutionStore } from '@/5_entities/institution';
import { useState } from 'react';
import { useGetCardBillingStandards, type CardBillingRpcResult } from '@/5_entities/cardbilling_standards';
import { formatNumberWithCommas, parseNumberFromCommas } from '@/6_shared/lib';

interface Props {
  accounts: AccountSaveType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean | null) => void;
  bankAccounts: { id: string; name: string; current_balance?: number }[];
}
export const CreditCardField = ({ accounts, onChange, onDetailChange, bankAccounts }: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [billingText, setBillingText] = useState<string>(''); // UX 향상을 위한 설명 텍스트 상태
  const [cumulativeUsage, setCumulativeUsage] = useState(0);
  const hasBankAccounts = bankAccounts.length > 0;
  const data = accounts as Extract<AccountSaveType, { type: 'CREDIT_CARD' | 'CHECK_CARD' }>;
  const institutions = useInstitutionStore((s) => s.institutions);
  const { data: cardBillingDay } = useGetCardBillingStandards();

  // 🌟 사용 금액이나 총 한도가 바뀔 때 '남은 한도'를 계산해서 부모에게 보고하는 함수
  const calculateRemaining = (limit: number, usage: number) => {
    const remaining = limit - usage;

    // 1. 부모의 limit_remaining (DB 실제 컬럼) 업데이트
    // onChange 형식을 빌려 쓰거나 onDetailChange를 사용합니다.
    onChange({
      target: { name: 'limit_remaining', value: remaining },
    } as unknown as React.ChangeEvent<HTMLInputElement>);

    // 2. 만약 details 내부에도 한도 값이 들어간다면 업데이트
    onDetailChange('amount_limit', limit);
  };

  // 💡 월 오프셋을 사람이 읽기 편한 텍스트로 변환하는 유틸 함수
  const getMonthText = (offset: number) => {
    if (offset === 0) return '이번 달';
    if (offset === -1) return '저번 달';
    if (offset === -2) return '전전 달';
    if (offset === 1) return '다음 달';
    return `${offset}개월 전`;
  };

  // 🌟 공통 매핑 함수
  const applyBillingRule = (instId?: string | null, billDay?: number | null) => {
    if (!cardBillingDay || !Array.isArray(cardBillingDay) || !instId || !billDay) {
      setBillingText(''); // 조건 안 맞으면 텍스트 초기화
      return;
    }

    const rules = cardBillingDay as CardBillingRpcResult[];

    const matchedRule = rules.find((rule) => rule.institution_id === instId && rule.billing_day === billDay);

    if (matchedRule) {
      onDetailChange('start_day', matchedRule.start_day);
      onDetailChange('start_month_offset', matchedRule.start_month_offset);
      onDetailChange('end_day', matchedRule.end_day);
      onDetailChange('end_month_offset', matchedRule.end_month_offset);

      const startDayText = matchedRule.start_day === 0 ? '말일' : `${matchedRule.start_day}일`;
      const endDayText = matchedRule.end_day === 0 ? '말일' : `${matchedRule.end_day}일`;

      // 🌟 수정 1: data.details.billing_day 대신 파라미터로 받은 billDay 사용
      setBillingText(
        `💡 결제일 ${billDay}일 기준 이용기간: ${getMonthText(matchedRule.start_month_offset)} ${startDayText} ~ ${getMonthText(matchedRule.end_month_offset)} ${endDayText}`
      );

      // setShowDetails(true);
    } else {
      setBillingText('⚠️ 해당 결제일의 기준표를 찾을 수 없습니다. 직접 입력해주세요.');
    }
  };

  // 🌟 추가 1: 선택된 카드사에 따른 결제일 옵션 필터링 로직
  const getAvailableBillingDays = () => {
    if (data.institution_id && Array.isArray(cardBillingDay)) {
      // 해당 카드사의 데이터만 필터링
      const rulesForInst = cardBillingDay.filter((rule) => rule.institution_id === data.institution_id);

      if (rulesForInst.length > 0) {
        // 결제일만 뽑아서 오름차순(1일 -> 31일) 정렬
        return rulesForInst.map((rule) => rule.billing_day).sort((a, b) => a - b);
      }
    }
    // 카드사가 선택되지 않았거나, 해당 카드사의 기준표 데이터가 아예 없는 경우 1~31일 반환
    return Array.from({ length: 31 }, (_, i) => i + 1);
  };

  const availableBillingDays = getAvailableBillingDays();

  // 카드사 선택 핸들러
  const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // onChange(e);
    // applyBillingRule(e.target.value, data.details.billing_day);
    onChange(e); // institution_id 업데이트

    // 🌟 추가 2: 카드사가 바뀌면 기존에 선택했던 결제일을 초기화 (충돌 방지)
    onDetailChange('billing_day', null);
    setBillingText('');
  };

  // 결제일 선택 핸들러
  const handleBillingDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBillingDay = Number(e.target.value);
    onDetailChange('billing_day', newBillingDay);
    applyBillingRule(data.institution_id, newBillingDay);
  };

  return (
    <>
      <Grid>
        <Field label="결제 대금 연결 계좌">
          {hasBankAccounts ? (
            <Select name="linked_account_id" value={data.linked_account_id ?? ''} onChange={onChange} required>
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
          <Select name="institution_id" onChange={handleInstitutionChange} value={data.institution_id || ''}>
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

      {/* 🌟 UX 디테일: 자동으로 세팅된 기간을 읽기 쉽게 보여줍니다 */}
      {billingText && <Alert message={billingText} />}

      <Grid>
        <Field label="카드 결제일">
          <Select name="billing_day" value={data.details.billing_day || ''} onChange={handleBillingDayChange} required>
            <option value="" disabled>
              날짜 선택
            </option>
            {/* {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}일
              </option>
            ))} */}
            {availableBillingDays.map((day) => (
              <option key={day} value={day}>
                {day}일
              </option>
            ))}
          </Select>
        </Field>

        <Field label={'카드 이용기간 수정'}>
          <Input
            type="checkbox"
            id="toggle-details"
            checked={showDetails}
            onChange={(e) => setShowDetails(e.target.checked)}
          />
        </Field>
      </Grid>

      {showDetails && (
        <Grid>
          <Grid>
            <Field label="시작 달">
              <Select
                name="start_month_offset"
                // value={data.details.start_month_offset ?? ''}
                // onChange={(e) => onDetailChange('start_month_offset', Number(e.target.value))}
                //  value={data.details.start_month_offset?.toString() ?? ''}
                //   onChange={(e) => {
                //     const val = e.target.value;
                //     onDetailChange('start_month_offset', val === '' ? null : Number(val)); // 🌟 빈 값이면 null 처리
                //   }}
                value={
                  data.details.start_month_offset !== null && data.details.start_month_offset !== undefined
                    ? String(data.details.start_month_offset)
                    : ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  onDetailChange('start_month_offset', val === '' ? null : Number(val));
                }}
                required
              >
                <option value="" disabled>
                  선택
                </option>
                <option value="0">이번 달</option>
                <option value="-1">저번 달</option>
                <option value="-2">전전 달</option>
              </Select>
            </Field>

            <Field label="시작 일">
              <Select
                name="start_day"
                // value={data.details.start_day ?? ''}
                // onChange={(e) => onDetailChange('start_day', Number(e.target.value))}
                // value={data.details.start_day?.toString() ?? ''}
                // onChange={(e) => {
                //   const val = e.target.value;
                //   onDetailChange('start_day', val === '' ? null : Number(val)); // 🌟 빈 값이면 null 처리
                // }}
                value={
                  data.details.start_day !== null && data.details.start_day !== undefined
                    ? String(data.details.start_day)
                    : ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  onDetailChange('start_day', val === '' ? null : Number(val));
                }}
                required
              >
                <option value="" disabled>
                  선택
                </option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day.toString()}>
                    {day}일
                  </option>
                ))}
                <option value="0">말일</option>
              </Select>
            </Field>
          </Grid>

          <Grid>
            <Field label="마감 달">
              <Select
                name="end_month_offset"
                // value={data.details.end_month_offset ?? ''}

                // onChange={(e) => onDetailChange('end_month_offset', Number(e.target.value))}
                // value={data.details.end_month_offset?.toString() ?? ''}
                // onChange={(e) => {
                //   const val = e.target.value;
                //   onDetailChange('end_month_offset', val === '' ? null : Number(val));
                // }}
                value={
                  data.details.end_month_offset !== null && data.details.end_month_offset !== undefined
                    ? String(data.details.end_month_offset)
                    : ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  onDetailChange('end_month_offset', val === '' ? null : Number(val));
                }}
                required
              >
                <option value="" disabled>
                  선택
                </option>
                <option value="0">이번 달</option>
                <option value="-1">저번 달</option>
                <option value="-2">전전 달</option>
              </Select>
            </Field>

            <Field label="마감 일">
              <Select
                name="end_day"
                // value={data.details.end_day ?? ''}
                // onChange={(e) => onDetailChange('end_day', Number(e.target.value))}
                // value={data.details.end_day?.toString() ?? ''}
                // onChange={(e) => {
                //   const val = e.target.value;
                //   onDetailChange('end_day', val === '' ? null : Number(val));
                // }}
                value={
                  data.details.end_day !== null && data.details.end_day !== undefined
                    ? String(data.details.end_day)
                    : ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  onDetailChange('end_day', val === '' ? null : Number(val));
                }}
                required
              >
                <option value="" disabled>
                  선택
                </option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day.toString()}>
                    {day}일
                  </option>
                ))}
                <option value="0">말일</option>
              </Select>
            </Field>
          </Grid>
        </Grid>
      )}
{/* TODO : formatNumberWithCommas, parseNumberFromCommas 제대로 적용하기. */}
      <Grid>
        <Field label="카드 한도">
          <Input
            data-type="number"
            placeholder="예: 500000 (카드앱 한도 확인)"
            name="amount_limit"
            value={formatNumberWithCommas(data.amount_limit) || ''}
            // onChange={onChange}
            onChange={(e) => {
              const newLimit = parseNumberFromCommas(e.target.value) || 0;
              onChange(e); // 기본 저장 실행
              calculateRemaining(newLimit, cumulativeUsage); // 실시간 계산 보고
            }}
          />
        </Field>
        <Field label="현재까지 누적 사용액">
          <Input //DB 저장X 계산용 (누적 사용액 입력 인풋)
            data-type="number"
            value={formatNumberWithCommas(cumulativeUsage) || ''}
            // onChange={onChange}
            onChange={(e) => {
              const usage = parseNumberFromCommas(e.target.value) || 0;
              setCumulativeUsage(usage); // 로컬에만 저장
              calculateRemaining(Number(data.amount_limit), usage); // 실시간 계산 보고
            }}
            placeholder="예: 500000 (카드앱 누적 사용액 확인)"
          />
        </Field>
        <Input
          type="hidden"
          name="limit_remaining" // 실제 DB 저장용 (남은 한도) (amount_limit - cumulative_usage = 값 저장)
          value={data.limit_remaining || ''}
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
            data-type="number"
            name="current_balance"
            value={formatNumberWithCommas(data.current_balance) ?? ''}
            onChange={onChange}
            required
            placeholder={'이번 달 명세서에 찍힌 금액'}
          />
        </Field>
      </Grid>
    </>
  );
};
//[x] : 저장 후 목록 조회페이지로 이동하면, 바로 보이지 않음. -> 근데 테이블에는 잘 들어가져 있는게 확인됨. -> 몇초뒤 반영되긴함.  반영되는게 좀 느림?? 그리고 나중에 정렬도 넣어야 겠음!!!!
/**
 * TODO :
 * 1. 카드이용기간 시작달과 마감 달의 문구 수정. 저번 달 -> 전달 변경
 */
