import { supabase } from '@/6_shared/api';
import type { AccountSaveType } from '@/5_entities/account';
import type { AccountRpcResult } from '@/5_entities/account';
import type { Json } from '@/6_shared/types/supabase';

export const accountFormApi = {
  // 자산 저장
  createAccount: async (accountData: AccountSaveType): Promise<AccountRpcResult> => {
    const { details, ...common } = accountData;

    const { data, error } = await supabase.rpc('create_account_with_details', {
      p_type: common.type,
      p_name: common.name,
      p_currency: common.currency ?? 'KRW',
      p_current_balance: common.current_balance ?? 0,
      p_is_active: common.is_active ?? true,
      p_provider: common.provider ?? null,
      p_balance_type: common.balance_type ?? 'ASSET',
      p_source: common.source ?? 'MANUAL',
      p_amount_limit: common.amount_limit ?? 0,
      p_limit_remaining: common.limit_remaining ?? 0,
      p_expiry_date: common.expiry_date ?? undefined,
      p_description: common.description ?? '',
      p_linked_account_id: common.linked_account_id ?? undefined,
      p_institution_id: common.institution_id ?? undefined,
      p_detail: details as unknown as Json,
    });

    if (error) throw error;
    return data as unknown as AccountRpcResult;
  },

  // 자산 일괄 저장
  createAccountsBulk: async (accounts: AccountSaveType[]): Promise<AccountRpcResult[]> => {
    // return Promise.all(accounts.map((acc) => accountFormApi.createAccount(acc)));
    const { data, error } = await supabase.rpc('create_accounts_bulk', {
      input_data: accounts as unknown as Json, // 배열 자체를 JSON 형태로 넘김
    });

    if (error) throw error;
    return data as unknown as AccountRpcResult[];
  },
};
