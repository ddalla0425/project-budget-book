import styled, { css } from "styled-components";

interface StyledGridProps {
  $gap: number;
  // $width: string;
  $height: string;
  $align?: string;
  $autoCols?: boolean;
  $selectCols?: string;
  $direction: "horizontal" | "vertical";
  $hasBoxStyle: boolean;
}

/* 💡 1. 전체 넓이를 제어하고 설명 텍스트를 포함하는 Wrapper */
export const GridWrapper = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width};
  display: flex;
  flex-direction: column;
  gap: 8px; /* Grid 콘텐츠와 Description 사이의 간격 */
`;

export const Grid = styled.div<StyledGridProps>`
  display: grid;
  width: 100%;
  gap: ${({ $gap }) => `${$gap}px`};
  align-items: ${({ $align = "stretch" }) => $align};

  /* 방향 및 레이아웃 설정 */
  ${({ $direction, $height, $autoCols, $selectCols }) => {
    if ($direction === "vertical") {
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
  }};

  /* 💡 Box 스타일 적용 여부 */
  ${({ $hasBoxStyle }) =>
    $hasBoxStyle &&
    css`
      padding: 20px;
      background-color: #f8f9fa; /* 연한 배경색 */
      border: 1px solid #e9ecef; /* 테두리 */
      border-radius: 12px; /* 모서리 둥글게 */
    `};

  /* 공통 반응형 설정 (태블릿/모바일) */
  @media (max-width: 768px) {
    grid-auto-flow: row;
    grid-template-columns: 1fr !important; /* 명시적 지정 해제 */
    grid-auto-rows: auto;
    height: auto !important;
    width: 100% !important;
  }
`;

export const Message = styled.span`
  font-size: 0.8rem;
  color: #666;
  margin-top: var(--field-gap);
  line-height: 1.4;
  min-height: 1em; // 메시지가 생길 때 레이아웃이 덜컹거리는 것 방지
`;
