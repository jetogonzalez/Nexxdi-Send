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
              width: isActive ? spacing[6] : spacing[2], // 24px activo, 8px inactivo (más pequeños estilo Apple TV mobile)
              height: spacing[2], // 8px - altura pequeña estilo Apple TV mobile
              borderRadius: spacing[2], // 8px - border radius pequeño
              backgroundColor: colors.semantic.text.primary, // Color sólido para todos
              opacity: isActive ? 1 : 0.3, // Opacidad al 100% para activo, 30% para inactivos
              overflow: 'visible', // Cambiar a visible para eliminar el relleno interno
              transition: `width ${motion.duration.base} ${motion.easing.smoothOut}, opacity ${motion.duration.base} ${motion.easing.smoothOut}`,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              minWidth: isActive ? spacing[6] : spacing[2],
              minHeight: spacing[2], // Altura pequeña estilo Apple TV mobile
              zIndex: 1001, // Asegurar que esté por encima de otros elementos
              pointerEvents: 'auto', // Asegurar que los clicks funcionen
            }}
            aria-label={`Ir al paso ${index + 1}`}
          />
        );
      })}
    </div>
  );
}
