import '@/1_app/styles/App.css'
import { AuthProvider } from './providers/AuthProvider'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/6_shared/lib/queyrClient'
import { TestPage } from '@/2_pages/test/TestPage'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TestPage />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
