import type { RawDashboardResponse } from '@/5_entities/account/type/rpc.type';
import { filterData } from './filter.utils';

/** @description UI 컴포넌트(셀렉트 박스 등)에서 사용하기 쉽도록 가공된 자산 데이터 타입 */
export type ParsedAssetOption = {
  id: string;
  type: string;
  displayName: string;
  current_balance: number;
  linked_account_id: string | null;
};

/** @description API 원본 자산 데이터를 화면 표시에 적합하게 평탄화하고 카테고리별로 그룹화
 * @param {RawDashboardResponse} rawData API에서 받아온 원본 대시보드 자산 데이터
 * @returns {{ flatAssets: ParsedAssetOption[], groupedAssets: Record<string, ParsedAssetOption[]> }} 평탄화된 전체 자산 배열과 한글 카테고리명으로 묶인 그룹 객체
 */
export const getGroupedAssetOptions = (rawData: RawDashboardResponse) => {
  if (!rawData) return { flatAssets: [], groupedAssets: {} as Record<string, ParsedAssetOption[]> };

  // 1. 모든 자산을 하나의 배열로 평탄화하고 필요한 포맷으로 맵핑
  const flatAssets: ParsedAssetOption[] = [
    ...(rawData.bank || []),
    ...(rawData.card || []),
    ...(rawData.pay || []),
    ...(rawData.voucher || []),
    ...(rawData.saving || []),
    ...(rawData.investment || []),
    ...(rawData.insurance || []),
    ...(rawData.debt || []),
  ].map((acc) => {
    const institutionName = acc.institution?.name || '';
    const displayName = institutionName ? `[${institutionName}] ${acc.name}` : acc.name;

    return {
      id: acc.id,
      type: acc.type,
      displayName,
      current_balance: acc.current_balance || 0,
      linked_account_id: acc.linked_account_id,
    };
  });

  // 🌟 2. 하드코딩된 filter() 대신, 강력한 범용 filterData 유틸리티 사용!
  const groupedAssets: Record<string, ParsedAssetOption[]> = {
    은행: filterData(flatAssets, { type: 'BANK' }),
    신용카드: filterData(flatAssets, { type: 'CREDIT_CARD' }),
    체크카드: filterData(flatAssets, { type: 'CHECK_CARD' }),
    간편결제: filterData(flatAssets, { type: 'PAY' }),
    포인트: filterData(flatAssets, { type: 'POINT' }),
    상품권: filterData(flatAssets, { type: 'GIFT_CARD' }),
    예적금: filterData(flatAssets, { type: 'SAVING' }),
    투자: filterData(flatAssets, { type: 'INVESTMENT' }),
    보험: filterData(flatAssets, { type: 'INSURANCE' }),
    채무: filterData(flatAssets, { type: 'DEBT' }),
  };

  return { flatAssets, groupedAssets };
};

/** @description 선택된 결제 수단의 연결 계좌 정보를 추적하여 UI용 잔액 안내 메시지 객체를 반환합니다.
 * @param {string | null | undefined} linkedAccountId 사용자가 선택한 결제 수단(계좌/카드/페이)의 ID
 * @param {ParsedAssetOption[]} flatAssets 평탄화된 전체 자산 목록 (getGroupedAssetOptions의 반환값)
 * @returns {{ isVisible: boolean, label: string, accountName: string, balanceMessage: string }} UI 렌더링에 필요한 메시지 객체
 */
export const getConnectedBalanceInfo = (
  linkedAccountId: string | null | undefined,
  flatAssets: ParsedAssetOption[]
) => {
  // 1. 기본 반환 상태 세팅
  const result = {
    isVisible: false,
    label: '결제 수단과 연결된 통장 잔액',
    accountName: '',
    balanceMessage: '',
  };

  if (!linkedAccountId || !flatAssets.length) return result;

  const selectedAsset = flatAssets.find((a) => a.id === linkedAccountId);
  if (!selectedAsset) return result;

  // 선택된 자산이 존재하므로 UI 노출 활성화
  result.isVisible = true;

  // 2. 은행 통장을 직접 선택한 경우
  if (selectedAsset.type === 'BANK') {
    result.label = '선택한 통장 잔액';
    result.balanceMessage = `${Number(selectedAsset.current_balance).toLocaleString()} 원`;
  }
  // 3. 카드나 페이를 선택한 경우 -> 연결된 부모 계좌를 역추적
  else {
    result.label = '연결된 출금 계좌 잔액';

    if (selectedAsset.linked_account_id) {
      const linkedBank = flatAssets.find((a) => a.id === selectedAsset.linked_account_id);

      if (linkedBank) {
        result.accountName = linkedBank.displayName;
        result.balanceMessage = `${Number(linkedBank.current_balance).toLocaleString()} 원`;
      } else {
        result.accountName = '연결 계좌 알 수 없음';
        result.balanceMessage = '연결된 계좌 정보를 불러올 수 없습니다.';
      }
    } else {
      result.accountName = '출금 계좌 미지정';
      result.balanceMessage = '-';
    }
  }

  return result;
};
