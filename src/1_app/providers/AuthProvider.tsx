import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/6_shared/config/firebaseConfig";
import { setTokenProvider } from "@/6_shared/api/auth-token-provider";
import { useAuthStore } from "@/4_features/auth/model/auth.store";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    // 🔥 Token Provider 등록
    setTokenProvider(async () => {
      const user = auth.currentUser;
      if (!user) return null;
      return await user.getIdToken();
    });

    // 🔥 세션 동기화
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <> {children} </>
  );
};

// NOTE
// provider 초기화 순서 보장
// 전역 세션 관리 = app 레이어