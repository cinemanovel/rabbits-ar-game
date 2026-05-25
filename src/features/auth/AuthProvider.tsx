import type { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import { supabase } from '@/lib/supabase';

type AuthResult = {
  error?: string;
  session?: Session | null;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  completeAuthCallback: (url: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function formatAuthError(message: string): string {
  if (message.toLowerCase().includes('email not confirmed')) {
    return 'Confirm your email before signing in.';
  }

  return message;
}

function getAuthCallbackParams(url: string) {
  const parsed = Linking.parse(url);
  const queryParams = parsed.queryParams ?? {};
  const hashParams = new URLSearchParams(url.includes('#') ? url.split('#')[1] : '');

  const readValue = (key: string) => {
    const queryValue = queryParams[key];

    if (typeof queryValue === 'string') {
      return queryValue;
    }

    if (Array.isArray(queryValue) && typeof queryValue[0] === 'string') {
      return queryValue[0];
    }

    return hashParams.get(key) ?? undefined;
  };

  return {
    accessToken: readValue('access_token'),
    code: readValue('code'),
    errorCode: readValue('error_code') ?? readValue('error'),
    errorDescription: readValue('error_description'),
    refreshToken: readValue('refresh_token'),
  };
}

export function getAuthCallbackUrl() {
  return Linking.createURL('auth/callback');
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      completeAuthCallback: async (url) => {
        const { accessToken, code, errorCode, errorDescription, refreshToken } = getAuthCallbackParams(url);

        if (errorCode) {
          return { error: formatAuthError(errorDescription ?? errorCode) };
        }

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          return error ? { error: formatAuthError(error.message) } : { session: data.session };
        }

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          return error ? { error: formatAuthError(error.message) } : { session: data.session };
        }

        return { error: 'No Supabase auth session was found in the callback URL.' };
      },
      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        return error ? { error: formatAuthError(error.message) } : { session: data.session };
      },
      signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: getAuthCallbackUrl(),
          },
        });

        return error ? { error: formatAuthError(error.message) } : { session: data.session };
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();

        return error ? { error: formatAuthError(error.message) } : {};
      },
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
