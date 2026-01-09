import { colors, spacing, borderRadius, liquidGlass } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface LiquidGlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: number; // Tamaño del botón (por defecto 44px para iOS)
  shape?: 'circle' | 'rounded'; // Forma del botón
  ariaLabel?: string;
  className?: string;
}

export function LiquidGlassButton({ 
  children, 
  onClick, 
  size = 44, 
  shape = 'circle',
  ariaLabel,
  className = ''
}: LiquidGlassButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={className}
      aria-label={ariaLabel}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: shape === 'circle' ? borderRadius.full : borderRadius['2xl'],
        backgroundColor: liquidGlass.background.lightTranslucent,
        backdropFilter: `${liquidGlass.blur.lg} ${liquidGlass.saturation.normal}`,
        WebkitBackdropFilter: `${liquidGlass.blur.lg} ${liquidGlass.saturation.normal}`,
        border: `0.5px solid ${liquidGlass.border.light}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
        transition: `background-color ${motion.duration.base} ${motion.easing.easeInOut}, transform ${motion.duration.base} ${motion.easing.easeInOut}, opacity ${motion.duration.base} ${motion.easing.easeInOut}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = liquidGlass.background.light;
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.opacity = '0.9';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = liquidGlass.background.lightTranslucent;
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.opacity = '1';
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.backgroundColor = liquidGlass.background.light;
        e.currentTarget.style.transform = 'scale(0.95)';
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.backgroundColor = liquidGlass.background.lightTranslucent;
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
      <style>{`
        @supports (backdrop-filter: blur(30px)) {
          button {
            backdrop-filter: ${liquidGlass.blur.lg} ${liquidGlass.saturation.normal};
            -webkit-backdrop-filter: ${liquidGlass.blur.lg} ${liquidGlass.saturation.normal};
          }
        }
      `}</style>
    </button>
  );
}
