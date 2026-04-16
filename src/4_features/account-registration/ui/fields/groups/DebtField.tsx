import { normalizeAccountValue } from '@/4_features/account-registration/lib/utils';
import {
  DEBT_SOURCE_PLACEHOLDERS,
  DEBT_TYPE_LABELS,
  DEBT_TYPE_MAPPING,
  INSTITUTION_TYPE_LABEL,
  useGetDashboardQuery,
  type AccountSaveType,
} from '@/5_entities/account';
import type { RawDashboardResponse } from '@/5_entities/account/type/rpc.type';
import { useInstitutionStore } from '@/5_entities/institution';
import { appendJosa, formatNumberWithCommas, getConnectedBalanceInfo, getGroupedAssetOptions, parseNumberFromCommas } from '@/6_shared/lib';
import { calculateExpiryDate } from '@/6_shared/lib';
import { Alert } from '@/6_shared/ui/alert';
import { Field } from '@/6_shared/ui/field';
import { Grid } from '@/6_shared/ui/grid';
import { Input } from '@/6_shared/ui/input';
import { Select } from '@/6_shared/ui/select';
import { Tab } from '@/6_shared/ui/tab';
import { useMemo, useState } from 'react';

interface Props {
  accounts: Extract<AccountSaveType, { type: 'DEBT' }>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean | null, index?: number) => void;
}

const institutionType = Object.entries(INSTITUTION_TYPE_LABEL).map(([value, label]) => ({
  value,
  label,
}));

