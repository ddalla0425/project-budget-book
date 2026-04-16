import { useQuery } from '@tanstack/react-query';
import { cardBillingStandardApi } from './api';

export const useGetCardBillingStandards = () => {
  return useQuery({
    queryKey: ['cardBillingStandards', 'all'],
    queryFn: () => cardBillingStandardApi.getCardBillingStandard(),
    staleTime: 1000 * 60 * 60 * 24,
  });
};
