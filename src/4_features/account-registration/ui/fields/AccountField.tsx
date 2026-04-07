import { Field } from '@/6_shared/ui/field';
import { Grid } from '@/6_shared/ui/grid';
import { type AccountInsertType, type AccountSaveType } from '@/5_entities/account';
import { ACCOUNT_TYPE_LABELS } from '@/5_entities/account';
import { BankField } from './groups/BankField';
import { CardField } from './groups/CardField';
import { CashField } from './groups/CashField';
import { Tab } from '@/6_shared/ui/tab';
import { DebtField } from './groups/DebtField';
import { InsuranceField } from './groups/InsuranceField';
import { PayField } from './groups/PayField';
import { VoucherField } from './groups/VoucherField';
import { normalizeAccountValue } from '../../lib/utils';
import { INITIAL_DETAILS } from '../../constants/accountInitialValues';
import { SavingField } from './groups/SavingField';
import { InvestmentField } from './groups/InvestmentField';
import { parseNumberFromCommas } from '@/6_shared/lib';

interface AccountFieldsProps {
  form: AccountSaveType;
  updateForm: (callback: (prev: AccountSaveType) => AccountSaveType) => void;
  onTypeChange?: (type: AccountInsertType) => void;
  onAddDetail: () => void;
  onRemoveDetail: (index: number) => void;
  bankAccounts: { id: string; name: string; type?: string; current_balance?: number }[];
  isCreateMode?: boolean; // true: 신규 등록, false: 대기열 수정
}

