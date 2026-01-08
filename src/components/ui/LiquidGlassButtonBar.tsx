import { colors, spacing, typography, borderRadius, liquidGlass } from '../../config/design-tokens';
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
        [position]: 0,
        left: 0,
        right: 0,
        paddingTop: position === 'top' ? 'env(safe-area-inset-top)' : spacing[4],
        paddingBottom: position === 'bottom' ? 'env(safe-area-inset-bottom)' : spacing[4],
        paddingLeft: spacing[5],
        paddingRight: spacing[5],
        backgroundColor: liquidGlass.background.lightTranslucent,
        backdropFilter: `${liquidGlass.blur.lg} ${liquidGlass.saturation.normal}`,
        WebkitBackdropFilter: `${liquidGlass.blur.lg} ${liquidGlass.saturation.normal}`,
        borderTop: position === 'bottom' ? `1px solid ${liquidGlass.border.light}` : 'none',
        borderBottom: position === 'top' ? `1px solid ${liquidGlass.border.light}` : 'none',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[3],
      }}
    >
      {children}
      <style>{`
        @supports (backdrop-filter: blur(20px)) {
          div {
            backdrop-filter: ${liquidGlass.blur.lg} ${liquidGlass.saturation.normal};
            -webkit-backdrop-filter: ${liquidGlass.blur.lg} ${liquidGlass.saturation.normal};
          }
        }
      `}</style>
    </div>
  );
}
