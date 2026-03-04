import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '../api/account.api';
import type { Tables, TablesInsert } from '@/6_shared/types';
import { filterData } from '@/6_shared/lib';

export const useGetAccount = (userId?: string) => {
  return useQuery({
    queryKey: ['accounts', userId],
    queryFn: async () => {
      console.log('--- 쿼리문 API 호출 시작 ---');
      if (!userId) return [];
      const data = await accountApi.getAccount(userId!);
      return data;
    },
    enabled: !!userId && userId !== '', // userId가 존재 할대만 쿼리 실행

    select: (rawData) => {
      if (!rawData || rawData.length === 0) {
        return { banks: [], cards: [], relations: { cardToBank: {}, bankToCards: {} } };
      }

      // 1. 전체 데이터를 ID 기반으로 매핑 (O(N))
      const allMap = new Map(rawData.map((item) => [item.id, item]));

      // 2. 은행과 카드 분리 (기존 공용함수 filterData 활용 가능)
      const banks = rawData.filter((item) => item.type === 'BANK');
      const cards = filterData(rawData, { type: ['CHECK_CARD', 'CREDIT_CARD'] });

      // 3. 양방향 관계 맵 생성
      const cardToBank: Record<string, Tables<'accounts'>> = {};
      const bankToCards: Record<string, Tables<'accounts'>[]> = {};

      cards.forEach((card) => {
        const bankId = card.linked_account_id;

        if (bankId) {
          const parentBank = allMap.get(bankId);
          if (parentBank) {
            // 카드 -> 계좌 매핑
            cardToBank[card.id] = parentBank;

            // 계좌 -> 카드 리스트 매핑
            if (!bankToCards[parentBank.id]) bankToCards[parentBank.id] = [];
            bankToCards[parentBank.id].push(card);
          }
        }
      });

      return { banks, cards, relations: { cardToBank, bankToCards } };
    },
    // 가계부 데이터는 빈번하게 변하지 않으므로 캐시 효율을 높입니다.
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accounts: TablesInsert<'accounts'>[]) => accountApi.createAccounts(accounts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};
