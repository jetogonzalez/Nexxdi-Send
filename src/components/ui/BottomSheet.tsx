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
  zIndex?: number; // Z-index base para stacked sheets (default: 1000)
  fullScreen?: boolean; // Full screen mode: no horizontal margin, 24px from top, 0 bottom border radius
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
  zIndex = 1000,
  fullScreen = false,
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
      // Guardar posición de scroll actual ANTES de abrir el bottom sheet
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      if (sheetRef.current) {
        (sheetRef.current as any)._scrollY = currentScrollY;
      }
      
      // Calcular el ancho del scrollbar para compensar y evitar salto de contenido
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Guardar estilos originales del body
      const originalStyles = {
        overflow: document.body.style.overflow,
        paddingRight: document.body.style.paddingRight,
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        right: document.body.style.right,
        width: document.body.style.width,
      };
      if (sheetRef.current) {
        (sheetRef.current as any)._originalStyles = originalStyles;
      }
      
      // Prevenir scroll del body cuando se abre el bottom sheet
      // Usar técnica que NO mueve el contenido
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${currentScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      // Compensar el scrollbar para evitar salto de contenido
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      // Iniciar animación de entrada - mostrar inmediatamente SIN delay
      setIsVisible(true);
      // Usar requestAnimationFrame para sincronizar con el render del navegador
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Doble RAF para asegurar que el DOM esté completamente renderizado
          setTranslateY(0); // Tamaño original (hug content)
          setStretchHeight(0); // Sin estiramiento
        });
      });
      // Esperar a que el contenido se renderice para obtener la altura base
      setTimeout(() => {
        if (sheetRef.current) {
          const contentHeight = sheetRef.current.scrollHeight;
          setBaseHeight(contentHeight);
        }
      }, 100);
    } else {
      // Iniciar animación de salida - ambos overlay y sheet deben animar juntos SIN delay
      setTranslateY(100); // Mover hacia abajo para cerrar
      setStretchHeight(0);
      // Esperar a que termine la animación antes de ocultar completamente
      const exitTimeout = setTimeout(() => {
        setIsVisible(false);
        setBaseHeight(null);
        // Restaurar scroll del body cuando se cierra
        const scrollY = (sheetRef.current as any)?._scrollY || 0;
        const originalStyles = (sheetRef.current as any)?._originalStyles || {};
        
        // Restaurar todos los estilos originales
        document.body.style.overflow = originalStyles.overflow || '';
        document.body.style.paddingRight = originalStyles.paddingRight || '';
        document.body.style.position = originalStyles.position || '';
        document.body.style.top = originalStyles.top || '';
        document.body.style.left = originalStyles.left || '';
        document.body.style.right = originalStyles.right || '';
        document.body.style.width = originalStyles.width || '';
        
        // Restaurar posición de scroll usando requestAnimationFrame para asegurar que el DOM esté listo
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollY, behavior: 'instant' });
        });
      }, 300); // Duración de la transición (0.3s) - debe coincidir con CSS
      
      return () => clearTimeout(exitTimeout);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Solo iniciar drag si se toca el graber o el header (pero NO los botones)
    const target = e.target as HTMLElement;
    const isGraber = graberRef.current?.contains(target);
    const isHeader = target.closest('[data-bottom-sheet-header]');
    
    // Excluir botones y elementos interactivos del drag
    const isButton = target.closest('button') !== null;
    const isClickable = target.closest('a, button, [role="button"]') !== null;
    
    // Solo iniciar drag si es el graber o el header, pero NO si es un botón
    if ((isGraber || isHeader) && !isButton && !isClickable) {
      // CRÍTICO: Prevenir comportamiento por defecto inmediatamente
      e.preventDefault();
      e.stopPropagation();
      
      // El scroll lock ya está aplicado cuando se abrió el modal
      // No necesitamos volver a aplicarlo aquí
      
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
      setStartTranslateY(translateY);
      setStartStretchHeight(stretchHeight);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Solo iniciar drag si se hace clic en el graber o el header (pero NO los botones)
    const target = e.target as HTMLElement;
    const isGraber = graberRef.current?.contains(target);
    const isHeader = target.closest('[data-bottom-sheet-header]');
    
    // Excluir botones y elementos interactivos del drag
    const isButton = target.closest('button') !== null;
    const isClickable = target.closest('a, button, [role="button"]') !== null;
    
    // Solo iniciar drag si es el graber o el header, pero NO si es un botón
    if ((isGraber || isHeader) && !isButton && !isClickable) {
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
      // Llamar onClose después de un breve delay
      setTimeout(() => {
        onClose();
      }, 300); // Duración de la transición
    } else {
      // Volver a la altura original (hug content) - usar transición CSS por defecto
      setTranslateY(0);
      setStretchHeight(0);
      // El scroll lock ya está aplicado, no necesitamos modificarlo
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
          zIndex: zIndex,
          opacity: isOpen && isVisible ? 1 : 0,
          pointerEvents: isOpen && isVisible ? 'auto' : 'none', // Prevenir interacciones cuando está oculto
          transition: 'opacity 0.3s ease-out', // Transición sincronizada - siempre activa
          willChange: isOpen ? 'opacity' : 'auto', // Optimizar para animaciones
          touchAction: 'none', // CRÍTICO: Prevenir scroll cuando se arrastra (especialmente iOS)
          WebkitOverflowScrolling: 'touch',
          WebkitTouchCallout: 'none', // Prevenir menú contextual en iOS
        }}
        onClick={onClose}
        onTouchStart={(e) => {
          // Prevenir que el drag del overlay afecte al bottom sheet
          // Solo prevenir si NO estamos tocando el bottom sheet
          const target = e.target as HTMLElement;
          if (!target.closest('[data-bottom-sheet]')) {
            e.preventDefault();
            e.stopPropagation();
            // Prevenir scroll en iOS
            if (e.nativeEvent.stopImmediatePropagation) {
              e.nativeEvent.stopImmediatePropagation();
            }
          }
        }}
        onTouchMove={(e) => {
          // Prevenir scroll del overlay en iOS
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
          bottom: fullScreen ? 0 : bottomSheet.margin,
          left: fullScreen ? 0 : bottomSheet.margin,
          right: fullScreen ? 0 : bottomSheet.margin,
          top: fullScreen ? '24px' : 'auto',
          backgroundColor: colors.semantic.background.white,
          borderRadius: fullScreen ? '44px 44px 0 0' : bottomSheet.borderRadius, // Full screen: solo esquinas superiores redondeadas
          paddingLeft: bottomSheet.padding,
          paddingRight: bottomSheet.padding,
          paddingTop: 0, // Sin padding top - el header lo maneja
          paddingBottom: fullScreen ? '0' : `calc(${spacing[8]} + env(safe-area-inset-bottom))`, // Full screen: sin padding bottom (el contenido lo maneja)
          zIndex: zIndex + 1,
          maxHeight: fullScreen ? 'none' : `calc(100vh - 24px - ${bottomSheet.margin})`, // Máximo hasta 24px del top
          height: fullScreen ? 'calc(100vh - 24px)' : 'auto', // Full screen: altura fija
          minHeight: fullScreen ? 'auto' : (stretchHeight > 0 && baseHeight ? `${baseHeight + stretchHeight}px` : 'auto'),
          width: fullScreen ? '100%' : `calc(100% - ${bottomSheet.margin} * 2)`,
          overflowY: fullScreen ? 'hidden' : 'auto', // Full screen: el contenido interno maneja el scroll
          display: fullScreen ? 'flex' : 'block',
          flexDirection: fullScreen ? 'column' : undefined,
          transform: `translateY(${translateY}%)`, // Solo para arrastrar hacia abajo (cerrar)
          transition: isDragging ? 'none' : 'transform 0.3s ease-out, min-height 0.3s ease-out, opacity 0.3s ease-out',
          opacity: isOpen && isVisible ? 1 : 0,
          pointerEvents: isOpen && isVisible ? 'auto' : 'none', // Prevenir interacciones cuando está oculto
          willChange: isDragging ? 'transform' : isOpen ? 'transform, opacity' : 'auto', // Optimizar para animaciones
          boxShadow: '0 15px 75px rgba(0, 0, 0, 0.18)', // Drop shadow: X: 0, Y: 15, Blur: 75, Spread: 0, Color: #000000, Opacity: 18%
          touchAction: isDragging ? 'none' : 'pan-y', // Prevenir todo cuando se arrastra, permitir scroll vertical cuando no
          WebkitOverflowScrolling: 'touch',
          WebkitTouchCallout: 'none', // Prevenir menú contextual en iOS
        }}
      >
        {/* Header con botones de iconos y graber */}
        {(title || leftIcon || rightIcon || showGraber) && (
          <div
            onTouchStart={(e) => {
              // Verificar si es un botón antes de procesar
              const target = e.target as HTMLElement;
              if (target.closest('button')) {
                return; // Dejar que el botón maneje el evento
              }
              handleTouchStart(e);
            }}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleEnd}
            onMouseDown={(e) => {
              // Verificar si es un botón antes de procesar
              const target = e.target as HTMLElement;
              if (target.closest('button')) {
                return; // Dejar que el botón maneje el evento
              }
              handleMouseDown(e);
            }}
            style={{ 
              touchAction: 'manipulation', // Permitir interacciones táctiles pero prevenir gestos
              WebkitUserSelect: 'none',
              userSelect: 'none',
              width: '100%', // Área completa arrastrable
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
            paddingBottom: 0, // El contenido hijo maneja su propio padding bottom
            touchAction: 'pan-y', // Permitir scroll vertical en el contenido
            flex: fullScreen ? 1 : undefined, // Full screen: tomar el espacio restante
            overflow: fullScreen ? 'hidden' : undefined, // Full screen: el hijo interno maneja el scroll
            display: fullScreen ? 'flex' : undefined,
            flexDirection: fullScreen ? 'column' : undefined,
          }}
          onTouchStart={(e) => {
            // Prevenir que el drag del contenido afecte al bottom sheet
            // PERO permitir que los elementos interactivos funcionen
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('button, [role="button"], input, [style*="touch-action: none"], [style*="touch-action: manipulation"]') !== null;
            if (!isInteractive) {
              e.stopPropagation();
            }
          }}
          onMouseDown={(e) => {
            // Prevenir que el drag del contenido afecte al bottom sheet
            // PERO permitir que los elementos interactivos funcionen
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('button, [role="button"], input, [style*="touch-action: none"], [style*="touch-action: manipulation"]') !== null;
            if (!isInteractive) {
              e.stopPropagation();
            }
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
