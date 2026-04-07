import type { ReactNode } from 'react';
import * as S from './Grid.style';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gap?: number;
  width?: string;
  height?: string;
  autoCols?: boolean; // 자식 개수만큼 자동 등분 활성화
  selectCols?: string;
  direction?: 'horizontal' | 'vertical'; // 방향 속성 추가
  align?: 'stretch' | 'center' | 'flex-start' | 'flex-end';
  description?: ReactNode;
  hasBoxStyle?: boolean; // 예: 회색 배경이나 테두리 박스 스타일 적용 여부
}

export const Grid = ({
  children,
  gap = 20,
  width = '100%',
  height = 'auto',
  autoCols = true, // 기본값을 true로 두면 알아서 자식 수만큼 등분
  selectCols, // 자식의 각각 너비를 정해주고 싶을떄 사용
  direction = 'horizontal',
  align = 'stretch',
  description,
  hasBoxStyle = false,
  ...rest
}: GridProps) => {
  return (
    <S.GridWrapper $width={width}>
      <S.Grid
        $gap={gap}
        $height={height}
        $autoCols={autoCols}
        $selectCols={selectCols}
        $direction={direction}
        $align={align}
        $hasBoxStyle={hasBoxStyle}
        {...rest}
      >
        {children}
      </S.Grid>

      {description && <S.Message>{description}</S.Message>}
    </S.GridWrapper>
  );
};
