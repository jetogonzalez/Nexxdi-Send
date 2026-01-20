"use client";

import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function NotificationPermissionModal({ isOpen, onAccept, onDecline }: NotificationPermissionModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing[5],
        }}
        onClick={onDecline}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.semantic.background.white,
            borderRadius: borderRadius['2xl'],
            padding: spacing[6],
            maxWidth: '320px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'fadeInScale 0.2s ease-out',
          }}
        >
          {/* Icono */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: borderRadius.full,
              backgroundColor: colors.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing[4],
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9ZM13.73 21a2 2 0 0 1-3.46 0" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Título */}
          <h2
            style={{
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.semantic.text.primary,
              textAlign: 'center',
              margin: 0,
              marginBottom: spacing[2],
            }}
          >
            Activa las notificaciones
          </h2>

          {/* Descripción */}
          <p
            style={{
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.secondary,
              textAlign: 'center',
              margin: 0,
              marginBottom: spacing[6],
              lineHeight: '1.5',
            }}
          >
            Recibe alertas cuando te envíen dinero, tus transferencias se completen y más.
          </p>

          {/* Botones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {/* Botón Activar */}
            <button
              onClick={onAccept}
              style={{
                width: '100%',
                padding: `${spacing[4]} ${spacing[6]}`,
                borderRadius: borderRadius.full,
                backgroundColor: colors.semantic.text.primary,
                color: colors.semantic.background.white,
                border: 'none',
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold,
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
            >
              Activar notificaciones
            </button>

            {/* Botón Ahora no */}
            <button
              onClick={onDecline}
              style={{
                width: '100%',
                padding: `${spacing[4]} ${spacing[6]}`,
                borderRadius: borderRadius.full,
                backgroundColor: 'transparent',
                color: colors.semantic.text.secondary,
                border: 'none',
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>

      {/* Estilos de animación */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
