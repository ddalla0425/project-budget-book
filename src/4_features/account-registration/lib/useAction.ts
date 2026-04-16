import type {
  AccountInsertType,
  AccountSaveType,
  CashDetailInsert,
  DebtDetailInsert,
  VoucherDetailInsert,
} from '@/5_entities/account';
import { CREATE_INITIAL, INITIAL_DETAILS } from '../constants/accountInitialValues';

// Setter 타입 정의: Zustand의 setForm과 useState의 Dispatch 모두 수용
type AccountSetter = (callback: (prev: AccountSaveType) => AccountSaveType) => void;

export const useAction = (setForm: AccountSetter, storeAddQueue?: (items: AccountSaveType[]) => void) => {
  // 1. 상세 항목 추가 (CASH, GIFT_CARD, DEBT 공용)
  const addDetail = (type: AccountInsertType) => {
    setForm((prev) => {
      if (!Array.isArray(prev.details)) return prev;
      const detailTemplate = INITIAL_DETAILS[type as keyof typeof INITIAL_DETAILS];
      let newDetail = {};
      if (Array.isArray(detailTemplate) && detailTemplate.length > 0) {
        newDetail = { ...detailTemplate[0] };
      }

      return {
        ...prev,
        details: [...prev.details, newDetail],
      } as AccountSaveType;
    });
  };

  // 2. 상세 항목 삭제 및 합계 재계산
  const removeDetail = (index: number, type: AccountInsertType) => {
    setForm((prev) => {
      if (!Array.isArray(prev.details) || prev.details.length <= 1) {
        return prev;
      }

      const newDetails = prev.details.filter((_, i) => i !== index);
      let newTotal = prev.current_balance;

      // 타입별 합계 재계산 로직 통합
      if (type === 'CASH') {
        const items = newDetails as CashDetailInsert[];
        newTotal = items.reduce(
          (sum, item) => sum + (Number(item.denomination) || 0) * (Number(item.quantity) || 0),
          0
        );
      } else if (type === 'DEBT') {
        const items = newDetails as DebtDetailInsert[];
        newTotal = items.reduce(
          (sum, item) => sum + (Number(item.remaining_amount) || Number(item.total_principal) || 0),
          0
        );
        newTotal = -Math.abs(newTotal);
      } else if (type === 'GIFT_CARD') {
        const items = newDetails as VoucherDetailInsert[];
        newTotal = items.reduce(
          (sum, item) => sum + (Number(item.denomination) || 0) * (Number(item.quantity) || 0),
          0
        );
      }

      return {
        ...prev,
        current_balance: newTotal,
        details: newDetails,
      } as AccountSaveType;
    });
  };

  // 🌟 스토어에서 이사 온 메인 큐 처리 로직!
  const handleAddToQueue = (
    form: AccountSaveType,
    options?: {
      createLinkedPoint?: boolean;
      institutionName?: string;
      targetPayId?: string;
    }
  ) => {
    let finalDetails = form.details;
    let finalName = form.name?.trim() || '';
    let finalBalance = form.current_balance || 0;
    const instName = options?.institutionName || '';

    if (Array.isArray(finalDetails)) {
      const currentArray = finalDetails as CashDetailInsert[] | DebtDetailInsert[] | VoucherDetailInsert[];

      // 1. 필터링 로직
      let filtered = currentArray.filter((item) => {
        const detail = item as Record<string, unknown>;
        if (form.type === 'CASH' && 'quantity' in detail) {
          return (Number(detail.quantity) || 0) > 0;
        }
        if (['GIFT_CARD', 'POINT'].includes(form.type) && 'voucher_name' in detail)
          return String(detail.voucher_name || '').trim() !== '';
        if (form.type === 'DEBT') {
          return String(detail.name || '').trim() !== '' || (Number(detail.total_principal) || 0) > 0;
        }
        return true;
      });

      // 2. 유효성 검사 (실패 시 여기서 종료)
      const hasBalance = (Number(form.current_balance) || 0) !== 0;
      if (filtered.length === 0 && !hasBalance && ['CASH', 'GIFT_CARD', 'POINT', 'DEBT'].includes(form.type)) {
        alert('상세 항목을 최소 1개 이상 입력해주세요.');
        return; // 실패했으므로 아무것도 넘기지 않음
      }

      // 3. 이름 자동 생성
      if (!finalName && filtered.length > 0) {
        const count = filtered.length;
        if (form.type === 'CASH') {
          const first = filtered[0] as CashDetailInsert;
          const typeLabel = first.cash_type === 'BILL' ? '지폐' : '동전';
          finalName = count === 1 ? `현금 (${typeLabel})` : `현금 (${typeLabel} 외 ${count - 1}건)`;
        } else if (['GIFT_CARD', 'POINT'].includes(form.type)) {
          const first = filtered[0] as VoucherDetailInsert;
          const firstName = first.voucher_name || (form.type === 'POINT' ? '포인트' : '상품권');
          finalName = count === 1 ? firstName : `${firstName} 외 ${count - 1}건`;
        } else if (form.type === 'DEBT') {
          const first = filtered[0] as DebtDetailInsert;
          const firstName = first.name || '부채 상세';
          finalName = count === 1 ? firstName : `${firstName} 외 ${count - 1}건`;
        }
      }

      // 🌟 [B안 적용] 포인트 단독 생성인데 연결할 페이(targetPayId)가 있다면 주입!
      if (form.type === 'POINT' && options?.targetPayId) {
        filtered = filtered.map((item) => ({
          ...item,
          target_pay_id: options.targetPayId, // SQL UPDATE 용 티켓 추가!
        })) as typeof currentArray;
      }

      finalDetails = filtered as typeof currentArray;
    } else if (finalDetails !== null) {
      const detailRecord = finalDetails as Record<string, unknown>;
      if (!finalName && detailRecord.name) {
        finalName = String(detailRecord.name).trim();
      }

      if (form.type === 'CREDIT_CARD') {
        finalBalance = -Math.abs(finalBalance);
      }
    }

    finalName = finalName || instName || '기타 자산';

    // 4. 메인 자산 엔트리 생성
    const newEntry: AccountSaveType = {
      ...form,
      name: finalName,
      details: finalDetails,
      current_balance: finalBalance,
    } as AccountSaveType;

    const entriesToQueue: AccountSaveType[] = [];

    // 🌟 5. [1+1 마법] 페이 생성 시 포인트 동시 생성 로직 (UUID 탑재)
    if (options?.createLinkedPoint && form.type === 'PAY') {
      // const pointId = crypto.randomUUID();

      // (newEntry.details as PayDetailInsert).linked_point_account_id =
      //     pointId; // 본체에 ID 연결
      // newEntry.details = {
      //     ...(newEntry.details as PayDetailInsert),
      //     linked_point_account_id: pointId,
      // };

      const payId = crypto.randomUUID();
      newEntry.id = payId;

      const pointName = instName ? `${instName} 포인트` : `${finalName} 포인트`;
      const pointEntry: AccountSaveType = {
        ...CREATE_INITIAL(form.user_id),
        // id: pointId, // DB에 들어갈 ID
        type: 'POINT',
        name: pointName,
        institution_id: form.institution_id,
        details: [
          {
            ...INITIAL_DETAILS['POINT'][0],
            voucher_name: pointName,

            // 🌟 2️⃣ 포인트 -> 페이 방향 연결 (나는 이 페이로 전환될 거야!)
            is_convertible: true,
            convertible_account_id: payId,

            // 🌟 3️⃣ 페이 -> 포인트 방향 연결 (DB야, 이 페이의 짝꿍으로 나를 등록해줘!)
            target_pay_id: payId,
          },
        ],
      } as AccountSaveType;

      entriesToQueue.push(newEntry);
      entriesToQueue.push(pointEntry);
    } else {
      entriesToQueue.push(newEntry);
    }

    if (storeAddQueue) {
      storeAddQueue(entriesToQueue);
    } else {
      console.warn('storeAddQueue 함수가 전달되지 않아 대기열에 추가할 수 없습니다.');
    }
  };

  return { addDetail, removeDetail, handleAddToQueue };
};
