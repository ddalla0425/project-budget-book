// PUBLIC - entities/account

// api 노출
export { useGetAccount, useGetDashboardQuery } from './api/useQuery';

// ui 노출
export { AccountTotal } from './ui/AccountTotal';
export { AccountQueueItem } from './ui/AccountQueueItem';

// constant 노출
export { ACCOUNT_TYPE_LABELS, DEBT_TYPE_LABELS, INSTITUTION_TYPE_LABEL } from './constants/typeLabel';
export { DEBT_SOURCE_PLACEHOLDERS, DEBT_TYPE_MAPPING } from './constants/mapping';

// lib 노출
export { mapAccountRelations } from './lib/utils';

// type 노출
export {
  // [ 화면용 - 조회 타입 정의 ]
  type AccountFetchResult,
  // 상세테이블 정의 (집합)
  type AccountListDetailType,
  //---------------------------
  // 기본 + 상세 테이블 정의 (집합)
  type AccountListType,
  type AccountRelations,
  //---------------------------
  // 화면용 가공 데이터
  type AccountState,
  // accounts 테이블 기본 타입 + ALL
  type AccountType,
  //-------------------------
  // 기본테이블 + 상세테이블 정의 (개별)
  type BankAccount,
  //-------------------------
  // 상세 테이블 정의 (개별)
  type BankDetail,
  type CardDetail,
  type CashAccount,
  type CashDetail,
  type CheckCardAccount,
  type CreditCardAccount,
  type DebtAccount,
  type DebtDetail,
  type InsuranceAccount,
  type InsuranceDetail,
  type InvestmentAccount,
  type InvestmentDetail,
  type PayAccount,
  type PayDetail,
  type SavingAccount,
  type SavingDetail,
  type VoucherAccount,
  type VoucherDetail,
} from './type/select.type';

export {
  // [ 입력용 - 저장 타입 정의 ]
  // accounts 테이블 기본 타입
  type AccountInsertType,
  // 상세테이블 정의 (집합)
  type AccountSaveDetailType,
  //---------------------------
  // 기본 + 상세 테이블 정의 (집합)
  type AccountSaveType,
  //-------------------------
  // 기본테이블 + 상세테이블 정의 (개별)
  type BankAccountInsert,
  //-------------------------
  // 상세 테이블 정의 (개별)
  type BankDetailInsert,
  type CardAccountInsert,
  type CardDetailInsert,
  type CashAccountInsert,
  type CashDetailInsert,
  type DebtAccountInsert,
  type DebtDetailInsert,
  type InsuranceAccountInsert,
  type InsuranceDetailInsert,
  type InvestmentAccountInsert,
  type InvestmentDetailInsert,
  type PayAccountInsert,
  type PayDetailInsert,
  type SavingAccountInsert,
  type SavingDetailInsert,
  type VoucherAccountInsert,
  type VoucherDetailInsert,
} from './type/insert.type';

export {
  // [ 화면용 - 함수 반환 정의 ]
  type AccountRelation,
  type AccountRpcResult,
} from './type/rpc.type';