const accountTypeOptions = Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const AccountFields = ({
  form,
  updateForm,
  onTypeChange,
  onAddDetail,
  onRemoveDetail,
  bankAccounts,
  isCreateMode = true,
}: AccountFieldsProps) => {
  const isCredit = form.type === 'CREDIT_CARD';
  const isCheck = form.type === 'CHECK_CARD';
  const isCard = isCredit || isCheck;
  const isBank = form.type === 'BANK';
  const isCash = form.type === 'CASH';
  const isDebt = form.type === 'DEBT';
  const isInsurance = form.type === 'INSURANCE';
  const isPay = form.type === 'PAY';
  const isGiftCard = form.type === 'GIFT_CARD';
  const isPoint = form.type === 'POINT';
  const isSaving = form.type === 'SAVING';
  const isInvestment = form.type === 'INVESTMENT';
  const isVoucher = isGiftCard || isPoint;
  const hasBankAccounts = bankAccounts.length > 0;
  const showBankField = (isCreateMode && !hasBankAccounts) || isBank;
  console.log(' hasBankAcoounts : ', !hasBankAccounts);

  const optionsWithDisabled = accountTypeOptions.map((opt) => ({
    ...opt,
    disabled: opt.value !== 'BANK' && isCreateMode && !hasBankAccounts,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value, type } = target;
    // const dataType = e.target.getAttribute('data-type');
    // 🌟 핵심 방어 로직: getAttribute가 있는 진짜 DOM 엘리먼트일 때만 호출 (가짜 객체 에러 방지)
    const dataType = typeof target.getAttribute === 'function' ? target.getAttribute('data-type') : null;

    if (!name) return; // 이름없는 가상 필드들 제외

    let finalValue: string | number | null = value;

    // finalValue =
    //   type === 'number'
    //     ? value === ''
    //       ? null
    //       : normalizeAccountValue(name, (e.target as HTMLInputElement).valueAsNumber)
    //     : value;
    // HTML 기본 type="number" 이거나, 콤마 처리를 위해 우리가 부여한 data-type="number" 인 경우
    if (type === 'number' || dataType === 'number') {
      if (value.trim() === '') {
        finalValue = null; // 빈 값이면 null로 처리
      } else {
        // data-type="number" 이면 공용함수로 콤마 제거 후 숫자 파싱, 아니면 기존 valueAsNumber 활용
        const parsedNumber =
          dataType === 'number'
            ? parseNumberFromCommas(value)
            : (e.target as HTMLInputElement).valueAsNumber;

        // 파싱된 숫자가 유효하지 않으면 null, 정상이면 normalizeAccountValue 거치기
        finalValue =
          Number.isNaN(parsedNumber) || parsedNumber === null
            ? null
            : normalizeAccountValue(name, parsedNumber);
      }
    }

    updateForm((prev): AccountSaveType => {
      const nextType = (name === 'type' ? finalValue : prev.type) as AccountInsertType; // 바뀔 값들 미리 준비
      const nextDetails = name === 'type' ? INITIAL_DETAILS[nextType as keyof typeof INITIAL_DETAILS] : prev.details; // details 결정 (타입이 바뀌었으면 초기값, 아니면 기존값)

      return {
        // 공통 필드 업데이트를 포함한 기본 객체 생성
        ...prev,
        [name]: finalValue,
        type: nextType,
        details: nextDetails,
      } as AccountSaveType;
    });
  };

  const handleDetailChange = (field: string, value: string | number | boolean | null, index?: number) => {
    updateForm((prev): AccountSaveType => {
      // 1:N 관계(배열)인 경우 처리
      if (Array.isArray(prev.details)) {
        if (index === undefined) return prev; // 배열인데 인덱스가 없으면 무시
        const newDetails = [...prev.details];
        newDetails[index] = { ...newDetails[index], [field]: value };

        return { ...prev, details: newDetails } as AccountSaveType;
      }

      // 1:1 관계인 경우
      let finalValue = value;
      if (typeof value === 'number') {
        // 하위에서 빈칸을 지워서 NaN이 날아오면? 0으로 세탁되지 못하게 null로 강제지정, 정상적인 숫자일 때만 공용함수를 통해 null/0으로(0은 금지필드 여부에 따라 null/0)으로 세탁
        finalValue = Number.isNaN(value) ? null : normalizeAccountValue(field, value);
      }

      return {
        ...prev,
        details: {
          ...prev.details,
          [field]: finalValue,
        },
      } as AccountSaveType;
    });
  };

  return (
    <>
      {/* 공용 자산 유형 선택 탭 */}
      <Grid direction={'vertical'}>
        <Field
          label="자산 유형"
          labelTag="span"
          description={isCreateMode && !hasBankAccounts ? '* 등록된 계좌가 없습니다. 계좌를 먼저 등록해 주세요.' : ''}
        >
          <div>
            <Tab
              variant="pill"
              tabSize="md"
              options={optionsWithDisabled}
              currentValue={form.type}
              disabled={!isCreateMode}
              onChange={(value) => onTypeChange?.(value)}
            />
          </div>
        </Field>
      </Grid>

      {/* 은행 필드 */}
      {showBankField && isBank && (
        <BankField accounts={form} onChange={handleChange} onDetailChange={handleDetailChange} />
      )}

      {/* 카드 필드 - (신용 + 체크) */}
      {isCard && (
        <CardField
          accounts={form}
          onChange={handleChange}
          onDetailChange={handleDetailChange}
          bankAccounts={bankAccounts}
        />
      )}

      {/* 캐시(현금) 필드 */}
      {isCash && (
        <CashField
          accounts={form}
          onChange={handleChange}
          onDetailChange={handleDetailChange}
          onAddDetail={onAddDetail}
          onRemoveDetail={onRemoveDetail}
        />
      )}

      {/* 채무 필드 */}
      {isDebt && <DebtField accounts={form} onChange={handleChange} onDetailChange={handleDetailChange} />}

      {/* 보험 필드 */}
      {isInsurance && (
        <InsuranceField
          accounts={form}
          onChange={handleChange}
          onDetailChange={handleDetailChange}
          isAssetMode={isCreateMode}
        />
      )}

      {/* 페이(간편결제) 필드 */}
      {isPay && <PayField accounts={form} onChange={handleChange} onDetailChange={handleDetailChange} />}

      {/* 바우처 필드 (상품권 + 포인트) */}
      {isVoucher && (
        <VoucherField
          accounts={form}
          onChange={handleChange}
          onDetailChange={handleDetailChange}
          onAddDetail={onAddDetail}
          onRemoveDetail={onRemoveDetail}
          bankAccounts={bankAccounts}
        />
      )}

      {/* 예적금 필드 */}
      {isSaving && (
        <SavingField
          accounts={form}
          onChange={handleChange}
          onDetailChange={handleDetailChange}
          bankAccounts={bankAccounts}
        />
      )}

      {/* 예적금 필드 */}
      {isInvestment && <InvestmentField accounts={form} onChange={handleChange} onDetailChange={handleDetailChange} />}
    </>
  );
};
