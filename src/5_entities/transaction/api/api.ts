import { supabase } from '@/6_shared/api';
import type { Tables } from '@/6_shared/types';

export const transactionApi = {
  // 거래내역 조회
  getTransaction: async (userId: string): Promise<Tables<'transactions'>[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select(
        `
         *,
          transfer_groups!fk_transactions_transfer_group_same_user(*),
          recurring_expenses!fk_transactions_recurring_same_user(*),
          accounts!fk_transactions_account_same_user(*),
          user_categories(*)
      `
      )
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as unknown as Tables<'transactions'>[]) || [];
  },

};
