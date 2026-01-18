import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { colors, bottomSheet, spacing } from '../../config/design-tokens';
import { BottomSheetHeader } from './BottomSheetHeader';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  initialHeight?: number; // Porcentaje de altura inicial (ej: 50 para 50%)
  maxHeight?: number; // Porcentaje de altura máxima (ej: 90 para 90%)
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
  initialHeight = 50,
  maxHeight = 90,
}: BottomSheetProps) {
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startTranslateY, setStartTranslateY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const graberRef = useRef<HTMLDivElement>(null);

  // Resetear posición cuando se abre/cierra
  useEffect(() => {
    if (isOpen) {
      setTranslateY(0);
    } else {
      setTranslateY(100); // Ocultar completamente
    }
  }, [isOpen]);

  // Calcular altura inicial basada en contenido
  const getInitialHeight = () => {
    if (sheetRef.current) {
      const contentHeight = sheetRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;
      const initialHeightPx = (viewportHeight * initialHeight) / 100;
      
      // Si el contenido es más grande, ajustar altura
      if (contentHeight > initialHeightPx) {
        const contentPercentage = (contentHeight / viewportHeight) * 100;
        if (contentPercentage > initialHeight && contentPercentage < maxHeight) {
          return contentPercentage;
        }
        if (contentPercentage >= maxHeight) {
          return maxHeight;
        }
      }
    }
    return initialHeight;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartTranslateY(translateY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartTranslateY(translateY);
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;

    const deltaY = clientY - startY;
    const viewportHeight = window.innerHeight;
    const deltaPercentage = (deltaY / viewportHeight) * 100;
    const newTranslateY = startTranslateY + deltaPercentage;

    // Limitar el movimiento hacia arriba (no más allá del 0%)
    // Y hacia abajo (hasta 100% para ocultar)
    const clampedTranslateY = Math.max(0, Math.min(100, newTranslateY));
    setTranslateY(clampedTranslateY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleMove(e.touches[0].clientY);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Si se arrastra más del 30% hacia abajo, cerrar
    if (translateY > 30) {
      onClose();
    } else {
      // Volver a la altura normal
      setTranslateY(0);
    }
  };

  // Event listeners globales para mouse
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
    };
  }, [isDragging, startY, startTranslateY, translateY]);

  if (!isOpen) return null;

  const currentHeight = getInitialHeight();
  const heightPercentage = Math.max(currentHeight, initialHeight);

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.semantic.background.white,
          borderTopLeftRadius: bottomSheet.borderRadius,
          borderTopRightRadius: bottomSheet.borderRadius,
          padding: bottomSheet.padding,
          paddingTop: `calc(${bottomSheet.graber.topDistance} + ${bottomSheet.graber.touchArea})`,
          paddingBottom: `calc(${bottomSheet.padding} + env(safe-area-inset-bottom))`,
          zIndex: 1001,
          maxHeight: `${maxHeight}vh`,
          height: `${heightPercentage}vh`,
          overflowY: 'auto',
          transform: `translateY(${translateY}%)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Graber - Área de arrastre */}
        <div
          ref={graberRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleEnd}
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            top: bottomSheet.graber.topDistance,
            left: '50%',
            transform: 'translateX(-50%)',
            width: bottomSheet.graber.touchArea,
            height: bottomSheet.graber.touchArea,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            zIndex: 10,
          }}
        >
          {/* Barra del graber */}
          <div
            style={{
              width: bottomSheet.graber.width,
              height: bottomSheet.graber.height,
              backgroundColor: colors.gray[300],
              borderRadius: '9999px',
            }}
          />
        </div>

        {/* Header con botones de iconos */}
        {(title || leftIcon || rightIcon) && (
          <BottomSheetHeader
            title={title}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            onLeftIconClick={onLeftIconClick || onClose}
            onRightIconClick={onRightIconClick}
          />
        )}

        {/* Contenido */}
        <div style={{ paddingTop: spacing[2] }}>
          {children}
        </div>
      </div>
    </>
  );
}
