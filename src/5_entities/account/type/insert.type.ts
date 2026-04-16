import type { Tables, TablesInsert } from '@/6_shared/types';

// ----- 기본 정의 -----
export type AccountInsertType = Tables<'accounts'>['type'];
export interface AccountInsertBaseInfo extends Omit<TablesInsert<'accounts'>, 'type'> {
  type: AccountInsertType;
}

// ----- detail 파일 정의 -----
type ExcludeFields = 'id' | 'account_id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at';
export type BankDetailInsert = Omit<TablesInsert<'account_bank_details'>, ExcludeFields>;
export type CardDetailInsert = Omit<TablesInsert<'account_card_details'>, ExcludeFields>;
export type PayDetailInsert = Omit<TablesInsert<'account_pay_details'>, ExcludeFields>;
export type SavingDetailInsert = Omit<TablesInsert<'account_saving_details'>, ExcludeFields>;
export type InvestmentDetailInsert = Omit<TablesInsert<'account_investment_details'>, ExcludeFields>;
export type InsuranceDetailInsert = Omit<TablesInsert<'account_insurance_details'>, ExcludeFields>;
export type DebtDetailInsert = Omit<TablesInsert<'account_debt_details'>, ExcludeFields>;
export type CashDetailInsert = Omit<TablesInsert<'account_cash_details'>, ExcludeFields>;
export type VoucherDetailInsert = Omit<TablesInsert<'account_voucher_details'>, ExcludeFields>;

export interface PointDetailInsert extends Omit<TablesInsert<'account_voucher_details'>, ExcludeFields> {
  target_pay_id?: string | null; // 🌟 디테일 안에 위치해야 합니다!
}

// ----- 저장용 타입 정의 -----
export interface CashAccountInsert extends AccountInsertBaseInfo {
  type: 'CASH';
  details: CashDetailInsert[];
}

export interface BankAccountInsert extends AccountInsertBaseInfo {
  type: 'BANK';
  details: BankDetailInsert;
}

export interface CardAccountInsert extends AccountInsertBaseInfo {
  type: 'CHECK_CARD' | 'CREDIT_CARD';
  details: CardDetailInsert;
}

export interface PayAccountInsert extends AccountInsertBaseInfo {
  type: 'PAY';
  details: PayDetailInsert;
}

export interface SavingAccountInsert extends AccountInsertBaseInfo {
  type: 'SAVING';
  details: SavingDetailInsert;
}

export interface InvestmentAccountInsert extends AccountInsertBaseInfo {
  type: 'INVESTMENT';
  details: InvestmentDetailInsert;
}

export interface InsuranceAccountInsert extends AccountInsertBaseInfo {
  type: 'INSURANCE';
  details: InsuranceDetailInsert;
}

export interface DebtAccountInsert extends AccountInsertBaseInfo {
  type: 'DEBT';
  details: DebtDetailInsert[];
}

export interface VoucherAccountInsert extends AccountInsertBaseInfo {
  type: 'GIFT_CARD';
  details: VoucherDetailInsert[];
}

export interface VoucherAccountInsertToPoint extends AccountInsertBaseInfo {
  type: 'POINT';
  details: PointDetailInsert[];
}

export type AccountSaveDetailType =
  | BankDetailInsert
  | CashDetailInsert
  | CardDetailInsert
  | PayDetailInsert
  | SavingDetailInsert
  | InvestmentDetailInsert
  | InsuranceDetailInsert
  | DebtDetailInsert
  | VoucherDetailInsert
  | PointDetailInsert;

export type AccountSaveType =
  | CashAccountInsert
  | BankAccountInsert
  | CardAccountInsert
  | PayAccountInsert
  | SavingAccountInsert
  | InvestmentAccountInsert
  | InsuranceAccountInsert
  | DebtAccountInsert
  | VoucherAccountInsert
  | VoucherAccountInsertToPoint;
