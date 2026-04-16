import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/6_shared/api';
import { AuthProvider } from './AuthProvider'; 

interface Props {
  children: React.ReactNode;
}

// 앱 전체에 주입될 Provider들을 여기서 모두 조립합니다.
export const Providers = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};