"use client";

import { PinScreen } from './PinScreen';

export default function PinPage() {
  const handleSuccess = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/welcome';
    }
  };

  return <PinScreen onSuccess={handleSuccess} />;
}
