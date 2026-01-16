"use client";

import { useState, useRef, useEffect } from 'react';
import { colors, spacing, typography } from '../../config/design-tokens';
import { transitions } from '../../config/transitions-tokens';
import { formatBalance } from '../../lib/formatBalance';
import { RecentMovementsSection } from './RecentMovementsSection';
import { SegmentedButton } from '../ui/SegmentedButton';
import { GroupCard } from '../ui/GroupCard';

interface WalletViewProps {
  isBalanceVisible?: boolean;
  titleRef?: (el: HTMLElement | null) => void;
  scrollProgress?: number;
  usdBalance?: number;
  copBalance?: number;
}

export function WalletView({ isBalanceVisible = true, titleRef, scrollProgress = 0, usdBalance = 5678.90, copBalance = 1500000.50 }: WalletViewProps) {
  const title = 'Wallet';
  const [selectedFilter, setSelectedFilter] = useState<string>('Actividad');
  const previousFilterRef = useRef<string>('Actividad');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  
  // Calcular saldo total: sumar USD y convertir COP a USD (aproximadamente 1 USD = 4000 COP)
  // Para simplificar, mostraremos el total en USD sumando ambos valores
  // En producción, esto debería usar la tasa de cambio real
  const exchangeRate = 4000; // Tasa aproximada: 1 USD = 4000 COP
  const copInUsd = copBalance / exchangeRate;
  const totalBalance = usdBalance + copInUsd;

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
          color: typography.sectionTitle.color,
          fontFamily: typography.sectionTitle.fontFamily,
          marginBottom: spacing[6], // 1.5rem después del título (default para todas las páginas)
        }}
      >
        {title}
      </h1>
      
      {/* Label "Saldo total" */}
      <div
        style={{
          height: '24px',
          fontFamily: typography.fontFamily.sans.join(', '), // Manrope
          fontWeight: typography.fontWeight.normal, // 400
          fontSize: typography.fontSize.base, // 16px
          color: '#101828',
          lineHeight: '24px',
          marginBottom: 0, // Sin espacio entre label y saldo
        }}
      >
        Saldo total
      </div>
      
      {/* Balance principal */}
      <div
        style={{
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.bold,
          color: colors.semantic.text.primary,
          fontFamily: typography.fontFamily.sans.join(', '),
          marginTop: 0, // Sin espacio entre label y saldo
          marginBottom: spacing[6], // 1.5rem después del contenido
        }}
      >
        {formatBalance(totalBalance, isBalanceVisible)}
      </div>
      
      {/* Segmented Button - Debajo del valor del saldo total */}
      <div
        style={{
          position: 'relative', // Asegurar posición estable
          width: '100%', // Ancho completo
          marginBottom: spacing[6], // 1.5rem después del segmented button
          zIndex: 10, // Asegurar que esté por encima del contenido animado
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
            filterBySource="wallet" 
          />
          
          {/* Group Card - Debajo de Últimos movimientos */}
          <div
            style={{
              marginTop: spacing[4], // Token semántico: 16px de espacio arriba
            }}
          >
            <GroupCard
              title="Grupos"
              amount={8002502.61}
              currency="USD"
              groupName="Viaje fin de año"
              progress={64}
              isBalanceVisible={isBalanceVisible}
            />
          </div>
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
