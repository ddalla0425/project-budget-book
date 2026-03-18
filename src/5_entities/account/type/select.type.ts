import type { Tables } from '@/6_shared/types';
import type { AccountRpcResult } from './rpc.type';
import type { FinancialInstitution } from '@/5_entities/institution';

// ----- 기본 정의 -----
export type AccountType = Tables<'accounts'>['type'] | 'ALL';
export interface AccountBaseInfo extends Tables<'accounts'> {
  tabType: AccountType;
  displayAmount: string;
  icon?: string; // TODO : 추후, 정부API를 통해 받아온 데이터를 사용하던, json 파일로 정의해 놓고 사용하던. 그때 쓸거!
}

// ----- detail 파일 정의 -----
export type CashDetail = Tables<'account_cash_details'>;
export type VoucherDetail = Tables<'account_voucher_details'>;
export type InsuranceDetail = Tables<'account_insurance_details'>;
export type InvestmentDetail = Tables<'account_investment_details'>;
export type SavingDetail = Tables<'account_saving_details'>;
export type PayDetail = Tables<'account_pay_details'>;
export type BankDetail = Tables<'account_bank_details'>;
export type CardDetail = Tables<'account_card_details'>;
export type DebtDetail = Tables<'account_debt_details'>;

// ----- 조회용 타입 정의 -----
export interface CashAccount extends AccountBaseInfo {
  type: 'CASH';
  details: CashDetail[];
  bankNoteType: number;
}

export interface BankAccount extends AccountBaseInfo {
  type: 'BANK';
  linkedCardId?: string;
  details: BankDetail;
  institution: FinancialInstitution;
}

export interface CheckCardAccount extends AccountBaseInfo {
  type: 'CHECK_CARD';
  linkedBankId?: string;
  details: CardDetail;
  institution: FinancialInstitution;
}

export interface CreditCardAccount extends AccountBaseInfo {
  type: 'CREDIT_CARD';
  tmp_cumulative_usage?: number; // 누적사용량 입력 (가상: DB 저장X)
  linkedBankId?: string;
  details: CardDetail;
  institution: FinancialInstitution;
}

export interface PayAccount extends AccountBaseInfo {
  type: 'PAY';
  linkedCardId?: string;
  linkedBankId?: string;
  details: PayDetail;
  institution: FinancialInstitution;
}

export interface SavingAccount extends AccountBaseInfo {
  type: 'SAVING';
  details: SavingDetail;
  linkedCardId?: string;
  linkedBankId?: string;
  institution: FinancialInstitution;
}

export interface InvestmentAccount extends AccountBaseInfo {
  type: 'INVESTMENT';
  details: InvestmentDetail;
  institution: FinancialInstitution;
}

export interface InsuranceAccount extends AccountBaseInfo {
  type: 'INSURANCE';
  details: InsuranceDetail; // 보험은 통상 1:1이므로 단수형 가능
  institution: FinancialInstitution;
}

export interface DebtAccount extends AccountBaseInfo {
  type: 'DEBT';
  details: DebtDetail;
  institution: FinancialInstitution;
}

export interface VoucherAccount extends AccountBaseInfo {
  type: 'GIFT_CARD' | 'POINT';
  details: VoucherDetail[];
  institution: FinancialInstitution;
}

export type AccountListDetailType =
  | CashDetail[]
  | BankDetail
  | CardDetail
  | PayDetail
  | SavingDetail
  | InvestmentDetail
  | InsuranceDetail
  | DebtDetail[]
  | VoucherDetail[];

export type AccountListType =
  | CashAccount
  | BankAccount
  | CheckCardAccount
  | CreditCardAccount
  | PayAccount
  | SavingAccount
  | InvestmentAccount
  | InsuranceAccount
  | DebtAccount
  | VoucherAccount;

export interface AccountState {
  accounts: AccountListType[];
  totalAmount: number;
}

export interface AccountRelations {
  cardToBank: Record<string, AccountRpcResult>;
  bankToCards: Record<string, AccountRpcResult[]>;
  payToPoint: Record<string, AccountRpcResult>;
  debtToAsset: Record<string, AccountRpcResult>;
}

export interface AccountFetchResult {
  banks: BankAccount[];
  cards: (CheckCardAccount | CreditCardAccount)[];
  relations: AccountRelations;
}
