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
  
  @keyframes spinLoader {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(2160deg); /* 6 vueltas = 6 * 360 = 2160 grados para efecto de "pensando" */
    }
  }
`;

interface SliderToBlockProps {
  onComplete: () => void;
  disabled?: boolean;
  key?: string | number; // Para resetear el componente cuando cambia
  onCloseSheet?: () => void; // Callback para cerrar el bottom sheet
  onShowToast?: (message: string) => void; // Callback para mostrar toast
  mode?: 'lock' | 'unlock' | 'exchange'; // Modo: bloquear, desbloquear o cambiar
  customLabel?: string; // Label personalizado
  customIcon?: string; // Icono personalizado (ruta)
  customToastMessage?: string; // Mensaje de toast personalizado
}

export function SliderToBlock({ 
  onComplete, 
  disabled = false,
  onCloseSheet,
  onShowToast,
  mode = 'lock',
  customLabel,
  customIcon,
  customToastMessage,
}: SliderToBlockProps) {
  // Determinar label según el modo
  const getLabel = () => {
    if (customLabel) return customLabel;
    switch (mode) {
      case 'lock': return 'Desliza para bloquear';
      case 'unlock': return 'Desliza para desbloquear';
      case 'exchange': return 'Desliza para cambiar';
      default: return 'Desliza para confirmar';
    }
  };
  
  // Determinar icono según el modo
  const getIcon = () => {
    if (customIcon) return customIcon;
    switch (mode) {
      case 'lock': return '/img/icons/global/lock.svg';
      case 'unlock': return '/img/icons/global/lock-open.svg';
      case 'exchange': return '/img/icons/global/fx.svg';
      default: return '/img/icons/global/check.svg';
    }
  };
  
  // Determinar mensaje de toast según el modo
  const getToastMessage = () => {
    if (customToastMessage) return customToastMessage;
    switch (mode) {
      case 'lock': return 'Bloqueo temporal activado';
      case 'unlock': return 'Tarjeta desbloqueada';
      case 'exchange': return 'Cambio realizado exitosamente';
      default: return 'Acción completada';
    }
  };
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0); // 0 a 100
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el loader
  const [sliderWidth, setSliderWidth] = useState(0);
  const [hasShownHint, setHasShownHint] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // Flag para saber si el usuario ya interactuó
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startProgressRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);

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

  // Definir handlers ANTES del useEffect que los usa
  const handleStart = useCallback((clientX: number, pointerId: number, element: HTMLElement) => {
    if (disabled || isCompleted) return;
    
    // Capturar el pointer para evitar que otros elementos lo intercepten
    try {
      element.setPointerCapture(pointerId);
      pointerIdRef.current = pointerId;
    } catch (e) {
      // Fallback si setPointerCapture no está disponible
      console.warn('setPointerCapture not available');
    }
    
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
    
    // Si llega al 100%, iniciar secuencia de loader
    if (newProgress >= 100) {
      setIsCompleted(true);
      setIsDragging(false);
      setIsLoading(true); // Activar loader
      // Feedback háptico si está disponible
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      // Después de 6 vueltas del loader (2.4 segundos: 6 vueltas * 0.4s por vuelta)
      setTimeout(() => {
        // Ejecutar acción + cerrar sheet + toast
        onComplete();
        if (onShowToast) {
          onShowToast(getToastMessage());
        }
        // Cerrar el sheet después de un pequeño delay adicional
        if (onCloseSheet) {
          setTimeout(() => {
            onCloseSheet();
          }, 200);
        }
      }, 2400); // 2.4 segundos para 6 vueltas (efecto de "pensando")
    }
  }, [isDragging, disabled, isCompleted, onComplete, onCloseSheet, onShowToast, sliderWidth]);

  const handleEnd = useCallback((pointerId: number, element: HTMLElement) => {
    if (!isDragging) return;
    
    // Liberar el pointer capture
    try {
      if (pointerIdRef.current !== null) {
        element.releasePointerCapture(pointerIdRef.current);
        pointerIdRef.current = null;
      }
    } catch (e) {
      // Fallback si releasePointerCapture no está disponible
    }
    
    setIsDragging(false);
    
    // Si no llegó al 100%, resetear al inicio
    // NO resetear hasShownHint - la animación solo debe aparecer una vez al inicio
    if (progress < 100) {
      setProgress(0);
    }
  }, [isDragging, progress]);
  
  // Touch event handlers usando addEventListener nativo con { passive: false }
  // CRÍTICO: React registra touchmove como passive por defecto, necesitamos listeners nativos
  useEffect(() => {
    const thumbElement = thumbRef.current;
    if (!thumbElement) return;
    
    const handleTouchStartNative = (e: TouchEvent) => {
      console.log('DOWN (touch native)'); // DEBUG
      if (disabled || isCompleted) return;
      // CRÍTICO: preventDefault() funciona porque el listener es no-pasivo
      e.preventDefault();
      e.stopPropagation();
      if (e.touches.length > 0) {
        handleStart(e.touches[0].clientX, e.touches[0].identifier, thumbElement);
      }
    };
    
    const handleTouchMoveNative = (e: TouchEvent) => {
      console.log('MOVE (touch native)'); // DEBUG
      if (!isDragging || disabled || isCompleted) return;
      // CRÍTICO: preventDefault() funciona porque el listener es no-pasivo
      e.preventDefault();
      e.stopPropagation();
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };
    
    const handleTouchEndNative = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      e.stopPropagation();
      handleEnd(-1, thumbElement);
    };
    
    const handleTouchCancelNative = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      e.stopPropagation();
      handleEnd(-1, thumbElement);
    };
    
    // CRÍTICO: addEventListener nativo con { passive: false } para poder usar preventDefault()
    thumbElement.addEventListener('touchstart', handleTouchStartNative, { passive: false });
    thumbElement.addEventListener('touchmove', handleTouchMoveNative, { passive: false });
    thumbElement.addEventListener('touchend', handleTouchEndNative, { passive: false });
    thumbElement.addEventListener('touchcancel', handleTouchCancelNative, { passive: false });
    
    return () => {
      thumbElement.removeEventListener('touchstart', handleTouchStartNative);
      thumbElement.removeEventListener('touchmove', handleTouchMoveNative);
      thumbElement.removeEventListener('touchend', handleTouchEndNative);
      thumbElement.removeEventListener('touchcancel', handleTouchCancelNative);
    };
  }, [disabled, isCompleted, isDragging, handleStart, handleMove, handleEnd]);

  // Pointer Events - reemplaza mouse/touch events
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    console.log('DOWN'); // DEBUG: Verificar si se dispara en iPhone
    if (disabled || isCompleted) return;
    
    // Prevenir comportamiento por defecto y propagación
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.currentTarget;
    handleStart(e.clientX, e.pointerId, element);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    console.log('MOVE'); // DEBUG: Verificar si se dispara en iPhone
    if (!isDragging || disabled || isCompleted) return;
    
    // Prevenir comportamiento por defecto y propagación
    e.preventDefault();
    e.stopPropagation();
    
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    // Prevenir comportamiento por defecto y propagación
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.currentTarget;
    handleEnd(e.pointerId, element);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    // Prevenir comportamiento por defecto y propagación
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.currentTarget;
    handleEnd(e.pointerId, element);
  };

  // Global event listeners para touch events con { passive: false }
  // CRÍTICO: Estos listeners se activan cuando isDragging es true
  useEffect(() => {
    if (!isDragging) return;

    // Touch listeners globales con { passive: false } para poder usar preventDefault()
    const handleTouchMoveGlobal = (e: TouchEvent) => {
      console.log('MOVE (touch global)'); // DEBUG
      if (e.touches.length > 0) {
        e.preventDefault(); // Ahora funciona porque el listener es no-pasivo
        e.stopPropagation();
        handleMove(e.touches[0].clientX);
      }
    };

    const handleTouchEndGlobal = (e: TouchEvent) => {
      const element = thumbRef.current;
      if (element) {
        e.preventDefault();
        e.stopPropagation();
        handleEnd(-1, element);
      }
    };

    // CRÍTICO: Usar addEventListener nativo con { passive: false }
    document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
    document.addEventListener('touchend', handleTouchEndGlobal, { passive: false });
    document.addEventListener('touchcancel', handleTouchEndGlobal, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleTouchMoveGlobal);
      document.removeEventListener('touchend', handleTouchEndGlobal);
      document.removeEventListener('touchcancel', handleTouchEndGlobal);
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
          {getLabel()}
        </div>
      )}

      {/* Thumb draggable */}
      <div
        ref={thumbRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
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
          touchAction: 'none', // CRÍTICO: Prevenir scroll y gestos táctiles
          userSelect: 'none', // CRÍTICO: Prevenir selección de texto
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none', // Prevenir menú contextual en iOS
          // Animación sutil: el ícono siempre alineado a la derecha con 18px durante la animación
          // No mostrar cuando está arrastrando, cuando hay progreso, o cuando el usuario ya interactuó
          animation: !isDragging && !isCompleted && progress === 0 && hasShownHint && !hasInteracted
            ? 'slideHint 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)' 
            : 'none',
        }}
      >
        {/* Icono de lock o loader */}
        {isLoading ? (
          <img
            src="/img/icons/global/loader.svg"
            alt="Cargando"
            style={{
              width: '18px',
              height: '18px',
              display: 'block',
              filter: 'brightness(0) invert(1)', // Convertir a blanco (igual que lock)
              flexShrink: 0, // El icono nunca se encoge
              touchAction: 'none', // CRÍTICO: Prevenir gestos en el hijo también
              pointerEvents: 'none', // El icono no debe interceptar eventos
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              WebkitTouchCallout: 'none',
              animation: 'spinLoader 2.4s cubic-bezier(0.4, 0.0, 0.2, 1) forwards', // 6 vueltas en 2.4s
              transformOrigin: 'center center', // Rotar desde el centro
            }}
            draggable={false}
          />
        ) : (
          <img
            src={getIcon()}
            alt={getLabel()}
            style={{
              width: '18px',
              height: '18px',
              display: 'block',
              filter: 'brightness(0) invert(1)', // Convertir a blanco
              flexShrink: 0, // El icono nunca se encoge
              touchAction: 'none', // CRÍTICO: Prevenir gestos en el hijo también
              pointerEvents: 'none', // El icono no debe interceptar eventos
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              WebkitTouchCallout: 'none',
            }}
            draggable={false}
          />
        )}
      </div>
    </div>
    </>
  );
}
