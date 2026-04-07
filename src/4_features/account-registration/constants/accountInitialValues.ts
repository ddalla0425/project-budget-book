import type {
  AccountInsertType,
  AccountSaveType,
  BankDetailInsert,
  CardDetailInsert,
  CashDetailInsert,
  DebtDetailInsert,
  InsuranceDetailInsert,
  InvestmentDetailInsert,
  PayDetailInsert,
  SavingDetailInsert,
  VoucherDetailInsert,
} from '@/5_entities/account';

export const INITIAL_DETAILS = {
  BANK: {
    account_number: '',
    deposit_rate: null,
    interest_cycle: 'MONTHLY',
    interest_settlement_day: null,
    is_main_account: false,
    loan_rate: null,
  } as BankDetailInsert,

  SAVING: {
    is_installment: true,
  } as SavingDetailInsert,

  CASH: [
    {
      cash_type: 'BILL',
      denomination: 50000,
      quantity: 0,
    },
  ] as CashDetailInsert[],

  GIFT_CARD: [
    {
      expiry_date: '',
      denomination: 50000,
      quantity: 0,
      is_used: false,
      voucher_name: '',
      is_convertible: false,
      convertible_account_id: null,
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
      repayment_day: 0,
      start_date: undefined,
      status: 'ACTIVE',
      total_principal: 0,
      total_prepaid_amount: 0,
      installment_months: 0,
      current_installment_plan: 0,
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
    investment_type: 'STOCK',
    average_buy_price: null,
    last_market_price: null,
    principal_amount: null,
    ticker_symbol: null,
    total_quantity: null,
    status: 'ACTIVE',
  } as InvestmentDetailInsert,

  INSURANCE: {
    payment_cycle: 'MONTHLY',
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
} satisfies Record<AccountInsertType, AccountSaveType['details']>;

export const CREATE_INITIAL = (userId: string): AccountSaveType => ({
  user_id: userId,
  name: '',
  type: 'BANK',
  currency: 'KRW',
  current_balance: undefined,
  provider: '',
  is_active: true,
  linked_account_id: null,
  details: INITIAL_DETAILS['BANK'],
  limit_remaining: undefined,
  amount_limit: 0,
  institution_id: null,
});
