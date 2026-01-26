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
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  // Función para vibrar
  const vibrate = (pattern: number | number[] = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const handleNumberPress = (num: string) => {
    vibrate(10);
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      // Verificar si el PIN está completo
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          // PIN correcto - guardar validación en sessionStorage
          vibrate(30);
          setPinValidated();
          setTimeout(() => {
            onSuccess();
          }, 200);
        } else {
          // PIN incorrecto - vibración más larga
          vibrate([50, 30, 50]);
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
    vibrate(10);
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
        padding: `calc(env(safe-area-inset-top, 20px) + 120px) ${spacing[6]} calc(env(safe-area-inset-bottom, 20px) + 40px)`,
        zIndex: 9999,
        boxSizing: 'border-box',
      }}
    >
      {/* Sección superior - Título y PIN dots */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          marginBottom: spacing[8],
        }}
      >
        {/* Título */}
        <h1
          style={{
            fontFamily: typography.fontFamily.sans.join(', '),
            fontSize: '28px',
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
            fontSize: typography.fontSize.base,
            color: colors.semantic.text.secondary,
            marginBottom: spacing[6],
            textAlign: 'center',
          }}
        >
          Acceso restringido
        </p>

        {/* Indicadores de PIN */}
        <div
          style={{
            display: 'flex',
            gap: spacing[5],
            animation: shake ? 'shake 0.5s ease-in-out' : 'none',
          }}
        >
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: pin.length > index
                  ? error
                    ? colors.error[500]
                    : colors.primary.main
                  : colors.semantic.border.light,
                transition: 'background-color 0.15s ease, transform 0.15s ease',
                transform: pin.length > index ? 'scale(1.1)' : 'scale(1)',
                boxShadow: 'none',
                border: 'none',
                outline: 'none',
              }}
            />
          ))}
        </div>

        {/* Mensaje de error */}
        <div style={{ height: '32px', display: 'flex', alignItems: 'center', marginTop: spacing[4] }}>
          {error && (
            <p
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.sm,
                color: colors.error[500],
                textAlign: 'center',
                margin: 0,
              }}
            >
              PIN incorrecto
            </p>
          )}
        </div>
      </div>

      {/* Sección inferior - Teclado numérico */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
          padding: `0 ${spacing[4]}`,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'min(5vw, 24px)',
            width: '100%',
            justifyItems: 'center',
          }}
        >
          {numbers.map((num, index) => {
            if (num === '') {
              return <div key={index} style={{ width: 'min(20vw, 80px)', height: 'min(20vw, 80px)' }} />;
            }

            if (num === 'delete') {
              const isPressed = pressedKey === 'delete';
              return (
                <button
                  key={index}
                  onClick={handleDelete}
                  onTouchStart={() => setPressedKey('delete')}
                  onTouchEnd={() => setPressedKey(null)}
                  onTouchCancel={() => setPressedKey(null)}
                  onMouseDown={() => setPressedKey('delete')}
                  onMouseUp={() => setPressedKey(null)}
                  onMouseLeave={() => setPressedKey(null)}
                  style={{
                    width: 'min(20vw, 80px)',
                    height: 'min(20vw, 80px)',
                    borderRadius: borderRadius.full,
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.15s ease, opacity 0.15s ease',
                    fontFamily: typography.fontFamily.sans.join(', '),
                    fontSize: 'min(4.5vw, 18px)',
                    fontWeight: typography.fontWeight.bold,
                    color: colors.semantic.text.primary,
                    WebkitTapHighlightColor: 'transparent',
                    transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                    opacity: isPressed ? 0.6 : 1,
                  }}
                >
                  Borrar
                </button>
              );
            }

            const isPressed = pressedKey === num;
            return (
              <button
                key={index}
                onClick={() => handleNumberPress(num)}
                onTouchStart={() => setPressedKey(num)}
                onTouchEnd={() => setPressedKey(null)}
                onTouchCancel={() => setPressedKey(null)}
                onMouseDown={() => setPressedKey(num)}
                onMouseUp={() => setPressedKey(null)}
                onMouseLeave={() => setPressedKey(null)}
                style={{
                  width: 'min(20vw, 80px)',
                  height: 'min(20vw, 80px)',
                  borderRadius: borderRadius.full,
                  border: 'none',
                  backgroundColor: isPressed ? colors.semantic.border.medium : colors.semantic.background.main,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: 'min(7vw, 32px)',
                  fontWeight: typography.fontWeight.medium,
                  color: colors.semantic.text.primary,
                  transition: 'transform 0.15s ease, background-color 0.15s ease',
                  WebkitTapHighlightColor: 'transparent',
                  transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                }}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* CSS para la animación de shake */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
        `}
      </style>
    </div>
  );
}
