import { supabase } from '@/6_shared/api';
import type { CardBillingRpcResult } from '../type/rpc.type';

export const cardBillingStandardApi = {
  getCardBillingStandard: async (): Promise<CardBillingRpcResult> => {
    const { data, error } = await supabase.rpc('get_card_billing_standards');
    // .from('card_billing_standards').select(`*`);

    if (error) throw error;
    return data as unknown as CardBillingRpcResult;
  },
};
