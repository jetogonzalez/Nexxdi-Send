import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface OnboardingButtonsProps {
  onCreateAccount?: () => void;
  onLogin?: () => void;
}

export function OnboardingButtons({ onCreateAccount, onLogin }: OnboardingButtonsProps) {
  return (
    <div 
      style={{
        paddingLeft: spacing[5], // 1.25rem = 20px
        paddingRight: spacing[5], // 1.25rem = 20px
        paddingBottom: spacing[8], // 2rem = 32px
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[4], // 1rem = 16px - distancia entre botones
        position: 'relative',
        zIndex: 10,
        backgroundColor: colors.semantic.background.main,
      }}
    >
      <button
        className="w-full text-white"
        onClick={onCreateAccount}
        style={{
          backgroundColor: colors.semantic.button.primary,
          borderRadius: borderRadius.full, // full rounded
          paddingTop: spacing[4], // 16px
          paddingBottom: spacing[4], // 16px
          fontSize: typography.fontSize.base, // 16pt
          fontWeight: typography.fontWeight.bold, // bold
          fontFamily: typography.fontFamily.sans.join(', '),
          transition: `background-color ${motion.duration.fast} ${motion.easing.smoothOut}`,
          border: 'none',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.semantic.button.primaryHover)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.semantic.button.primary)}
      >
        Crear cuenta
      </button>
      <button
        className="w-full"
        onClick={() => {
          if (onLogin) {
            onLogin();
          } else if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }}
        style={{
          backgroundColor: colors.semantic.button.secondary,
          color: colors.semantic.text.primary,
          borderRadius: borderRadius.full, // full rounded
          paddingTop: spacing[4], // 16px
          paddingBottom: spacing[4], // 16px
          marginBottom: spacing[10], // 40px - espacio adicional en la parte inferior
          fontSize: typography.fontSize.base, // 16pt
          fontWeight: typography.fontWeight.bold, // bold
          fontFamily: typography.fontFamily.sans.join(', '),
          transition: `background-color ${motion.duration.fast} ${motion.easing.smoothOut}`,
          border: 'none',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.semantic.button.secondaryHover)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.semantic.button.secondary)}
      >
        Ya tengo cuenta
      </button>
    </div>
  );
}
