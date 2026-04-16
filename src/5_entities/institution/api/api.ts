import { supabase } from '@/6_shared/api';
import type { FinancialInstitution } from '../type/select.type';

export const institutionApi = {
  // 금융기관 정보 조회
  getInstitution: async (): Promise<FinancialInstitution[]> => {
    const { data, error } = await supabase.rpc('get_financial_institutions');

    if (error) {
      console.log('금융기관 정보 조회 에러: ', error);
    }

    return data as FinancialInstitution[];
  },
};
