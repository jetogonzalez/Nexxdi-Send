import { colors } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface ApplePaginationProps {
  currentIndex: number;
  totalPages: number;
}

export function ApplePagination({ currentIndex, totalPages }: ApplePaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalPages }).map((_, index) => (
        <div
          key={index}
          className={`rounded-full ${
            index === currentIndex
              ? 'w-8 h-2'
              : 'w-2 h-2'
          }`}
          style={{
            backgroundColor: index === currentIndex 
              ? colors.semantic.text.primary 
              : `${colors.semantic.text.primary}30`,
            transition: `width ${motion.duration.base} ${motion.easing.smoothOut}, background-color ${motion.duration.base} ${motion.easing.smoothOut}`,
          }}
        />
      ))}
    </div>
  );
}
