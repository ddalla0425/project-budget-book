import { Field } from '@/6_shared/ui/field';
import type { AccountSaveType } from '@/5_entities/account';
import { Grid } from '@/6_shared/ui/grid';
import { Select } from '@/6_shared/ui/select';
import { Input } from '@/6_shared/ui/input';
import { normalizeAccountValue } from '@/4_features/account-registration/lib/utils';
import { Button } from '@/6_shared/ui/button';
// import { useAccountFormStore } from '@/4_features/account-registration/model/form.store';
import { useState } from 'react';
import { formatNumberWithCommas } from '@/6_shared/lib';

// type AccountFormType = Extract<AccountSaveType, { type: 'CASH' }> & {
//   tmp_cash_input_type?: string;
// };

interface Props {
  accounts: AccountSaveType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean | null, index?: number) => void;
  onAddDetail: () => void;
  onRemoveDetail: (index: number) => void;
}

export const CashField = ({ accounts, onChange, onDetailChange, onAddDetail, onRemoveDetail }: Props) => {
  const [inputType, setInputType] = useState<'DETAIL' | 'TOTAL'>('TOTAL');
  const data = accounts as Extract<AccountSaveType, { type: 'CASH' }>;
  // const inputType = accounts.tmp_cash_input_type || 'DETAIL';
  const isTotalMode = inputType === 'TOTAL';

  const handleDetailUpdate = (field: string, value: string | number | boolean | null, index: number) => {
    const safeValue = typeof value === 'number' ? normalizeAccountValue(field, value) : value;

    // 상세 항목 업데이트 전, 타입 변경 시 권종 기본값 강제 할당 로직
    if (field === 'cash_type') {
      // 지폐로 바꾸면 5만원, 동전으로 바꾸면 500원을 기본값으로 설정
      const defaultDenom = value === 'BILL' ? 50000 : 500;

      // 부모에게 타입 변경과 권종 변경을 동시에 알림
      onDetailChange('cash_type', value, index);
      onDetailChange('denomination', defaultDenom, index);

      // 아래 계산 로직에서 쓰일 updatedDetails를 위해 값을 미리 보정
      // (여기서 return하지 않고 아래 합계 계산 로직으로)
    } else {
      onDetailChange(field, safeValue, index);
    }

    // 권종별 입력 모드일 때만 합계 자동 계산
    if (!isTotalMode) {
      const updatedDetails = data.details.map((item, idx) => {
        if (idx === index) {
          // 타입 변경 시에는 위에서 정한 기본값들을 적용해서 계산
          if (field === 'cash_type') {
            return {
              ...item,
              // cash_type: value as 'BILL' | 'COIN',
              cash_type: value,
              denomination: value === 'BILL' ? 50000 : 500,
            };
          }
          return { ...item, [field]: safeValue };
        }
        return item;
      });

      const totalSum = updatedDetails.reduce((sum, item) => {
        const denom = Number(item.denomination) || 0;
        const quant = Number(item.quantity) || 0;
        return sum + denom * quant;
      }, 0);

      // console.log('계산에 사용된 데이터:', updatedDetails);
      // console.log('최종 합계:', totalSum);

      // 부모의 onChange를 호출하여 current_balance 갱신
      onChange({
        target: {
          name: 'current_balance',
          value: totalSum,
          valueAsNumber: totalSum,
          type: 'number',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
    }
  };

  return (
    <>
      {/* --- 상단: 입력 방법 선택 --- */}
      <Grid>
        <Field label="현금 입력 방법 선택">
          <Select onChange={(e) => setInputType(e.target.value as 'DETAIL' | 'TOTAL')} value={inputType}>
            <option value="DETAIL">권종별 입력</option>
            <option value="TOTAL">토탈 입력</option>
          </Select>
        </Field>
      </Grid>

      {/* 공용 필드 - 자산 이름 */}
      <Grid>
        <Field label="자산 이름">
          <Input name="name" value={accounts.name} onChange={onChange} placeholder="예: 비상금 현금" required />
        </Field>
      </Grid>

      {/* 2. 하단: 모드에 따른 분기 처리 */}
      {isTotalMode ? (
        // ---------------- [토탈 입력 모드] ----------------
        <Grid>
          <Field label="직접 금액 입력">
            <Input
              type="number"
              name="current_balance"
              onChange={onChange}
              value={formatNumberWithCommas(data.current_balance) ?? ''}
              placeholder="전체 금액을 입력하세요"
            />
          </Field>
        </Grid>
      ) : (
        // ---------------- [권종별 상세 입력 모드] ----------------
        <>
          {/* 리스트 렌더링 */}
          {data.details.map((item, idx) => {
            const currentCashType = item.cash_type || 'BILL';
            return (
              <Grid
                key={idx}
                direction="vertical"
                style={{
                  gap: '12px',
                  marginBottom: '16px',
                  padding: '16px',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                }}
              >
                <Grid selectCols="1fr 1fr 1fr auto">
                  {' '}
                  {/* 삭제 버튼 공간 확보 */}
                  <Field label="현금 타입">
                    <Select
                      value={currentCashType}
                      onChange={(e) => handleDetailUpdate('cash_type', e.target.value, idx)}
                    >
                      <option value="BILL">지폐</option>
                      <option value="COIN">동전</option>
                    </Select>
                  </Field>
                  <Field label="권종 선택">
                    <Select
                      value={item.denomination || ''}
                      onChange={(e) => handleDetailUpdate('denomination', Number(e.target.value), idx)}
                    >
                      <option value="" disabled>
                        선택
                      </option>
                      {currentCashType === 'BILL' ? (
                        <>
                          <option value="50000">50,000원</option>
                          <option value="10000">10,000원</option>
                          <option value="5000">5,000원</option>
                          <option value="1000">1,000원</option>
                        </>
                      ) : (
                        <>
                          <option value="500">500원</option>
                          <option value="100">100원</option>
                          <option value="50">50원</option>
                          <option value="10">10원</option>
                        </>
                      )}
                    </Select>
                  </Field>
                  <Field label="개수">
                    <Input
                      type="number"
                      onChange={(e) => handleDetailUpdate('quantity', e.target.valueAsNumber, idx)}
                      value={item.quantity ?? ''}
                      placeholder="0"
                    />
                  </Field>
                  {/* 🌟 삭제 버튼 (항목이 2개 이상일 때만 노출하는 센스!) */}
                  {data.details.length > 1 && (
                    <div style={{ alignSelf: 'center', paddingTop: '20px' }}>
                      <Button onClick={() => onRemoveDetail(idx)} variant="secondary" color="error">
                        삭제
                      </Button>
                    </div>
                  )}
                </Grid>
              </Grid>
            );
          })}

          {/* 🌟 권종 추가 버튼 */}
          <Button
            type="button"
            onClick={onAddDetail}
            variant="outline"
            style={{ width: '100%', marginBottom: '24px', borderStyle: 'dashed' }}
          >
            + 권종 추가하기
          </Button>

          {/* 🌟 최종 합계 (자동 계산된 결과) */}
          <Grid>
            <Field label="최종 합계 금액">
              <Input
                data-type="number"
                value={formatNumberWithCommas(data.current_balance) ?? ''}
                readOnly
                placeholder="자동 계산됨"
                style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold', fontSize: '1.1rem' }}
              />
            </Field>
          </Grid>
        </>
      )}
    </>
  );
};
// TODO:
