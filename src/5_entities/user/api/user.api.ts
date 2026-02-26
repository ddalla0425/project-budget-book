import { supabase } from '@/6_shared/api/supabaseClient'
import type { Tables, TablesInsert } from '@/6_shared/types/supabase'

export const userApi = {
  // 유저 조회
  getUser: async (userId: string): Promise<Tables<'users'> | null> => {
    console.log('---  API 호출  ---');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error
    return data
  },

  // 유저 정보 저장 (Upsert 또는 Insert)
  createUser: async (user: TablesInsert<'users'>): Promise<Tables<'users'>> => {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single()

    if (error) throw error
    return data
  }
}