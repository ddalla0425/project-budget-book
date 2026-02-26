// TODO : persist 고민 해보기. -> 그 이전에 설계부터 확실하게 결정하기
/**
 * NOTE
 * 새로고침시 대비할겸 로컬 스토리지 사용할지 고민할 때는 persist 고민 했지만.
 * 현재 로컬스토리지 사용하지 않고, AuthProvider 내부의 onAuthStateChanged 가 새로고침시 실행되면서 유저 정보 받아와 스토어 다시 채워줌.
 * -> 어차피 새로고침시 유저 정보 받아와서 스토어 채워주면, 굳이? 로컬스토리지랑 persist 사용할 이유가 없음 ㅎㅎ 안쓰는걸로 땅땅!
 * */

import { create } from 'zustand'
import type { User } from 'firebase/auth'

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
