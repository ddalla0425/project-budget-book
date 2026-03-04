import styled, { css } from 'styled-components';

interface StyledInputProps {
  $variant: 'primary' | 'secondary' | 'danger';
  $deviceSize: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: css`
    padding: 6px 10px;
    font-size: 0.85rem;
  `,
  md: css`
    padding: 10px 14px;
    font-size: 1rem;
  `,
  lg: css`
    padding: 14px 18px;
    font-size: 1.2rem;
  `,
};

const variantStyles = {
  primary: css`
    border: 1px solid #ddd;
    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
  `,
  secondary: css`
    border: 1px solid #6c757d;
    &:focus {
      border-color: #5a6268;
      box-shadow: 0 0 0 3px rgba(90, 98, 104, 0.1);
    }
  `,
  danger: css`
    border: 1px solid #dc3545;
    &:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
  `,
};

export const Input = styled.input<StyledInputProps>`
  outline: none;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;

  ${({ $deviceSize = 'md' }) => sizeStyles[$deviceSize]}
  ${({ $variant = 'primary' }) => variantStyles[$variant]}
  width: 100%;

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    color: #999;
    border-color: #eee;
  }

  &::placeholder {
    color: #bbb;
  }
`;
