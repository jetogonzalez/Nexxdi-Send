"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';

// Estilos de animación para el hint de arrastre
const slideHintKeyframes = `
  @keyframes slideHint {
    0% {
      width: 56px;
      justify-content: flex-end;
      padding-right: 18px;
      padding-left: 0;
    }
    50% {
      width: 80px;
      justify-content: flex-end;
      padding-right: 18px;
      padding-left: 0;
    }
    100% {
      width: 56px;
      justify-content: flex-end;
      padding-right: 18px;
      padding-left: 0;
    }
  }
`;

interface SliderToBlockProps {
  onComplete: () => void;
  disabled?: boolean;
  key?: string | number; // Para resetear el componente cuando cambia
}

export function SliderToBlock({ onComplete, disabled = false }: SliderToBlockProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0); // 0 a 100
  const [isCompleted, setIsCompleted] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [hasShownHint, setHasShownHint] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // Flag para saber si el usuario ya interactuó
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startProgressRef = useRef(0);

  // Calcular ancho del slider
  useEffect(() => {
    const updateWidth = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Mostrar hint una sola vez después de un pequeño delay cuando el componente se monta
  useEffect(() => {
    if (!disabled && !isCompleted) {
      const timer = setTimeout(() => {
        setHasShownHint(true);
      }, 500); // Delay de 500ms antes de mostrar el hint
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar el componente

  const handleStart = useCallback((clientX: number) => {
    if (disabled || isCompleted) return;
    setIsDragging(true);
    // Marcar que el usuario ya interactuó, la animación no debe aparecer más
    setHasInteracted(true);
    startXRef.current = clientX;
    startProgressRef.current = progress;
  }, [disabled, isCompleted, progress]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || disabled || isCompleted) return;
    
    const baseThumbWidth = 56; // Ancho base del thumb: 56px
    const currentSliderWidth = sliderRef.current?.offsetWidth || sliderWidth;
    const maxDistance = currentSliderWidth - baseThumbWidth;
    
    if (maxDistance <= 0) return;
    
    const deltaX = clientX - startXRef.current;
    const newProgress = Math.max(0, Math.min(100, startProgressRef.current + (deltaX / maxDistance) * 100));
    
    setProgress(newProgress);
    
    // Si llega al 100%, completar
    if (newProgress >= 100) {
      setIsCompleted(true);
      setIsDragging(false);
      // Feedback háptico si está disponible
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onComplete();
    }
  }, [isDragging, disabled, isCompleted, onComplete, sliderWidth]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Si no llegó al 100%, volver al inicio
    // NO resetear hasShownHint - la animación solo debe aparecer una vez al inicio
    if (progress < 100) {
      setProgress(0);
    }
  }, [isDragging, progress]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      e.preventDefault();
      handleStart(e.touches[0].clientX);
    }
  };

  // Global event listeners
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      handleEnd();
    };

    const handleTouchEnd = () => {
      handleEnd();
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  const trackHeight = 56; // Altura del track: 56px
  const baseThumbWidth = 56; // Ancho base del thumb: 56x56px
  
  // Calcular ancho dinámico del thumb basado en el progreso
  // El thumb crece desde 48px hasta el ancho completo del slider
  const finalProgress = isCompleted ? 100 : progress;
  const dynamicThumbWidth = sliderWidth > 0
    ? baseThumbWidth + ((finalProgress / 100) * (sliderWidth - baseThumbWidth))
    : baseThumbWidth;
  
  // Posición del thumb: siempre empieza desde la izquierda
  const thumbLeft = '0px';
  
  // Distancia del icono al borde derecho cuando el thumb crece
  const iconRightDistance = 14; // 14px desde el borde derecho
  
  // Determinar si el thumb está en su tamaño base (56x56)
  const isBaseSize = dynamicThumbWidth === baseThumbWidth;

  return (
    <>
      {/* Inyectar keyframes de animación */}
      <style>{slideHintKeyframes}</style>
      <div
        ref={sliderRef}
        style={{
          position: 'relative',
          width: '100%',
          height: `${trackHeight}px`,
          backgroundColor: isCompleted ? colors.semantic.text.primary : colors.gray[100], // Track negro cuando completado, gris claro por defecto
          borderRadius: borderRadius.full, // 9999px - full rounded
          overflow: 'hidden',
          cursor: disabled || isCompleted ? 'default' : 'grab',
          touchAction: 'none',
          WebkitTapHighlightColor: 'transparent',
          transition: isCompleted ? 'background-color 0.3s ease' : 'none',
        }}
      >
      {/* Texto del label - siempre centrado y fijo */}
      {!isCompleted && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: typography.fontFamily.sans.join(', '),
            fontSize: sliderWidth > 0 
              ? `clamp(${typography.fontSize.sm}, ${(sliderWidth / 100) * 0.8}px, ${typography.fontSize.base})` 
              : typography.fontSize.base, // Responsive basado en ancho del slider
            fontWeight: typography.fontWeight.bold, // Mismo peso que los botones
            color: colors.semantic.text.primary, // Negro más fuerte
            pointerEvents: 'none',
            zIndex: 1,
            whiteSpace: 'nowrap',
            opacity: 1, // Siempre visible
          }}
        >
          Desliza para bloquear
        </div>
      )}

      {/* Thumb draggable */}
      <div
        ref={thumbRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          position: 'absolute',
          left: thumbLeft,
          top: 0,
          width: `${dynamicThumbWidth}px`,
          height: `${trackHeight}px`,
          backgroundColor: colors.semantic.text.primary, // Negro
          borderRadius: borderRadius.full, // 9999px - full rounded
          display: 'flex',
          alignItems: 'center',
          justifyContent: isBaseSize ? 'center' : 'flex-end', // Icono centrado cuando es 56x56, a la derecha cuando crece
          paddingRight: isBaseSize ? '0' : `${iconRightDistance}px`, // Sin padding cuando es tamaño base, padding cuando crece
          paddingLeft: '0', // Sin padding izquierdo normalmente
          cursor: disabled || isCompleted ? 'default' : isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'none' : 'width 0.1s ease-out, justify-content 0.3s ease-out, padding-right 0.3s ease-out, padding-left 0.3s ease-out',
          zIndex: 2,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          // Animación sutil: el ícono siempre alineado a la derecha con 18px durante la animación
          // No mostrar cuando está arrastrando, cuando hay progreso, o cuando el usuario ya interactuó
          animation: !isDragging && !isCompleted && progress === 0 && hasShownHint && !hasInteracted
            ? 'slideHint 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)' 
            : 'none',
        }}
      >
        {/* Icono de lock */}
        <img
          src="/img/icons/global/lock.svg"
          alt="Bloquear"
          style={{
            width: '20px',
            height: '20px',
            display: 'block',
            filter: 'brightness(0) invert(1)', // Convertir a blanco
            flexShrink: 0, // El icono nunca se encoge
          }}
        />
      </div>
    </div>
    </>
  );
}
