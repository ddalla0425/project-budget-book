import styled from 'styled-components';

export const WidgetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
`;

export const SubTitle = styled.div`
  font-weight: bold;
  color: #4597f1;
`;

export const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  & > div:not(${SubTitle}) {
    padding: 20px;
    background: #f1f1f1;
    border-radius: 10px;

    p {
      margin-bottom: 0;
    }
  }
  & > div:has(${SubTitle}) {
    background-color: #fff;
  }
`;
