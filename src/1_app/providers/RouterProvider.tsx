import { LoginPage } from '@/2_pages/login'
import { DashboardPage } from '@/2_pages/dashboard'
import { TestPage } from '@/2_pages/test'
import { Header } from '@/3_widgets/header'
import { useUserStore } from '@/5_entities/user'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'

// 라우터 내부 전용 최상위 레이아웃 컴포넌트 
const RootLayout = ({ showHeader }: { showHeader: boolean }) => (
  <div className="app-container">
    {showHeader && <Header />}
    <main className="content">
      <Outlet /> {/* 하위 페이지들이 렌더링되는 지점 */}
    </main>
  </div>
)

export const AppRouter = () => {
  const user = useUserStore((s) => s.user)
  const router = createBrowserRouter([
    {
      element: <RootLayout showHeader={!!user} />,
      children: [
        {
          path: '/',
          element: user ? (
            <DashboardPage/>
          ) : (
            <Navigate to="/login" replace />
          ),
        },
        {
          path: '/login',
          element: !user ? <LoginPage /> : <Navigate to="/" replace />,
        },

        // 추가되는 페이지들
        {
          path: '/test',
          element: user ? <TestPage/> : <Navigate to="/login" replace />,
        },
        {
          path: '/account',
          element: user ? <div>Account</div> : <Navigate to="/login" replace />,
        },
        {
          path: '/mypage',
          element: user ? <div>My Page</div> : <Navigate to="/login" replace />,
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
