import { colors, spacing, typography, borderRadius, liquidGlass } from '../../config/design-tokens';
import { motion } from '../../lib/motion';
import { LiquidGlassButtonBar } from './LiquidGlassButtonBar';

interface OnboardingButtonsProps {
  onCreateAccount?: () => void;
  onLogin?: () => void;
}

export function OnboardingButtons({ onCreateAccount, onLogin }: OnboardingButtonsProps) {
  return (
    <LiquidGlassButtonBar position="bottom">
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
          transition: `background-color ${motion.duration.fast} ${motion.easing.smoothOut}, transform ${motion.duration.fast} ${motion.easing.smoothOut}`,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.semantic.button.primaryHover;
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.semantic.button.primary;
          e.currentTarget.style.transform = 'scale(1)';
        }}
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
          backgroundColor: liquidGlass.background.light,
          backdropFilter: liquidGlass.blur.md,
          WebkitBackdropFilter: liquidGlass.blur.md,
          color: colors.semantic.text.primary,
          borderRadius: borderRadius.full, // full rounded
          paddingTop: spacing[4], // 16px
          paddingBottom: spacing[4], // 16px
          fontSize: typography.fontSize.base, // 16pt
          fontWeight: typography.fontWeight.bold, // bold
          fontFamily: typography.fontFamily.sans.join(', '),
          transition: `background-color ${motion.duration.fast} ${motion.easing.smoothOut}, transform ${motion.duration.fast} ${motion.easing.smoothOut}`,
          border: `1px solid ${liquidGlass.border.light}`,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = liquidGlass.background.lightTranslucent;
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = liquidGlass.background.light;
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Ya tengo cuenta
      </button>
    </LiquidGlassButtonBar>
  );
}
