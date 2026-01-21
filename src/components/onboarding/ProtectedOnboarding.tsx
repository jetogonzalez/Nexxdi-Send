"use client";

import { PinProtection } from '../auth/PinProtection';
import OnboardingFlow from './OnboardingFlow';

export default function ProtectedOnboarding() {
  return (
    <PinProtection>
      <OnboardingFlow />
    </PinProtection>
  );
}
