// - 전세자금/주담대 등은 은행과 정부 등에 중복 포함됨.
// - 모든 배열의 마지막에는 'OTHER'를 반드시 포함.
export const DEBT_TYPE_MAPPING: Record<string, string[] | Record<string, string[]>> = {
  MY_ASSET: {
    BANK: ['OVERDRAFT', 'OTHER'],
    SAVING: ['DEPOSIT_BACKED_LOAN', 'OTHER'],
    CREDIT_CARD: ['CARD_INSTALLMENT', 'CARD_LOAN', 'CASH_ADVANCE', 'REVOLVING', 'OTHER'],
    INVESTMENT: ['SECURITIES_LOAN', 'OTHER'],
    INSURANCE: ['INSURANCE_LOAN', 'OTHER'],
    DEFAULT: ['OTHER'],
  },
  PRIVATE: ['PERSONAL_LOAN', 'OTHER'], // 개인
  CORPORATE: ['BUSINESS_LOAN', 'CREDIT_LOAN', 'OTHER'], // 회사
  GOVERNMENT: ['POLICY_LOAN', 'STUDENT_LOAN', 'MORTGAGE', 'LEASE_LOAN', 'BUSINESS_LOAN', 'OTHER'], // 정부 (디딤돌, 중기청전세, 소상공인대출 등 중복 허용)
  INSTITUTION: {
    BANK: [
      'CREDIT_LOAN',
      'MORTGAGE',
      'LEASE_LOAN',
      'OVERDRAFT',
      'DEPOSIT_BACKED_LOAN',
      'CAR_LOAN',
      'BUSINESS_LOAN',
      'OTHER',
    ], // 은행
    CARD: ['CARD_INSTALLMENT', 'CARD_LOAN', 'CASH_ADVANCE', 'REVOLVING', 'CAR_LOAN', 'CREDIT_LOAN', 'OTHER'], // 카드사 (오토론 등 중복)
    INVESTMENT: ['SECURITIES_LOAN', 'CREDIT_LOAN', 'OTHER'], // 증권사
    INSURANCE: ['INSURANCE_LOAN', 'MORTGAGE', 'CREDIT_LOAN', 'OTHER'], // 보험사 (보험사 주담대 중복)
    DEFAULT: ['CREDIT_LOAN', 'OTHER'], // 기타 간편결제, 통신사 등
  },
  DEFAULT: ['CREDIT_LOAN', 'OTHER'], // 완전히 알 수 없는 출처일 경우의 폴백
};

export const DEBT_SOURCE_PLACEHOLDERS: Record<string, string> = {
  INSTITUTION: '예: **은행 전세자금대출, **카드 할부, **은행 신용대출',
  PRIVATE: '예: 친구 지민이한테 빌린 돈',
  CORPORATE: '예: 회사 사내대출, 가불금',
  GOVERNMENT: '예: 중소기업 청년 전세대출, 한국장학재단',
  OTHER: '예: 부채/대출 이름을 입력하세요',
};
