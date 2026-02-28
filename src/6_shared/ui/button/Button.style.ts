import styled, { css } from 'styled-components'

interface StyledButtonProps {
  $variant: 'primary' | 'secondary' | 'danger'
  $size: 'sm' | 'md' | 'lg'
  $fullWidth: boolean
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
}

const variantStyles = {
  primary: css`
    background-color: #007bff;
    color: white;
    &:hover {
      background-color: #0056b3;
    }
  `,
  secondary: css`
    background-color: #6c757d;
    color: white;
    &:hover {
      background-color: #5a6268;
    }
  `,
  danger: css`
    background-color: #dc3545;
    color: white;
    &:hover {
      background-color: #c82333;
    }
  `,
}

export const Button = styled.button<StyledButtonProps>`
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`