import type { Tables } from '@/6_shared/types';
import type {
  AccountListDetailType,
  BankAccount,
  CashAccount,
  CheckCardAccount,
  CreditCardAccount,
  DebtAccount,
  DebtDetail,
  InsuranceAccount,
  InvestmentAccount,
  PayAccount,
  SavingAccount,
  VoucherAccount,
} from './select.type';
import type { FinancialInstitution } from '@/5_entities/institution';

// ----- 기본 정의 -----
export interface AccountRpcResult extends Tables<'accounts'> {
  details: AccountListDetailType;
}

export interface AccountRelationResult {
  info: AccountRpcResult; // 여기에 실제 데이터가 들어있음
  institution: FinancialInstitution | null;
  [key: string]: AccountListDetailType | unknown;
}

// ----- RPC에서 추가로 계산해서 보내주는 필드 타입 정의 -----
export interface ComputedCardFields {
  expected_billing_amount: number;
  total_installment_debt: number;
}

export interface ComputedInsuranceFields {
  total_linked_debt_amount: number;
  linked_debts: DebtDetail[];
}

export interface ComputedAssetFields {
  linked_debts: DebtDetail[];
}

// 자산 조회용 반환 타입
export type RawAccountResponse = Tables<'accounts'> & {
  account_cash_details: Tables<'account_cash_details'>[];
  account_bank_details: Tables<'account_bank_details'>[];
  account_card_details: Tables<'account_card_details'>[];
  account_pay_details: Tables<'account_pay_details'>[];
  account_voucher_details: Tables<'account_voucher_details'>[];
  account_insurance_details: Tables<'account_insurance_details'>[];
  account_investment_details: Tables<'account_investment_details'>[];
  account_saving_details: Tables<'account_saving_details'>[];
  account_debt_details: Tables<'account_debt_details'>[];
  financial_institutions: FinancialInstitution;
};

// ----- 대쉬보드용 RPC 반환 타입
export interface RawDashboardResponse {
  fetched_at: string;
  bank: BankAccount[];
  // 카드는 계산된 필드가 포함된 인터페이스와 결합
  card: ((CreditCardAccount | CheckCardAccount) & ComputedCardFields)[];
  investment: (InvestmentAccount & ComputedAssetFields)[];
  insurance: (InsuranceAccount & ComputedInsuranceFields)[];
  saving: (SavingAccount & ComputedAssetFields)[];
  pay: PayAccount[];
  cash: CashAccount[];
  voucher: VoucherAccount[];
  debt: (DebtAccount & { debt_items: DebtDetail[]; collateral_info: AccountListDetailType })[];
  relations: AccountRelation[];
}
export interface AccountRelation {
  rel_type: 'ACCOUNT_LINK' | 'PAY_POINT_LINK' | 'DEBT_ACCOUNT_LINK' | 'SAVING_PAYOUT_LINK';
  source_account: AccountRelationResult; // 연결을 시작하는 계좌 (예: 카드)
  target_account: AccountRelationResult; // 연결된 대상 계좌 (예: 결제 은행)
}
