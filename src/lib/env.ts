type PublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

function readRequiredEnv(value: string | undefined, name: string): string {
  if (!value || value.includes('your-')) {
    throw new Error(`Missing ${name}. Add it to .env.local before using Supabase.`);
  }

  return value;
}

export function getPublicEnv(): PublicEnv {
  return {
    supabaseUrl: readRequiredEnv(SUPABASE_URL, 'EXPO_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: readRequiredEnv(SUPABASE_ANON_KEY, 'EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  };
}
