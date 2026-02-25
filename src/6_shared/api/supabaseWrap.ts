import type { PostgrestError } from '@supabase/postgrest-js'

export const wrap = async <T>(
  query: PromiseLike<{ data: T | null; error: PostgrestError | null }>,
): Promise<T> => {
  const { data, error } = await query

  if (error) {
    console.error(`[Supabase Error] ${error.code}: ${error.message}`)
    throw error
  }
  if (data === null) {
    throw new Error('[Supabase Error] : data is NULL!!!')
  }

  return data as T
}
