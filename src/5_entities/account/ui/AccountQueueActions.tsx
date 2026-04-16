import { useNavigate } from 'react-router-dom';
import { useAccountStore } from '../model/accountStore';
import { useCreateAccount } from '../model/useAccountQuery';
import { Button } from '@/6_shared/ui/button';

export const AccountQueueActions = () => {
  const { queue, clearQueue, editingIndices } = useAccountStore();
  const { mutate, isPending } = useCreateAccount();
  const navigate = useNavigate();

  const handleBulkSave = () => {
    if (queue.length === 0) return;
    if (editingIndices.length > 0) {
      alert('수정 중인 항목의 저장을 먼저 완료해 주세요.');
      return;
    }

    // 전송 전 데이터 최종 확인 (userId 누락 체크)
    const isValid = queue.every((item) => !!item.user_id);
    if (!isValid) {
      alert('데이터에 사용자 정보가 누락되었습니다. 다시 시도해주세요.');
      return;
    }

    mutate(queue, {
      onSuccess: () => {
        clearQueue(); // 저장 성공 후 대기열 비우기
        alert('모든 자산이 성공적으로 등록되었습니다.');
        navigate('/account/list');
      },
      onError: (err) => {
        alert('저장 중 오류가 발생했습니다.');
        console.error(err);
      },
    });
  };

  // if (queue.length === 0) return null

  return (
    <div>
      <Button
        onClick={handleBulkSave}
        disabled={isPending || editingIndices.length > 0}
        style={{ width: '100%', height: '50px' }}
      >
        {isPending ? '서버에 저장 중...' : `총 ${queue.length}건의 자산 등록 완료하기`}
      </Button>
    </div>
  );
};
