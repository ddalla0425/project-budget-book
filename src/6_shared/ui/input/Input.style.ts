import styled, { css } from "styled-components";

interface StyledInputProps {
  $variant: "primary" | "secondary" | "danger";
  $deviceSize: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: css`
    padding: 6px 10px;
    font-size: 0.85rem;
  `,
  md: css`
    padding: 10px 12px;
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

  ${({ $deviceSize = "md" }) => sizeStyles[$deviceSize]} ${(
    { $variant = "primary" },
  ) => variantStyles[$variant]} width: 100%;

  ${({ type }) =>
    type === "number" &&
    css`
      -moz-appearance: textfield;
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
    `};

  ${({ type }) =>
    type === "checkbox" &&
    css`
      padding: 0;
      cursor: pointer;
      border: none;
      box-shadow: none;
      align-self: center;
    `};

  ${({ type }) =>
    type === "date" &&
    css`
      font-size: 0.875rem;
      letter-spacing: -0.1rem;
      &::-webkit-calendar-picker-indicator {
        cursor: pointer;
        opacity: 0.6;
        &:hover {
          opacity: 1;
        }
      }
    `};

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    color: #999;
    border-color: #eee;
  }

  &::placeholder {
    color: #bbb;
  }

  &:read-only {
    background-color: #f5f5f5;
    cursor: no-drop;
    &:focus {
      outline: none;
      border-color: #ccc; /* 일반 상태의 테두리색 유지 */
      box-shadow: none;
    }
  }
`;
