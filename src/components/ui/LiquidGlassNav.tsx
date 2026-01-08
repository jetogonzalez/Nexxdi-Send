import { colors, spacing, liquidGlass } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface LiquidGlassNavProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export function LiquidGlassNav({ children, position = 'top' }: LiquidGlassNavProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        ...(position === 'top' ? { top: 0 } : { bottom: 0 }),
        left: 0,
        right: 0,
        paddingTop: position === 'top' ? 'env(safe-area-inset-top)' : spacing[4],
        paddingBottom: position === 'bottom' ? 'env(safe-area-inset-bottom)' : spacing[4],
        paddingLeft: spacing[5],
        paddingRight: spacing[5],
        backgroundColor: 'transparent', // Sin color de fondo, solo efecto glass
        backdropFilter: `${liquidGlass.blur.lg} ${liquidGlass.saturation.normal}`,
        WebkitBackdropFilter: `${liquidGlass.blur.lg} ${liquidGlass.saturation.normal}`,
        borderBottom: position === 'top' ? `1px solid ${liquidGlass.border.light}` : 'none',
        borderTop: position === 'bottom' ? `1px solid ${liquidGlass.border.light}` : 'none',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '44px',
      }}
    >
      {children}
      <style>{`
        @supports (backdrop-filter: blur(20px)) {
          nav {
            backdrop-filter: ${liquidGlass.blur.lg} ${liquidGlass.saturation.normal};
            -webkit-backdrop-filter: ${liquidGlass.blur.lg} ${liquidGlass.saturation.normal};
          }
        }
      `}</style>
    </nav>
  );
}