// TODO : 부채 입력 필드 자체를 자산 입력과 분리해서 보여주기
export const DebtField = ({ accounts, onChange, onDetailChange }: Props) => {
  const institutions = useInstitutionStore((s) => s.institutions);
  const { data } = useGetDashboardQuery();
  const [selectedTypes, setSelectedTypes] = useState<Record<number, string>>({});
  const [customRemaining, setCustomRemaining] = useState<Record<number, boolean>>({});

  const handleDetailUpdate = (field: string, value: string | number | boolean | null, index: number) => {
    const safeValue = typeof value === 'number' ? normalizeAccountValue(field, value) : value;
    onDetailChange(field, safeValue, index);

    // 🌟 [추가] 직접입력 모드가 아닐 때 '원금'을 바꿨다면, '잔액' 상태도 여기서 한 번에 동기화!
    if (field === 'total_principal' && !customRemaining[index]) {
      onDetailChange('remaining_amount', safeValue, index);
    }

    // 2. 총액 계산 로직
    if (field === 'total_principal' || field === 'remaining_amount') {
      const totalDebt = (accounts.details || []).reduce((sum, item, i) => {
        // 지금 수정 중인 행이라면 과거 상태 대신 '방금 입력된 최신 값' 적용
        const currentItem = i === index ? { ...item, [field]: safeValue } : item;

        if (i === index && field === 'total_principal' && !customRemaining[i]) {
          currentItem.remaining_amount = safeValue as number;
        }

        // 🌟 최종 잔액 계산 (직접입력 모드면 잔액, 아니면 원금을 기준)
        const amount = customRemaining[i] ? Number(currentItem.remaining_amount) : Number(currentItem.total_principal);
        return sum + (amount || 0);
      }, 0);

      const finalBalance = -Math.abs(totalDebt); // 빚이니까 무조건 마이너스!

      // 3. 부모 컴포넌트에 최종 금액 1번만 전달
      onChange({
        target: { name: 'current_balance', value: finalBalance, valueAsNumber: finalBalance, type: 'number' },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const rawData = data?.raw;

  const { flatAssets, groupedAssets } = useMemo(
    () => getGroupedAssetOptions(rawData as RawDashboardResponse),
    [rawData]
  );

  const balanceInfo = getConnectedBalanceInfo(accounts.linked_account_id, flatAssets);

  const handleDateChange = (field: 'start_date' | 'installment_months', value: string | number, idx: number) => {
    onDetailChange(field, value, idx);

    // 방금 바꾼 값 or 기존 폼의 값 가져오기
    const startDate = field === 'start_date' ? (value as string) : accounts.details[idx].start_date;
    const duration = field === 'installment_months' ? Number(value) : Number(accounts.details[idx].installment_months);

    if (startDate && duration > 0) {
      const expiry = calculateExpiryDate(startDate, duration, 'MONTHS'); // 🌟 만능 유틸!
      if (expiry) onDetailChange('expiry_date', expiry, idx);
    } else if (duration === 0 || isNaN(duration)) {
      onDetailChange('expiry_date', '', idx); // 개월수를 지우면 만기일도 초기화
    }
  };
  return (
    <>
      {(accounts.details || []).map((item, idx) => {
        const currentTab = selectedTypes[idx] || 'BANK';
        const filteredList = institutions.filter((inst) => inst.type === currentTab);
        const isInstitution = item.debt_source === 'INSTITUTION';
        const isPrivate = item.debt_source === 'PRIVATE';
        const isMyAsset = item.debt_source === 'MY_ASSET';
        const currentLabel = INSTITUTION_TYPE_LABEL[currentTab as keyof typeof INSTITUTION_TYPE_LABEL] || '금융기관';
        const placeholderText = `${appendJosa(currentLabel, '을를')} 선택하세요`;
        // '내 자산 연동' 모드일 경우, 사용자가 선택한 자산 객체를 찾아옴
        const selectedAsset = isMyAsset ? flatAssets.find((a) => a.id === accounts.linked_account_id) : null;

        // 상수 매핑 객체에서 조건에 맞는 배열만 빼옴(성능 최적화)
        let availableDebtTypes: string[] = [];

        if (!item.debt_source) {
          availableDebtTypes = [];
        } else if (isMyAsset) {
          // 새로 만든 MY_ASSET 매핑 객체를 활용!
          if (selectedAsset) {
            const myAssetMapping = DEBT_TYPE_MAPPING.MY_ASSET as Record<string, string[]>;
            availableDebtTypes = myAssetMapping[selectedAsset.type] || myAssetMapping.DEFAULT || [];
          } else {
            // 자산 선택 전
            availableDebtTypes = [];
          }
        } else if (isInstitution) {
          // 기관인 경우: 탭(BANK, CARD 등)에 맞는 배열을 가져옴
          const instMapping = DEBT_TYPE_MAPPING.INSTITUTION as Record<string, string[]>;
          availableDebtTypes = instMapping[currentTab] || instMapping.DEFAULT || [];
        } else {
          // 기타 출처
          availableDebtTypes =
            (DEBT_TYPE_MAPPING[item.debt_source] as string[]) || (DEBT_TYPE_MAPPING.DEFAULT as string[]) || [];
        }

        return (
          <Grid direction="vertical" key={idx} autoCols={false}>
            <Grid>
              <Input type="hidden" name="balance_type" value={accounts.balance_type ?? 'LIABILITY'} />
              <Field label="채무 출처">
                <Select
                  name="debt_source"
                  onChange={(e) => {
                    const newSource = e.target.value;
                    onDetailChange('debt_source', newSource, idx);
                    if (newSource !== 'INSTITUTION') {
                      // 금융기관 외 다른 옵션 선택시, 기관 정보 초기화
                      onDetailChange('institution_id', null, idx);
                      onDetailChange('institution_type', null, idx);
                    }
                    if (newSource !== 'MY_ASSET') {
                      // 가상의 이벤트 객체를 만들어 최상위 onChange 호출
                      onChange({
                        target: {
                          name: 'linked_account_id',
                          value: '',
                        } as unknown as EventTarget & HTMLSelectElement,
                      } as React.ChangeEvent<HTMLSelectElement>);
                    }
                  }}
                  value={item.debt_source || ''}
                >
                  <option value="" disabled>
                    출처를 선택해주세요
                  </option>
                  <option value="MY_ASSET">보유 자산 담보/연계 (마통, 예적금담보, 카드대출 등)</option>
                  <option value="INSTITUTION">금융기관</option>
                  <option value="PRIVATE">개인 간 거래</option>
                  <option value="CORPORATE">회사 대출</option>
                  <option value="GOVERNMENT">정부/공공기관</option>
                  <option value="OTHER">기타</option>
                </Select>
              </Field>

              {isMyAsset && (
                <Grid autoCols={true}>
                  <Field label="담보 및 연계 자산 선택" labelTag="span">
                    <Select
                      name="linked_account_id"
                      onChange={(e) => {
                        // 1. 최상위 계좌 연결 ID 업데이트
                        onChange(e);
                        // 💡 2. 자산이 바뀌면 하위 대출 종류도 깨끗하게 비워줍니다!
                        onDetailChange('debt_type', '', idx);
                      }}
                      value={accounts.linked_account_id || ''}
                    >
                      <option value="" disabled>
                        채무의 바탕이 되는 보유 자산을 선택해주세요
                      </option>

                      {/* optgroup을 사용하여 카테고리별로 예쁘게 보여줍니다 */}
                      {/* {groupedAssets['은행'].length > 0 && (
                        <optgroup label="💰 통장">
                          {groupedAssets['은행'].map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.displayName}
                            </option>
                          ))}
                        </optgroup>
                      )} */}

                      {groupedAssets['예적금'].length > 0 && (
                        <optgroup label="🏦 예적금">
                          {groupedAssets['예적금'].map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.displayName}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {groupedAssets['신용카드'].length > 0 && (
                        <optgroup label="💳 보유 신용 카드">
                          {groupedAssets['신용카드'].map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.displayName}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {groupedAssets['투자'].length > 0 && (
                        <optgroup label="📈 투자">
                          {groupedAssets['투자'].map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.displayName}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {groupedAssets['보험'].length > 0 && (
                        <optgroup label="🏢 보험">
                          {groupedAssets['보험'].map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.displayName}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </Select>
                  </Field>
                </Grid>
              )}
            </Grid>

            {isInstitution && (
              <Grid autoCols={true}>
                <Field label="채무 금융기관 선택" labelTag="span">
                  <div>
                    <Tab
                      variant="underline"
                      options={institutionType}
                      currentValue={currentTab}
                      tabSize="md"
                      onChange={(value) => {
                        setSelectedTypes((prev) => ({ ...prev, [idx]: value }));
                        onDetailChange('institution_id', null, idx);
                        onDetailChange('name', null, idx);
                        onDetailChange('institution_type', value, idx);
                      }}
                    />

                    <Select
                      name="institution_id"
                      onChange={(e) => onDetailChange('institution_id', e.target.value, idx)}
                      value={item.institution_id || ''}
                    >
                      <option value="" disabled>
                        {placeholderText}
                      </option>
                      {/* 필터링된 리스트만 출력 */}
                      {filteredList.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </Field>
              </Grid>
            )}

            <Grid>
              <Field label="채무 종류">
                <Select
                  name="debt_type"
                  value={item.debt_type || ''}
                  onChange={(e) => onDetailChange('debt_type', e.target.value, idx)}
                  disabled={!item.debt_source || (isMyAsset && !accounts.linked_account_id)}
                >
                  <option value="" disabled>
                    {!item.debt_source
                      ? '출처를 먼저 선택해주세요'
                      : isMyAsset && !accounts.linked_account_id
                        ? '연결할 자산을 먼저 선택해주세요'
                        : '종류를 선택해주세요'}
                  </option>
                  {(availableDebtTypes || []).map((typeKey) => (
                    <option key={typeKey} value={typeKey}>
                      {DEBT_TYPE_LABELS[typeKey]}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="채무 이름">
                <Input
                  name="name"
                  onChange={(e) => {
                    console.log('name 의 값 : ', e.target.value);
                    onDetailChange('name', e.target.value, idx);
                  }}
                  value={item.name || ''}
                  placeholder={DEBT_SOURCE_PLACEHOLDERS[item.debt_source || 'OTHER'] || DEBT_SOURCE_PLACEHOLDERS.OTHER}
                  required
                />
              </Field>
            </Grid>

            <Grid selectCols={'1fr 1fr 1fr'}>
              <Field label="채무 시작일">
                <Input
                  type="date"
                  name="start_date"
                  // onChange={(e) => {
                  //   const newStartDate = e.target.value;
                  //   // 시작일 업데이트
                  //   onDetailChange('start_date', newStartDate, idx);

                  //   // 만기일 자동 계산 (개월 수가 이미 입력되어 있다면)
                  //   const months = Number(item.installment_months);
                  //   if (newStartDate && months > 0) {
                  //     const expiry = calculateExpiryDate(newStartDate, months);
                  //     if (expiry) onDetailChange('expiry_date', expiry, idx);
                  //   }
                  // }}
                  onChange={(e) => handleDateChange('start_date', e.target.value, idx)}
                  value={item.start_date || ''}
                  required
                />
              </Field>

              <Field label="채무 기간(개월수)">
                <Input
                  type="number"
                  name="installment_months"
                  // onChange={(e) => {
                  //   const months = Number(e.target.value);
                  //   // 개월 수 업데이트
                  //   onDetailChange('installment_months', months, idx);

                  //   // 만기일 자동 계산 (시작일이 이미 입력되어 있다면)
                  //   if (item.start_date && months > 0) {
                  //     const expiry = calculateExpiryDate(item.start_date, months);
                  //     if (expiry) onDetailChange('expiry_date', expiry, idx);
                  //   } else if (months === 0 || isNaN(months)) {
                  //     // 개월 수를 지웠을 경우 만기일도 초기화하고 싶다면 추가
                  //     onDetailChange('expiry_date', '', idx);
                  //   }
                  // }}
                  onChange={(e) => handleDateChange('installment_months', e.target.value, idx)}
                  value={item.installment_months || ''}
                  placeholder="예: 36"
                  required
                />
              </Field>

              {/* [x] : 대출 시작일 + 지속 개월 수 = 채무 만기일 자동계산  */}
              <Field label="채무 만기일(자동계산)">
                <Input
                  type="date"
                  name="expiry_date"
                  onChange={(e) => onDetailChange('expiry_date', e.target.value, idx)}
                  value={item.expiry_date || ''}
                />
              </Field>
            </Grid>

            {/* [x] 기본설정 : 채무원금 = 채무 잔액 , 납부완료 회차(숨겨짐) 필드값 0
                    직접입력 체크박스 선택시 : 채무 잔액 수정가능 , 납부완료 회차(보여짐) 필드값 입력받음
            */}
            <Grid selectCols="1fr 1fr auto">
              <Field label="채무 원금">
                <Input
                  data-type="number"
                  name="total_principal"
                  onChange={(e) => {
                    // 🌟 이제 한 번만 호출하면 내부에서 잔액까지 다 처리합니다!
                    handleDetailUpdate('total_principal', parseNumberFromCommas(e.target.value), idx);
                  }}
                  value={formatNumberWithCommas(item.total_principal) || ''}
                  required
                />
              </Field>

              <Field label="채무 잔액">
                <Input
                  disabled={!customRemaining[idx]}
                  data-type="number"
                  name="remaining_amount"
                  onChange={(e) => handleDetailUpdate('remaining_amount', parseNumberFromCommas(e.target.value), idx)}
                  value={formatNumberWithCommas(item.remaining_amount) || ''}
                />
              </Field>

              <Field label="직접입력">
                <Input
                  type="checkbox"
                  checked={!!customRemaining[idx]}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    // 체크 상태 업데이트
                    setCustomRemaining((prev) => ({ ...prev, [idx]: isChecked }));

                    // 체크를 해제하면 다시 잔액을 원금과 똑같이 덮어씀 (롤백)
                    if (!isChecked) {
                      handleDetailUpdate('remaining_amount', item.total_principal || 0, idx);
                      handleDetailUpdate('current_installment_plan', 0, idx);
                    }
                  }}
                />
              </Field>
            </Grid>

            <Grid selectCols={customRemaining[idx] ? '100px 120px 100px 1fr' : '120px 100px 1fr'}>
              {customRemaining[idx] && (
                <Field label="납부 완료 회차">
                  <Input
                    type="number"
                    name="current_installment_plan"
                    placeholder="예: 5"
                    value={item.current_installment_plan || ''}
                    onChange={(e) => {
                      // 음수 입력 방지 및 숫자 변환
                      const rounds = Math.max(0, Number(e.target.value));
                      handleDetailUpdate('current_installment_plan', rounds, idx);
                    }}
                    required
                  />
                </Field>
              )}
              <Field label="채무 금리 (연이율)">
                <Input
                  type="number"
                  name="interest_rate"
                  onChange={(e) => handleDetailUpdate('interest_rate', Number(e.target.value), idx)}
                  placeholder="예: 1.2"
                  value={item.interest_rate || ''}
                  required
                />
              </Field>

              <Field label="상환 예정일">
                <Select
                  name="repayment_day"
                  onChange={(e) => onDetailChange('repayment_day', e.target.value, idx)}
                  value={item.repayment_day || ''}
                  required
                >
                  <option value="" disabled>
                    날짜 선택
                  </option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}일
                    </option>
                  ))}
                </Select>
              </Field>

              {/* TODO: 
              1. 상환 방식에 따른 계산을 어떻게 적용할 것인지. 이건 입력시 고민할 문제가 아닌가? 입력 받고, 화면에 뿌려줄때 계산되서 보여줘야 하는거 같은데 체크하기. 
              2. 상환 방식에 따라 Field에 description 으로 방식에 대한 설명해주기
              */}
              <Field label="상환 방식">
                <Select
                  name="repayment_method"
                  onChange={(e) => onDetailChange('repayment_method', e.target.value, idx)}
                  value={item.repayment_method || (isPrivate ? 'INTEREST_ONLY' : '')}
                  required
                >
                  <option value="" disabled>
                    방식을 선택해주세요
                  </option>
                  <option value="PRINCIPAL_EQUAL">원금 균등 (할부)</option>
                  <option value="LEVEL_PAYMENT">원리금 균등</option>
                  <option value="INTEREST_ONLY">
                    {isPrivate ? '만기 일시 상환 (이자만 먼저 납부)' : '만기 일시 상환'}
                  </option>
                </Select>
              </Field>
            </Grid>

            <Grid>
              <Field label="대출 상태 관리" labelTag="span">
                <Grid gap={0}>
                  {[
                    { value: 'ACTIVE', label: '정상 상환 중' },
                    { value: 'PREPAID', label: '일부 중도상환' },
                    { value: 'DELINQUENT', label: '연체 상태' },
                    { value: 'PAID_OFF', label: '상환 완료' },
                  ].map((statusOpt) => (
                    <label
                      key={statusOpt.value}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      <input
                        type="radio"
                        name={`status_${idx}`}
                        value={statusOpt.value}
                        checked={(item.status || 'ACTIVE') === statusOpt.value}
                        onChange={(e) => onDetailChange('status', e.target.value, idx)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: (item.status || 'ACTIVE') === statusOpt.value ? '600' : '400',
                        }}
                      >
                        {statusOpt.label}
                      </span>
                    </label>
                  ))}
                </Grid>
              </Field>
            </Grid>

            <Grid>
              <Field label="자동이체 통장 (상환 계좌)">
                <Select
                  name="repayment_account_id"
                  onChange={(e) => onDetailChange('repayment_account_id', e.target.value, idx)}
                  value={item.repayment_account_id || ''}
                  required
                >
                  {/* 직접 이체하는 경우도 있으므로 기본값은 비워둡니다 */}
                  {/* TODO : 선택 안 함 (직접상환) 잠시 보류 */}
                  <option value="" disabled>
                    선택하세요
                  </option>

                  {/* 은행 통장 목록만 뽑아서 보여줍니다 */}
                  {groupedAssets['은행']?.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.displayName}
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
          </Grid>
        );
      })}
    </>
  );
};
