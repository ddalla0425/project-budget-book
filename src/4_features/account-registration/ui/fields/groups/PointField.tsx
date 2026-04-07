import { useGetDashboardQuery, type AccountSaveType } from '@/5_entities/account';
import type { VoucherAccountInsertToPoint } from '@/5_entities/account/type/insert.type';
import { useInstitutionStore } from '@/5_entities/institution';
import { filterData, formatNumberWithCommas } from '@/6_shared/lib';
import { Field } from '@/6_shared/ui/field';
import { Grid } from '@/6_shared/ui/grid';
import { Input } from '@/6_shared/ui/input';
import { Select } from '@/6_shared/ui/select';
import { useMemo, useState } from 'react';

interface Props {
  accounts: AccountSaveType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean | null, idx: number) => void;
}
export const PointField = ({ accounts, onChange, onDetailChange }: Props) => {
  const data = accounts as Extract<AccountSaveType, { type: 'POINT' }> as VoucherAccountInsertToPoint;
  const institutions = useInstitutionStore((s) => s.institutions);
  const { data: assetData } = useGetDashboardQuery();
  const [isCustomInput, setIsCustomInput] = useState(false);

  const myPayAccounts = useMemo(() => {
    // if (!assetData?.flatList) return [];
    // return filterData(assetData.flatList, { type: 'PAY' }) || [];
    if (!assetData?.flatList || !assetData?.raw?.pay) return [];

    // 1️⃣ 이미 다른 포인트와 짝이 맞는 페이들의 ID를 수집합니다.
    const alreadyLinkedPayIds = new Set(
      assetData.raw.pay.filter((pay) => !!pay.details?.linked_point_account_id).map((pay) => pay.id)
    );

    // 2️⃣ 페이 목록 중 조건에 맞는 것만 남깁니다.
    return (filterData(assetData.flatList, { type: 'PAY' }) || []).filter((pay) => {
      // 3️⃣ 만약 이 페이가 '지금 내가 포인트 상세에서 선택한 페이'라면 목록에 남겨둡니다.
      // (수정 중이거나 대기열에 이미 담긴 경우를 위해)
      const currentTargetPayId = data.details[0]?.target_pay_id;
      if (pay.id === currentTargetPayId) return true;

      // 4️⃣ 그 외에 이미 짝이 있는 페이라면 목록에서 가차 없이 제거!
      return !alreadyLinkedPayIds.has(pay.id);
    });
  }, [assetData, data.details]);

  return (
    <>
      <Input type="hidden" name="type" value="POINT" />

      {/* 🌟 1. 공통 헤더 구역 (맵 바깥으로 독립) */}
      <Grid style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
        <Field label="포인트 종류 (공통)" labelTag="span">
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
                등록할 포인트를 선택하세요
              </option>
              {institutions
                .filter((inst) => inst.type === 'POINT')
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
                placeholder="예: A마트 적립 포인트"
              />
            )}
          </Grid>
        </Field>
      </Grid>

      <Grid direction="vertical" autoCols={false}>
        {(data.details || []).map((item, idx) => (
          <Grid
            key={idx}
            direction="vertical"
            autoCols={false}
            style={
              {
                /* ... 스타일 ... */
              }
            }
          >
            {/* ... (기존 포인트 이름, 금액, 개수 등 입력 필드들) ... */}

            {/* 🌟 B안의 핵심! 페이 연결 UI 추가 */}
            <Grid selectCols="1fr 200px">
              <Field
                label="연결할 페이 자산 (선택 사항)"
                description="* 기존에 만들어둔 간편결제(PAY)에 이 포인트를 찰떡같이 연결합니다."
              >
                <Select
                  name="target_pay_id"
                  value={item.target_pay_id || ''}
                  onChange={(e) => onDetailChange('target_pay_id', e.target.value, idx)}
                >
                  <option value="">연결 안 함 (단독 포인트로 생성)</option>

                  {myPayAccounts.length > 0 ? (
                    myPayAccounts.map((pay) => (
                      <option key={pay.id} value={pay.id}>
                        [{pay.provider || '페이'}] {pay.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>등록된 페이 자산이 없습니다.</option>
                  )}
                </Select>
              </Field>

              <Field label="유효기간">
                <Input
                  type="date"
                  value={item.expiry_date ?? ''}
                  onChange={(e) => onDetailChange('expiry_date', e.target.value, idx)}
                />
              </Field>
            </Grid>

            <Grid>
              <Field label="포인트 금액">
                <Input
                  data-type="number"
                  name="current_balance"
                  value={formatNumberWithCommas(data.current_balance) ?? ''}
                  placeholder="예: 1500"
                  onChange={onChange}
                />
              </Field>
            </Grid>
          </Grid>
        ))}
      </Grid>

      {/* ... (합계 금액 등) ... */}
    </>
  );
};
