import { colors, spacing, borderRadius } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface ApplePaginationProps {
  currentIndex: number;
  totalPages: number;
  onDotClick?: (index: number) => void;
}

export function ApplePagination({ currentIndex, totalPages, onDotClick }: ApplePaginationProps) {
  return (
    <div 
      className="flex items-center justify-center"
      style={{
        gap: spacing[2], // 8px
        paddingTop: spacing[4], // 16px
        paddingBottom: spacing[4], // 16px
      }}
    >
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onDotClick?.(index)}
          style={{
            borderRadius: borderRadius.full,
            backgroundColor: index === currentIndex 
              ? colors.semantic.text.primary 
              : `${colors.semantic.text.primary}30`,
            width: index === currentIndex ? spacing[8] : spacing[2], // 32px activo, 8px inactivo
            height: spacing[2], // 8px
            minWidth: index === currentIndex ? spacing[8] : spacing[2],
            minHeight: spacing[2],
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            transition: `width ${motion.duration.base} ${motion.easing.smoothOut}, background-color ${motion.duration.base} ${motion.easing.smoothOut}`,
          }}
          aria-label={`Ir al paso ${index + 1}`}
        />
      ))}
    </div>
  );
}
