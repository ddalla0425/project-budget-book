import { useQuery } from '@tanstack/react-query';
import { accountApi } from './api';
import { transformDashboardToAccountList, transformRawAccount } from '../lib/utils';

// 자산 조회
export const useGetAccount = (userId?: string) => {
  return useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => accountApi.getAccount(userId as string),
    select: (data) => data.map(transformRawAccount), // 여기서 UI 타입으로 변환!
    enabled: !!userId,
  });
};

// 자산 대쉬보드용 함수 조회
export const useGetDashboardQuery = () => {
  return useQuery({
    queryKey: ['account-dashboard'],
    queryFn: () => accountApi.getDashboardAccount(),
    // select를 통해 UI에서 사용하기 편한 형태로 변환
    select: (data) => ({
      raw: data,
      flatList: transformDashboardToAccountList(data),
      fetchedAt: data.fetched_at,
    }),
  });
};
