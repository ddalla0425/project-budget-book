import { CommonWrapper } from "@/6_shared/styles";
import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  padding: 10px 40px;
  background-color: #f9f9f9;

  h1 {
    display: flex;
    font-size: 1rem;
  }
  ul {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
export const Wrapper = styled(CommonWrapper)`
  justify-content: space-between;
  align-items: center;
`;
