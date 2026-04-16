export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  BANK: '은행/계좌',
  CASH: '현금',
  CHECK_CARD: '체크카드',
  CREDIT_CARD: '신용카드',
  PAY: '간편결제',
  SAVING: '예/적금',
  INVESTMENT: '투자',
  INSURANCE: '보험',
  DEBT: '채무/대출',
  GIFT_CARD: '상품권',
  POINT: '포인트',
};

export const INSTITUTION_TYPE_LABEL: Record<string, string> = {
  BANK: '은행',
  CARD: '카드사',
  INVESTMENT: '중권사',
  PAY: '간편 결제사',
  TELECOM: '통신사',
};

export const DEBT_TYPE_LABELS: Record<string, string> = {
  CREDIT_LOAN: '일반 신용 대출',
  MORTGAGE: '주택 담보 대출',
  CARD_INSTALLMENT: '신용카드 할부 (결제 대금)',
  CARD_LOAN: '카드론 (장기카드대출)',
  CASH_ADVANCE: '현금서비스 (단기카드대출)',
  REVOLVING: '리볼빙 (일부결제금액이월약정)',
  LEASE_LOAN: '전세 자금 대출',
  OVERDRAFT: '마이너스 통장',
  INSURANCE_LOAN: '보험 약관 대출',
  CAR_LOAN: '자동차 대출/할부',
  STUDENT_LOAN: '학자금 대출',
  PERSONAL_LOAN: '지인/개인 채무',
  BUSINESS_LOAN: '사업자 대출',
  POLICY_LOAN: '정부 정책 대출',
  DEPOSIT_BACKED_LOAN: '예적금/청약 담보 대출',
  SECURITIES_LOAN: '증권/주식 담보 대출',
  OTHER: '기타',
};

// todo 완료! : accounts 테이블 만으로는 한계가 잇음. -> 추후 테이블 추가 생성 필요
/**
 * [x] 현재 단계에서는 일단 진행 후, 진행 완료시 추가로 보완 필수!
 * [x] 테이블 추가 생성 필요 : 보험/펀드, 예금/적금, 보험 , 채무/대출 테이블 생성 필요
 * [x] 테이블 추가 후 타입 추가
 * [x] 테이블 생성시 신중하게 모든 변수와 상황 생각해보고 생성하기.
 */
