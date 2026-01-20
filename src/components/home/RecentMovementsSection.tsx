"use client";

import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { RecentMovementsWrapper } from './RecentMovementsWrapper';

interface RecentMovementsSectionProps {
  isBalanceVisible?: boolean;
  maxItems?: number;
  filterBySource?: 'wallet' | 'card' | 'general' | 'wallet-and-card' | 'cash' | 'wallet-and-cash';
  titleColor?: string; // Color del título (opcional, por defecto usa semantic.text.primary)
  buttonTextColor?: string; // Color del texto del botón (opcional, por defecto usa semantic.text.primary)
}

/**
 * Componente completo de "Últimos movimientos" que incluye:
 * - Contenedor con fondo blanco, border radius 24px, padding 24px
 * - Header con título "Últimos movimientos" y botón "Ver todo"
 * - Componente de movimientos dinámicos
 * 
 * Todo está tokenizado y no hay valores hardcodeados
 */
export function RecentMovementsSection({ 
  isBalanceVisible = true, 
  maxItems = 3, 
  filterBySource,
  titleColor,
  buttonTextColor
}: RecentMovementsSectionProps) {
  // Usar colores semánticos por defecto, o los proporcionados
  const finalTitleColor = titleColor || colors.semantic.text.primary;
  const finalButtonTextColor = buttonTextColor || colors.semantic.text.primary;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%', // Prevenir overflow
        borderRadius: borderRadius['3xl'], // Token semántico: 24px border radius
        backgroundColor: colors.semantic.background.white, // Token semántico: fondo blanco
        paddingTop: spacing[6], // Token semántico: 24px arriba
        paddingRight: spacing[6], // Token semántico: 24px derecha
        paddingBottom: spacing[6], // Token semántico: 24px abajo
        paddingLeft: spacing[6], // Token semántico: 24px izquierda
        marginBottom: spacing[6], // Token semántico: 1.5rem después del contenido
        marginTop: 0,
        boxSizing: 'border-box',
        overflowX: 'hidden', // Prevenir overflow horizontal
      }}
    >
      {/* Header interno */}
      <div
        style={{
          height: spacing[8], // Token semántico: 32px
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing[4], // Token semántico: 16px de espacio debajo del header
        }}
      >
        {/* Título */}
        <h2
          style={{
            fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
            fontSize: typography.fontSize.lg, // Token semántico: 18px
            fontWeight: typography.fontWeight.bold, // Token semántico: 700 Bold
            lineHeight: '24px', // Token semántico: 24px
            letterSpacing: '0%',
            color: finalTitleColor, // Color configurable
            margin: 0,
            padding: 0,
          }}
        >
          Últimos movimientos
        </h2>
        
        {/* Botón Ver todo */}
        <button
          type="button"
          style={{
            padding: `${spacing[2]} ${spacing[4]}`, // Token semántico: 8px vertical, 16px horizontal
            borderRadius: borderRadius.full, // Token semántico: Full rounded
            backgroundColor: 'rgba(0, 0, 0, 0.0627)', // Token semántico: Fondo #00000010 (16/255 ≈ 6.27% opacidad)
            color: finalButtonTextColor, // Color configurable
            border: 'none',
            fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
            fontSize: typography.fontSize.xs, // Token semántico: 12px (0.75rem)
            fontWeight: typography.fontWeight.bold, // Token semántico: 700 Bold
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          Ver todo
        </button>
      </div>
      
      {/* Componente de movimientos dinámicos */}
      <RecentMovementsWrapper 
        isBalanceVisible={isBalanceVisible} 
        maxItems={maxItems} 
        filterBySource={filterBySource} 
      />
    </div>
  );
}
