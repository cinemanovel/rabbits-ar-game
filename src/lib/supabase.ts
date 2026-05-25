import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { getPublicEnv } from '@/lib/env';
import type { Database } from '@/types/database';

const { supabaseUrl, supabaseAnonKey } = getPublicEnv();

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    persistSession: true,
  },
});
