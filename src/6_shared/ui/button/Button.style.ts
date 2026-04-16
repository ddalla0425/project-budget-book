import styled, { css } from 'styled-components';

interface StyledButtonProps {
  $variant: 'primary' | 'secondary' | 'danger' | 'outline' | 'active';
  $deviceSize: 'sm' | 'md' | 'lg';
  $fullWidth: boolean;
  $isActive?: boolean;
}

const sizeStyles = {
  sm: css`
    padding: 6px 12px;
    font-size: 12px;
  `,
  md: css`
    padding: 10px 18px;
    font-size: 14px;
  `,
  lg: css`
    padding: 14px 24px;
    font-size: 16px;
  `,
};

const variantStyles = {
  primary: css`
    background-color: #007bff;
    color: white;
    // border: 1px solid #4f46e5;
    &:hover:not(:disabled) {
      background-color: #4399f6;
    }
  `,
  secondary: css`
    background-color: #6c757d;
    color: white;
    // border: 1px solid #6c757d;
    &:hover:not(:disabled) {
      background-color: #5a6268;
    }
  `,
  danger: css`
    background-color: #dc3545;
    color: white;
    // border: 1px solid #dc3545;
    &:hover:not(:disabled) {
      background-color: #c82333;
    }
  `,
  active: css`
    background-color: #4597f1;
    color: white;
    // border: 2px solid #4f46e5;
    &:hover:not(:disabled) {
      background-color: #b6d1ed;
    }
  `,
  // 🔥 outline variant 개선
  outline: css<{ $isActive?: boolean }>`
    background-color: ${({ $isActive }) => ($isActive ? '#ffffff' : '#f9fafb')};
    color: ${({ $isActive }) => ($isActive ? '#4f46e5' : '#666')};
    border: 1px solid #d1d5db;

    position: relative;
    z-index: ${({ $isActive }) => ($isActive ? 2 : 1)};

    ${({ $isActive }) =>
      $isActive &&
      css`
        border-bottom: 2px solid white; /* 🔥 이게 핵심 (탭 올라온 느낌) */
        font-weight: 700;
      `}
  `,
};

export const Button = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px; /* 조금 더 부드러운 느낌 */
  border-color: transparent;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $deviceSize }) => sizeStyles[$deviceSize]} ${({ $variant }) => variantStyles[$variant]} &:disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
    border-color: #e5e7eb;
    cursor: not-allowed;
    opacity: 0.7;
  }

  /* 활성화 상태(Tab 선택 등)에서 조금 더 강조하고 싶을 때 */

  }
`;
