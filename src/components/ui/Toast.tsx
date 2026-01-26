"use client";

import { useEffect, useState } from 'react';
import { borderRadius, colors, spacing, typography, shadows } from '../../config/design-tokens';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number; // Duración en milisegundos
}

export function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setTimeout(onClose, 300); // Esperar a que termine la animación de salida
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setShouldRender(false);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !shouldRender) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: `calc(80px + ${spacing[4]} + env(safe-area-inset-bottom))`, // Encima del bottom navigation
        left: '50%',
        transform: `translateX(-50%) translateY(${shouldRender && isVisible ? '0' : '100px'})`,
        backgroundColor: colors.semantic.text.primary, // Negro
        color: colors.semantic.background.white,
        paddingTop: spacing[3], // 12px
        paddingBottom: spacing[3], // 12px
        paddingLeft: spacing[4], // 16px
        paddingRight: spacing[4], // 16px
        borderRadius: borderRadius.full, // Full rounded
        fontFamily: typography.fontFamily.sans.join(', '),
        fontSize: typography.fontSize.sm, // 14px (más pequeño)
        fontWeight: typography.fontWeight.semibold, // Mayor peso (600)
        zIndex: 9999,
        opacity: shouldRender && isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: 'none',
        maxWidth: 'calc(100% - 32px)',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        boxShadow: shadows.toast,
      }}
    >
      {message}
    </div>
  );
}
