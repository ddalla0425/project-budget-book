import styled from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
`;

export const QueueCard = styled.div<{ $isEditing: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
  background: ${(props) => (props.$isEditing ? '#f0f7ff' : '#fff')};
  border: 1px solid ${(props) => (props.$isEditing ? '#007bff' : '#eee')};
  border-radius: 8px;
  margin-bottom: 10px;
  align-items: center;

  input,
  select {
    flex: 1;
  }
`;

export const SummaryWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f9fa;
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
    if ($type === 'BANK') return '#e7f5ff';
    if ($type.includes('CARD')) return '#fff0f6';
    return '#f3f0ff';
  }};
  color: ${({ $type }) => {
    if ($type === 'BANK') return '#1971c2';
    if ($type.includes('CARD')) return '#d6336c';
    return '#6741d9';
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

export const InfoBox = styled.div<{ $variant?: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px;
  padding: 8px 12px;
  background-color: #f1f3f5;
  border: 1px solid ${({ $variant }) => ($variant === 'danger' ? '#fa5252' : '#dee2e6')};
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  color: #495057;
`;
