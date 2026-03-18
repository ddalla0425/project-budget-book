import type { AccountFormState } from '../model/form.store';
import type {
  AccountInsertType,
  BankDetailInsert,
  CardDetailInsert,
  CashDetailInsert,
  DebtDetailInsert,
  InsuranceDetailInsert,
  InvestmentDetailInsert,
  PayDetailInsert,
  VoucherDetailInsert,
} from '@/5_entities/account';

export const INITIAL_DETAILS: Record<AccountInsertType, AccountFormState['details']> = {
  BANK: {
    account_number: '',
    deposit_rate: 0,
    interest_cycle: 'MONTHLY',
    interest_settlement_day: null,
    is_main_account: false,
    loan_rate: 0,
  } as BankDetailInsert,

  CASH: [
    {
      cash_type: 'TOTAL',
      denomination: 50000,
      quantity: 0,
    },
  ] as CashDetailInsert[],

  GIFT_CARD: [
    {
      expiry_date: undefined,
      denomination: 50000,
      quantity: 0,
      is_used: false,
      voucher_name: '',
    },
  ] as VoucherDetailInsert[],

  POINT: [
    {
      expiry_date: undefined,
      denomination: 50000,
      quantity: 0,
      is_used: false,
      voucher_name: '',
    },
  ] as VoucherDetailInsert[],

  DEBT: [
    {
      expiry_date: undefined,
      name: '',
      institution_id: '',
      debt_source: '',
      debt_type: '',
      interest_rate: 0,
      remaining_amount: 0,
      repayment_day: -1,
      start_date: undefined,
      status: 'ACTIVE',
      total_principal: 0,
    },
  ] as DebtDetailInsert[],

  CREDIT_CARD: {
    billing_day: 1,
    start_month_offset: -2,
    start_day: 1,
    end_month_offset: -1,
    end_day: 0,
  } as CardDetailInsert,

  CHECK_CARD: {
    billing_day: 1,
    start_month_offset: -2,
    start_day: 1,
    end_month_offset: -1,
    end_day: 0,
  } as CardDetailInsert,

  INVESTMENT: {
    average_buy_price: 0,
    last_market_price: 0,
    ticker_symbol: null,
    total_quantity: 0,
  } as InvestmentDetailInsert,

  INSURANCE: {
    interest_rate: 0,
    status: 'ACTIVE',
    estimated_refund_amount: 0,
    is_refundable: false,
    premium_amount: 0,
  } as InsuranceDetailInsert,

  PAY: {
    is_auto_rechargeable: false,
    linked_point_account_id: null,
    recharge_unit_amount: 0,
  } as PayDetailInsert,
};
