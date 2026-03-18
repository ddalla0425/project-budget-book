import { create } from 'zustand';
import type {
  AccountInsertType,
  AccountSaveType,
  CashDetailInsert,
  DebtDetailInsert,
  VoucherDetailInsert,
} from '@/5_entities/account';
import { INITIAL_DETAILS } from '../constants/accountInitialValues';

export type AccountFormState = AccountSaveType & {
  tmp_cumulative_usage?: number; // UI 계산용 가상 필드
  tmp_cash_input_type?: string;
};

interface AccountFormStore {
  form: AccountFormState;
  queue: AccountFormState[]; // 등록 대기열
  editingIndices: number[]; // 수정 항목 인덱스 추적

  // Actions
  changeType: (type: AccountInsertType) => void;
  setForm: (data: Partial<AccountFormState>) => void;
  updateForm: (callback: (prev: AccountFormState) => AccountFormState) => void;
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
  provider: '',
  is_active: true,
  linked_account_id: null,
  details: {
    account_number: '',
    deposit_rate: 0,
    interest_cycle: 'MONTHLY',
    interest_settlement_day: null,
    is_main_account: false,
    loan_rate: 0,
  },
  limit_remaining: 0,
  amount_limit: 0,
});

export const useAccountFormStore = create<AccountFormStore>((set) => ({
  form: createInitialState(''), // 초기엔 빈 값, 호출 시 resetForm으로 주입
  queue: [],
  editingIndices: [],

  changeType: (type) =>
    set((state) => {
      // 공통 베이스 정보 추출
      const base = {
        ...state.form,
        type,
        // 타입 변경 시 기존 잔액이나 한도는 유지할지 초기화할지 선택 가능
        current_balance: 0, // 초기화 ㄱㄱ
        // 가상 필드도 타입에 따라 리셋
        tmp_cash_input_type: type === 'CASH' ? 'DETAIL' : undefined,
        tmp_cumulative_usage: type === 'CREDIT_CARD' ? 0 : undefined,
      };
      //  타입별 전략 패턴 매핑 테이블에서 해당 타입의 초기 details를 가져옴
      const initialDetails = INITIAL_DETAILS[type as keyof typeof INITIAL_DETAILS] || {};
      return {
        form: {
          ...base,
          details: initialDetails,
        } as AccountFormState,
      };
    }),

  setForm: (data) =>
    set((state) => ({
      form: { ...state.form, ...data } as AccountFormState,
    })),

  updateForm: (callback) =>
    set((state) => ({
      form: callback(state.form),
    })),

  resetForm: (userId) => set({ form: createInitialState(userId), editingIndices: [] }),

  setInitialForm: (data) => set({ form: data }),

  addQueue: () =>
    set((state) => {
      const { form } = state;
      // details 처리
      let finalDetails = form.details;

      if (Array.isArray(finalDetails)) {
        // 'as' 단언을 써서 유니온 타입을 유지하며 필터링 => 섞인 배열(A|B|C)[]이 아니라 단품 배열들의 유니온(A[]|B[]|C[])임을 명시
        const currentArray = finalDetails as CashDetailInsert[] | DebtDetailInsert[] | VoucherDetailInsert[];

        const filtered = currentArray.filter((item) => {
          const detail = item as Record<string, unknown>;
          if ('quantity' in detail) return (Number(detail.quantity) || 0) > 0;
          if ('voucher_name' in detail) return String(detail.voucher_name || '').trim() !== '';
          return true;
        });

        // CASH 모드가 'TOTAL'일 때는 상세 항목이 없어도 balance가 있으니 통과
        const isCashTotalMode = form.type === 'CASH' && form.tmp_cash_input_type === 'TOTAL';

        if (
          filtered.length === 0 &&
          !isCashTotalMode && // 토탈 모드가 아닐 때만 체크
          (form.type === 'CASH' || form.type === 'GIFT_CARD' || form.type === 'POINT')
        ) {
          alert('상세 항목을 입력해주세요.');
          return state;
        }

        // filtered를 다시 원본 타입으로 '안전하게' 돌려보냅니다.
        finalDetails = filtered as typeof currentArray;
      }

      // 조립 및 반환
      const finalName = form.name?.trim() || form.provider || 'NONE';
      const finalBalance = form.type === 'CHECK_CARD' ? 0 : form.current_balance;

      const newEntry: AccountFormState = {
        ...form,
        name: finalName,
        current_balance: finalBalance,
        details: finalDetails,
      } as AccountFormState;

      return {
        queue: [...state.queue, newEntry],
        form: createInitialState(form.user_id),
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
