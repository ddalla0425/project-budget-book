import { useMutation } from "@tanstack/react-query";
import { loginWithGoogle } from "../api/loginWithGoogle";

export const useLogin = () => {
 return useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: () => {
      // 로그인이 성공하면 자동으로 AuthProvider의 onAuthStateChanged가 실행되어 
      // Zustand 스토어에 유저 정보가 담깁니다.
      console.log('로그인 프로세스 시작');
    }
  });
};