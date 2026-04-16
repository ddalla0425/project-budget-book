import styled, { css } from 'styled-components';

interface StyledStepProps {
  $variant: 'primary' | 'secondary' | 'danger' | 'disabled' | 'textDisabled';
  $isActive: boolean;
}

const variantStyles = {
  primary: css`
    background-color: #007bff;
    border-color: #007bff;
    color: #fff;
  `,
  secondary: css`
    background-color: #6c757d;
    border-color: #6c757d;
    color: #fff;
  `,
  danger: css`
    background-color: #dc3545;
    border-color: #dc3545;
    color: #fff;
  `,
  disabled: css`
    background-color: #e0e0e0;
    border-color: #e0e0e0;
    color: #333;
  `,
  textDisabled: css`
    background-color: #9e9e9e;
    border-color: #9e9e9e;
    color: #333;
  `,
};

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  width: 100%;
`;

export const StepWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const StepCircle = styled.div<StyledStepProps>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;

  /* 활성화 여부와 variant에 따른 배경색 처리 */
  ${({ $isActive, $variant }) =>
    $isActive &&
    css`
      ${variantStyles[$variant]}
    `}
`;

export const Connector = styled.div<StyledStepProps>`
  width: 40px;
  height: 2px;
  margin: 0 8px;
  transition: background-color 0.3s ease;
  ${({ $isActive, $variant }) =>
    $isActive
      ? css`
          ${variantStyles[$variant]}
        `
      : `
     ${variantStyles[($variant = 'disabled')]}
 `};
`;
