import { colors, spacing } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface ProgressIndicatorProps {
  currentIndex: number;
  totalPages: number;
  progress: number; // 0 a 1 (0 = inicio, 1 = completo)
  onDotClick?: (index: number) => void; // Para hacer clickeable
}

export function ProgressIndicator({ currentIndex, totalPages, progress, onDotClick }: ProgressIndicatorProps) {
  return (
    <div 
      className="flex items-center justify-center"
      style={{
        gap: spacing[2], // 8px
      }}
    >
      {Array.from({ length: totalPages }).map((_, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => onDotClick?.(index)}
            style={{
              position: 'relative',
              width: isActive ? spacing[8] : spacing[2], // 32px activo, 8px inactivo
              height: spacing[2], // 8px
              borderRadius: spacing[2], // 8px
              backgroundColor: isCompleted 
                ? colors.semantic.text.primary 
                : `${colors.semantic.text.primary}30`, // Fondo claro para inactivos
              overflow: 'hidden',
              transition: `width ${motion.duration.base} ${motion.easing.smoothOut}, background-color ${motion.duration.base} ${motion.easing.smoothOut}`,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              minWidth: isActive ? spacing[8] : spacing[2],
              minHeight: spacing[2],
            }}
            aria-label={`Ir al paso ${index + 1}`}
          >
            {/* Barra de progreso estilo Apple - solo relleno natural */}
            {isActive && (
              <>
                {/* Fondo de la barra (inactivo) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    backgroundColor: `${colors.semantic.text.primary}30`,
                    borderRadius: spacing[2],
                  }}
                />
                
                {/* Barra de progreso que se rellena suavemente */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${progress * 100}%`,
                    backgroundColor: colors.semantic.text.primary,
                    borderRadius: spacing[2],
                    transition: `width 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`, // Transición suave y natural
                    willChange: 'width',
                  }}
                />
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
