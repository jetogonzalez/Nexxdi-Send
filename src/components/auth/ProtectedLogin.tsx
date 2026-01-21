"use client";

import { PinProtection } from './PinProtection';
import LoginPage from './LoginPage';

export default function ProtectedLogin() {
  return (
    <PinProtection>
      <LoginPage />
    </PinProtection>
  );
}
