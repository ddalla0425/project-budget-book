import { CommonWrapper } from '@/6_shared/styles';
import styled, { createGlobalStyle } from 'styled-components';
export const GlobalStyle = createGlobalStyle`
* {box-sizing: border-box;}
  body {
    display: flex;
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    font-family: 'Pretendard', sans-serif;
    #root {
      width: 100%;
    }
  };
  .app-container {
    min-height: 100vh
  };
  main {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    min-height: calc(100vh - 80px);
    padding: 40px;
  };
  ol,ul {
    list-style: none;
  };
`;

export const MainWrapper = styled(CommonWrapper) `
  flex-direction: column;    
// > * {
    //     width: 100%;
    // }
`
