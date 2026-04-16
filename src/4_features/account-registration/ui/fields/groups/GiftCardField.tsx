import { normalizeAccountValue } from '@/4_features/account-registration/lib/utils';
import { useGetDashboardQuery, type AccountSaveType, type VoucherAccountInsert } from '@/5_entities/account';
import { useInstitutionStore } from '@/5_entities/institution';
import { filterData, formatNumberWithCommas } from '@/6_shared/lib';
import { Alert } from '@/6_shared/ui/alert';
import { Button } from '@/6_shared/ui/button';
import { Field } from '@/6_shared/ui/field';
import { Grid } from '@/6_shared/ui/grid';
import { Input } from '@/6_shared/ui/input';
import { Select } from '@/6_shared/ui/select';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  accounts: AccountSaveType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean | null, idx: number) => void;
  onAddDetail: () => void;
  onRemoveDetail: (index: number) => void;
}
export const GiftCardField = ({ accounts, onChange, onAddDetail, onRemoveDetail, onDetailChange }: Props) => {
  const data = accounts as Extract<AccountSaveType, { type: 'GIFT_CARD' }> as VoucherAccountInsert;
  const institutions = useInstitutionStore((s) => s.institutions);
  const { data: assetData } = useGetDashboardQuery();
  const [isCustomInput, setIsCustomInput] = useState(false);

  // 현재 선택된 기관 정보 찾기
  const selectedInstitution = useMemo(() => {
    if (isCustomInput || !accounts.institution_id) return null;
    return institutions.find((inst) => inst.id === accounts.institution_id) || null;
  }, [accounts.institution_id, isCustomInput, institutions]);

  // 전환 옵션 노출 여부 결정
  // - 직접 입력 모드이거나
  // - 선택한 기관이 존재하고, 해당 기관이 전환 가능(is_convertible)할 때만 노출
  // (DB의 is_convertible 컬럼 활용)
  const shouldShowConvertOption =
    isCustomInput || (selectedInstitution && selectedInstitution.is_convertible !== false);

  // 전환 대상이 될 수 있는 자산 필터링 (POINT, PAY 타입만)
  const convertibleTargets = useMemo(() => {
    if (!assetData?.flatList) return [];

    const points = filterData(assetData.flatList, { type: 'POINT' }) || [];
    const pays = filterData(assetData.flatList, { type: 'PAY' }) || [];

    return [...points, ...pays];
  }, [assetData]);

  // masterName을 따로 변수로 빼서, 이 값이 바뀔 때만 실행되도록 유도
  const masterName = data.details[0]?.voucher_name || '';

  useEffect(() => {
    if (data.details.length > 1) {
      data.details.forEach((item, idx) => {
        if (idx > 0 && item.voucher_name !== masterName) {
          onDetailChange('voucher_name', masterName, idx);
        }
      });
    }
  }, [masterName, data.details, onDetailChange]);

  const handleDetailUpdate = (field: string, value: string | number | boolean | null, index: number) => {
    const safeValue = typeof value === 'number' ? normalizeAccountValue(field, value) : value;

    onDetailChange(field, safeValue, index);

    const updatedDetails = data.details.map((item, idx) => {
      if (idx === index) return { ...item, [field]: safeValue };

      return item;
    });

    const totalSum = updatedDetails.reduce((sum, item) => {
      const denom = Number(item.denomination) || 0;
      const quant = Number(item.quantity) || 0;
      return sum + denom * quant;
    }, 0);

    // 부모의 onChange를 호출하여 current_balance 갱신
    onChange({
      target: {
        name: 'current_balance',
        value: String(totalSum),
        valueAsNumber: totalSum,
        type: 'number',
      },
    } as unknown as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
    //   }
  };
  return (
    <>
      <Input type="hidden" name="type" value="GIFT_CARD" />

      <Grid>
        <Alert
          variant="secondary"
          message={`💡 여러 장의 "${data.details[0]?.voucher_name || '상품권'}"을 한 번에 관리하고 싶다면 추가 버튼을 눌러보세요.`}
        />
      </Grid>

      <Grid direction="vertical" autoCols={false}>
        {/* 공통 헤더 구역 */}
        <Grid style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <Field label="상품권 종류 (공통)" labelTag="span">
            <Grid>
              <Select
                value={isCustomInput ? 'CUSTOM' : accounts.institution_id || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'CUSTOM') {
                    setIsCustomInput(true);
                    onChange({
                      target: { name: 'institution_id', value: null },
                    } as unknown as React.ChangeEvent<HTMLSelectElement>);
                    onDetailChange('voucher_name', '', 0);
                  } else {
                    setIsCustomInput(false);
                    const selectedInst = institutions.find((inst) => inst.id === value);
                    onChange({
                      target: { name: 'institution_id', value },
                    } as unknown as React.ChangeEvent<HTMLSelectElement>);
                    onDetailChange('voucher_name', selectedInst?.name || '', 0);
                  }
                }}
              >
                <option value="" disabled>
                  등록할 상품권을 선택하세요
                </option>
                {institutions
                  .filter((inst) => inst.type === 'GIFT_CARD')
                  .map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                <option value="CUSTOM">✏️ 직접 입력</option>
              </Select>
              {isCustomInput && (
                <Input
                  value={data.details[0]?.voucher_name ?? ''}
                  onChange={(e) => onDetailChange('voucher_name', e.target.value, 0)}
                  placeholder="예: 동네 카페 상품권"
                />
              )}
            </Grid>
          </Field>
        </Grid>

        {/* 상세 내역 구역 */}
        <Grid direction="vertical" autoCols={false}>
          {data?.details.map((item, idx) => (
            <Grid
              key={idx}
              direction="vertical"
              autoCols={false}
              style={{
                gap: '12px',
                marginBottom: '16px',
                padding: '16px',
                border: '1px solid #eee',
                borderRadius: '8px',
              }}
            >
              <Grid
                selectCols={data.details.length > 1 ? '1fr 50px 130px 40px' : '1fr 50px 130px auto'}
                gap={data.details.length > 1 ? 10 : 20}
              >
                <Field label="권종">
                  <Select
                    name="denomination"
                    value={item.denomination ?? 50000}
                    onChange={(e) => handleDetailUpdate('denomination', Number(e.target.value), idx)}
                  >
                    <option value="1000">1,000원</option>
                    <option value="5000">5,000원</option>
                    <option value="10000">10,000원</option>
                    <option value="30000">30,000원</option>
                    <option value="50000">50,000원</option>
                    <option value="100000">100,000원</option>
                  </Select>
                </Field>
                <Field label="개수">
                  <Input
                    name="quantity"
                    type="number"
                    value={item.quantity ?? 0}
                    onChange={(e) => handleDetailUpdate('quantity', e.target.valueAsNumber, idx)}
                  />
                </Field>
                <Field label="유효기간">
                  <Input
                    type="date"
                    value={item.expiry_date ?? ''}
                    onChange={(e) => onDetailChange('expiry_date', e.target.value, idx)}
                  />
                </Field>

                {data.details.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => onRemoveDetail(idx)}
                    variant="secondary"
                    color="error"
                    style={{ alignSelf: 'flex-end', padding: '10px' }}
                  >
                    ✕
                  </Button>
                )}
              </Grid>

              {/* 🔗 연결 고리 섹션 */}
              {shouldShowConvertOption && (
                <Grid direction="vertical" autoCols={false}>
                  <Grid>
                    <Field label="포인트/페이로 전환 여부">
                      <Input
                        type="checkbox"
                        name="is_convertible"
                        id={`convert-${idx}`}
                        checked={!!item.is_convertible}
                        onChange={(e) => onDetailChange('is_convertible', e.target.checked, idx)}
                      />
                    </Field>
                  </Grid>
                  {item.is_convertible && (
                    <Field
                      label="전환될 대상 자산 선택"
                      description="* 나중에 '전환 완료' 처리 시, 해당 자산의 잔액으로 합산됩니다."
                    >
                      <Select
                        name="convertible_account_id"
                        value={item.convertible_account_id ?? ''}
                        onChange={(e) => onDetailChange('convertible_account_id', e.target.value, idx)}
                      >
                        <option value="" disabled>
                          연결할 자산 선택
                        </option>
                        {convertibleTargets.map((target) => (
                          <option key={target.id} value={target.id}>
                            [{target.type === 'PAY' ? '페이' : '포인트'}] {target.name}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  )}
                </Grid>
              )}
            </Grid>
          ))}
        </Grid>

        <Button type="button" onClick={onAddDetail} variant="outline">
          {/* + 상품권 추가하기 */}+ 같은 묶음으로 등록할 상품권 추가
        </Button>

        {/* 최종 합계 (자동 계산된 결과) */}
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
      </Grid>
    </>
  );
};
// TODO : 수량 입력시 앞에 '0'이 붙음. 안지워짐.... 
