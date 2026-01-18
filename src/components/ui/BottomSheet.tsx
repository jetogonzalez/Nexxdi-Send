import { useState, useRef, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { colors, spacing, borderRadius } from '../../config/design-tokens';
import { BottomSheetHeader } from './BottomSheetHeader';

// Importar bottomSheet directamente desde el módulo
const bottomSheet = {
  margin: spacing[2], // 8px - margin global alrededor del bottom sheet
  padding: spacing[6], // 24px - padding interno global
  borderRadius: '44px', // Border radius global de 44px
  graber: {
    width: '34px',
    height: '4px',
    topDistance: '5px',
    touchArea: '40px',
  },
  header: {
    actionButtonSize: '44px', // Tamaño de botones de acción según Apple HIG
    iconSize: '24px', // Tamaño de iconos según Apple HIG
    horizontalSpacing: spacing[2], // 8px - distancia visual horizontal
    buttonBackground: 'rgba(0, 0, 0, 0.05)', // Negro con 5% opacidad
  },
};

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  maxHeight?: number; // Porcentaje de altura máxima (ej: 90 para 90%)
  showGraber?: boolean; // Mostrar graber en el header
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
  maxHeight = 90,
  showGraber = true,
}: BottomSheetProps) {
  const [translateY, setTranslateY] = useState(0); // Para arrastrar hacia abajo (cerrar)
  const [stretchHeight, setStretchHeight] = useState(0); // Altura adicional cuando se estira hacia arriba
  const [baseHeight, setBaseHeight] = useState<number | null>(null); // Altura base del contenido
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startTranslateY, setStartTranslateY] = useState(0);
  const [startStretchHeight, setStartStretchHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(false); // Control de visibilidad para animación de entrada/salida
  const sheetRef = useRef<HTMLDivElement>(null);
  const graberRef = useRef<HTMLDivElement>(null);

  // Resetear posición cuando se abre/cierra y obtener altura base
  useEffect(() => {
    if (isOpen) {
      // Iniciar animación de entrada
      setIsVisible(true);
      setTranslateY(0); // Tamaño original (hug content)
      setStretchHeight(0); // Sin estiramiento
      // Esperar a que el contenido se renderice para obtener la altura base
      setTimeout(() => {
        if (sheetRef.current) {
          const contentHeight = sheetRef.current.scrollHeight;
          setBaseHeight(contentHeight);
        }
      }, 100);
    } else {
      // Iniciar animación de salida
      setTranslateY(100); // Mover hacia abajo para cerrar
      setStretchHeight(0);
      // Esperar a que termine la animación antes de ocultar completamente
      const exitTimeout = setTimeout(() => {
        setIsVisible(false);
        setBaseHeight(null);
        // Restaurar scroll del body cuando se cierra
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }, 300); // Duración de la transición (0.3s)
      
      return () => clearTimeout(exitTimeout);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Solo iniciar drag si se toca el graber o el header
    const target = e.target as HTMLElement;
    const isGraber = graberRef.current?.contains(target);
    const isHeader = target.closest('[data-bottom-sheet-header]');
    
    if (isGraber || isHeader) {
      e.stopPropagation(); // Prevenir que el evento se propague al overlay
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
      setStartTranslateY(translateY);
      setStartStretchHeight(stretchHeight);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Solo iniciar drag si se hace clic en el graber o el header
    const target = e.target as HTMLElement;
    const isGraber = graberRef.current?.contains(target);
    const isHeader = target.closest('[data-bottom-sheet-header]');
    
    if (isGraber || isHeader) {
      e.stopPropagation(); // Prevenir que el evento se propague al overlay
      setIsDragging(true);
      setStartY(e.clientY);
      setStartTranslateY(translateY);
      setStartStretchHeight(stretchHeight);
    }
  };

  const handleMove = useCallback((clientY: number) => {
    if (!isDragging) return;

    const deltaY = startY - clientY; // Positivo cuando arrastra hacia arriba, negativo hacia abajo
    const viewportHeight = window.innerHeight;
    const deltaPixels = deltaY;
    
    if (deltaY > 0) {
      // Arrastrar hacia arriba: estirar el bottom sheet (aumentar altura)
      const currentBaseHeight = baseHeight || sheetRef.current?.scrollHeight || 0;
      const newStretchHeight = Math.max(0, startStretchHeight + deltaPixels);
      // Calcular altura máxima permitida: viewport menos 24px del top menos el margin bottom
      const marginBottomPx = 8; // margin bottom
      const topOffset = 24; // 24px desde el top
      const maxAllowedHeight = viewportHeight - topOffset - marginBottomPx;
      const maxStretch = Math.max(0, maxAllowedHeight - currentBaseHeight);
      setStretchHeight(Math.min(newStretchHeight, maxStretch));
      setTranslateY(0); // Mantener en posición base (no mover hacia arriba)
    } else {
      // Arrastrar hacia abajo: mover hacia abajo para cerrar
      const deltaPercentage = (Math.abs(deltaY) / viewportHeight) * 100;
      const newTranslateY = startTranslateY + deltaPercentage;
      const clampedTranslateY = Math.max(0, Math.min(100, newTranslateY));
      setTranslateY(clampedTranslateY);
      setStretchHeight(0); // Sin estiramiento cuando se arrastra hacia abajo
    }
  }, [isDragging, startY, startTranslateY, startStretchHeight, baseHeight]);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientY);
    }
  };

  const translateYRef = useRef(translateY);
  useEffect(() => {
    translateYRef.current = translateY;
  }, [translateY]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    const currentTranslateY = translateYRef.current;
    setIsDragging(false);

    // Si se arrastra más del 30% hacia abajo, cerrar con animación
    if (currentTranslateY > 30) {
      // Completar la animación de cierre
      setTranslateY(100);
      setStretchHeight(0);
      // Restaurar scroll del body después de un breve delay
      setTimeout(() => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        onClose(); // Llamar onClose después de la animación
      }, 300); // Duración de la transición
    } else {
      // Volver a la altura original (hug content) - usar transición CSS por defecto
      setTranslateY(0);
      setStretchHeight(0);
    }
  }, [isDragging, onClose]);

  // Event listeners globales para mouse y touch
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientY);
    };

    const handleTouchMoveGlobal = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientY);
      }
    };

    const handleTouchEndGlobal = () => {
      handleEnd();
    };

    // Mouse events
    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    
    // Touch events - CRÍTICO: usar { passive: false } para poder prevenir el scroll
    document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
    document.addEventListener('touchend', handleTouchEndGlobal);
    document.addEventListener('touchcancel', handleTouchEndGlobal);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMoveGlobal);
      document.removeEventListener('touchend', handleTouchEndGlobal);
      document.removeEventListener('touchcancel', handleTouchEndGlobal);
    };
  }, [isDragging, startY, startTranslateY, startStretchHeight, translateY, stretchHeight, baseHeight, handleMove, handleEnd]);

  if (!isOpen && !isVisible) return null;

  return (
    <>
      {/* Overlay - según Apple HIG para Medium detent */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Opacidad ajustada según Apple HIG
          zIndex: 1000,
          opacity: isOpen && isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
          touchAction: 'none', // Prevenir scroll cuando se arrastra
          WebkitOverflowScrolling: 'touch',
        }}
        onClick={onClose}
        onTouchStart={(e) => {
          // Prevenir que el drag del overlay afecte al bottom sheet
          // Solo prevenir si NO estamos tocando el bottom sheet
          const target = e.target as HTMLElement;
          if (!target.closest('[data-bottom-sheet]')) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onMouseDown={(e) => {
          // Prevenir que el drag del overlay afecte al bottom sheet
          e.stopPropagation();
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        data-bottom-sheet
        style={{
          position: 'fixed',
          bottom: bottomSheet.margin,
          left: bottomSheet.margin,
          right: bottomSheet.margin,
          backgroundColor: colors.semantic.background.white,
          borderRadius: bottomSheet.borderRadius, // 44px en todos los lados
          paddingLeft: bottomSheet.padding,
          paddingRight: bottomSheet.padding,
          paddingTop: 0, // Sin padding top - el header lo maneja
          paddingBottom: `calc(${bottomSheet.padding} + env(safe-area-inset-bottom))`,
          zIndex: 1001,
          maxHeight: `calc(100vh - 24px - ${bottomSheet.margin})`, // Máximo hasta 24px del top
          minHeight: stretchHeight > 0 && baseHeight ? `${baseHeight + stretchHeight}px` : 'auto', // Altura base + estiramiento
          width: `calc(100% - ${bottomSheet.margin} * 2)`,
          overflowY: 'auto',
          transform: `translateY(${translateY}%)`, // Solo para arrastrar hacia abajo (cerrar)
          transition: isDragging ? 'none' : 'transform 0.3s ease-out, min-height 0.3s ease-out, opacity 0.3s ease-out',
          opacity: isOpen && isVisible ? 1 : 0,
          boxShadow: '0 15px 75px rgba(0, 0, 0, 0.18)', // Drop shadow: X: 0, Y: 15, Blur: 75, Spread: 0, Color: #000000, Opacity: 18%
          touchAction: isDragging ? 'none' : 'pan-y', // Prevenir todo cuando se arrastra, permitir scroll vertical cuando no
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Header con botones de iconos y graber */}
        {(title || leftIcon || rightIcon || showGraber) && (
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleEnd}
            onMouseDown={handleMouseDown}
            style={{ 
              touchAction: 'none', // Prevenir scroll cuando se arrastra el header
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
          >
            <BottomSheetHeader
              title={title}
              leftIcon={leftIcon}
              rightIcon={rightIcon}
              onLeftIconClick={onLeftIconClick || onClose}
              onRightIconClick={onRightIconClick}
              showGraber={showGraber}
              graberRef={graberRef}
              onGraberTouchStart={handleTouchStart}
              onGraberTouchMove={handleTouchMove}
              onGraberTouchEnd={handleEnd}
              onGraberMouseDown={handleMouseDown}
            />
          </div>
        )}

        {/* Contenido */}
        <div 
          style={{ 
            paddingTop: (title || leftIcon || rightIcon || showGraber) ? 0 : bottomSheet.padding,
            touchAction: 'pan-y', // Permitir scroll vertical en el contenido
          }}
          onTouchStart={(e) => {
            // Prevenir que el drag del contenido afecte al bottom sheet
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            // Prevenir que el drag del contenido afecte al bottom sheet
            e.stopPropagation();
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
