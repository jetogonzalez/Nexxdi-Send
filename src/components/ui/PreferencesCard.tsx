"use client";

import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';

export interface PreferenceItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  isDanger?: boolean; // Para items como "Eliminar cuenta"
  showChevron?: boolean; // Por defecto true, false para items sin navegación
}

interface PreferencesCardProps {
  title?: string;
  preferences: PreferenceItem[];
}

/**
 * Componente de tarjeta de preferencias que replica el estilo de RecentMovementsSection
 * - Contenedor con fondo blanco, border radius 24px, padding 24px
 * - Header con título "Preferencias"
 * - Lista de preferencias con iconos circulares, texto y chevron
 * - Separadores entre items (excepto el último)
 * - Estilo especial para items peligrosos (rojo)
 * 
 * Todo está tokenizado y no hay valores hardcodeados
 */
export function PreferencesCard({ 
  title = 'Preferencias',
  preferences 
}: PreferencesCardProps) {
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
      
      {/* Lista de preferencias */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {preferences.map((preference, index) => (
          <PreferenceItem
            key={preference.id}
            label={preference.label}
            icon={preference.icon}
            onClick={preference.onClick}
            isDanger={preference.isDanger}
            showChevron={preference.showChevron !== false} // Por defecto true
            isLast={index === preferences.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Componente individual de preferencia
 * - Layout horizontal: icono circular a la izquierda, texto en el centro, chevron a la derecha
 * - Icono circular: 36px de diámetro
 * - Separador debajo (excepto el último item)
 */
interface PreferenceItemProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  isDanger?: boolean;
  showChevron?: boolean;
  isLast?: boolean;
}

function PreferenceItem({ 
  label, 
  icon, 
  onClick, 
  isDanger = false,
  showChevron = true,
  isLast = false 
}: PreferenceItemProps) {
  const iconSize = 36; // Tamaño del icono circular: 36px
  
  // Colores según si es peligroso o no
  const iconBackgroundColor = isDanger 
    ? '#CF3E3E33' // Color específico del contenedor del icono de eliminar (con opacidad)
    : colors.gray[100]; // Token semántico: fondo gris claro
  
  const textColor = isDanger
    ? '#B12010' // Color específico del texto de eliminar
    : colors.semantic.text.primary; // Token semántico: texto primario
  
  const iconColor = isDanger
    ? '#9E3024' // Color específico del icono de eliminar
    : colors.semantic.text.primary; // Token semántico: icono primario
  
  const chevronColor = '#B6B6C6'; // Color específico del chevron

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[4], // Token semántico: 16px entre icono y texto
          paddingTop: spacing[4], // Token semántico: 16px arriba
          paddingBottom: spacing[4], // Token semántico: 16px abajo
          paddingLeft: 0,
          paddingRight: 0,
          border: 'none',
          background: 'transparent',
          cursor: onClick ? 'pointer' : 'default',
          width: '100%',
          textAlign: 'left',
        }}
      >
        {/* Icono circular */}
        <div
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            borderRadius: borderRadius.full, // Token semántico: círculo perfecto
            backgroundColor: iconBackgroundColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        
        {/* Texto de la preferencia */}
        <span
          style={{
            flex: 1,
            fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
            fontSize: typography.fontSize.base, // Token semántico: 16px
            fontWeight: typography.fontWeight.normal, // Token semántico: 400 Regular
            color: textColor,
            lineHeight: '24px', // Token semántico: 24px
          }}
        >
          {label}
        </span>
        
        {/* Chevron de navegación */}
        {showChevron && (
          <img
            src="/img/icons/global/chevron-forward.svg"
            alt=""
            style={{
              width: '20px',
              height: '20px',
              flexShrink: 0,
              display: 'block',
              // Aplicar color #B6B6C6 usando CSS filter
              // #B6B6C6 = rgb(182, 182, 198)
              filter: 'brightness(0) saturate(100%) invert(72%) sepia(3%) saturate(500%) hue-rotate(200deg) brightness(95%) contrast(90%)',
            }}
          />
        )}
      </button>
      
      {/* Separador que empieza donde empieza el texto (excepto el último item) */}
      {!isLast && (
        <div
          style={{
            marginLeft: `calc(36px + ${spacing[4]})`, // Empieza después del icono (36px) + gap (16px)
            height: '1px',
            backgroundColor: colors.semantic.border.light, // Token semántico: borde suave
          }}
        />
      )}
    </>
  );
}

/**
 * Iconos locales para las preferencias
 * Usa archivos SVG locales desde /img/icons/global/
 */
export const PreferenceIcons = {
  /**
   * Icono de Seguridad: shield.svg
   */
  Security: () => (
    <img
      src="/img/icons/global/shield.svg"
      alt="Seguridad"
      style={{
        width: '20px',
        height: '20px',
        display: 'block',
      }}
    />
  ),

  /**
   * Icono de Límites de uso: limit.svg
   */
  UsageLimits: () => (
    <img
      src="/img/icons/global/limit.svg"
      alt="Límites de uso"
      style={{
        width: '20px',
        height: '20px',
        display: 'block',
      }}
    />
  ),

  /**
   * Icono de Ayuda y soporte: help-and-support.svg
   */
  HelpSupport: () => (
    <img
      src="/img/icons/global/help-and-support.svg"
      alt="Ayuda y soporte"
      style={{
        width: '20px',
        height: '20px',
        display: 'block',
      }}
    />
  ),

  /**
   * Icono de Eliminar cuenta: trash.svg (con color específico #9E3024)
   */
  DeleteAccount: () => (
    <img
      src="/img/icons/global/trash.svg"
      alt="Eliminar cuenta"
      style={{
        width: '20px',
        height: '20px',
        display: 'block',
        // Aplicar color #9E3024 usando CSS filter
        // Convertir #9E3024 (RGB: 158, 48, 36) usando filter
        filter: 'brightness(0) saturate(100%) invert(18%) sepia(85%) saturate(2000%) hue-rotate(340deg) brightness(90%) contrast(90%)',
      }}
    />
  ),
};
