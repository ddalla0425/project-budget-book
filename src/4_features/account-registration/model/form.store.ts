import { create } from 'zustand';
import type { AccountInsertType, AccountSaveType } from '@/5_entities/account';
import { INITIAL_DETAILS, CREATE_INITIAL as createInitialState } from '../constants/accountInitialValues';

interface AccountFormStore {
  form: AccountSaveType;
  queue: AccountSaveType[]; // 등록 대기열
  editingIndices: number[]; // 수정 항목 인덱스 추적

  // Actions
  changeType: (type: AccountInsertType) => void;
  setForm: (data: Partial<AccountSaveType>) => void;
  updateForm: (callback: (prev: AccountSaveType) => AccountSaveType) => void;
  resetForm: (userId: string) => void;

  setInitialForm: (data: AccountSaveType) => void;

  // addQueue: (options?: { createLinkedPoint?: boolean; institutionName?: string }) => void;
  addQueue: (items: AccountSaveType[]) => void;
  updateQueueItem: (index: number, data: AccountSaveType) => void;
  removeFromQueue: (index: number) => void;
  setEditingMode: (index: number, isEditing: boolean) => void; // 수정 모드 토글
  clearQueue: () => void;

  addDetail: (newDetails: unknown[]) => void;
  removeDetail: (newDetails: unknown[], newTotal: number) => void;
}

