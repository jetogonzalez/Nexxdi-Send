"use client";

import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';

interface InfoBannerProps {
  title: string;
  description: string;
}

export function InfoBanner({ title, description }: InfoBannerProps) {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'rgb(110 147 221 / 12%)', // Background color especificado
        border: '1px solid rgb(110 147 221 / 20%)', // Borde con mismo color pero 20% opacidad
        borderRadius: '24px', // Border radius de 24px
        paddingTop: spacing[6], // 24px
        paddingBottom: spacing[6], // 24px
        paddingLeft: spacing[6], // 24px
        paddingRight: spacing[6], // 24px
        marginBottom: spacing[4], // 16px de espacio inferior
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing[4], // 16px entre icono y contenido de texto
      }}
    >
      {/* Contenedor del icono - full rounded con fondo negro 5% opacidad */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: borderRadius.full, // Full rounded
          backgroundColor: 'rgba(0, 0, 0, 0.05)', // Fondo negro con 5% opacidad
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0, // No se encoge
        }}
      >
        {/* Icono de información - usando lock como placeholder, ajustar según icono disponible */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
            stroke={colors.semantic.text.primary}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 14V10"
            stroke={colors.semantic.text.primary}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 6H10.01"
            stroke={colors.semantic.text.primary}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Contenido de texto */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[1], // 4px entre título y descripción
          flex: 1, // Ocupa el resto del espacio
        }}
      >
        {/* Título */}
        <h3
          style={{
            fontFamily: typography.fontFamily.sans.join(', '),
            fontSize: typography.fontSize.base, // 16px
            fontWeight: typography.fontWeight.semibold, // 600
            color: colors.semantic.text.primary, // Color negro token
            margin: 0,
            lineHeight: '24px',
          }}
        >
          {title}
        </h3>
        {/* Descripción */}
        <p
          style={{
            fontFamily: typography.fontFamily.sans.join(', '),
            fontSize: typography.fontSize.sm, // 14px
            fontWeight: typography.fontWeight.normal, // 400
            color: colors.semantic.text.primary, // Color negro token
            margin: 0,
            lineHeight: '20px',
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
