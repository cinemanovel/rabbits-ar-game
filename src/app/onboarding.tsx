import { Redirect } from 'expo-router';

import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';
import { useAuth } from '@/features/auth/AuthProvider';

export default function OnboardingRoute() {
  const { isLoading, session, user } = useAuth();

  if (isLoading) {
    return <OnboardingFlow mode="loading" />;
  }

  if (!session || !user) {
    return <Redirect href="/sign-in" />;
  }

  return <OnboardingFlow user={user} />;
}
