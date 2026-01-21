"use client";

import { useState } from 'react';
import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';

interface PinScreenProps {
  onSuccess: () => void;
}

const CORRECT_PIN = '9092';
const PIN_VALIDATED_KEY = 'nexxdi_pin_validated';

// Función para verificar si el PIN ya fue validado
export function isPinValidated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(PIN_VALIDATED_KEY) === 'true';
}

// Función para marcar el PIN como validado
export function setPinValidated(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(PIN_VALIDATED_KEY, 'true');
  }
}

export function PinScreen({ onSuccess }: PinScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleNumberPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      // Verificar si el PIN está completo
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          // PIN correcto - guardar validación en sessionStorage
          setPinValidated();
          setTimeout(() => {
            onSuccess();
          }, 200);
        } else {
          // PIN incorrecto
          setError(true);
          setShake(true);
          setTimeout(() => {
            setPin('');
            setShake(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.semantic.background.white,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[6],
        zIndex: 9999,
      }}
    >
      {/* Título */}
      <h1
        style={{
          fontFamily: typography.fontFamily.sans.join(', '),
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.bold,
          color: colors.semantic.text.primary,
          marginBottom: spacing[2],
          textAlign: 'center',
        }}
      >
        Ingresa tu PIN
      </h1>

      <p
        style={{
          fontFamily: typography.fontFamily.sans.join(', '),
          fontSize: typography.fontSize.sm,
          color: colors.semantic.text.secondary,
          marginBottom: spacing[8],
          textAlign: 'center',
        }}
      >
        Acceso restringido
      </p>

      {/* Indicadores de PIN */}
      <div
        style={{
          display: 'flex',
          gap: spacing[4],
          marginBottom: spacing[8],
          animation: shake ? 'shake 0.5s ease-in-out' : 'none',
        }}
      >
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: borderRadius.full,
              backgroundColor: pin.length > index
                ? error
                  ? '#EF4444'
                  : colors.primary.main
                : colors.semantic.border.light,
              transition: 'all 0.2s ease',
              transform: pin.length > index ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Mensaje de error */}
      {error && (
        <p
          style={{
            fontFamily: typography.fontFamily.sans.join(', '),
            fontSize: typography.fontSize.sm,
            color: '#EF4444',
            marginBottom: spacing[4],
            textAlign: 'center',
          }}
        >
          PIN incorrecto
        </p>
      )}

      {/* Teclado numérico */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: spacing[3],
          maxWidth: '280px',
          width: '100%',
        }}
      >
        {numbers.map((num, index) => {
          if (num === '') {
            return <div key={index} />;
          }

          if (num === 'delete') {
            return (
              <button
                key={index}
                onClick={handleDelete}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: borderRadius.full,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.semantic.text.primary,
                }}
              >
                Borrar
              </button>
            );
          }

          return (
            <button
              key={index}
              onClick={() => handleNumberPress(num)}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: borderRadius.full,
                border: 'none',
                backgroundColor: colors.semantic.background.main,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.semibold,
                color: colors.semantic.text.primary,
                transition: 'all 0.15s ease',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
                e.currentTarget.style.backgroundColor = colors.semantic.border.light;
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = colors.semantic.background.main;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = colors.semantic.background.main;
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
                e.currentTarget.style.backgroundColor = colors.semantic.border.light;
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = colors.semantic.background.main;
              }}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* CSS para la animación de shake */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
            20%, 40%, 60%, 80% { transform: translateX(8px); }
          }
        `}
      </style>
    </div>
  );
}
