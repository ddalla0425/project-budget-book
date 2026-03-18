import type { TablesInsert } from '@/6_shared/types';
import * as S from './AccountUI.style';
import { ACCOUNT_TYPE_LABELS } from './../constants/financialInstitutions';
import { formatCurrency } from '@/6_shared/lib';

interface SummaryProps {
  data: TablesInsert<'accounts'>;
  linkedBankName?: string;
  onEdit: () => void;
  onRemove: () => void;
}

export const AccountSummary = ({ data, linkedBankName, onEdit, onRemove }: SummaryProps) => {
  if (!data) return null;
  const formattedAmount = formatCurrency(data.current_balance);
  const typeLabel = ACCOUNT_TYPE_LABELS[data.type as keyof typeof ACCOUNT_TYPE_LABELS] || data.type;

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
