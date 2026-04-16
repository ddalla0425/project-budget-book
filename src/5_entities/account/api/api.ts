import { supabase } from '@/6_shared/api';
import type { RawAccountResponse, RawDashboardResponse } from '../type/rpc.type';

export const accountApi = {
  // 자산 조회
  getAccount: async (userId: string): Promise<RawAccountResponse[]> => {
    const { data, error } = await supabase
      .from('accounts')
      .select(
        `
         *,
          financial_institutions(*),
          account_cash_details(*),
          account_bank_details!account_bank_details_account_id_fkey(*),
          account_card_details!account_card_details_account_id_fkey(*),
          account_pay_details!account_pay_details_account_id_fkey(*),
          account_voucher_details!asset_vouchers_account_id_fkey(*),
          account_insurance_details!account_insurance_details_account_id_fkey(*),
          account_investment_details!account_investment_details_account_id_fkey(*),
          account_saving_details!fk_account_saving_details_accounts(*),
          account_debt_details!fk_account_debt_details_accounts(*)
      `
      )
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as unknown as RawAccountResponse[]) || [];
  },

  // 대쉬보드용 함수 조회
  getDashboardAccount: async (): Promise<RawDashboardResponse> => {
    const { data, error } = await supabase.rpc('get_user_account_dashboard_v2');

    if (error) {
      console.error('Dashboard 조회 에러:', error);
      throw error;
    }

    return data as unknown as RawDashboardResponse;
  },
};
