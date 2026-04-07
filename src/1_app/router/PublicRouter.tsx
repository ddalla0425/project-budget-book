import { useUserStore } from "@/5_entities/user";
import { Navigate, Outlet } from "react-router-dom";
import { MainWrapper } from "../styles/GlobalStyle";


// 인증 안 된 유저(로그인 전)만 접근 가능한 레이아웃
export const PublicRouter = () => {
  const user = useUserStore((s) => s.user);
  
  if (user) return <Navigate to="/" replace />;
  
  return (
    <div className="app-container">
      <main className="content">
        <MainWrapper>
          <Outlet /> {/* 이 자리에 LoginPage가 들어옵니다 */}
        </MainWrapper>
      </main>
    </div>
  );
};