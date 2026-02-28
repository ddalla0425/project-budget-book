import { LoginButton } from '@/4_features/auth'; 

export const LoginPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h1>가계부 서비스</h1>
      <p>서비스 이용을 위해 로그인이 필요합니다.</p>
      <LoginButton />
    </div>
  );
};