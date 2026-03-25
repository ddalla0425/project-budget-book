import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountFormApi } from './api';
import type { AccountSaveType } from '@/5_entities/account';

// 자산 일괄 저장
export const useCreateAccount = (userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (queue: AccountSaveType[]) => accountFormApi.createAccountsBulk(queue),
    onSuccess: () => {
      // 저장 성공 시 'accounts' 키를 가진 쿼리를 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['accounts', userId] });
      queryClient.invalidateQueries({ queryKey: ['account-dashboard', userId] });
    },
    onError: (error) => {
      alert(`저장시 에러 :  ,${error}`);
    },
  });
};
