import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface SavePasswordModalProps {
  isOpen: boolean;
  onSave: () => void;
  onSkip: () => void;
}

export function SavePasswordModal({ isOpen, onSave, onSkip }: SavePasswordModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: spacing[5],
        animation: `fadeIn ${motion.duration.base} ${motion.easing.smoothOut}`,
      }}
      onClick={onSkip}
    >
      <div
        style={{
          backgroundColor: colors.semantic.background.white,
          borderRadius: spacing[4],
          padding: spacing[6],
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          animation: `slideUp ${motion.duration.base} ${motion.easing.smoothOut}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.semantic.text.primary,
            marginBottom: spacing[4],
            fontFamily: typography.fontFamily.sans.join(', '),
          }}
        >
          ¿Guardar contraseña?
        </h2>
        <p
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal,
            color: colors.semantic.text.secondary,
            marginBottom: spacing[6],
            fontFamily: typography.fontFamily.sans.join(', '),
            lineHeight: typography.lineHeight.normal,
          }}
        >
          Podrás iniciar sesión rápidamente con Face ID la próxima vez.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[3],
          }}
        >
          <button
            onClick={onSave}
            style={{
              width: '100%',
              padding: `${spacing[4]} ${spacing[6]}`,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold,
              color: colors.semantic.background.white,
              backgroundColor: colors.semantic.button.primary,
              borderRadius: borderRadius.full,
              border: 'none',
              cursor: 'pointer',
              fontFamily: typography.fontFamily.sans.join(', '),
              transition: `background-color ${motion.duration.base} ${motion.easing.smoothOut}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.button.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.button.primary;
            }}
          >
            Guardar
          </button>
          <button
            onClick={onSkip}
            style={{
              width: '100%',
              padding: `${spacing[4]} ${spacing[6]}`,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.primary,
              backgroundColor: 'transparent',
              borderRadius: borderRadius.full,
              border: 'none',
              cursor: 'pointer',
              fontFamily: typography.fontFamily.sans.join(', '),
              transition: `opacity ${motion.duration.base} ${motion.easing.smoothOut}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Ahora no
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
