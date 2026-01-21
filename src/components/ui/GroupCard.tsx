"use client";

import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { currentUser } from '../../config/userProfile';
import { formatCurrency } from '../../lib/formatBalance';
import { CircularProgress } from './CircularProgress';
import { MovementAvatar } from '../home/MovementAvatar';

export interface AvatarData {
  /** URL de la imagen del avatar */
  imageUrl?: string;
  /** Nombre del contacto para generar iniciales */
  contactName?: string;
  /** URL del logo (si aplica) */
  logoUrl?: string;
}

interface GroupCardProps {
  /** Título de la tarjeta (ej: "Grupos") */
  title: string;
  /** Monto del grupo */
  amount: number;
  /** Moneda (default: "USD") */
  currency?: string;
  /** Nombre del grupo (ej: "Viaje al Config - SF") */
  groupName: string;
  /** Valor del progreso (0-100) */
  progress: number;
  /** Array de avatares a mostrar */
  avatars?: AvatarData[];
  /** Si el balance es visible */
  isBalanceVisible?: boolean;
}

/**
 * Componente reutilizable de tarjeta de grupo
 * - Layout horizontal: texto a la izquierda, progreso circular con avatares a la derecha
 * - Todo tokenizado: spacing, typography, colors, borderRadius
 * - Progreso animado desde 0% hasta el valor objetivo
 */
export function GroupCard({
  title,
  amount,
  currency = 'USD',
  groupName,
  progress,
  avatars = [],
  isBalanceVisible = true,
}: GroupCardProps) {
  // Avatares por defecto: Juan Robledo (izquierda/arriba) y usuario actual (derecha/abajo, superpuesto)
  const defaultAvatars: AvatarData[] = [
    {
      contactName: 'Juan Robledo',
      imageUrl: '/img/user/juan-robledo.png', // Avatar izquierda/arriba (base)
    },
    {
      contactName: currentUser.firstName,
      imageUrl: currentUser.photo, // Avatar del usuario actual (derecha/abajo, superpuesto sobre el otro)
    },
  ];

  const displayAvatars = avatars.length > 0 ? avatars : defaultAvatars;

  // Formatear el monto
  const formattedAmount = isBalanceVisible
    ? formatCurrency(amount, currency, false) // Solo el número formateado
    : '•••';

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
          {title}
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
              {currency}
            </span>
          )}
        </div>

        {/* Nombre del grupo */}
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
          {groupName}
        </div>
      </div>

      {/* Sección derecha: Progreso circular con avatares */}
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
          {/* Contenedor de avatares: 36x36px fijo, sin padding/margin/spacing */}
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
            {/* Avatar 1: Fernando - bottom-right con borde circular */}
            <div
              style={{
                position: 'absolute',
                bottom: '0', // Posicionado en bottom
                right: '0', // Posicionado en right
                width: '24px', // Tamaño fijo: 24px x 24px
                height: '24px', // Tamaño fijo: 24px x 24px
                borderRadius: borderRadius.full, // Círculo completo
                overflow: 'hidden', // Clip a círculo
                outline: `2px solid ${colors.semantic.background.white}`, // Borde circular de 2px fuera del avatar (tokenizado)
                outlineOffset: '0', // Sin offset, borde justo fuera
                zIndex: 2, // Fernando siempre adelante
              }}
            >
              {displayAvatars[1]?.imageUrl ? (
                <img
                  src={displayAvatars[1].imageUrl}
                  alt={displayAvatars[1].contactName || ''}
                  style={{
                    width: '40px', // Área de cover: 40px
                    height: '40px', // Área de cover: 40px
                    objectFit: 'cover', // Cover behavior
                    objectPosition: 'center', // Centrado
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)', // Centrado perfecto
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: typography.fontFamily.sans.join(', '),
                    fontSize: typography.fontSize.sm,
                    color: colors.semantic.text.primary,
                  }}
                >
                  {displayAvatars[1]?.contactName?.charAt(0).toUpperCase() || 'F'}
                </div>
              )}
            </div>

            {/* Avatar 2: Segundo usuario - top-left */}
            <div
              style={{
                position: 'absolute',
                top: '0', // Posicionado en top
                left: '0', // Posicionado en left
                width: '24px', // Tamaño fijo: 24px x 24px
                height: '24px', // Tamaño fijo: 24px x 24px
                borderRadius: borderRadius.full, // Círculo completo
                overflow: 'hidden', // Clip a círculo
                zIndex: 1, // Segundo usuario detrás
              }}
            >
              {displayAvatars[0]?.imageUrl ? (
                <img
                  src={displayAvatars[0].imageUrl}
                  alt={displayAvatars[0].contactName || ''}
                  style={{
                    width: '40px', // Área de cover: 40px
                    height: '40px', // Área de cover: 40px
                    objectFit: 'cover', // Cover behavior
                    objectPosition: 'center', // Centrado
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)', // Centrado perfecto
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: typography.fontFamily.sans.join(', '),
                    fontSize: typography.fontSize.sm,
                    color: colors.semantic.text.primary,
                  }}
                >
                  {displayAvatars[0]?.contactName?.charAt(0).toUpperCase() || 'J'}
                </div>
              )}
            </div>
          </div>
        </CircularProgress>
      </div>
    </div>
  );
}
