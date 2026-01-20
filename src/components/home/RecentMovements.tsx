"use client";

import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { MovementAvatar } from './MovementAvatar';
import { formatBalance } from '../../lib/formatBalance';

export interface Movement {
  id: string;
  name: string;
  amount: number;
  currency: string;
  date: Date;
  logoUrl?: string;
  contactName?: string;
  imageUrl?: string;
  type: 'purchase' | 'deposit' | 'transfer' | 'withdrawal';
  source: 'wallet' | 'card' | 'general' | 'cash'; // Fuente del movimiento: wallet (cuentas), card (tarjeta), general (todos), cash (transferencias)
}

interface RecentMovementsProps {
  movements: Movement[];
  isBalanceVisible?: boolean;
  maxItems?: number;
  filterBySource?: 'wallet' | 'card' | 'general' | 'wallet-and-card' | 'cash' | 'wallet-and-cash'; // Filtrar por fuente específica
}

/**
 * Formatea la fecha para mostrar en el movimiento
 */
function formatMovementDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const movementDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (movementDate.getTime() === today.getTime()) {
    // Hoy
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `Hoy, ${hours}:${minutes}`;
  } else if (movementDate.getTime() === yesterday.getTime()) {
    // Ayer
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `Ayer, ${hours}:${minutes}`;
  } else {
    // Fecha específica
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month}, ${hours}:${minutes}`;
  }
}

/**
 * Formatea el monto del movimiento
 */
function formatMovementAmount(amount: number, currency: string, isVisible: boolean): string {
  if (!isVisible) {
    return '•••';
  }
  
  const sign = amount >= 0 ? '+ ' : '- ';
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(absAmount);
  
  return `${sign}${formatted} ${currency}`;
}

export function RecentMovements({ movements, isBalanceVisible = true, maxItems = 3, filterBySource }: RecentMovementsProps) {
  // Filtrar movimientos por fuente si se especifica
  // 'general' o undefined: muestra TODOS los movimientos (matriz general)
  // 'wallet': solo movimientos de cuentas/monedas
  // 'card': solo movimientos de tarjeta/compras
  // 'wallet-and-card': solo movimientos de wallet Y tarjeta (unión de ambos)
  let filteredMovements = movements;
  if (filterBySource === 'wallet-and-card') {
    // Mostrar solo movimientos de wallet y tarjeta (unión de ambos)
    filteredMovements = movements.filter((m) => m.source === 'wallet' || m.source === 'card');
  } else if (filterBySource === 'wallet-and-cash') {
    // Mostrar solo movimientos de wallet y cash (transferencias)
    filteredMovements = movements.filter((m) => m.source === 'wallet' || m.source === 'cash');
  } else if (filterBySource && filterBySource !== 'general') {
    filteredMovements = movements.filter((m) => m.source === filterBySource);
  }
  // Si filterBySource es 'general' o undefined, mostrar todos los movimientos
  
  // Ordenar movimientos por fecha (más reciente primero) y limitar a maxItems
  const sortedMovements = [...filteredMovements]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, maxItems);

  if (sortedMovements.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: borderRadius.lg, // Token semántico: 8px border radius
        overflow: 'hidden',
        backgroundColor: colors.semantic.background.white, // Token semántico: fondo blanco
      }}
    >
      {sortedMovements.map((movement, index) => (
        <div
          key={movement.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            paddingTop: spacing[3], // Token semántico: 12px vertical arriba
            paddingBottom: spacing[3], // Token semántico: 12px vertical abajo
            paddingLeft: spacing[0], // Token semántico: 0px
            paddingRight: spacing[0], // Token semántico: 0px
            position: 'relative',
          }}
        >
          {/* Divider que empieza después del avatar */}
          {index < sortedMovements.length - 1 && (
            <div
              style={{
                position: 'absolute',
                left: `calc(40px + ${spacing[4]})`, // Token semántico: Empieza después del avatar (40px) + gap (16px)
                right: spacing[0], // Token semántico: 0px
                bottom: spacing[0], // Token semántico: 0px
                height: '1px',
                backgroundColor: colors.semantic.border.light, // Token semántico: borde suave
              }}
            />
          )}
          
          {/* Avatar */}
          <MovementAvatar
            logoUrl={movement.logoUrl}
            contactName={movement.contactName}
            imageUrl={movement.imageUrl}
            size={40}
            borderColor={
              movement.name.includes('Carulla')
                ? colors.semantic.movementAvatar?.carulla || '#7DBE42'
                : movement.name.includes('Netflix')
                ? colors.semantic.movementAvatar?.netflix || '#141414'
                : undefined // Amazon no tiene color de fondo ni borde
            }
          />
          
          {/* Información del movimiento */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing[0.5], // Token semántico: 2px entre nombre y fecha
              alignItems: 'flex-start',
            }}
          >
            {/* Nombre del movimiento */}
            <div
              style={{
                fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
                fontSize: typography.fontSize.base, // Token semántico: 16px
                fontWeight: typography.fontWeight.normal, // Token semántico: 400
                color: colors.semantic.text.primary, // Token semántico: texto primario
                lineHeight: typography.lineHeight.normal, // Token semántico: altura de línea normal
                textAlign: 'left',
                width: '100%',
              }}
            >
              {movement.name}
            </div>
            
            {/* Fecha y hora */}
            <div
              style={{
                fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
                fontSize: typography.fontSize.xs, // Token semántico: 12px
                fontWeight: typography.fontWeight.normal, // Token semántico: 400
                color: colors.semantic.text.secondary, // Token semántico: texto secundario
                lineHeight: typography.lineHeight.normal, // Token semántico: altura de línea normal
                textAlign: 'left',
                width: '100%',
              }}
            >
              {formatMovementDate(movement.date)}
            </div>
          </div>
          
          {/* Valor */}
          <div
            style={{
              fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
              fontSize: typography.fontSize.base, // Token semántico: 16px
              fontWeight: typography.fontWeight.normal, // Token semántico: 400
              color: colors.semantic.text.primary, // Token semántico: texto primario
              marginLeft: spacing[4], // Token semántico: 16px de espacio a la izquierda
              textAlign: 'right',
              lineHeight: typography.lineHeight.normal, // Token semántico: altura de línea normal
              marginTop: spacing[0], // Token semántico: 0px
              alignSelf: 'flex-start',
            }}
          >
            {formatMovementAmount(movement.amount, movement.currency, isBalanceVisible)}
          </div>
        </div>
      ))}
    </div>
  );
}
