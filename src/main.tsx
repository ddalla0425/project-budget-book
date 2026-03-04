import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/1_app/providers';
import App from '@/1_app/App.tsx';
import { queryClient } from '@/6_shared/api';

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </QueryClientProvider>
);
