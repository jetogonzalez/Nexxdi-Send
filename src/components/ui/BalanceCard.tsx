"use client";

import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { formatCurrency } from '../../lib/formatBalance';
import { CircularProgress } from './CircularProgress';

interface BalanceCardProps {
  /** Monto total en COP (pesos colombianos) */
  copAmount: number;
  /** Tasa de cambio: 1 USD = exchangeRate COP */
  exchangeRate?: number;
  /** Si el balance es visible */
  isBalanceVisible?: boolean;
  /** Valor del progreso para el círculo (0-100) */
  progress?: number;
}

/**
 * Componente de tarjeta de saldo total
 * - Similar a MonthlyPurchasesCard pero para mostrar saldo total
 * - Muestra el valor en COP (pesos colombianos)
 * - Muestra la tasa de cambio como subtítulo
 * - Progress bar circular a la derecha
 * - Todo tokenizado: spacing, typography, colors, borderRadius
 */
export function BalanceCard({
  copAmount,
  exchangeRate = 4000, // Tasa por defecto: 1 USD = 4000 COP
  isBalanceVisible = true,
  progress = 0, // Por defecto sin progreso
}: BalanceCardProps) {
  // Formatear el monto en COP
  const formattedAmount = isBalanceVisible
    ? formatCurrency(copAmount, 'COP', false) // Solo el número formateado sin decimales
    : '•••';
  
  // Formatear subtítulo con tasa de cambio (USD será más pequeño)
  const copValue = formatCurrency(exchangeRate, 'COP', false);

  return (
    <div
      style={{
        backgroundColor: colors.semantic.background.white, // Token semántico: fondo blanco
        borderRadius: borderRadius['3xl'], // Token semántico: 24px
        padding: spacing[6], // Token semántico: 24px en todos los lados
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing[6], // Token semántico: 24px entre contenido y progreso
        marginBottom: spacing[6], // Token semántico: 1.5rem después del contenido
        marginTop: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Sección izquierda: Contenido de texto */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: spacing[0.5], // Token semántico: 2px entre elementos
          minWidth: 0, // Permitir que se contraiga si es necesario
        }}
      >
        {/* Título */}
        <h2
          style={{
            fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
            fontSize: typography.fontSize.lg, // Token semántico: 18px (igual que "Últimos movimientos")
            fontWeight: typography.fontWeight.bold, // Token semántico: 700 Bold
            lineHeight: '24px', // Token semántico: 24px (igual que "Últimos movimientos")
            letterSpacing: '0%',
            color: colors.semantic.text.primary, // Token semántico: texto primario
            margin: 0,
            padding: 0,
          }}
        >
          Saldo total
        </h2>

        {/* Monto */}
        <div
          style={{
            fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
            fontSize: '1.75rem', // 28px (tokenizado como valor literal - no existe en tokens actuales)
            fontWeight: typography.fontWeight.extrabold, // Token semántico: 800
            letterSpacing: '-0.04em', // -4% (tokenizado como valor literal)
            color: colors.semantic.text.primary, // Token semántico: color de balance/amount
            lineHeight: typography.lineHeight.none, // Token semántico: 1
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'baseline',
            gap: spacing[1], // Token semántico: 4px entre número y moneda
          }}
        >
          <span>{formattedAmount}</span>
          {isBalanceVisible && (
            <span
              style={{
                fontSize: typography.fontSize.base, // Token semántico: 16px (mismo estilo que referencia)
                fontWeight: typography.fontWeight.bold, // Token semántico: 700 Bold
                fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
                color: colors.semantic.text.primary, // Token semántico: mismo color que el monto
              }}
            >
              COP
            </span>
          )}
        </div>

        {/* Subtítulo con tasa de cambio */}
        <div
          style={{
            fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
            fontSize: typography.fontSize.base, // Token semántico: 16px (body text)
            fontWeight: typography.fontWeight.normal, // Token semántico: 400 (body text)
            lineHeight: typography.lineHeight.normal, // Token semántico: 1.5
            color: colors.semantic.text.secondary, // Token semántico: texto secundario
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'baseline',
            gap: spacing[0.5], // 2px entre elementos
          }}
        >
          <span>1</span>
          <span
            style={{
              fontSize: typography.fontSize.sm, // Token semántico: 14px (más pequeño)
              fontWeight: typography.fontWeight.normal, // Token semántico: 400
              fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
              color: colors.semantic.text.secondary, // Token semántico: texto secundario
            }}
          >
            USD
          </span>
          <span>= {copValue}</span>
        </div>
      </div>

      {/* Sección derecha: Progreso circular */}
      {progress > 0 && (
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center', // Centrado verticalmente con el texto
            justifyContent: 'flex-end', // Alineado a la derecha
          }}
        >
          <CircularProgress
            progress={progress}
            size={64} // Tamaño total: 64px x 64px
            strokeWidth={5} // Grosor del anillo de progreso: 5px (reducido de 6px)
            backgroundStrokeWidth={1} // Grosor del anillo de fondo: 1px (reducido de 2px)
            progressColor={colors.primary.main} // Token semántico: color primario
            backgroundColor={colors.semantic.border.light} // Token semántico: borde suave (light gray)
          />
        </div>
      )}
    </div>
  );
}
