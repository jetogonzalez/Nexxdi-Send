import { colors, spacing, typography, borderRadius, liquidGlass, shadows } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface LiquidGlassButtonBarProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export function LiquidGlassButtonBar({ children, position = 'bottom' }: LiquidGlassButtonBarProps) {
  return (
    <div
      style={{
        position: 'fixed',
        ...(position === 'top' ? { top: spacing[4] } : { bottom: `calc(${spacing[4]} + env(safe-area-inset-bottom))` }),
        left: spacing[4],
        right: spacing[4],
        paddingTop: spacing[2],
        paddingBottom: spacing[2],
        paddingLeft: spacing[2],
        paddingRight: spacing[2],
        backgroundColor: 'transparent',
        borderRadius: borderRadius.full,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[4],
        pointerEvents: 'auto',
        maxWidth: '100%',
        margin: '0 auto',
      }}
    >
      {children}
    </div>
  );
}
