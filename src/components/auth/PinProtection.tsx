"use client";

import { useEffect, useState } from 'react';
import { isPinValidated } from './PinScreen';

interface PinProtectionProps {
  children: React.ReactNode;
}

export function PinProtection({ children }: PinProtectionProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    // Verificar si el PIN ya fue validado
    if (isPinValidated()) {
      setIsValidated(true);
    } else {
      // Redirigir a la página de PIN
      window.location.href = '/pin';
      return;
    }
    setIsChecking(false);
  }, []);

  // Mientras verifica, no mostrar nada
  if (isChecking) {
    return null;
  }

  // Si no está validado, no mostrar nada (ya se redirigió)
  if (!isValidated) {
    return null;
  }

  return <>{children}</>;
}
