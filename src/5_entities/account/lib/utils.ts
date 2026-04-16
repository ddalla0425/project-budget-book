import type { AccountRelation, RawAccountResponse, RawDashboardResponse } from '../type/rpc.type';
import type { AccountListType, AccountRelations } from '../type/select.type';

/**
 * DB에서 가져온 Raw 데이터를 UI에서 사용하는 AccountListType으로 변환
 * 상세 테이블 배열([0])에서 데이터를 추출하여 details 필드에 주입
 */
export const transformRawAccount = (raw: RawAccountResponse): AccountListType => {
  const common = {
    ...raw,
    tabType: raw.type, // AccountBaseInfo의 tabType 매핑
    displayAmount: raw.current_balance?.toLocaleString() || '0',
  };

  switch (raw.type) {
    case 'CASH':
      return {
        ...common,
        type: 'CASH',
        details: raw.account_cash_details || [],
        bankNoteType: 0,
      } as AccountListType;

    case 'BANK':
      return {
        ...common,
        type: 'BANK',
        details: raw.account_bank_details?.[0] || {},
        institution: raw.financial_institutions || [],
      } as AccountListType;

    case 'CHECK_CARD':
      return {
        ...common,
        type: 'CHECK_CARD',
        details: raw.account_card_details?.[0] || {},
        institution: raw.financial_institutions || [],
      } as AccountListType;

    case 'CREDIT_CARD':
      return {
        ...common,
        type: 'CREDIT_CARD',
        details: raw.account_card_details?.[0] || {},
        institution: raw.financial_institutions || [],
      } as AccountListType;

    case 'PAY':
      return {
        ...common,
        type: 'PAY',
        details: raw.account_pay_details?.[0] || {},
        institution: raw.financial_institutions || [],
      } as AccountListType;

    case 'SAVING':
      return {
        ...common,
        type: 'SAVING',
        details: raw.account_saving_details?.[0] || {},
        institution: raw.financial_institutions || [],
      } as AccountListType;

    case 'INVESTMENT':
      return {
        ...common,
        type: 'INVESTMENT',
        details: raw.account_investment_details?.[0] || {},
        institution: raw.financial_institutions || [],
      } as AccountListType;

    case 'INSURANCE':
      return {
        ...common,
        type: 'INSURANCE',
        details: raw.account_insurance_details?.[0] || {},
        institution: raw.financial_institutions || [],
      } as AccountListType;

    case 'DEBT':
      return {
        ...common,
        type: 'DEBT',
        details: raw.account_debt_details?.[0] || {},
        institution: raw.financial_institutions || [],
      } as AccountListType;

    case 'GIFT_CARD':
    case 'POINT':
      return {
        ...common,
        type: raw.type,
        details: raw.account_voucher_details || [],
        institution: raw.financial_institutions || [],
      } as AccountListType;

    default:
      // 정의되지 않은 타입일 경우 기본 처리
      return {
        ...common,
        details: {},
      } as unknown as AccountListType;
  }
};

export const transformDashboardToAccountList = (raw: RawDashboardResponse): AccountListType[] => {
  // 각 섹션의 데이터를 하나의 배열로 합침
  const allAccounts: AccountListType[] = [
    ...raw.bank,
    ...raw.card,
    ...raw.investment,
    ...raw.insurance,
    ...raw.saving,
    ...raw.pay,
    ...raw.cash,
    ...raw.voucher,
    ...raw.debt,
  ];

  return allAccounts.map((account) => ({
    ...account,
    // 여기서 포맷팅같은 공통 처리를 수행
    tabType: account.type,
    displayAmount: account.current_balance.toLocaleString(),
  }));
};

export const mapAccountRelations = (relations: AccountRelation[]): AccountRelations => {
  const maps: AccountRelations = {
    cardToBank: {},
    bankToCards: {},
    payToPoint: {},
    pointToPay: {},
    giftCardToTarget: {},
    debtToAsset: {},
  };

  // relations 자체가 null이나 undefined로 올 경우 대비
  if (!Array.isArray(relations)) return maps;

  relations.forEach((rel) => {
    // 데이터 무결성 체크: rel이 없거나 필수 계좌 정보가 없으면 스킵
    const sourceAccount = rel.source_account?.info;
    const targetAccount = rel.target_account?.info;

    // 데이터가 없을시 (방어 코드)
    if (!sourceAccount?.id || !targetAccount?.id) {
      console.warn('⚠️ 연결할 계좌 정보가 부족함 (Skip):', rel);
      return;
    }

    const sourceId = sourceAccount.id;
    const targetId = targetAccount.id;

    if (!sourceId || !targetAccount || !targetId) {
      console.warn('⚠️ 불완전한 관계 데이터(Account Relation) 무시됨:', rel);
      return; // 에러를 던지지 않고 다음 항목으로 이동
    }

    const { rel_type } = rel;

    // source_account.id가 실제로 존재하는지 확인 (안전빵)
    // if (!source_account.id || !target_account.id) return;

    // 카드 -> 은행 연결 (ACCOUNT_LINK)
    if (rel_type === 'ACCOUNT_LINK') {
      maps.cardToBank[sourceId] = targetAccount;

      // 역방향: 은행 -> 카드들 (1:N)
      if (!maps.bankToCards[targetId]) maps.bankToCards[targetId] = [];
      maps.bankToCards[targetId].push(sourceAccount);
    }

    // 페이 -> 포인트 (PAY_POINT_LINK)
    // if (rel_type === 'PAY_POINT_LINK') {
    //   maps.payToPoint[sourceId] = targetAccount;
    // }

    // 🌟 2. 페이 <-> 포인트 1:1 양방향 매핑 (PAY_POINT_LINK)
    // DB에 PAY_POINT_LINK 하나만 저장되어 있어도, UI에서는 양쪽에서 다 찾을 수 있게 해줍니다!
    if (rel_type === 'PAY_POINT_LINK') {
      // source가 페이, target이 포인트일 경우
      if (sourceAccount.type === 'PAY') {
        maps.payToPoint[sourceId] = targetAccount as AccountListType;
        maps.pointToPay[targetId] = sourceAccount as AccountListType;
      }
      // 만약 DB에 반대로 (source가 포인트) 저장되었을 경우를 대비한 방어 로직
      else if (sourceAccount.type === 'POINT') {
        maps.pointToPay[sourceId] = targetAccount as AccountListType;
        maps.payToPoint[targetId] = sourceAccount as AccountListType;
      }
    }

    // 🌟 3. 상품권 -> 페이/포인트 전환 매핑
    // 유저님이 제안하신 2개 타입(GIFT_CARD_PAY_LINK, GIFT_CARD_POINT_LINK)을 모두 수용합니다.
    if (rel_type === 'VOUCHER_CONVERT_LINK') {
      // 상품권의 ID를 키로, 타겟(페이/포인트) 객체를 값으로 저장
      maps.giftCardToTarget[sourceId] = targetAccount as AccountListType;
    }

    // 대출 -> 담보자산 (DEBT_ACCOUNT_LINK)
    if (rel_type === 'DEBT_ACCOUNT_LINK') {
      maps.debtToAsset[sourceId] = targetAccount;
    }
  });

  return maps;
};
