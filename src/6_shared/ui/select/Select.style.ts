import styled, { css } from 'styled-components';

interface StyledSelectProps {
  $variant: 'primary' | 'secondary' | 'danger';
  $deviceSize: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: css`
    padding: 6px 32px 6px 10px; /* 오른쪽 공간(32px) 확보 */
    font-size: 0.85rem;
    background-position: calc(100% - 10px) center; /* 화살표 위치 */
    background-size: 10px;
    min-height: 32px;
  `,
  md: css`
    padding: 10px 20px 10px 12px; /* 오른쪽 공간(38px) 확보 */
    font-size: 1rem;
    background-position: calc(100% - 10px) center;
    background-size: 12px;
    min-height: 40px;
  `,
  lg: css`
    padding: 14px 44px 14px 18px; /* 오른쪽 공간(44px) 확보 */
    font-size: 1.2rem;
    background-position: calc(100% - 18px) center;
    background-size: 10px;
    min-height: 52px;
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
    background-color: #fff8f8;
    &:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
  `,
};

export const Select = styled.select<StyledSelectProps>`
  outline: none;
  border-radius: 6px;
  background-color: #fff;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  text-align: left;
  vertical-align: middle;
  line-height: normal;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;

  ${({ $deviceSize = 'md' }) => sizeStyles[$deviceSize]}
  ${({ $variant = 'primary' }) => variantStyles[$variant]}
  width: 100%;

  ::-ms-expand {
    display: none;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    color: #999;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ccc'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  }
`;
