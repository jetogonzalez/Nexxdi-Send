import { colors, spacing, typography } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface MotionPermissionButtonProps {
  onRequestPermission: () => void;
  isVisible: boolean;
}

export function MotionPermissionButton({
  onRequestPermission,
  isVisible,
}: MotionPermissionButtonProps) {
  if (!isVisible) return null;

  return (
    <button
      onClick={onRequestPermission}
      style={{
        position: 'absolute',
        bottom: spacing[4],
        left: '50%',
        transform: 'translateX(-50%)',
        padding: `${spacing[2]} ${spacing[4]}`,
        backgroundColor: colors.semantic.button.secondary,
        color: colors.semantic.text.primary,
        border: 'none',
        borderRadius: spacing[2],
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        fontFamily: typography.fontFamily.sans.join(', '),
        cursor: 'pointer',
        transition: `background-color ${motion.duration.base} ${motion.easing.easeInOut}`,
        zIndex: 1000,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.semantic.button.secondaryHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.semantic.button.secondary;
      }}
    >
      ✨ Habilitar movimiento 3D
    </button>
  );
}
