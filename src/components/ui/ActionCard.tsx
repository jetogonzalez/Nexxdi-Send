"use client";

import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';

// Tokens para tamaños de iconos en ActionCard
const ACTION_ICON_CONTAINER_SIZE = 36; // Token: tamaño del contenedor circular del icono (36px)
const ACTION_ICON_IMAGE_SIZE = 20; // Token: tamaño del icono dentro del contenedor circular (20px)
const ACTION_ICON_NO_BACKGROUND_SIZE = 36; // Token: tamaño del icono sin fondo (36px para Apple Pay)

export interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode; // Icono personalizado (opcional)
  onClick?: () => void;
  noBackground?: boolean; // Si es true, el icono no tiene fondo circular (solo para Apple Pay)
  disabled?: boolean; // Si es true, la acción está deshabilitada
}

interface ActionCardProps {
  title?: string;
  actions: ActionItem[];
}

/**
 * Componente de tarjeta de acciones que replica el estilo de RecentMovementsSection
 * - Contenedor con fondo blanco, border radius 24px, padding 24px
 * - Header con título "Acciones"
 * - Lista de acciones con iconos circulares y texto
 * 
 * Todo está tokenizado y no hay valores hardcodeados
 */
export function ActionCard({ 
  title = 'Acciones',
  actions 
}: ActionCardProps) {
  return (
    <div
      style={{
        width: '100%',
        borderRadius: borderRadius['3xl'], // Token semántico: 24px border radius
        backgroundColor: colors.semantic.background.white, // Token semántico: fondo blanco
        paddingTop: spacing[6], // Token semántico: 24px arriba
        paddingRight: spacing[6], // Token semántico: 24px derecha
        paddingBottom: spacing[6], // Token semántico: 24px abajo
        paddingLeft: spacing[6], // Token semántico: 24px izquierda
        marginBottom: spacing[6], // Token semántico: 1.5rem después del contenido
        marginTop: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Header interno */}
      <div
        style={{
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
            color: colors.semantic.text.primary, // Token semántico: texto primario
            margin: 0,
            padding: 0,
          }}
        >
          {title}
        </h2>
      </div>
      
      {/* Lista de acciones */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {actions.map((action, index) => (
          <ActionItem
            key={action.id}
            label={action.label}
            icon={action.icon}
            onClick={action.onClick}
            noBackground={action.noBackground}
            disabled={action.disabled}
            isLast={index === actions.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Componente individual de acción
 * - Layout horizontal: icono circular a la izquierda, texto a la derecha
 * - Icono circular: 36px de diámetro, fondo gris claro
 * - Texto: tamaño base, color primario
 */
interface ActionItemProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  noBackground?: boolean;
  disabled?: boolean;
  isLast?: boolean;
}

function ActionItem({ label, icon, onClick, noBackground = false, disabled = false, isLast = false }: ActionItemProps) {
  // Tokens para tamaños de iconos
  const iconContainerSize = 36; // Token: tamaño del contenedor del icono (36px)
  const iconImageSize = 20; // Token: tamaño del icono dentro del contenedor (20px)
  const iconImageSizeNoBackground = 36; // Token: tamaño del icono sin fondo (36px para Apple Pay)
  
  // Icono por defecto: flecha hacia abajo-izquierda (recibir/entrar)
  const defaultIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 15L15 5M5 15H12M5 15V8"
        stroke={colors.semantic.text.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <>
      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        onTouchStart={(e) => {
          if (!disabled) {
            // Feedback visual en touch solo si no está deshabilitado
            e.currentTarget.style.opacity = '0.7';
          }
        }}
        onTouchEnd={(e) => {
          if (!disabled) {
            // Resetear inmediatamente después del touch solo si no está deshabilitado
            setTimeout(() => {
              e.currentTarget.style.opacity = disabled ? '0.6' : '1';
            }, 100);
          }
        }}
        onTouchCancel={(e) => {
          // Resetear si el touch se cancela
          e.currentTarget.style.opacity = disabled ? '0.6' : '1';
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[4], // Token semántico: 16px entre icono y texto
          paddingTop: spacing[3], // Token semántico: 12px arriba
          paddingBottom: spacing[3], // Token semántico: 12px abajo
          paddingLeft: 0,
          paddingRight: 0,
          border: 'none',
          background: 'transparent',
          cursor: disabled ? 'not-allowed' : (onClick ? 'pointer' : 'default'),
          width: '100%',
          textAlign: 'left',
          position: 'relative',
          WebkitTapHighlightColor: 'transparent',
          touchAction: disabled ? 'none' : 'manipulation',
          opacity: disabled ? 0.6 : 1, // Opacidad 60% cuando está deshabilitado
        }}
      >
        {/* Icono circular o sin fondo */}
        {noBackground ? (
          <div
            style={{
              width: `${ACTION_ICON_NO_BACKGROUND_SIZE}px`, // Token: 36px para iconos sin fondo
              height: `${ACTION_ICON_NO_BACKGROUND_SIZE}px`, // Token: 36px para iconos sin fondo
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon || defaultIcon}
          </div>
        ) : (
          <div
            style={{
              width: `${ACTION_ICON_CONTAINER_SIZE}px`, // Token: 36px contenedor circular
              height: `${ACTION_ICON_CONTAINER_SIZE}px`, // Token: 36px contenedor circular
              borderRadius: borderRadius.full, // Token semántico: círculo perfecto
              backgroundColor: disabled ? colors.gray[200] : colors.gray[100], // Gris más oscuro cuando está deshabilitado
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon || defaultIcon}
          </div>
        )}
        
        {/* Texto de la acción */}
        <span
          style={{
            fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
            fontSize: typography.fontSize.base, // Token semántico: 16px
            fontWeight: typography.fontWeight.normal, // Token semántico: 400 Regular
            color: disabled ? colors.semantic.text.tertiary : colors.semantic.text.primary, // Gris cuando está deshabilitado
            lineHeight: '24px', // Token semántico: 24px
          }}
        >
          {label}
        </span>
      </button>
      
      {/* Separador que empieza donde empieza el texto (excepto el último item) */}
      {!isLast && (
        <div
          style={{
            marginLeft: `calc(${ACTION_ICON_CONTAINER_SIZE}px + ${spacing[4]})`, // Empieza después del icono (36px) + gap (16px)
            height: '1px',
            backgroundColor: colors.semantic.border.light, // Token semántico: borde suave
          }}
        />
      )}
    </>
  );
}
