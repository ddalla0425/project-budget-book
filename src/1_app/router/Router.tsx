import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/2_pages/login';
import { DashboardPage } from '@/2_pages/dashboard';
import { TestPage } from '@/2_pages/test';
import { AccountCreatePage, AccountListPage } from '@/2_pages/account';
import { PrivateRouter } from './PrivateRouter';
import { PublicRouter } from './PublicRouter';
import { TransactionPage } from '@/2_pages/transaction/TransactionPage';

// 라우터 객체를 컴포넌트 '외부'에서 정적으로 생성
export const Router = createBrowserRouter([
  {
    // 인증이 필요한 페이지들을 하나의 레이아웃으로 묶음
    element: <PrivateRouter />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/test', element: <TestPage /> },
      {
        path: '/account',
        children: [
          { index: true, element: <AccountListPage /> },
          { path: 'create', element: <AccountCreatePage /> },
        ],
      },
      { path: '/transaction', element: <TransactionPage/> },
      { path: '/mypage', element: <div>My Page</div> },
    ],
  },
  {
    // 로그인이 필요 없는 페이지들을 묶음
    element: <PublicRouter />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
]);
