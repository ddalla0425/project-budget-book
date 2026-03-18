import * as S from './AccountUI.style';

interface AccountTotalProps {
  totalAmount: number;
  label?: string;
}

export const AccountTotal = ({ totalAmount, label }: AccountTotalProps) => {
  const formattedAmount = new Intl.NumberFormat('ko-KR').format(totalAmount);

  return (
    <S.SummaryWrapper style={{ background: '#f8f9fa', border: '2px solid #e9ecef' }}>
      <S.InfoGroup>
        <S.AccountName style={{ fontSize: '16px' }}>{label}</S.AccountName>
      </S.InfoGroup>
      <S.AmountText style={{ fontSize: '24px', color: '#228be6' }}>
        {formattedAmount}
        <span>원</span>
      </S.AmountText>
    </S.SummaryWrapper>
  );
};
