import { useNavigate } from 'react-router-dom';
import { Button } from '@/6_shared/ui/button';
import { useAccountFormStore } from '../model/form.store';
import { useCreateAccount } from '../api/useQuery';

export const AccountQueueActions = () => {
  const { queue, clearQueue, editingIndices } = useAccountFormStore();
  const { mutate, isPending } = useCreateAccount();
  const navigate = useNavigate();
  const isEditingAny = editingIndices.length > 0;
  const isQueueEmpty = queue.length === 0;

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

    console.log('전송 직전  최종 데이터 :', queue);

    mutate(queue, {
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
