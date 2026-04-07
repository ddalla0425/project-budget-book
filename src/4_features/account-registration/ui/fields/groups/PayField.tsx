import { useGetDashboardQuery, type AccountSaveType } from '@/5_entities/account';
import { useInstitutionStore } from '@/5_entities/institution';
import { formatNumberWithCommas, parseNumberFromCommas } from '@/6_shared/lib';
import { Alert } from '@/6_shared/ui/alert';
import { Field } from '@/6_shared/ui/field';
import { Grid } from '@/6_shared/ui/grid';
import { Input } from '@/6_shared/ui/input';
import { Select } from '@/6_shared/ui/select';
import { useState } from 'react';

interface Props {
  accounts: AccountSaveType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean | null) => void;
}
export const PayField = ({ accounts, onChange, onDetailChange }: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const data = accounts as Extract<AccountSaveType, { type: 'PAY' }>;
  const institutions = useInstitutionStore((s) => s.institutions);
  const { data: assetData } = useGetDashboardQuery();
  const rawData = assetData?.raw;

  // 🌟 1. 자동 충전 타입 (기본값 세팅)
  const rechargeType = data.details.auto_recharge_type || 'NONE';

  const myAssetAccounts = [
    ...(rawData?.bank || []),
    ...(rawData?.card || []),
    ...(rawData?.pay || []),
    ...(rawData?.voucher || []),
  ].map((acc) => {
    const institutionName = acc.institution?.name || '';
    const displayName = institutionName ? `[${institutionName}] ${acc.name}` : acc.name;
    return {
      id: acc.id,
      type: acc.type,
      displayName,
      current_balance: acc.current_balance || 0,
      linked_account_id: acc.linked_account_id,
    };
  });

  // 🌟 3. 결제 수단(충전 계좌)용 그룹화
  const groupedAssets = {
    은행: myAssetAccounts.filter((a) => a.type === 'BANK'),
    신용카드: myAssetAccounts.filter((a) => a.type === 'CREDIT_CARD'),
    체크카드: myAssetAccounts.filter((a) => a.type === 'CHECK_CARD'),
  };

  // 🌟 4. 포인트 연동용 계좌만 필터링!
  // const pointAccounts = myAssetAccounts.filter((a) => a.type === 'POINT');
  const pointAccounts = myAssetAccounts.filter((a) => {
    // 1. 일단 포인트 타입인지 확인
    if (a.type !== 'POINT') return false;

    // 2. 다른 페이들이 이미 연동해둔(임자 있는) 포인트 ID들을 싹 긁어옵니다.
    const alreadyLinkedPointIds = new Set(
      (rawData?.pay || []).map((payAcc) => payAcc.details?.linked_point_account_id).filter(Boolean) // null이나 undefined 제거
    );

    // 3. 만약 이 포인트가 '지금 내가 폼에서 선택해둔 포인트'라면 무조건 보여줍니다!
    // (수정 모드로 들어왔을 때, 이미 선택한 값이 목록에서 사라지면 안 되기 때문)
    if (a.id === data.details.linked_point_account_id) {
      return true;
    }

    // 4. 그 외의 경우, 이미 다른 페이의 짝꿍이라면(Set에 존재한다면) 목록에서 숨깁니다.
    return !alreadyLinkedPointIds.has(a.id);
  });

  // 🌟 5. 결제 수단 잔액 표시 로직 (InsuranceField 복붙의 마법!)
  let connectedBalanceMessage = '';
  let connectedAccountName = '';
  let balanceFieldLabel = '자동 충전 / 출금 계좌 잔액';

  if (data.linked_account_id) {
    const selectedAsset = myAssetAccounts.find((a) => a.id === data.linked_account_id);
    if (selectedAsset) {
      if (selectedAsset.type === 'BANK') {
        balanceFieldLabel = '선택한 통장 잔액';
        connectedAccountName = selectedAsset.displayName;
        connectedBalanceMessage = `${Number(selectedAsset.current_balance).toLocaleString()} 원`;
      } else {
        balanceFieldLabel = `연결된 출금 계좌 잔액`;
        if (selectedAsset.linked_account_id) {
          const linkedBank = myAssetAccounts.find((a) => a.id === selectedAsset.linked_account_id);
          if (linkedBank) {
            connectedAccountName = linkedBank.displayName;
            connectedBalanceMessage = `${Number(linkedBank.current_balance).toLocaleString()} 원`;
          } else {
            connectedAccountName = '연결 계좌 알 수 없음';
            connectedBalanceMessage = '연결된 계좌 정보를 불러올 수 없습니다.';
          }
        } else {
          connectedAccountName = '출금 계좌 미지정';
          connectedBalanceMessage = '-';
        }
      }
    }
  }

  // 🌟 라디오 버튼 변경 시 안 쓰는 데이터 초기화 로직
  const handleRechargeTypeChange = (newType: string) => {
    onDetailChange('auto_recharge_type', newType);
    if (newType === 'NONE') {
      onDetailChange('recharge_threshold_amount', null);
      onDetailChange('recharge_unit_amount', null);
      onDetailChange('recharge_cycle', null);
      onDetailChange('recharge_day', null);
    } else if (newType === 'THRESHOLD') {
      onDetailChange('recharge_cycle', null);
      onDetailChange('recharge_day', null);
    } else if (newType === 'PERIODIC') {
      onDetailChange('recharge_threshold_amount', null);
      onDetailChange('recharge_cycle', 'MONTHLY'); // 기본값 세팅
    }
  };

  // 🌟 주기(MONTHLY, WEEKLY, DAILY)가 바뀔 때 날짜 데이터 포맷팅
  const handleCycleChange = (newCycle: string) => {
    onDetailChange('recharge_cycle', newCycle);
    if (newCycle === 'DAILY') {
      onDetailChange('recharge_day', null); // 매일이면 날짜 불필요!
    } else {
      onDetailChange('recharge_day', 1); // 월별이면 1일, 주별이면 1(월요일)로 초기화
    }
  };
  return (
    <>
      <Input type="hidden" name="type" value="PAY" />

      <Grid>
        <Alert
          variant="secondary"
          message={`💡 페이 머니(선불충전금)를 관리합니다. \n포인트는 별도로 연결할 수 있습니다.`}
        />
      </Grid>

      <Grid>
        <Field label="페이 서비스 선택">
          <Select name="institution_id" onChange={onChange} value={data.institution_id ?? ''}>
            <option value="" disabled>
              선택하세요
            </option>
            {institutions
              .filter((inst) => inst.type === 'PAY')
              .map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
          </Select>
        </Field>

        <Field label="페이 별칭">
          <Input name="name" value={data.name} onChange={onChange} placeholder={'예: 네이버페이'} required />
        </Field>
      </Grid>

      <Grid>
        <Field label="현재 페이 머니 잔액">
          <Input
            data-type="number"
            name="current_balance"
            value={formatNumberWithCommas(data.current_balance) ?? ''}
            onChange={onChange}
            placeholder="예: 50000"
            required
          />
        </Field>
        <Field
          label="연동할 포인트 (선택)"
          labelTag="span"
          description="결제 시 함께 사용할 포인트가 있다면 선택해주세요."
        >
          {pointAccounts.length > 0 ? (
            <Select
              name="linked_point_account_id"
              value={data.details.linked_point_account_id ?? ''}
              onChange={(e) => onDetailChange('linked_point_account_id', e.target.value || null)}
            >
              <option value="">연결 안 함 / 나중에 연결</option>
              {pointAccounts.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.displayName} (잔액: {Number(pt.current_balance).toLocaleString()}원)
                </option>
              ))}
            </Select>
          ) : (
            <Alert
              variant="secondary"
              align="left"
              message="💡 등록된 포인트 자산이 없습니다. 나중에 포인트를 등록할 때 이 페이를 역으로 연결할 수도 있습니다!"
            />
          )}
        </Field>
      </Grid>

      {/* 🌟 여기에 추가! 소액 후불 결제 한도 영역 */}
      <Grid selectCols={showDetails ? '200px 1fr' : '1fr'}>
        <Field label={'소액 후불 결제 (신용) 사용'}>
          <Input
            type="checkbox"
            name="use_credit_limit"
            checked={showDetails}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setShowDetails(isChecked);

              // 🌟 체크를 풀면 부모의 amount_limit을 빈 값으로 초기화!
              if (!isChecked) {
                onChange({
                  target: { name: 'amount_limit', value: '' },
                } as unknown as React.ChangeEvent<HTMLInputElement>);
              }
            }}
          />
        </Field>

        {showDetails && (
          <Field label="월 후불 한도 금액">
            <Input
              data-type="number"
              name="amount_limit" // 🌟 부모 필드이므로 onChange가 잡습니다!
              value={formatNumberWithCommas(data.amount_limit) ?? ''}
              onChange={onChange}
              placeholder="예: 300000 (부여받은 한도 입력)"
            />
          </Field>
        )}
      </Grid>

      {/* 🌟 결제 / 자동 충전 수단 영역 */}
      <Grid>
        <Field label="결제 수단">
          {myAssetAccounts.length > 0 ? (
            <Select name="linked_account_id" value={data.linked_account_id ?? ''} onChange={onChange} required>
              <option value="" disabled>
                선택하세요
              </option>

              {groupedAssets['은행'].length > 0 && (
                <optgroup label="🏦 은행 계좌 (현금 충전용)">
                  {groupedAssets['은행'].map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.displayName}
                    </option>
                  ))}
                </optgroup>
              )}
              {groupedAssets['신용카드'].length > 0 && (
                <optgroup label="💳 보유 신용 카드 (간편 결제용)">
                  {groupedAssets['신용카드'].map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.displayName}
                    </option>
                  ))}
                </optgroup>
              )}
              {groupedAssets['체크카드'].length > 0 && (
                <optgroup label="💳 보유 체크 카드 (간편 결제용)">
                  {groupedAssets['체크카드'].map((asset) => (
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

        {!!data.linked_account_id && connectedBalanceMessage !== '' && (
          <Field label={balanceFieldLabel} labelTag="span" description={connectedAccountName}>
            <Alert variant="secondary" align="right" message={connectedBalanceMessage} />
          </Field>
        )}
      </Grid>

      {/* 🌟 대망의 자동 충전 로직 UI */}
      <Grid direction="vertical">
        <Field label="자동 충전 설정" labelTag="span">
          <Grid gap={0}>
            {[
              { value: 'NONE', label: '안 함' },
              { value: 'THRESHOLD', label: '기준 잔액 충전' },
              { value: 'PERIODIC', label: '정기 지정일 충전' },
            ].map((opt) => (
              <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="auto_recharge_type"
                  value={opt.value}
                  checked={rechargeType === opt.value}
                  onChange={(e) => handleRechargeTypeChange(e.target.value)}
                />
                <span style={{ fontWeight: rechargeType === opt.value ? '600' : '400' }}>{opt.label}</span>
              </label>
            ))}
          </Grid>
        </Field>
      </Grid>

      {/* 🌟 선택된 자동 충전 방식에 따른 조건부 렌더링 */}
      {rechargeType !== 'NONE' && (
        <Grid
          selectCols={
            rechargeType === 'THRESHOLD'
              ? '1fr 1fr'
              : data.details.recharge_cycle === 'DAILY'
                ? '1fr 1fr'
                : '1fr 1fr 1fr' // 🌟 데일리면 2칸, 아니면 3칸
          }
        >
          {rechargeType === 'THRESHOLD' && (
            <Field label="기준 잔액 (이하로 떨어지면)">
              <Input
                data-type="number"
                name="recharge_threshold_amount"
                value={formatNumberWithCommas(data.details.recharge_threshold_amount) ?? ''}
                onChange={(e) => onDetailChange('recharge_threshold_amount', parseNumberFromCommas(e.target.value))}
                placeholder="예: 10000"
              />
            </Field>
          )}

          {rechargeType === 'PERIODIC' && (
            <>
              <Field label="충전 주기">
                <Select
                  name="recharge_cycle"
                  value={data.details.recharge_cycle || 'MONTHLY'}
                  onChange={(e) => handleCycleChange(e.target.value)} // 🌟 새로 만든 핸들러 연결
                >
                  <option value="MONTHLY">매월</option>
                  <option value="WEEKLY">매주</option>
                  <option value="DAILY">매일</option>
                </Select>
              </Field>

              {/* 🌟 DAILY가 아닐 때만 날짜/요일 선택 필드 노출 */}
              {data.details.recharge_cycle !== 'DAILY' && (
                <Field label={data.details.recharge_cycle === 'WEEKLY' ? '충전 요일' : '충전일'}>
                  <Select
                    name="recharge_day"
                    value={data.details.recharge_day?.toString() ?? ''}
                    onChange={(e) => onDetailChange('recharge_day', Number(e.target.value))}
                    required
                  >
                    <option value="" disabled>
                      선택
                    </option>
                    {data.details.recharge_cycle === 'WEEKLY' ? (
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
            </>
          )}

          <Field label="1회 충전 금액">
            <Input
              data-type="number"
              name="recharge_unit_amount"
              value={formatNumberWithCommas(data.details.recharge_unit_amount) ?? ''}
              onChange={(e) => onDetailChange('recharge_unit_amount', parseNumberFromCommas(e.target.value))}
              placeholder="예: 50000"
              required
            />
          </Field>
        </Grid>
      )}
    </>
  );
};

// TODO : 연동할 포인트 내역에서 불러오는 포인트 들 중에서.
//        account_pay_details 테이블의 linked_point_account_id 로 등록 되어 있는 녀석이면 제외 해야 할듯.
