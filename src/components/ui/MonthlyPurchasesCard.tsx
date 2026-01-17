"use client";

import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { formatCurrency } from '../../lib/formatBalance';
import { CircularProgress } from './CircularProgress';

// Color de Carulla (verde) - Token semántico
const CARULLA_COLOR = '#7DBE42';
// Color de Netflix (oscuro) - Token semántico
const NETFLIX_COLOR = '#141414';

interface MonthlyPurchasesCardProps {
  /** Monto total de compras */
  amount: number;
  /** Moneda (default: "USD") */
  currency?: string;
  /** Si el balance es visible */
  isBalanceVisible?: boolean;
  /** Mes específico (opcional, por defecto usa el mes actual) */
  month?: number; // 0-11 (0 = enero, 11 = diciembre)
  /** Año específico (opcional, por defecto usa el año actual) */
  year?: number;
}

/**
 * Componente de tarjeta de compras mensuales
 * - Similar a GroupCard pero para mostrar compras del mes
 * - Progress bar dinámico basado en el día del mes actual
 * - Muestra logos de Amazon y Carulla dentro del círculo
 * - Todo tokenizado: spacing, typography, colors, borderRadius
 */
export function MonthlyPurchasesCard({
  amount,
  currency = 'USD',
  isBalanceVisible = true,
  month,
  year,
}: MonthlyPurchasesCardProps) {
  // Obtener fecha actual o usar la proporcionada
  const now = new Date();
  const targetMonth = month !== undefined ? month : now.getMonth();
  const targetYear = year !== undefined ? year : now.getFullYear();
  
  // Calcular el día del mes actual
  const currentDay = now.getDate();
  
  // Calcular el número total de días en el mes
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  
  // Calcular el progreso basado en el día del mes
  // Si estamos al día 15 de un mes de 30 días, el progreso es (15/30) * 100 = 50%
  const progress = Math.round((currentDay / daysInMonth) * 100);
  
  // Nombres de los meses en español
  const monthNames = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  
  const monthName = monthNames[targetMonth];
  
  // Formatear el monto
  const formattedAmount = isBalanceVisible
    ? formatCurrency(amount, currency, false) // Solo el número formateado
    : '•••';
  
  // Formatear rango de fechas: "Del 01 enero hasta la fecha"
  const dateRange = `Del 01 ${monthName} hasta la fecha`;

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
        marginBottom: 0, // Sin margen inferior para evitar espacio extra
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
          Compras en {monthName}
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
                fontSize: typography.fontSize.sm, // Token semántico: 14px (más pequeño que el monto)
                fontWeight: typography.fontWeight.bold, // Token semántico: 700 Bold
                fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
                color: colors.semantic.text.primary, // Token semántico: mismo color que el monto
              }}
            >
              {currency}
            </span>
          )}
        </div>

        {/* Rango de fechas */}
        <div
          style={{
            fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
            fontSize: typography.fontSize.base, // Token semántico: 16px (body text)
            fontWeight: typography.fontWeight.normal, // Token semántico: 400 (body text)
            lineHeight: typography.lineHeight.normal, // Token semántico: 1.5
            color: colors.semantic.text.secondary, // Token semántico: texto secundario
            margin: 0,
            padding: 0,
          }}
        >
          {dateRange}
        </div>
      </div>

      {/* Sección derecha: Progreso circular con logos */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-end', // Alineado abajo
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
        >
          {/* Contenedor de logos: 36x36px fijo, sin padding/margin/spacing */}
          <div
            style={{
              position: 'relative',
              width: '36px', // Tamaño fijo: 36px x 36px
              height: '36px', // Tamaño fijo: 36px x 36px
              padding: '0', // Sin padding
              margin: '0', // Sin margin
              boxSizing: 'border-box',
            }}
          >
            {/* Logo Netflix - bottom-right con borde circular */}
            <div
              style={{
                position: 'absolute',
                bottom: '0', // Posicionado en bottom
                right: '0', // Posicionado en right
                width: '24px', // Tamaño fijo: 24px x 24px
                height: '24px', // Tamaño fijo: 24px x 24px
                borderRadius: borderRadius.full, // Círculo completo
                overflow: 'hidden', // Clip a círculo
                outline: `2px solid ${colors.semantic.background.white}`, // Borde circular de 2px fuera del logo (tokenizado)
                outlineOffset: '0', // Sin offset, borde justo fuera
                zIndex: 2, // Netflix siempre adelante
                backgroundColor: NETFLIX_COLOR, // Token semántico: fondo oscuro Netflix (#141414)
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/img/icons/logos/logo-local-netflix.svg"
                alt="Netflix"
                style={{
                  width: '20px', // Tamaño del logo dentro del círculo
                  height: '20px', // Tamaño del logo dentro del círculo
                  objectFit: 'contain', // Contener el logo sin recortar
                  objectPosition: 'center', // Centrado
                }}
              />
            </div>

            {/* Logo Carulla - top-left */}
            <div
              style={{
                position: 'absolute',
                top: '0', // Posicionado en top
                left: '0', // Posicionado en left
                width: '24px', // Tamaño fijo: 24px x 24px
                height: '24px', // Tamaño fijo: 24px x 24px
                borderRadius: borderRadius.full, // Círculo completo
                overflow: 'hidden', // Clip a círculo
                zIndex: 1, // Carulla detrás
                backgroundColor: CARULLA_COLOR, // Token semántico: verde Carulla (#7DBE42)
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/img/icons/logos/logo-local-carulla.png"
                alt="Carulla"
                style={{
                  width: '20px', // Tamaño del logo dentro del círculo
                  height: '20px', // Tamaño del logo dentro del círculo
                  objectFit: 'contain', // Contener el logo sin recortar
                  objectPosition: 'center', // Centrado
                }}
              />
            </div>
          </div>
        </CircularProgress>
      </div>
    </div>
  );
}
