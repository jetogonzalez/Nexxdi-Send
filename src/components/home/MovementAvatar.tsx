"use client";

import { useState } from 'react';
import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';

interface MovementAvatarProps {
  /** URL del logo interno (18x18px) */
  logoUrl?: string;
  /** Nombre completo del contacto para generar iniciales */
  contactName?: string;
  /** URL de la imagen del contacto */
  imageUrl?: string;
  /** Tamaño del avatar (por defecto 40px) */
  size?: number;
  /** Color del borde doble (ej: #7DBE42 para Carulla) */
  borderColor?: string;
}

/**
 * Componente genérico para avatares de movimientos
 * - Avatar: 40x40px con fondo negro al 5% de opacidad
 * - Logo interno: 18x18px
 * - Iniciales: Primer nombre
 * - Imagen: Reemplaza el fondo cuando está disponible
 */
export function MovementAvatar({
  logoUrl,
  contactName,
  imageUrl,
  size = 40,
  borderColor,
}: MovementAvatarProps) {
  const [logoError, setLogoError] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generar iniciales desde el nombre completo (solo primer nombre)
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '';
    
    // Solo usar el primer nombre
    const firstName = parts[0];
    const firstInitial = firstName.charAt(0).toUpperCase();
    
    return firstInitial;
  };

  // Determinar el contenido a mostrar
  const hasImage = Boolean(imageUrl) && !imageError;
  const hasLogo = Boolean(logoUrl) && !logoError;
  const hasInitials = Boolean(contactName);
  
  // Tamaño del logo interno (18x18px para iconos más pequeños)
  const logoSize = 18;
  
  // Tamaño de fuente para iniciales (ajustado proporcionalmente)
  const fontSize = size * 0.5; // Aproximadamente 20px para 40px

  // Avatar ocupa todo el espacio de 40x40px
  const containerSize = size;
  
  // Tamaños de las capas concéntricas cuando hay borderColor
  // Capa 3 (exterior): fondo default - 40px
  // Capa 2 (media): color del anillo (#7DBE42) - 40px (mismo tamaño que el exterior)
  // Capa 1 (interior): logo - 24px
  const outerSize = size; // 40px - Capa exterior (fondo default)
  const middleSize = borderColor ? size : size; // 40px - Capa media (color del anillo) - mismo tamaño que exterior
  const innerSize = logoSize; // 18px - Capa interior (logo)

  return (
    <div
      style={{
        width: `${containerSize}px`,
        height: `${containerSize}px`,
        position: 'relative',
        flexShrink: 0,
        marginRight: spacing[4], // 16px de espacio a la derecha (12px + 4px adicional)
        border: 'none', // Sin borde
      }}
    >
      {/* Capa 3 (exterior): Fondo default */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${outerSize}px`,
          height: `${outerSize}px`,
          borderRadius: borderRadius.full,
          border: 'none', // Sin borde
          backgroundColor: hasImage 
            ? 'transparent' // Sin fondo cuando hay imagen
            : 'rgba(0, 0, 0, 0.05)', // Fondo negro al 5% de opacidad
          backgroundImage: hasImage ? `url(${imageUrl})` : undefined,
          backgroundSize: hasImage ? 'cover' : undefined,
          backgroundPosition: hasImage ? 'center' : undefined,
          backgroundRepeat: hasImage ? 'no-repeat' : undefined,
          zIndex: 1,
        }}
      />

      {/* Capa 2 (media): Color del anillo (#7DBE42, #141414, #ffffff) */}
      {borderColor && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${middleSize}px`,
            height: `${middleSize}px`,
            borderRadius: borderRadius.full,
            // Si el fondo es blanco, agregar borde de 1px más claro (nivel 300)
            border: borderColor.toLowerCase() === '#ffffff' || borderColor.toLowerCase() === '#fff' || borderColor.toLowerCase() === 'white'
              ? `1px solid ${colors.gray[300]}` // Borde claro (nivel 300) - sutil para fondo blanco
              : 'none',
            backgroundColor: borderColor,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Capa 1 (interior): Logo */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${innerSize}px`,
          height: `${innerSize}px`,
          borderRadius: borderRadius.full,
          border: 'none', // Sin borde
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 3,
          backgroundColor: borderColor ? 'transparent' : undefined, // Transparente cuando hay anillo de color
        }}
      >
        {/* Contenido del logo */}
        {hasImage ? (
          // Si hay imagen, solo mostrar la imagen (el fondo ya está configurado en la capa exterior)
          null
        ) : hasLogo ? (
          // Mostrar logo interno (24x24px)
          <img
            src={logoUrl}
            alt=""
            style={{
              width: `${innerSize}px`,
              height: `${innerSize}px`,
              display: 'block',
              objectFit: 'contain',
              border: 'none', // Sin borde
            }}
            onError={(e) => {
              console.error('Error loading logo:', logoUrl, e);
              setLogoError(true);
            }}
            onLoad={() => {
              console.log('Logo loaded successfully:', logoUrl);
              setLogoError(false);
            }}
          />
        ) : hasInitials ? (
          // Mostrar iniciales
          <span
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: typography.fontWeight.semibold,
              color: colors.semantic.text.primary,
              fontFamily: typography.fontFamily.sans.join(', '),
              lineHeight: 1,
              textAlign: 'center',
            }}
          >
            {getInitials(contactName!)}
          </span>
        ) : (
          // Fallback: mostrar un placeholder
          <span
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.secondary,
              fontFamily: typography.fontFamily.sans.join(', '),
            }}
          >
            ?
          </span>
        )}
      </div>

    </div>
  );
}
