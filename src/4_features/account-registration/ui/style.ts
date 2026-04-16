import styled from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0 auto;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
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
