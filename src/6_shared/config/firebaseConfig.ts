import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
// 참고 문서 : https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Firebase SDK 초기화
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
let analytics = null;

// analytics 배포 환경에서만 실행 되게 설정 : 로컬에선 작동 X
if (import.meta.env.VITE_PRODUCTION_BASE_URL && typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, analytics }

/**  
 * CHECKLIST
 * - [ ] VITE_PRODUCTION_BASE_URL 추가 -> .env 환경변수
 * - [ ] 스트림 URL 설정 -> 애널리틱스 > 속성설정 > 데이터 수집 및 수정 > 데이터 스트림
 * */ 