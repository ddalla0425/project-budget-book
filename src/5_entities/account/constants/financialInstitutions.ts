export const FINANCIAL_INSTITUTIONS = {
  BANK: [
    'KB국민은행',
    '신한은행',
    '우리은행',
    '하나은행',
    'NH농협은행',
    'IBK기업은행',
    '카카오뱅크',
    '토스뱅크',
    '케이뱅크',
    '새마을금고',
  ],
  CARD: ['국민카드', '신한카드', '삼성카드', '현대카드', '롯데카드', 'BC카드', '우리카드', '하나카드', 'NH농협카드'],
};

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  BANK: '은행/계좌',
  CASH: '현금',
  CHECK_CARD: '체크카드',
  CREDIT_CARD: '신용카드',
  PAY: '간편결제',
  SAVING: '예금/적금',
  INVESTMENT: '투자',
  INSURANCE: '보험',
  DEBT: '채무/대출',
  GIFT_CARD: '상품권',
  POINT: '포인트',
};
// todo 완료! : accounts 테이블 만으로는 한계가 잇음. -> 추후 테이블 추가 생성 필요
/**
 * [x] 현재 단계에서는 일단 진행 후, 진행 완료시 추가로 보완 필수!
 * [x] 테이블 추가 생성 필요 : 보험/펀드, 예금/적금, 보험 , 채무/대출 테이블 생성 필요
 * [x] 테이블 추가 후 타입 추가
 * [x] 테이블 생성시 신중하게 모든 변수와 상황 생각해보고 생성하기.
 */
