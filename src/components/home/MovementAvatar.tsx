import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { useState, useEffect } from 'react';

interface MovementAvatarProps {
  /** URL del logo interno (20x20px) */
  logoUrl?: string;
  /** Nombre completo del contacto para generar iniciales */
  contactName?: string;
  /** URL de la imagen del contacto */
  imageUrl?: string;
  /** Badge a mostrar en la esquina (ej: "+", icono SVG, etc.) */
  badge?: React.ReactNode;
  /** URL del icono SVG para el badge (12x12px, color #101828, stroke 1px) */
  badgeIconUrl?: string;
  /** Estilo del badge: 'default' (fondo gris) o 'light' (fondo blanco con borde) */
  badgeStyle?: 'default' | 'light';
  /** Tamaño del avatar (por defecto 34px) */
  size?: number;
}

/**
 * Componente genérico para avatares de movimientos
 * - Contenedor: 34x34px con fondo negro al 5% de opacidad
 * - Logo interno: 20x20px
 * - Iniciales: Primer nombre + Primer apellido
 * - Imagen: Reemplaza el fondo cuando está disponible
 */
export function MovementAvatar({
  logoUrl,
  contactName,
  imageUrl,
  badge,
  badgeIconUrl,
  badgeStyle = 'default',
  size = 34,
}: MovementAvatarProps) {
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
  const hasImage = Boolean(imageUrl);
  const hasLogo = Boolean(logoUrl);
  const hasInitials = Boolean(contactName);
  
  // Tamaño del logo interno (20x20px según especificación)
  const logoSize = 20;
  
  // Tamaño de fuente para iniciales (ajustado proporcionalmente)
  const fontSize = size * 0.5; // Aproximadamente 17px para 34px

  // Contenedor principal de 40x40px que incluye avatar y badge
  const containerSize = 40;
  
  return (
    <div
      style={{
        width: `${containerSize}px`,
        height: `${containerSize}px`,
        position: 'relative',
        flexShrink: 0,
        marginRight: spacing[3], // 12px de espacio a la derecha
      }}
    >
      {/* Avatar principal */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: borderRadius.full,
          backgroundColor: hasImage 
            ? 'transparent' // Sin fondo cuando hay imagen
            : 'rgba(0, 0, 0, 0.05)', // Fondo negro al 5% de opacidad
          backgroundImage: hasImage ? `url(${imageUrl})` : undefined,
          backgroundSize: hasImage ? 'cover' : undefined,
          backgroundPosition: hasImage ? 'center' : undefined,
          backgroundRepeat: hasImage ? 'no-repeat' : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden', // Para que la imagen no sobresalga
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {/* Contenido principal */}
        {hasImage ? (
          // Si hay imagen, solo mostrar la imagen (el fondo ya está configurado)
          null
        ) : hasLogo ? (
          // Mostrar logo interno (20x20px)
          <img
            src={logoUrl}
            alt=""
            style={{
              width: `${logoSize}px`,
              height: `${logoSize}px`,
              display: 'block',
              objectFit: 'contain',
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

      {/* Badge fuera del avatar, alineado a la derecha y abajo */}
      {(badge || badgeIconUrl) && (
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: borderRadius.full,
            backgroundColor: '#F0EFF8',
            border: `1px solid ${colors.semantic.background.white}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        >
          {badgeIconUrl ? (
            // Renderizar icono SVG con tamaño y color correctos (12x12px, #101828, stroke 1px)
            <img
              src={badgeIconUrl}
              alt=""
              style={{
                width: '12px',
                height: '12px',
                display: 'block',
                filter: 'brightness(0) saturate(100%) invert(8%) sepia(8%) saturate(1234%) hue-rotate(177deg) brightness(95%) contrast(95%)', // Convertir a #101828
              }}
            />
          ) : typeof badge === 'string' ? (
            <span style={{ fontSize: '10px', color: colors.semantic.text.primary }}>
              {badge}
            </span>
          ) : (
            badge
          )}
        </div>
      )}
    </div>
  );
}
