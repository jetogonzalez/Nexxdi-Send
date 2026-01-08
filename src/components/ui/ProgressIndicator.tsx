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
              width: isActive ? spacing[8] : spacing[3], // 32px activo, 12px inactivo
              height: spacing[3], // 12px - misma altura para todos
              borderRadius: spacing[3], // 12px - mismo border radius que la altura
              backgroundColor: isCompleted 
                ? colors.semantic.text.primary 
                : `${colors.semantic.text.primary}30`, // Fondo claro para inactivos
              overflow: 'hidden',
              transition: `width ${motion.duration.base} ${motion.easing.smoothOut}, background-color ${motion.duration.base} ${motion.easing.smoothOut}`,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              minWidth: isActive ? spacing[8] : spacing[3],
              minHeight: spacing[3], // Misma altura mínima para todos
              zIndex: 1001, // Asegurar que esté por encima de otros elementos
              pointerEvents: 'auto', // Asegurar que los clicks funcionen
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
                    borderRadius: spacing[3],
                    pointerEvents: 'none', // No bloquear clicks
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
                    borderRadius: spacing[3],
                    transition: `width 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`, // Transición suave y natural
                    willChange: 'width',
                    pointerEvents: 'none', // No bloquear clicks
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
