import styled, { css } from 'styled-components';

interface StyledGridProps {
  $gap: number;
  $width: string;
  $height: string;
  $align?: string;
  $autoCols?: boolean;
  $direction: 'horizontal' | 'vertical';
}

export const Grid = styled.div<StyledGridProps>`
  display: grid;
  width: ${({ $width }) => $width};
  gap: ${({ $gap }) => `${$gap}px`};
  align-items: ${({ $align = 'stretch' }) => $align};

  /* 세로 등분 모드일 때 전달받은 height 적용 */
  ${({ $direction, $height }) => 
    $direction === 'vertical' && $height && css`
      height: ${$height};
    `
  }

  /* $autoCols가 true면 자식들이 무조건 같은 비율로 한 줄에 배치됨 */
  ${({ $autoCols, $direction }) =>
    $autoCols &&
    ($direction === 'horizontal'
      ? css`
          grid-auto-flow: column;   /* 가로로 나열 */
          grid-auto-columns: 1fr;  /* 자식 수만큼 가로 등분 */
        `
      : css`
          grid-auto-flow: row;      /* 세로로 나열 */
          grid-auto-rows: 1fr;     /* 자식 수만큼 세로 등분 */
        `)}

  /* autoCols가 false일 때의 기본 동작 */
  ${({ $autoCols }) => !$autoCols && css`
    grid-template-columns: 1fr;
  `}

  /* 공통 반응형 설정 (태블릿/모바일) */
  @media (max-width: 768px) {
    grid-auto-flow: row; /* 모바일에서는 자동으로 세로로 흐르게 변경 */
    grid-template-columns: 1fr;
    grid-auto-rows: auto; /* 모바일에서는 등분 해제하고 콘텐츠만큼 차지하게 */
    height: auto !important; /* 모바일에서는 고정 높이 해제 */
    width: 100% !important; /* 모바일은 웬만하면 꽉 차게 */
  }
`;
