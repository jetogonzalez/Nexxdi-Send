"use client";

import { useState, useRef, useEffect } from 'react';
import { colors, spacing, typography } from '../../config/design-tokens';
import { transitions } from '../../config/transitions-tokens';
import { RecentMovementsSection } from './RecentMovementsSection';
import { SegmentedButton } from '../ui/SegmentedButton';

interface TarjetaViewProps {
  titleRef?: (el: HTMLElement | null) => void;
  scrollProgress?: number;
  isBalanceVisible?: boolean;
}

export function TarjetaView({ titleRef, scrollProgress = 0, isBalanceVisible = true }: TarjetaViewProps) {
  const title = 'Tarjeta virtual';
  const [selectedFilter, setSelectedFilter] = useState<string>('Actividad');
  const previousFilterRef = useRef<string>('Actividad');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Determinar dirección de la animación según el cambio
  useEffect(() => {
    if (previousFilterRef.current !== selectedFilter) {
      // Activity → Options: slide left
      // Options → Activity: slide right
      if (previousFilterRef.current === 'Actividad' && selectedFilter === 'Opciones') {
        setSlideDirection('left');
      } else if (previousFilterRef.current === 'Opciones' && selectedFilter === 'Actividad') {
        setSlideDirection('right');
      }
      previousFilterRef.current = selectedFilter;
    }
  }, [selectedFilter]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: spacing[4], // 16px
        paddingBottom: spacing[10], // 40px
        backgroundColor: colors.semantic.background.main,
      }}
    >
      <h1
        ref={(el) => {
          if (titleRef) titleRef(el);
        }}
        style={{
          fontSize: typography.sectionTitle.fontSize,
          fontWeight: typography.sectionTitle.fontWeight,
          lineHeight: typography.sectionTitle.lineHeight,
          color: colors.semantic.background.white, // Blanco solo en tarjetas
          fontFamily: typography.sectionTitle.fontFamily,
          marginBottom: spacing[6], // 1.5rem después del título (default para todas las páginas)
        }}
      >
        {title}
      </h1>
      
      <p
        style={{
          fontSize: typography.fontSize.base,
          color: colors.semantic.text.secondary,
          fontFamily: typography.fontFamily.sans.join(', '),
          marginBottom: spacing[6], // 1.5rem después del contenido
        }}
      >
        Gestiona tu tarjeta virtual
      </p>

      {/* Segmented Button - Debajo del texto descriptivo de tarjeta virtual */}
      <div
        style={{
          marginBottom: spacing[6], // 1.5rem después del segmented button
        }}
      >
        <SegmentedButton
          options={['Actividad', 'Opciones']}
          defaultValue={selectedFilter}
          onChange={setSelectedFilter}
        />
      </div>

      {/* Contenedor de contenido con animación de slide horizontal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'visible', // Cambiado a 'visible' para que no corte el contenido
          minHeight: '400px', // Altura mínima aumentada para acomodar 3 movimientos
        }}
      >
        {/* Vista de Actividad - Últimos movimientos */}
        <div
          style={{
            position: selectedFilter === 'Actividad' ? 'relative' : 'absolute', // 'relative' cuando está visible para que afecte la altura del contenedor
            top: 0,
            left: selectedFilter === 'Actividad' ? '0%' : slideDirection === 'left' ? '-100%' : '100%',
            width: '100%',
            opacity: selectedFilter === 'Actividad' ? 1 : 0,
            transform: selectedFilter === 'Actividad' 
              ? 'translateX(0)' 
              : slideDirection === 'left' 
                ? 'translateX(-100%)' 
                : 'translateX(100%)',
            transition: `opacity ${transitions.duration.slow} ${transitions.easing.easeInOut}, transform ${transitions.duration.slow} ${transitions.easing.easeInOut}`,
            pointerEvents: selectedFilter === 'Actividad' ? 'auto' : 'none',
            zIndex: selectedFilter === 'Actividad' ? 1 : 0,
          }}
        >
          {/* Sección Últimos movimientos - Solo visible en Actividad */}
          <RecentMovementsSection 
            isBalanceVisible={isBalanceVisible} 
            maxItems={3} 
            filterBySource="card" 
          />
        </div>

        {/* Vista de Opciones - Contenido placeholder */}
        <div
          style={{
            position: selectedFilter === 'Opciones' ? 'relative' : 'absolute', // 'relative' cuando está visible para que afecte la altura del contenedor
            top: selectedFilter === 'Opciones' ? 0 : 'auto',
            left: selectedFilter === 'Opciones' ? '0%' : slideDirection === 'left' ? '100%' : '-100%',
            width: '100%',
            opacity: selectedFilter === 'Opciones' ? 1 : 0,
            transform: selectedFilter === 'Opciones' 
              ? 'translateX(0)' 
              : slideDirection === 'left' 
                ? 'translateX(100%)' 
                : 'translateX(-100%)',
            transition: `opacity ${transitions.duration.slow} ${transitions.easing.easeInOut}, transform ${transitions.duration.slow} ${transitions.easing.easeInOut}`,
            pointerEvents: selectedFilter === 'Opciones' ? 'auto' : 'none',
            zIndex: selectedFilter === 'Opciones' ? 1 : 0,
          }}
        >
          {/* Contenido placeholder para Opciones */}
          <div
            style={{
              padding: spacing[6],
              textAlign: 'center',
              color: colors.semantic.text.secondary,
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.base,
            }}
          >
            Contenido de Opciones
          </div>
        </div>
      </div>
    </div>
  );
}
