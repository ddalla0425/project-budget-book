import { useNavigate } from 'react-router-dom';
import { Button } from '@/6_shared/ui/button';
import { useAccountFormStore } from '../model/form.store';
import { useCreateAccount } from '../api/useQuery';
import type { AccountSaveType } from '@/5_entities/account';
import { normalizeAccountValue } from '../lib/utils';

export const AccountQueueActions = () => {
  const { queue, clearQueue, editingIndices } = useAccountFormStore();
  const { mutate, isPending } = useCreateAccount();
  const navigate = useNavigate();
  const isEditingAny = editingIndices.length > 0;
  const isQueueEmpty = queue.length === 0;
  // const isPending = saveMutation.isPending;
  const handleBulkSave = () => {
    console.log('🔥🔥 handleBulkSave 버튼 클릭됨! 대기열 개수:', queue.length);
    // 즉시 방어: 이미 전송 중이면 실행 차단
    if (isPending || queue.length === 0) return;

    if (isQueueEmpty) return;
    if (isEditingAny) {
      alert('수정 중인 항목의 저장을 먼저 완료해 주세요.');
      return;
    }

    // 전송 전 데이터 최종 확인 (userId 누락 체크)
    const isValid = queue.every((item) => !!item.user_id);
    if (!isValid) {
      alert('데이터에 사용자 정보가 누락되었습니다. 다시 시도해주세요.');
      return;
    }

    // 데이터 가공 
    const formattedQueue: AccountSaveType[] = queue.map((account) => {
      // 가상 필드('tmp_'로 시작) 분리 (비구조화 할당 사용)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tmp_cumulative_usage: _, tmp_cash_input_type: __, ...rest } = account;

      // 기본 가공값 설정
      const isCreditCard = rest.type === 'CREDIT_CARD';
      const finalBalance = isCreditCard
        ? rest.current_balance
          ? -Math.abs(rest.current_balance)
          : 0
        : rest.current_balance;

      // Details 가공 (배열이 아닐 때만 숫자 필드 보정)
      let finalDetails = rest.details;

      if (finalDetails && !Array.isArray(finalDetails)) {
        const cleanDetails = { ...finalDetails } as Record<string, string | number | boolean | null>;

        Object.keys(cleanDetails).forEach((key) => {
          const val = cleanDetails[key];
          // 모든 숫자 필드(이미 valueAsNumber로 숫자 타입인 것들)에 대해 실행 // TODO : 필드에 number 타입 valueAsNumber로 변경
          if (typeof val === 'number') {
            cleanDetails[key] = normalizeAccountValue(key, val);
          }
        });
        finalDetails = cleanDetails as typeof rest.details;
      }

      return {
        ...rest,
        current_balance: finalBalance,
        balance_type: isCreditCard ? 'LIABILITY' : rest.balance_type,
        details: finalDetails,
      } as AccountSaveType;
    });

    console.log('전송 직전  최종 데이터 :', formattedQueue);

    mutate(formattedQueue, {
      onSuccess: () => {
        clearQueue(); 
        alert('모든 자산이 성공적으로 등록되었습니다.');
        navigate('/account');
      },
      onError: (err) => {
        alert('일괄 저장 중 오류가 발생했습니다.');
        console.error(err);
      },
    });
  };

  return (
    <div>
      <Button
        onClick={handleBulkSave}
        disabled={isPending || isEditingAny || isQueueEmpty}
        style={{ width: '100%', height: '50px' }}
      >
        {isPending ? '서버에 저장 중...' : `총 ${queue.length}건의 자산 등록 완료하기`}
      </Button>
    </div>
  );
};
