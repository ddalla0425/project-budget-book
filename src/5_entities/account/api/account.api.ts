import { supabase } from '@/6_shared/api';
import type { Tables, TablesInsert } from '@/6_shared/types';

export const accountApi = {
  // 자산 조회
  getAccount: async (userId: string): Promise<Tables<'accounts'>[] | null> => {
    console.log('---  API 호출  ---');
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || []; // data 가 null 일경우 빈 배열 반환
  },

  // 자산 정보 저장 (Upsert 또는 Insert) 개별 저장
  //   createAccount: async (account: TablesInsert<'accounts'>): Promise<Tables<'accounts'>> => {
  //     const { data, error } = await supabase
  //       .from('accounts')
  //       .insert(account)
  //       .select()
  //       .single()

  //     if (error) throw error
  //     return data
  //   }

  // 자산 정보 저장 : 일괄 저장
  createAccounts: async (accounts: TablesInsert<'accounts'>[]): Promise<Tables<'accounts'>[]> => {
    // 💡 시니어의 조언: DB가 ID를 직접 생성하게 하기 위해 id 필드를 제거합니다.
    const accountsWithoutId = accounts.map((acc) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = acc;
      return rest;
    });

    console.log('🚀 최종 전송 데이터:', accountsWithoutId);

    const { data, error } = await supabase.from('accounts').insert(accountsWithoutId).select();

    if (error) {
      console.error('❌ Supabase 저장 에러 상세:', error);
      throw error;
    }
    return data || [];
  },
};
