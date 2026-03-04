import styled from 'styled-components';

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  height: 80px;
  padding: 10px 40px;
  background-color: #f9f9f9;

  h1 {
    display: flex;
    align-items: center;
    font-size: 1rem;
  }
  ul {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
