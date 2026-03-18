import { Field } from '@/6_shared/ui/field';
import type { AccountSaveType } from '@/5_entities/account';
import { Grid } from '@/6_shared/ui/grid';
import { Select } from '@/6_shared/ui/select';
import { Input } from '@/6_shared/ui/input';

type AccountFormType = Extract<AccountSaveType, { type: 'CASH' }> & {
  tmp_cash_input_type?: string;
};

interface Props {
  accounts: AccountFormType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean, index?: number) => void;
}
export const CashField = ({ accounts, onChange, onDetailChange }: Props) => {
  const data = accounts as AccountFormType;
  const inputType = accounts.tmp_cash_input_type || 'DETAIL';
  const isTotalMode = inputType === 'TOTAL';

  const handleDetailUpdate = (field: string, value: string | number | boolean, index: number) => {
    // 상세 항목 업데이트
    onDetailChange(field, value, index);

    // 권종별 입력 모드일 때만 합계 자동 계산 로직 실행
    if (!isTotalMode) {
      // 현재 데이터의 복사본을 만들어 방금 바뀐 값을 반영
      const updatedDetails = [...data.details];
      updatedDetails[index] = { ...updatedDetails[index], [field]: value };

      // 전체 합계 계산: Σ (권종 * 개수)
      const totalSum = updatedDetails.reduce((sum, item) => {
        const denom = Number(item.denomination) || 0;
        const quant = Number(item.quantity) || 0;
        return sum + denom * quant;
      }, 0);

      // 부모의 onChange 포맷에 맞춰 current_balance 업데이트 호출
      onChange({
        target: { name: 'current_balance', value: totalSum },
      } as unknown as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
    }
  };
  return (
    <>
      <Grid>
        <Field label="현금 입력 방법 선택">
          <Select name="tmp_cash_input_type" onChange={onChange} value={inputType}>
            <option value="DETAIL">권종별 입력</option>
            <option value="TOTAL">토탈 입력</option>
          </Select>
        </Field>
      </Grid>
      {data.details.map((item, idx) => {
        return (
          <Grid key={idx} direction="vertical">
            {!isTotalMode && (
              <Grid style={{ display: isTotalMode ? 'none' : 'grid' }}>
                <Field label="현금 타입 선택">
                  <Select
                    name="cash_type"
                    value={item.cash_type}
                    onChange={(e) => handleDetailUpdate('cash_type', e.target.value, idx)}
                  >
                    <option value="BILL">지폐</option>
                    <option value="COIN">동전</option>
                  </Select>
                </Field>

                <Field label="권종 선택">
                  <Select
                    name="denomination"
                    value={item.denomination || ''}
                    onChange={(e) => handleDetailUpdate('denomination', Number(e.target.value), idx)}
                  >
                    {item.cash_type === 'BILL' ? (
                      <>
                        <option value="50000">신사임당</option>
                        <option value="10000">세종대왕</option>
                        <option value="5000">율곡 이이</option>
                        <option value="1000">퇴계 이황</option>
                      </>
                    ) : (
                      <>
                        <option value="500">학</option>
                        <option value="100">이순신 장군</option>
                        <option value="50">벼 이삭</option>
                        <option value="10">다보탑</option>
                      </>
                    )}
                  </Select>
                </Field>
                <Field label="개수 입력">
                  <Input
                    type="number"
                    name="quantity"
                    onChange={(e) => handleDetailUpdate('quantity', Number(e.target.value), idx)}
                    value={item.quantity ?? 0}
                  />
                </Field>
              </Grid>
            )}
            <Grid>
              <Field label={isTotalMode ? '직접 금액 입력' : '자동 계산된 금액'}>
                <Input
                  type="number"
                  name="current_balance"
                  onChange={onChange}
                  value={data.current_balance ?? 0}
                  readOnly={!isTotalMode} // 토달은 수정 금지
                  style={!isTotalMode ? { backgroundColor: '#f5f5f5' } : {}}
                />
              </Field>
            </Grid>
          </Grid>
        );
      })}
    </>
  );
};
