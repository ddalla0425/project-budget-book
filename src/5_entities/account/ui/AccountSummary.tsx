import type { TablesInsert } from '@/6_shared/types';
import * as S from './AccountUI.style';
import { ACCOUNT_TYPE_LABELS } from '@/6_shared/constants';

interface SummaryProps {
  data: TablesInsert<'accounts'>;
  linkedBankName?: string;
  onEdit: () => void;
  onRemove: () => void;
}

export const AccountSummary = ({ data, linkedBankName, onEdit, onRemove }: SummaryProps) => {
  // 금액 포맷팅 (시니어의 디테일: 천단위 콤마)
  const formattedAmount = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: data.currency || 'KRW',
  }).format(data.current_balance || 0);
  console.log('실제 데이터 타입:', data.type);
  const typeLabel = ACCOUNT_TYPE_LABELS[data.type] || data.type;

  return (
    <S.SummaryWrapper>
      <S.InfoGroup>
        <S.TypeBadge $type={data.type}>{typeLabel}</S.TypeBadge>
        <S.AccountName>{data.name}</S.AccountName>
        {linkedBankName && <S.LinkedInfo>🔗 연결: {linkedBankName}</S.LinkedInfo>}
      </S.InfoGroup>

      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <S.AmountText>{formattedAmount}</S.AmountText>
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
          <button onClick={onEdit} style={{ fontSize: '12px', cursor: 'pointer' }}>
            수정
          </button>
          <button onClick={onRemove} style={{ fontSize: '12px', color: '#fa5252', cursor: 'pointer' }}>
            삭제
          </button>
        </div>
      </div>
    </S.SummaryWrapper>
  );
};
