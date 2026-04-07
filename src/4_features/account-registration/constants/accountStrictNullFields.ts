/**
 * DB 제약 조건(CHECK)에 의해 0이 입력될 수 없거나,
 * 날짜/주기 등 논리적으로 0이 입력되면 안 되는 필드 목록
 * 이 필드들은 값이 비어있거나(NaN) 0일 경우 null로 처리
 */
export const STRICT_NULL_FIELDS = [
  // 날짜 관련 (1~31)
  'interest_settlement_day',
  // 'billing_day',
  'repayment_day',
  // 'start_day', //말일이 0 이라 무조건 0 선택할 수 있어야함
  // 'end_day',   //말일이 0 이라 무조건 0 선택할 수 있어야함
  'anchor_day',
  'anchor_month',

  // 금액/수량/주기 관련 (0보다 커야 함)
  'interval_months',
  'denomination',
  'quantity', // 상품권/현금 등 (0개는 의미 없음)
  'amount', // 거래/정산/반복지출 금액

  // (예: deposit_rate, loan_rate, start_month_offset 등은 0 가능)
];
