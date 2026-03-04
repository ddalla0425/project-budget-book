import type { TablesInsert } from '@/6_shared/types';
import { create } from 'zustand';

type AccountFormState = TablesInsert<'accounts'>;

interface AccountStore {
  form: AccountFormState;
  queue: AccountFormState[]; // 등록 대기열
  editingIndices: number[]; // 수정 항목 인덱스 추적

  // Actions
  setField: <K extends keyof AccountFormState>(field: K, value: AccountFormState[K]) => void;
  resetForm: (userId: string) => void;
  setInitialForm: (data: AccountFormState) => void;

  addQueue: () => void;
  updateQueueItem: (index: number, data: AccountFormState) => void;
  removeFromQueue: (index: number) => void;
  setEditingMode: (index: number, isEditing: boolean) => void; // 수정 모드 토글
  clearQueue: () => void;
}

const createInitialState = (userId: string): AccountFormState => ({
  user_id: userId,
  name: '',
  type: 'BANK',
  currency: 'KRW',
  current_balance: 0,
  source: 'NONE',
  is_active: true,
  linked_account_id: null,
  closing_day: null,
  billing_day: null,
});

export const useAccountStore = create<AccountStore>((set) => ({
  form: createInitialState(''), // 초기엔 빈 값, 호출 시 resetForm으로 주입
  queue: [],
  editingIndices: [],

  setField: (field, value) =>
    set((state) => ({
      form: { ...state.form, [field]: value },
    })),

  resetForm: (userId) => set({ form: createInitialState(userId), editingIndices: [] }),

  setInitialForm: (data) => set({ form: data }),

  addQueue: () =>
    set((state) => {
      const finalName = state.form.name?.trim() || state.form.source || 'NONE';
      const finalBalance = state.form.type === 'CHECK_CARD' ? 0 : state.form.current_balance;
      const newEntry = { ...state.form, name: finalName, current_balance: finalBalance };
      return {
        queue: [...state.queue, newEntry],
        form: createInitialState(state.form.user_id), // 폼 초기화
      };
    }),

  updateQueueItem: (index, data) =>
    set((state) => {
      const newQueue = [...state.queue];
      newQueue[index] = data;
      return { queue: newQueue };
    }),

  removeFromQueue: (index) =>
    set((state) => ({
      queue: state.queue.filter((_, i) => i !== index),
      editingIndices: state.editingIndices.filter((i) => i !== index),
    })),

  setEditingMode: (index, isEditing) =>
    set((state) => ({
      editingIndices: isEditing ? [...state.editingIndices, index] : state.editingIndices.filter((i) => i !== index),
    })),

  clearQueue: () => set({ queue: [], editingIndices: [] }),
}));
