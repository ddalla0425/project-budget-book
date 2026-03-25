import type { Tables } from '@/6_shared/types';

export interface CardBillingRpcResult extends Tables<'card_billing_standards'> {
  institution?: {
    id: string;
    name: string;
    type?: string;
    logo_url?: string;
  };
}
