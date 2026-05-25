import { createClient } from '@supabase/supabase-js';

import { getPublicEnv } from '@/lib/env';
import type { Database } from '@/types/database';

const { supabaseUrl, supabaseAnonKey } = getPublicEnv();

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false,
  },
});
