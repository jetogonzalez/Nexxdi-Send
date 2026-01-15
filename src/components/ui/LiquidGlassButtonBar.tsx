import { spacing, bottomNavigation } from '../../config/design-tokens';

interface LiquidGlassButtonBarProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  showBackground?: boolean;
}

export function LiquidGlassButtonBar({ children, position = 'bottom', showBackground = false }: LiquidGlassButtonBarProps) {
  return (
    <div
      data-bottom-navigation={position === 'bottom' ? 'true' : undefined}
      style={{
        position: 'fixed',
        ...(position === 'top' ? { top: `calc(${spacing[4]} + env(safe-area-inset-top))` } : { bottom: `calc(${spacing[6]} + env(safe-area-inset-bottom))` }),
        left: spacing[5], // 20px padding horizontal
        right: spacing[5], // 20px padding horizontal
        padding: bottomNavigation.spacing.containerPadding, // 4px tokenizado
        backgroundColor: showBackground ? bottomNavigation.navigationBar.background : 'transparent', // Background tokenizado
        border: showBackground ? bottomNavigation.navigationBar.border : 'none', // Border tokenizado
        borderRadius: bottomNavigation.navigationBar.borderRadius, // 9999px tokenizado
        backdropFilter: showBackground ? bottomNavigation.navigationBar.backdropFilter : 'none', // blur(6px) tokenizado
        WebkitBackdropFilter: showBackground ? bottomNavigation.navigationBar.backdropFilter : 'none', // blur(6px) para Safari
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
