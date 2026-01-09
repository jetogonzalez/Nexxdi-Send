import { colors, spacing, typography, borderRadius, liquidGlass, shadows } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface LiquidGlassButtonBarProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  showBackground?: boolean;
}

export function LiquidGlassButtonBar({ children, position = 'bottom', showBackground = false }: LiquidGlassButtonBarProps) {
  return (
    <div
      style={{
        position: 'fixed',
        ...(position === 'top' ? { top: spacing[4] } : { bottom: `calc(${spacing[4]} + env(safe-area-inset-bottom))` }),
        left: spacing[4],
        right: spacing[4],
        padding: spacing[1], // 4px según Figma
        backgroundColor: showBackground ? liquidGlass.background.navigationBottom : 'transparent', // 51% de opacidad según Figma
        backdropFilter: showBackground ? liquidGlass.blur.xs : 'none', // blur(6px) según Figma
        WebkitBackdropFilter: showBackground ? liquidGlass.blur.xs : 'none', // blur(6px) para Safari según Figma
        borderRadius: borderRadius.full,
        boxShadow: 'none', // Sin sombra
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
