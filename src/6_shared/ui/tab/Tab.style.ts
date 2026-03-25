import styled, { css } from 'styled-components';
import { Button } from '../button';
import { media } from '@/6_shared/lib';

// TODO : 수직 , 수평 && variant 타입별로 스타일 주기
interface TabProps {
  $variant: 'default' | 'card' | 'pill' | 'underline' | 'outline' | 'round';
  $direction: 'horizontal' | 'vertical';
}

interface StyledTabButtonProps {
  $isActive?: boolean; // 활성화 여부
  $tabSize?: 'sm' | 'md' | 'lg';
  $variant?: 'default' | 'card' | 'pill' | 'underline' | 'outline' | 'round';
  $direction?: 'horizontal' | 'vertical';
}

const tabContainerStyles = {
  default: css`
    gap: 8px;
  `,
  card: css`
    gap: 12px;
    background-color: #f8f9fa; /* 카드형 탭들을 감싸는 연한 회색 배경 */
    padding: 8px;
    border-radius: 8px;
  `,
  pill: css`
    gap: 6px;
    // box-shadow: 0 0 5px 1px #e8e8e8;
    border-radius: 20px;
    padding: 5px;
  `,
  underline: css`
    gap: 0;
    box-shadow: 0 0 5px 1px #e8e8e8;
    border-radius: 5px;
    justify-content: center;
  `,
  outline: css`
    gap: 0;
    // box-shadow: 0 0 5px 1px #e8e8e8;
    border-radius: 5px;
    justify-content: center;
  `,
  round: css`
    gap: 10px;
  `,
};

const tabStyles = {
  default: css<StyledTabButtonProps>`
    border: none;
    color: #666;
    ${({ $isActive }) =>
      $isActive
        ? css`
            color: #fff;
            background-color: #4597f1;

            &:hover:not(:disabled) {
              color: #4597f1;
              background-color: #cbe4ff;
            }
          `
        : css`
            background-color: #f9fafb;
            &:hover:not(:disabled) {
              color: #4597f1;
              font-weight: bold;
              background-color: #f5f5f5;
            }
          `};
  `,
  card: css<StyledTabButtonProps>`
    border: none;
  `,
  pill: css<StyledTabButtonProps>`
    border: none;
    border-radius: 20px;
    color: #666;
    ${({ $isActive }) =>
      $isActive
        ? css`
            color: #fff;
            background-color: #4597f1;
            &:hover:not(:disabled) {
              background-color: #deedfe;
            }
          `
        : css`
            background-color: #f9fafb;
            &:hover:not(:disabled) {
              background-color: #fff;
            }
          `};

    &:hover:not(:disabled) {
      color: #4597f1;
    }
  `,
  underline: css<StyledTabButtonProps>`
    border: none;
    border-bottom: 2px solid transparent;
    background: #fff;
    border-radius: 0;
    ${({ $isActive }) =>
      $isActive
        ? css`
            color: #666;
            border-color: #4597f1;
          `
        : css``} &:hover:not(:disabled) {
      background-color: #fff;
      color: #4597f1;
    }
  `,
  outline: css<StyledTabButtonProps>`
    border: none;
    border-bottom: 1px solid #4597f1;
    background: #fff;
    border-radius: 5px 5px 0 0;
    ${({ $isActive }) =>
      $isActive
        ? css`
            color: #666;
            border: 1px solid #4597f1;
            border-bottom: none;
          `
        : css``} &:hover:not(:disabled) {
      background-color: #fff;
      color: #4597f1;
    }
  `,
  round: css<StyledTabButtonProps>`
    border: none;
  `,
};

const tabSizeStyles = {
  sm: css`
    padding: 4px 6px;
    font-size: 10px;
  `,
  md: css`
    padding: 10px 12px;
    font-size: 14px;
  `,
  lg: css`
    padding: 10px 16px;
    font-size: 16px;
  `,
};

export const Tab = styled.div<TabProps>`
  display: flex;
  flex-direction: ${({ $direction }) => ($direction === 'vertical' ? 'column' : 'row')};
  max-width: ${({ $direction }) => ($direction === 'vertical' ? '100px' : '100%')};
  flex-wrap: wrap;
  overflow: hidden;

  ${({ $variant }) => tabContainerStyles[$variant]};
`;

export const TabButton = styled(Button)<StyledTabButtonProps>`
  white-space: nowrap;
  color: #666;

  ${({ $variant }) =>
    $variant
      ? tabStyles[$variant]
      : css`
          ${tabStyles.default};
        `};

  // 🔥 Tab 전용 size
  ${({ $tabSize }) =>
    $tabSize
      ? // tabSize 있으면 우선 적용
        tabSizeStyles[$tabSize]
      : // tabSize 없으면 반응형 처리
        css`
          ${tabSizeStyles.md} // 기본 사이즈 md
                ${media.md`
                    // 태블릿 화면(md) 일때, tabSize sm 으로 변경 
                    ${tabSizeStyles.sm}
                `};
        `};
`;