export const useAccountFormStore = create<AccountFormStore>((set) => ({
  form: createInitialState(''), // 초기엔 빈 값, 호출 시 resetForm으로 주입
  queue: [],
  editingIndices: [],

  changeType: (type) =>
    set((state) => {
      // 🌟 1. 유저 ID만 살리고, 폼 전체를 완전히 백지(초기값)로 만듭니다.
      const freshState = createInitialState(state.form.user_id);

      // 🌟 2. 새로 선택한 타입에 맞는 디테일 초기값을 가져옵니다.
      const initialDetails = INITIAL_DETAILS[type as keyof typeof INITIAL_DETAILS] || {};

      return {
        form: {
          ...freshState, // 백지 상태를 베이스로 깔고
          type, // 선택한 타입 덮어쓰기
          details: initialDetails, // 타입에 맞는 빈 디테일 덮어쓰기
        } as AccountSaveType,
      };
    }),

  setForm: (data) =>
    set((state) => ({
      form: { ...state.form, ...data } as AccountSaveType,
    })),

  updateForm: (callback) =>
    set((state) => ({
      form: callback(state.form),
    })),

  resetForm: (userId) => set({ form: createInitialState(userId), editingIndices: [] }),

  setInitialForm: (data) => set({ form: data }),

  // addQueue: (options) =>
  //   set((state) => {
  //     const { form } = state;
  //     let finalDetails = form.details;
  //     let finalName = form.name?.trim() || "";
  //   let finalBalance = form.current_balance || 0;

  //     const instName = options?.institutionName || "";

  //     // 1. 빈 항목 필터링 (저장할 가치가 없는 데이터 솎아내기)
  //     if (Array.isArray(finalDetails)) {
  //       const currentArray = finalDetails as
  //        | CashDetailInsert[]
  //         | DebtDetailInsert[]
  //         | VoucherDetailInsert[];

  //       const filtered = currentArray.filter((item) => {
  //           const detail = item as Record<string, unknown>;
  //           if (form.type === "CASH" && "quantity" in detail) return (Number(detail.quantity) || 0) > 0;
  //           if (form.type === "GIFT_CARD" || form.type === "POINT" &&  "voucher_name" in detail) return String(detail.voucher_name || "").trim() !== "";
  //           if (form.type === "DEBT") {
  //             return String(detail.name || "").trim() !== "" ||
  //               (Number(detail.total_principal) || 0) > 0;
  //           }
  //           return true;
  //         });

  //       // 유효성 검사 (아무것도 입력 안 했으면 중단)
  //       const hasBalance = (Number(form.current_balance) || 0) !== 0;
  //       if (
  //         filtered.length === 0 && !hasBalance &&
  //         ["CASH", "GIFT_CARD", "POINT", "DEBT"].includes(form.type)
  //       ) {
  //         alert("상세 항목을 최소 1개 이상 입력해주세요.");
  //         return state;
  //       }

  //       // 🌟 2. 이름 자동 생성 (이미 계산된 finalDetails 기반)
  //       if (!finalName && filtered.length > 0) {
  //         const count = filtered.length;
  //         if (form.type === "CASH") {
  //            const first = filtered[0] as CashDetailInsert;
  //           const typeLabel = first.cash_type === "BILL"
  //             ? "지폐"
  //             : "동전";
  //           finalName = count === 1
  //             ? `현금 (${typeLabel})`
  //             : `현금 (${typeLabel} 외 ${count - 1}건)`;
  //         } else if (form.type === "GIFT_CARD" || form.type === "POINT") {
  //            const first = filtered[0] as VoucherDetailInsert;
  //           const firstName = first.voucher_name ||
  //             (form.type === "POINT" ? "포인트" : "상품권");
  //           finalName = count === 1
  //             ? firstName
  //             : `${firstName} 외 ${count - 1}건`;
  //         } else if (form.type === "DEBT") {
  //            const first = filtered[0] as DebtDetailInsert;
  //           const firstName = first.name || "부채 상세";
  //           finalName = count === 1
  //             ? firstName
  //             : `${firstName} 외 ${count - 1}건`;
  //         }
  //       }
  //       finalDetails = filtered as typeof currentArray;
  //     } else if (finalDetails !== null) {
  //       // 객체 형태(1:1 관계)일 경우의 동기화 (기존 답변 로직)
  //       const detailRecord = finalDetails as Record<string, unknown>;
  //       if (!finalName && detailRecord.name) {
  //         finalName = String(detailRecord.name).trim();
  //       }
  //       if(form.type === "CREDIT_CARD") {
  //         finalBalance = -Math.abs(finalBalance)
  //         // -Math.abs(form.current_balance)
  //       }
  //     }

  //     // 3. 최종 폴백 (이름이 여전히 없다면)
  //     finalName = finalName || instName || "기타 자산";

  //     // 4. 최종 조립 (계산은 이미 되어있으므로 form.current_balance 그대로 사용)
  //     const newEntry: AccountSaveType = {
  //       ...form,
  //       name: finalName,
  //       details: finalDetails,
  //       current_balance: finalBalance
  //       // current_balance는 필드에서 계산해준 그대로 저장
  //     } as AccountSaveType;

  //     const entriesToQueue = [newEntry];

  //    // 🌟 2. [1+1 마법] 포인트 동시 생성 로직
  //   if (options?.createLinkedPoint && form.type === 'PAY') {
  //     // 기관 이름이 있으면 "네이버페이 포인트", 없으면 입력한 이름 기반으로 명명
  //     const pointName = instName ? `${instName} 포인트` : `${finalName} 포인트`;

  //     const pointEntry: AccountSaveType = {
  //       ...createInitialState(form.user_id),
  //       type: 'POINT',
  //       name: pointName,
  //       institution_id: form.institution_id, // 🌟 포인트도 같은 기관 ID 공유
  //       details: [
  //         {
  //           ...INITIAL_DETAILS['POINT'][0],
  //           voucher_name: pointName // 디테일 내부의 포인트 이름도 세팅
  //         }
  //       ]
  //     } as AccountSaveType;

  //     entriesToQueue.push(pointEntry);
  //   }

  //     return {
  //       queue: [...state.queue, ...entriesToQueue],
  //       form: createInitialState(form.user_id),
  //     };
  //   }),
  addQueue: (items) =>
    set((state) => ({
      queue: [...state.queue, ...items],
      form: createInitialState(state.form.user_id),
    })),
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

  addDetail: (newDetails) =>
    set((state) => ({
      form: { ...state.form, details: newDetails } as AccountSaveType,
    })),

  removeDetail: (newDetails, newTotal) =>
    set((state) => ({
      form: {
        ...state.form,
        details: newDetails,
        current_balance: newTotal,
      } as AccountSaveType,
    })),
}));
