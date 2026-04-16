import { LogoutButton } from '@/4_features/auth';
import * as S from './Header.style';
import { Link } from 'react-router-dom';
export const Header = () => {
  return (
    <S.HeaderContainer>
      <S.Wrapper>
        <h1><Link to='/'>가계부 로고영역</Link></h1>
        <ul>
          <li>마이페이지</li>
          <li>
            <LogoutButton />
          </li>
        </ul>
      </S.Wrapper>
    </S.HeaderContainer>
  );
};
