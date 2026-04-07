import { Header } from "@/3_widgets/header";
import { useUserStore } from "@/5_entities/user";
import { Navigate, Outlet } from "react-router-dom";
import { MainWrapper } from "../styles/GlobalStyle";

// 인증된 유저만 접근 가능한 레이아웃 (Header 포함)
export const PrivateRouter = () => {
  const user = useUserStore((s) => s.user);
  
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <div className="app-container">
      <Header />
      <main className="content">
        <MainWrapper>
          <Outlet /> {/* 이 자리에 Dashboard, TestPage 등이 들어옵니다 */}
        </MainWrapper>
      </main>
    </div>
  );
};
