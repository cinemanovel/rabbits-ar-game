import { Redirect } from 'expo-router';
import { useEffect } from 'react';

import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';
import { useAuth } from '@/features/auth/AuthProvider';

export default function OnboardingRoute() {
  const { isLoading, session, user } = useAuth();

  useEffect(() => {
    if (__DEV__) {
      console.log('[route:onboarding] decision state', {
        isLoading,
        hasSession: Boolean(session),
        hasUser: Boolean(user),
        target: isLoading ? 'loading' : !session || !user ? '/sign-in' : 'onboarding',
      });
    }
  }, [isLoading, session, user]);

  if (isLoading) {
    return <OnboardingFlow mode="loading" />;
  }

  if (!session || !user) {
    return <Redirect href="/sign-in" />;
  }

  return <OnboardingFlow user={user} />;
}
