import axios from 'axios'
import { fetchToken } from './auth-token-provider'
import { auth } from '../config/firebaseConfig'

//---------------- API 인스턴스 ----------------
export const api = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_PROJECT_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
})

//---------------- 요청 가로채기 ----------------
api.interceptors.request.use(
  async (config) => {
    const token = await fetchToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

//---------------- 응답 가로채기 ----------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true

      try {
        // const refreshedToken = await fetchToken?.() // 기본 refresh 시도
        const refreshedToken = await auth.currentUser?.getIdToken();
        if (refreshedToken) {
          originalRequest.headers.Authorization = `Bearer ${refreshedToken}`
          return api(originalRequest)
        }
      } catch(authErr) {
        // 그냥 아래로 떨어짐
        console.log("인증 갱신 실패 : ",authErr)
      }
    }

    return Promise.reject(error)
    // console.log("에러 : ", error)
  },
)

// NOTE 
// FSD 철학상.shared는 logout 안 함
// 무한루프 방지 "_retry"