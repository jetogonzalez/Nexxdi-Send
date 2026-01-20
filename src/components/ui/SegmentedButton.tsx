"use client";

import React, { useState, useRef, useEffect } from 'react';
import { segmentedButton } from '../../config/segmented-button-tokens';

interface SegmentedButtonProps {
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function SegmentedButton({ 
  options, 
  defaultValue = options[0], 
  onChange 
}: SegmentedButtonProps) {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);
  const [indicatorReady, setIndicatorReady] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Generar un ID único para el grupo de radio buttons
  const groupId = React.useId();

  // Actualizar posición y tamaño del indicador activo
  useEffect(() => {
    const updateIndicator = (isInitial = false) => {
      const selectedIndex = options.indexOf(selectedValue);
      const selectedButton = buttonRefs.current[selectedIndex];
      const container = containerRef.current;
      const indicator = indicatorRef.current;

      if (!selectedButton || !container || !indicator) return;

      // Usar getBoundingClientRect pero con un enfoque más estable
      // Forzar un reflow para asegurar que los valores estén actualizados
      container.offsetHeight; // Trigger reflow
      
      const containerRect = container.getBoundingClientRect();
      const buttonRect = selectedButton.getBoundingClientRect();

      // Determinar posición del botón activo
      const isFirst = selectedIndex === 0;
      const isLast = selectedIndex === options.length - 1;

      // Calcular márgenes según la posición (2px en los bordes correspondientes)
      const marginTop = 2; // Siempre 2px arriba
      const marginBottom = 2; // Siempre 2px abajo
      const marginLeft = isFirst ? 2 : 0; // 2px izquierda solo si es el primero
      const marginRight = isLast ? 2 : 0; // 2px derecha solo si es el último

      // Calcular posición y tamaño del indicador (ajustado por márgenes)
      // Usar getBoundingClientRect pero asegurar que sea relativo al contenedor
      const left = buttonRect.left - containerRect.left + marginLeft;
      const width = buttonRect.width - marginLeft - marginRight;
      const top = marginTop;
      const height = buttonRect.height - marginTop - marginBottom;

      // En el primer render, desactivar la transición para evitar movimiento
      if (isInitial && !indicatorReady) {
        indicator.style.transition = 'none';
      }

      indicator.style.left = `${left}px`;
      indicator.style.width = `${width}px`;
      indicator.style.top = `${top}px`;
      indicator.style.height = `${height}px`;
      
      // Marcar el indicador como listo después de la primera actualización
      if (!indicatorReady) {
        // Usar requestAnimationFrame doble para asegurar que el renderizado esté completo
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (indicator) {
              indicator.style.transition = segmentedButton.animation.transition;
            }
            setIndicatorReady(true);
          });
        });
      }
    };

    // Usar requestAnimationFrame para asegurar que los botones estén renderizados
    const rafId = requestAnimationFrame(() => {
      updateIndicator(true);
    });

    // Actualizar en resize
    const handleResize = () => {
      // Usar requestAnimationFrame para asegurar que el layout esté estable
      requestAnimationFrame(() => {
        updateIndicator(false);
      });
    };

    // Usar ResizeObserver para detectar cambios en el tamaño de los botones o contenedor
    const resizeObserver = new ResizeObserver(() => {
      // Pequeño delay para asegurar que el layout se haya estabilizado
      requestAnimationFrame(() => {
        updateIndicator(false);
      });
    });

    window.addEventListener('resize', handleResize);
    
    // Observar cambios en el contenedor y los botones
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      
      // Observar todos los botones después de que se hayan renderizado
      const observeButtons = () => {
        buttonRefs.current.forEach((button) => {
          if (button) {
            try {
              resizeObserver.observe(button);
            } catch (e) {
              // Ignorar errores (puede estar ya observando)
            }
          }
        });
      };
      
      // Observar botones después de que se hayan renderizado
      requestAnimationFrame(() => {
        requestAnimationFrame(observeButtons);
      });
    }
    
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [selectedValue, options]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  // Manejar navegación con teclado (flechas izquierda/derecha)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let newIndex = currentIndex;
    
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
    } else if (event.key === 'Home') {
      event.preventDefault();
      newIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      newIndex = options.length - 1;
    }
    
    if (newIndex !== currentIndex) {
      const newValue = options[newIndex];
      handleSelect(newValue);
      // Enfocar el nuevo botón
      buttonRefs.current[newIndex]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: segmentedButton.layout.display,
        flexDirection: segmentedButton.layout.flexDirection,
        alignItems: segmentedButton.layout.alignItems,
        justifyContent: segmentedButton.layout.justifyContent,
        width: segmentedButton.layout.width,
        height: segmentedButton.dimensions.height,
        backgroundColor: segmentedButton.colors.background,
        borderRadius: segmentedButton.borders.radius,
        padding: segmentedButton.spacing.containerPadding,
        overflow: 'hidden',
      }}
      role="radiogroup"
      aria-label="Segmented button group"
      aria-orientation="horizontal"
    >
      {/* Indicador activo */}
      <div
        ref={indicatorRef}
        style={{
          position: 'absolute',
          top: '2px', // Margin superior (se ajustará dinámicamente)
          left: '0', // Se ajustará dinámicamente según posición
          height: 'calc(100% - 4px)', // Altura ajustada para márgenes superior e inferior (2px + 2px)
          backgroundColor: segmentedButton.colors.activeIndicator.background,
          borderRadius: segmentedButton.borders.radius,
          boxShadow: segmentedButton.colors.activeIndicator.shadow,
          transition: 'none', // Se establecerá dinámicamente después del primer render
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Botones */}
      {options.map((option, index) => {
        const isActive = selectedValue === option;
        
        return (
          <button
            key={option}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-current={isActive ? 'true' : undefined}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(option);
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPointerDown={(e) => {
              // Prevenir que el gesto se convierta en scroll del bottom sheet
              e.preventDefault();
              e.stopPropagation();
            }}
            onPointerMove={(e) => {
              // Prevenir propagación durante el movimiento
              e.preventDefault();
              e.stopPropagation();
            }}
            tabIndex={isActive ? 0 : -1}
            style={{
              position: 'relative',
              zIndex: 2,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: `${segmentedButton.spacing.buttonPaddingY} ${segmentedButton.spacing.buttonPaddingX}`,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: segmentedButton.borders.radius,
              fontFamily: segmentedButton.typography.fontFamily,
              fontSize: segmentedButton.typography.fontSize,
              fontWeight: segmentedButton.typography.fontWeight,
              lineHeight: segmentedButton.typography.lineHeight,
              color: isActive 
                ? segmentedButton.colors.text.active 
                : segmentedButton.colors.text.inactive,
              cursor: 'pointer',
              transition: `color ${segmentedButton.animation.duration} ${segmentedButton.animation.easing}`,
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation', // Prevenir gestos táctiles que interfieran con scroll
              userSelect: 'none', // Prevenir selección de texto
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
