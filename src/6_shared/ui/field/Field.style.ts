import styled, { css } from 'styled-components';

interface StyledFieldProps {
  $variant: 'primary' | 'secondary' | 'danger';
  $deviceSize: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: css`
    --label-font-size: 0.8rem;
    --message-font-size: 0.75rem;
    --field-gap: 4px;
    font-size: 12px;
  `,
  md: css`
    --label-font-size: 0.9rem;
    --message-font-size: 0.8rem;
    --field-gap: 6px;
    font-size: 14px;
  `,
  lg: css`
    --label-font-size: 1rem;
    --message-font-size: 0.9rem;
    --field-gap: 8px;
    font-size: 16px;
  `,
};

const variantStyles = {
  primary: css`
    color: #666;
  `,
  secondary: css`
    color: #999;
  `,
  danger: css`
    color: #dc3545;
  `,
};

export const Field = styled.div<StyledFieldProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: var(--container-margin);

  ${({ $deviceSize = 'md' }) => sizeStyles[$deviceSize]}
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: var(--label-font-size);
  font-weight: 600;
  color: #333;
  margin-bottom: var(--field-gap);
  cursor: pointer;

  &:empty {
    display: none;
  }
`;

export const RequiredMark = styled.span`
  color: #dc3545;
  margin-left: 4px;
  font-size: 1.1em;
  line-height: 0;
  margin-top: 4px;
`;

export const ControlWrapper = styled.div`
  width: 100%;
  position: relative;
  /* 내부의 Input이나 Select가 100%로 꽉 차게 됨 */
`;

export const Message = styled.span<{ $variant: 'primary' | 'secondary' | 'danger' }>`
  font-size: var(--message-font-size);
  margin-top: var(--field-gap);
  line-height: 1.4;
  min-height: 1em; // 메시지가 생길 때 레이아웃이 덜컹거리는 것 방지

  ${({ $variant = 'primary' }) => variantStyles[$variant]}
`;
