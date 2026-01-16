"use client";

import { useEffect, useState, useRef } from 'react';
import { colors } from '../../config/design-tokens';
import { transitions } from '../../config/transitions-tokens';

interface CircularProgressProps {
  /** Valor del progreso (0-100) */
  progress: number;
  /** Tamaño del círculo en píxeles */
  size?: number;
  /** Grosor del stroke en píxeles */
  strokeWidth?: number;
  /** Grosor del anillo de fondo (por defecto más delgado que el de progreso) */
  backgroundStrokeWidth?: number;
  /** Color del anillo de progreso */
  progressColor?: string;
  /** Color del anillo de fondo */
  backgroundColor?: string;
  /** Contenido a mostrar dentro del círculo (ej: avatares) */
  children?: React.ReactNode;
}

/**
 * Componente de progreso circular animado
 * - Anima desde 0% hasta el valor objetivo
 * - Usa tokens para colores y transiciones
 */
export function CircularProgress({
  progress,
  size = 64, // Tamaño total: 64px x 64px
  strokeWidth = 6, // Grosor del anillo de progreso: 6px
  backgroundStrokeWidth = 2, // Grosor del anillo de fondo: 2px (más delgado)
  progressColor = colors.primary.main, // Token semántico: color primario
  backgroundColor = colors.semantic.border.light, // Token semántico: borde suave (light gray)
  children,
}: CircularProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const progressRef = useRef(progress); // Guardar el valor de progreso actual

  // Actualizar la referencia cuando cambia el progreso
  useEffect(() => {
    progressRef.current = progress;
    // Resetear el estado de animación cuando cambia el progreso
    if (hasAnimatedRef.current) {
      hasAnimatedRef.current = false;
      setAnimatedProgress(0);
    }
  }, [progress]);

  // Radio del círculo (ajustado por el stroke width más grande - progreso)
  const radius = (size - strokeWidth) / 2;
  // Circunferencia del círculo
  const circumference = 2 * Math.PI * radius;
  // Offset del stroke para mostrar el progreso
  const offset = circumference - (animatedProgress / 100) * circumference;

  // Animar progreso solo cuando el componente es visible y supera el navigation bar
  useEffect(() => {
    if (!containerRef.current) return;

    // Calcular el offset del navigation bar (aproximadamente 100px desde arriba)
    const navigationBarHeight = 100; // Altura aproximada del navigation bar

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Verificar que el elemento esté visible y haya superado el navigation bar
          if (entry.isIntersecting && entry.boundingClientRect.top > navigationBarHeight) {
            // Iniciar animación solo si no se ha animado antes
            if (!hasAnimatedRef.current) {
              hasAnimatedRef.current = true;
              // Pequeño delay para una entrada más suave
              setTimeout(() => {
                setAnimatedProgress(progressRef.current);
              }, 100);
            }
          }
        });
      },
      {
        threshold: 0.1, // Iniciar cuando al menos el 10% del elemento sea visible
        rootMargin: `-${navigationBarHeight}px 0px 0px 0px`, // Considerar el navigation bar
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* SVG del progreso circular */}
      <svg
        width={size}
        height={size}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'rotate(-90deg)', // Rotar para que empiece desde arriba
        }}
      >
        {/* Anillo de fondo - más delgado */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={backgroundStrokeWidth} // Más delgado que el anillo de progreso (2px)
        />
        {/* Anillo de progreso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            // Animación muy suave y constante estilo Apple (smooth, sin aceleración brusca)
            transition: `stroke-dashoffset 1000ms cubic-bezier(0.2, 0, 0, 1)`, // Muy suave y constante, estilo Apple
          }}
        />
      </svg>
      
      {/* Contenido centrado (avatares) - perfectamente centrado en el mismo punto que el círculo */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // Centrado perfecto en el punto medio del círculo
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
