import { useQuery } from '@tanstack/react-query';
import { institutionApi } from './api';

// 금융기관 정보 함수 조회
export const useGetFinancialInstitutionsQuery = () => {
  return useQuery({
    queryKey: ['financial-Institutions'],
    queryFn: async () => await institutionApi.getInstitution(),
  });
};
