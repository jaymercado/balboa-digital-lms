import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null

const connectSupabase = async () => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error('Supabase credentials not defined')
    }

    if (supabase) {
      return supabase
    } else {
      supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
      return supabase
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in connectSupabase', error?.message)
    }
  }
}

export default connectSupabase
