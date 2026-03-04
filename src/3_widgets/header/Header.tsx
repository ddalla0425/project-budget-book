import { LogoutButton } from '@/4_features/auth';
import { HeaderContainer } from './Header.style';

export const Header = () => {
  return (
    <HeaderContainer>
      <h1>가계부 로고영역</h1>
      <ul>
        <li>마이페이지</li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </HeaderContainer>
  );
};
