"use client";

import { PinProtection } from './PinProtection';
import WelcomeScreen from './WelcomeScreen';

export default function ProtectedWelcome() {
  return (
    <PinProtection>
      <WelcomeScreen />
    </PinProtection>
  );
}
