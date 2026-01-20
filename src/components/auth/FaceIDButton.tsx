import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface FaceIDButtonProps {
  onFaceID?: () => Promise<boolean> | boolean;
}

export function FaceIDButton({ onFaceID }: FaceIDButtonProps) {
  return (
    <div style={{ textAlign: 'center', marginTop: spacing[8], marginBottom: spacing[10] }}>
      <p
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.semantic.text.secondary,
          marginBottom: spacing[6],
          fontFamily: typography.fontFamily.sans.join(', '),
        }}
      >
        O inicia sesión con
      </p>
      <button
        type="button"
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Face ID button clicked'); // DEBUG
          if (onFaceID) {
            try {
              const result = await onFaceID();
              console.log('Face ID result:', result); // DEBUG
            } catch (error) {
              console.error('Face ID error:', error); // DEBUG
            }
          } else {
            console.warn('onFaceID handler not provided'); // DEBUG
          }
        }}
        onTouchStart={(e) => {
          // Prevenir que el touch se propague y cause scroll
          e.stopPropagation();
        }}
        style={{
          width: spacing[16], // 64px
          height: spacing[16], // 64px
          borderRadius: borderRadius.full,
          backgroundColor: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: `transform ${motion.duration.base} ${motion.easing.easeInOut}, opacity ${motion.duration.base} ${motion.easing.easeInOut}`,
          margin: '0 auto',
          padding: 0,
          touchAction: 'manipulation', // Prevenir gestos táctiles que interfieran
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.opacity = '1';
        }}
      >
        <img
          src="/img/icons/login/Icon-faceid.svg"
          alt="Face ID"
          style={{
            width: spacing[16], // 64px
            height: spacing[16], // 64px
            objectFit: 'contain',
          }}
        />
      </button>
    </div>
  );
}
