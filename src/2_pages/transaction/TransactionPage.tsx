import { useGetTransaction } from '@/5_entities/transaction';
import { useUserStore } from '@/5_entities/user';
import { formatNumberWithCommas } from '@/6_shared/lib';
import type { Tables } from '@/6_shared/types';
import { Table, type Column } from '@/6_shared/ui/table';

// 조인된 데이터가 포함된 타입 (유저님 환경에 맞게 조절하세요)
type TransactionWithDetails = Tables<'transactions'> & {
  accounts?: { name: string } | null;
  user_categories?: { name: string } | null;
};

type UseGetTransactionResult = {
  data: TransactionWithDetails[] | undefined;
  error: Error | null;
  isLoading: boolean;
  // 필요한 다른 속성 추가
};
// 🌟 도우미 함수 안에서 유틸 함수를 재활용합니다!
const formatAmount = (amount: number, type: string) => {
  const isExpense = type === 'EXPENSE';
  const isIncome = type === 'INCOME';
  const color = isExpense ? '#e53e3e' : isIncome ? '#3182ce' : '#718096';
  const sign = isExpense ? '-' : isIncome ? '+' : '';
  
  return (
    <span style={{ color, fontWeight: 'bold' }}>
      {/* 🌟 기존의 amount.toLocaleString() 대신 유저님의 함수 사용! */}
      {sign}{formatNumberWithCommas(amount)}원
    </span>
  );
};
export const TransactionPage = () => {
  const user = useUserStore((s) => s.user);
  const {data , error, isLoading}:UseGetTransactionResult = useGetTransaction(user?.uid);
  console.log("data 값",data)

   // 🌟 에러 처리 개선: error가 존재할 때만 표시, 타입 안전하게 message 접근
  if (error) {
    return <p>에러: {error.message}</p>;
  }

    // 🌟 로딩 상태 처리 추가 (선택적)
  if (isLoading) {
    return <p>로딩 중...</p>;
  }
  const columns: Column<TransactionWithDetails>[] = [
    { header: '날짜', accessor: (row) => row.transaction_date, width: '15%' },
    { header: '자산', accessor: (row) => row.accounts?.name || '알 수 없음', width: '20%' },
    { header: '카테고리', accessor: (row) => row.user_categories?.name || '미분류', width: '15%' },
    { header: '내역', accessor: (row) => row.memo || '-', width: '30%' },
    { header: '금액', accessor: (row) => formatAmount(row.amount, row.type), width: '20%' },
  ];
  return (
    <>
      <h2>가계부 원장</h2>
      <p>환영합니다 {user?.displayName} 님</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      
      <Table columns={columns} data={data || []} />
    </>
  );
};
