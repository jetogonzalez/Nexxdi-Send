"use client";

import { useState } from 'react';
import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';

interface PinScreenProps {
  onSuccess: () => void;
}

const CORRECT_PIN = '9092';

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
          // PIN correcto
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
      {/* Logo */}
      <div style={{ marginBottom: spacing[8] }}>
        <img
          src="/img/logos/logo-nexxdi-cash.svg"
          alt="Nexxdi Cash"
          style={{ height: '40px' }}
        />
      </div>

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
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke={colors.semantic.text.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="rotate(180 12 12)"
                  />
                  <path
                    d="M19 6H9L4 12L9 18H19C20.1046 18 21 17.1046 21 16V8C21 6.89543 20.1046 6 19 6Z"
                    stroke={colors.semantic.text.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 10L17 14M17 10L13 14"
                    stroke={colors.semantic.text.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
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
