import { colors, spacing, typography, borderRadius, liquidGlass, button, shadows } from '../../config/design-tokens';
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
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onCreateAccount?.();
        }}
        style={{
          backgroundColor: colors.semantic.button.primary,
          borderRadius: borderRadius.full, // full rounded
          paddingTop: button.paddingY, // 12px (regla de 4px)
          paddingBottom: button.paddingY, // 12px (regla de 4px)
          minHeight: button.minHeight, // 48px (regla de 4px)
          fontSize: typography.fontSize.base, // 16pt
          fontWeight: typography.fontWeight.bold, // bold
          fontFamily: typography.fontFamily.sans.join(', '),
          transition: `background-color ${motion.duration.fast} ${motion.easing.smoothOut}, transform ${motion.duration.fast} ${motion.easing.smoothOut}`,
          border: 'none',
          cursor: 'pointer',
          boxShadow: shadows.buttonMd,
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
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onLogin) {
            onLogin();
          } else if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }}
        style={{
          backgroundColor: colors.semantic.button.secondary, // Color anterior con opacidad
          color: colors.semantic.text.primary,
          borderRadius: borderRadius.full, // full rounded
          paddingTop: button.paddingY, // 12px (regla de 4px)
          paddingBottom: button.paddingY, // 12px (regla de 4px)
          minHeight: button.minHeight, // 48px (regla de 4px)
          fontSize: typography.fontSize.base, // 16pt
          fontWeight: typography.fontWeight.bold, // bold
          fontFamily: typography.fontFamily.sans.join(', '),
          transition: `background-color ${motion.duration.fast} ${motion.easing.smoothOut}, transform ${motion.duration.fast} ${motion.easing.smoothOut}`,
          border: 'none',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.semantic.button.secondaryHover;
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.semantic.button.secondary;
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Ya tengo cuenta
      </button>
    </LiquidGlassButtonBar>
  );
}
