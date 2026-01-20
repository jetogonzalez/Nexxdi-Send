import { useState, useEffect, useRef, useCallback } from 'react';
import { colors, spacing, typography, borderRadius, button } from '../../config/design-tokens';
import { LiquidGlassButton } from './LiquidGlassButton';
import { motion } from '../../lib/motion';

interface SavePasswordModalProps {
  isOpen: boolean;
  onSave: () => void;
  onSkip: () => void;
}

type SheetState = 'collapsed' | 'expanded';

export function SavePasswordModal({ isOpen, onSave, onSkip }: SavePasswordModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [sheetState, setSheetState] = useState<SheetState>('collapsed');
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragYRef = useRef(0);
  const isDraggingRef = useRef(false);
  
  // Sincronizar refs con state
  useEffect(() => {
    dragYRef.current = dragY;
    isDraggingRef.current = isDragging;
  }, [dragY, isDragging]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setSheetState('collapsed');
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

  // Drag handlers usando addEventListener nativo con { passive: false }
  // CRÍTICO: React registra touchmove como passive por defecto, necesitamos listeners nativos
  useEffect(() => {
    const dragHandleElement = sheetRef.current?.querySelector('[data-drag-handle]') as HTMLElement;
    if (!dragHandleElement || !isOpen) return;

    const handleTouchStartNative = (e: TouchEvent) => {
      console.log('Modal DOWN (touch native)'); // DEBUG
      e.preventDefault(); // Ahora funciona porque el listener es no-pasivo
      e.stopPropagation();
      setIsDragging(true);
      isDraggingRef.current = true;
      startYRef.current = e.touches[0].clientY;
      setDragY(0);
      dragYRef.current = 0;
    };

    const handleTouchMoveNative = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      console.log('Modal MOVE (touch native)'); // DEBUG
      e.preventDefault(); // Ahora funciona porque el listener es no-pasivo
      e.stopPropagation();
      if (e.touches.length > 0) {
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startYRef.current;
        setDragY(deltaY);
        dragYRef.current = deltaY;
      }
    };

    const handleTouchEndNative = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      
      const threshold = 100; // Umbral para cerrar
      const currentDragY = dragYRef.current;
      
      // Si se arrastra hacia abajo más del umbral, cerrar
      if (currentDragY > threshold) {
        onSkip();
      } else {
        // Siempre volver al tamaño original (colapsado) cuando se suelta
        setSheetState('collapsed');
      }
      
      setIsDragging(false);
      isDraggingRef.current = false;
      setDragY(0);
      dragYRef.current = 0;
    };

    // CRÍTICO: addEventListener nativo con { passive: false } para poder usar preventDefault()
    dragHandleElement.addEventListener('touchstart', handleTouchStartNative, { passive: false });
    dragHandleElement.addEventListener('touchmove', handleTouchMoveNative, { passive: false });
    dragHandleElement.addEventListener('touchend', handleTouchEndNative, { passive: false });
    dragHandleElement.addEventListener('touchcancel', handleTouchEndNative, { passive: false });

    return () => {
      dragHandleElement.removeEventListener('touchstart', handleTouchStartNative);
      dragHandleElement.removeEventListener('touchmove', handleTouchMoveNative);
      dragHandleElement.removeEventListener('touchend', handleTouchEndNative);
      dragHandleElement.removeEventListener('touchcancel', handleTouchEndNative);
    };
  }, [isOpen, onSkip]);

  // Listeners globales para cuando se está arrastrando
  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMoveGlobal = (e: TouchEvent) => {
      console.log('Modal MOVE (touch global)'); // DEBUG
      if (e.touches.length > 0 && isDraggingRef.current) {
        e.preventDefault();
        e.stopPropagation();
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startYRef.current;
        setDragY(deltaY);
        dragYRef.current = deltaY;
      }
    };

    const handleTouchEndGlobal = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      
      const threshold = 100;
      const currentDragY = dragYRef.current;
      
      if (currentDragY > threshold) {
        onSkip();
      } else {
        setSheetState('collapsed');
      }
      
      setIsDragging(false);
      isDraggingRef.current = false;
      setDragY(0);
      dragYRef.current = 0;
    };

    document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
    document.addEventListener('touchend', handleTouchEndGlobal, { passive: false });
    document.addEventListener('touchcancel', handleTouchEndGlobal, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleTouchMoveGlobal);
      document.removeEventListener('touchend', handleTouchEndGlobal);
      document.removeEventListener('touchcancel', handleTouchEndGlobal);
    };
  }, [isDragging, onSkip]);

  // Calcular altura del sheet basado en el estado y el drag
  const getSheetHeight = () => {
    if (typeof window === 'undefined') return '30vh';
    
    const viewportHeight = window.innerHeight;
    const collapsedHeight = viewportHeight * 0.3; // Altura original colapsada
    const maxExpandHeight = viewportHeight * 0.6; // Máximo 60% al arrastrar (no hasta arriba)
    
    if (isDragging && dragY < 0) {
      // Arrastrando hacia arriba: expandir temporalmente pero limitado
      const dragProgress = Math.min(Math.abs(dragY) / 300, 1); // Normalizar a 300px de drag máximo
      const currentHeight = collapsedHeight + (maxExpandHeight - collapsedHeight) * dragProgress;
      return `${currentHeight}px`;
    } else if (isDragging && dragY > 0) {
      // Arrastrando hacia abajo: reducir altura pero mantener mínimo
      const dragProgress = Math.min(dragY / 200, 1);
      const currentHeight = Math.max(collapsedHeight - (dragProgress * 50), collapsedHeight * 0.5);
      return `${currentHeight}px`;
    }
    
    // Estado normal: siempre colapsado
    return '30vh';
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
          paddingBottom: `calc(${spacing[8]} + env(safe-area-inset-bottom))`, // Más espacio de área segura
          zIndex: 2001,
          height: isDragging ? getSheetHeight() : 'auto', // Auto cuando no se arrastra, altura calculada cuando se arrastra
          minHeight: '30vh',
          maxHeight: '90vh', // Máximo 90% para permitir más contenido
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: isDragging 
            ? 'none' 
            : `transform ${motion.duration.slow} ${motion.easing.smoothOut}, height ${motion.duration.slow} ${motion.easing.smoothOut}`,
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          touchAction: 'pan-y',
          overflow: isDragging ? 'hidden' : 'visible', // Visible cuando no se arrastra para mostrar todo el contenido
          willChange: isDragging ? 'height' : 'auto',
        }}
      >
        {/* Drag Handle - Área táctil aumentada para móviles */}
        <div
          data-drag-handle
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: spacing[6], // Más espacio arriba (24px)
            paddingBottom: spacing[8], // Más espacio abajo para área táctil más grande (32px)
            cursor: 'grab',
            touchAction: 'none', // CRÍTICO: Prevenir scroll y gestos táctiles
            minHeight: spacing[16], // Área táctil mínima de 64px para facilitar el drag en móviles
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '4px',
              backgroundColor: colors.semantic.text.tertiary,
              borderRadius: borderRadius.full,
              pointerEvents: 'none', // El área táctil está en el contenedor padre
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
            paddingBottom: spacing[6],
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontSize: typography.fontSize['2xl'], // Más grande para mejor jerarquía
              fontWeight: typography.fontWeight.bold,
              color: colors.semantic.text.primary,
              fontFamily: typography.fontFamily.sans.join(', '),
              margin: 0,
              lineHeight: typography.lineHeight.tight,
            }}
          >
            ¿Guardar contraseña?
          </h2>
          <LiquidGlassButton
            onClick={onSkip}
            size={44}
            shape="circle"
            ariaLabel="Cerrar"
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
          </LiquidGlassButton>
        </div>

        {/* Content Area */}
        <div
          style={{
            paddingLeft: spacing[5],
            paddingRight: spacing[5],
            paddingBottom: spacing[6],
            flexShrink: 0, // No encoger, ajustarse al contenido
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
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
            paddingTop: spacing[4], // Espacio reducido entre contenido y botones (16px)
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[4], // 16px entre botones
            flexShrink: 0,
          }}
        >
          <button
            onClick={onSave}
            type="button"
            style={{
              width: '100%',
              paddingTop: button.paddingY,
              paddingBottom: button.paddingY,
              paddingLeft: button.paddingX,
              paddingRight: button.paddingX,
              minHeight: button.heightCompact, // 40px - igual que el botón de inicio de sesión
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
              paddingTop: button.paddingY, // 12px
              paddingBottom: button.paddingY, // 12px
              minHeight: button.minHeight, // 48px - igual que onboarding
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold, // Bold como en onboarding
              color: colors.semantic.text.primary,
              backgroundColor: colors.semantic.button.secondary, // Color con opacidad como onboarding
              borderRadius: borderRadius.full,
              border: 'none',
              cursor: 'pointer',
              fontFamily: typography.fontFamily.sans.join(', '),
              transition: `background-color ${motion.duration.fast} ${motion.easing.smoothOut}, transform ${motion.duration.fast} ${motion.easing.smoothOut}`,
              marginBottom: spacing[6], // Área segura estándar después del último botón (24px)
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.button.secondaryHover;
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.button.secondary;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Ahora no
          </button>
        </div>
      </div>
    </>
  );
}
