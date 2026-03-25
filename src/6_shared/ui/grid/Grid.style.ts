import styled, { css } from 'styled-components';

interface StyledGridProps {
  $gap: number;
  $width: string;
  $height: string;
  $align?: string;
  $autoCols?: boolean;
  $selectCols?: string;
  $direction: 'horizontal' | 'vertical';
}

export const Grid = styled.div<StyledGridProps>`
  display: grid;
  width: ${({ $width }) => $width};
  gap: ${({ $gap }) => `${$gap}px`};
  align-items: ${({ $align = 'stretch' }) => $align};

  /* 방향 및 레이아웃 설정 */
  ${({ $direction, $height, $autoCols, $selectCols }) => {
    if ($direction === 'vertical') {
      return css`
        height: ${$height};
        grid-auto-flow: row;
        ${$autoCols &&
        css`
          grid-auto-rows: 1fr;
        `};
      `;
    }

    // 가로(horizontal) 모드일 때
    return css`
      /* 1순위: selectCols가 있으면 해당 그리드 템플릿 사용 */
      ${$selectCols
        ? css`
            grid-template-columns: ${$selectCols};
          `
        : $autoCols
          ? css`
              /* 2순위: autoCols가 true면 자식 수만큼 자동 등분 */
              grid-auto-flow: column;
              grid-auto-columns: 1fr;
            `
          : css`
              /* 3순위: 둘 다 없으면 기본 1열 배치 */
              grid-template-columns: 1fr;
            `};
    `;
  }} /* 공통 반응형 설정 (태블릿/모바일) */ @media (max-width:
    768px) {
    grid-auto-flow: row;
    grid-template-columns: 1fr !important; /* 명시적 지정 해제 */
    grid-auto-rows: auto;
    height: auto !important;
    width: 100% !important;
  }
`;