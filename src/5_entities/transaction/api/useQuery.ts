import { useQuery } from "@tanstack/react-query";
import { transactionApi } from "./api";

export const useGetTransaction = (userId?: string) => {
  return useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => transactionApi.getTransaction(userId as string),
    // select: (data) => data.map(transformRawAccount), // 여기서 UI 타입으로 변환!
    enabled: !!userId,
  });
};
