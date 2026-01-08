import { useState, useEffect, useRef } from 'react';
import { colors, spacing, typography, borderRadius, button } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface SavePasswordModalProps {
  isOpen: boolean;
  onSave: () => void;
  onSkip: () => void;
}

export function SavePasswordModal({ isOpen, onSave, onSkip }: SavePasswordModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), parseInt(motion.duration.slow.replace('ms', '')));
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Drag handlers para cerrar deslizando hacia abajo
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;
    
    // Solo permitir arrastrar hacia abajo
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    // Si se arrastró más de 100px hacia abajo, cerrar
    if (dragY > 100) {
      onSkip();
    }
    
    setIsDragging(false);
    setDragY(0);
  };

  if (!isVisible && !isOpen) return null;

  return (
    <>
      {/* Scrim (overlay oscuro) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 2000,
          opacity: isOpen ? 1 : 0,
          transition: `opacity ${motion.duration.slow} ${motion.easing.smoothOut}`,
        }}
        onClick={onSkip}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.semantic.background.white,
          borderTopLeftRadius: borderRadius['2xl'],
          borderTopRightRadius: borderRadius['2xl'],
          paddingBottom: `calc(${spacing[6]} + env(safe-area-inset-bottom))`,
          zIndex: 2001,
          maxHeight: '90vh',
          minHeight: '30vh',
          transform: isOpen 
            ? `translateY(${Math.max(0, -dragY)}px)` 
            : 'translateY(100%)',
          transition: isDragging 
            ? 'none' 
            : `transform ${motion.duration.slow} ${motion.easing.smoothOut}`,
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          touchAction: 'pan-y',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: spacing[3],
            paddingBottom: spacing[2],
            cursor: 'grab',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '4px',
              backgroundColor: colors.semantic.text.tertiary,
              borderRadius: borderRadius.full,
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: spacing[5],
            paddingRight: spacing[5],
            paddingBottom: spacing[4],
          }}
        >
          <h2
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.semantic.text.primary,
              fontFamily: typography.fontFamily.sans.join(', '),
              margin: 0,
            }}
          >
            ¿Guardar contraseña?
          </h2>
          <button
            onClick={onSkip}
            type="button"
            style={{
              width: spacing[12], // 48px
              height: spacing[12], // 48px
              borderRadius: borderRadius.full,
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: `background-color ${motion.duration.base} ${motion.easing.easeInOut}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.button.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Cerrar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke={colors.semantic.text.primary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            paddingLeft: spacing[5],
            paddingRight: spacing[5],
            paddingBottom: spacing[6],
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <p
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.secondary,
              fontFamily: typography.fontFamily.sans.join(', '),
              lineHeight: typography.lineHeight.normal,
              margin: 0,
            }}
          >
            Podrás iniciar sesión rápidamente con Face ID la próxima vez.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            paddingLeft: spacing[5],
            paddingRight: spacing[5],
            paddingTop: spacing[4],
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[4], // 16px entre botones
          }}
        >
          <button
            onClick={onSave}
            type="button"
            style={{
              width: '100%',
              paddingTop: button.paddingY,
              paddingBottom: button.paddingY,
              minHeight: button.minHeight, // 48px
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold,
              color: colors.semantic.background.white,
              backgroundColor: colors.semantic.button.primary,
              borderRadius: borderRadius.full,
              border: 'none',
              cursor: 'pointer',
              fontFamily: typography.fontFamily.sans.join(', '),
              transition: `background-color ${motion.duration.fast} ${motion.easing.smoothOut}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.button.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.button.primary;
            }}
          >
            Guardar
          </button>
          <button
            onClick={onSkip}
            type="button"
            style={{
              width: '100%',
              paddingTop: button.paddingY,
              paddingBottom: button.paddingY,
              minHeight: button.minHeight, // 48px
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.primary,
              backgroundColor: 'transparent',
              borderRadius: borderRadius.full,
              border: 'none',
              cursor: 'pointer',
              fontFamily: typography.fontFamily.sans.join(', '),
              transition: `opacity ${motion.duration.base} ${motion.easing.easeInOut}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Ahora no
          </button>
        </div>
      </div>
    </>
  );
}
