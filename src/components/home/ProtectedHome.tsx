"use client";

import { PinProtection } from '../auth/PinProtection';
import HomePage from './HomePage';

export default function ProtectedHome() {
  return (
    <PinProtection>
      <HomePage />
    </PinProtection>
  );
}
