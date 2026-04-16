import { css } from 'styled-components';

export const breakpoints = {
  sm: 768,
  md: 1199,
  lg: 1200,
};

type CssParams = Parameters<typeof css>;

export const media = {
  // 모바일 (768px 이하)
  sm: (...args: CssParams) => css`
    @media (max-width: ${breakpoints.sm}) {
      ${css(...args)}
    }
  `,
  // 태블릿 (1199px 이하)
  md: (...args: CssParams) => css`
    @media (max-width: ${breakpoints.md}) {
      ${css(...args)}
    }
  `,
  // 데스크탑 (1200px 이상)
  lg: (...args: CssParams) => css`
    @media (min-width: ${breakpoints.lg}) {
      ${css(...args)}
    }
  `,
};
