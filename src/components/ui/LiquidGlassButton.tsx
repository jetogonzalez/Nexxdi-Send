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
        backgroundColor: 'rgba(16, 24, 40, 0.08)', // Fondo del color del texto con 8% de opacidad (#101828)
        backdropFilter: liquidGlass.blur.lg,
        WebkitBackdropFilter: liquidGlass.blur.lg,
        border: `0.5px solid ${liquidGlass.border.light}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
        transition: `background-color ${motion.duration.base} ${motion.easing.easeInOut}, transform ${motion.duration.base} ${motion.easing.easeInOut}, opacity ${motion.duration.base} ${motion.easing.easeInOut}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(16, 24, 40, 0.15)';
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.opacity = '0.9';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(16, 24, 40, 0.08)';
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.opacity = '1';
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(16, 24, 40, 0.15)';
        e.currentTarget.style.transform = 'scale(0.95)';
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(16, 24, 40, 0.08)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
      <style>{`
        @supports (backdrop-filter: blur(32px)) {
          button {
            backdrop-filter: ${liquidGlass.blur.lg};
            -webkit-backdrop-filter: ${liquidGlass.blur.lg};
          }
        }
      `}</style>
    </button>
  );
}
