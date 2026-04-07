import styled, { css } from 'styled-components';

interface StyledAlertProps {
  $align: 'left' | 'right' | 'center';
  $variant: 'primary' | 'secondary' | 'danger';
  $deviceSize: 'sm' | 'md' | 'lg';
  $fullWidth: boolean;
}
const alignStyles = {
  left: css`
    justify-content: flex-start;
    text-align: left;
  `,
  right: css`
    justify-content: flex-end;
    text-align: right;
  `,
  center: css`
    justify-content: center;
    text-align: center;
  `,
};
const sizeStyles = {
  sm: css`
    --message-font-size: 0.75rem;
    padding: 6px 12px;
    font-size: 12px;
  `,
  md: css`
    --message-font-size: 0.8rem;
    padding: 10px 12px;
    font-size: 14px;
    line-height: 18px;
  `,
  lg: css`
    --message-font-size: 0.9rem;
    padding: 14px 24px;
    font-size: 16px;
  `,
};

const variantStyles = {
  primary: css`
    color: #666;
    background-color: #f4fffd;
    border: 1px solid #b4e9ed;
  `,
  secondary: css`
    color: #999;
    background-color: #f9f9f9;
    border: 1px solid #eaeaea;
  `,
  danger: css`
    color: #dc3545;
    background-color: #fff4f4;
    border: 1px solid #ffcccc;
  `,
};

export const Alert = styled.div<StyledAlertProps>`
  padding: 12px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  white-space: pre-wrap;
  ${({ $align = 'center' }) => alignStyles[$align]};

  ${({ $deviceSize = 'md' }) => sizeStyles[$deviceSize]};
  ${({ $variant }) => variantStyles[$variant]};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'fit-content')};
`;

export const Message = styled.span<{ $variant: 'primary' | 'secondary' | 'danger' }>`
  font-size: var(--message-font-size);
  margin-top: var(--field-gap);
  line-height: 1.4;
  min-height: 1em; // 메시지가 생길 때 레이아웃이 덜컹거리는 것 방지

  ${({ $variant = 'primary' }) => variantStyles[$variant]};
`;
