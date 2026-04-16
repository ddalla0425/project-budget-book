import styled from 'styled-components';

export const SummaryWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.2s;

  &:hover {
    border-color: #dee2e6;
    background: #f1f3f5;
  }
`;

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TypeBadge = styled.span<{ $type: string }>`
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;
  background: ${({ $type }) => {
    if ($type === 'CASH') return '#c6fbe8;';
    if ($type === 'BANK') return '#d9efff';
    if ($type.includes('CARD')) return '#f6dbff';
    if ($type === 'PAY') return '#fff3bf';
    if ($type === 'SAVING') return '#d8f6eb';
    if ($type === 'INVESTMENT') return '#ffe1ed';
    if ($type === 'INSURANCE') return '#ffeace';
    if ($type === 'DEBT') return '#ffd8d8';
    if ($type === 'GIFT_CARD') return '#fff4e6';
    if ($type === 'POINT') return '#eebefa';
    return '#f1f3f5'; // 기본값 (회색)
  }};

  color: ${({ $type }) => {
    if ($type === 'CASH') return '#4bc096';
    if ($type === 'BANK') return '#1971c2';
    if ($type.includes('CARD')) return '#a752ff';
    if ($type === 'PAY') return '#f08c00';
    if ($type === 'SAVING') return '#78a60c';
    if ($type === 'INVESTMENT') return '#d6336c';
    if ($type === 'INSURANCE') return '#c48617';
    if ($type === 'DEBT') return '#ff0707';
    if ($type === 'GIFT_CARD') return '#d9480f';
    if ($type === 'POINT') return '#ae3ec9';
    return '#495057'; // 기본값 (진한 회색)
  }};
`;

export const AccountName = styled.strong`
  font-size: 15px;
  color: #212529;
`;

export const AmountText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #495057;
`;

export const LinkedInfo = styled.span`
  font-size: 12px;
  color: #868e96;
  margin-top: 2px;
`;
