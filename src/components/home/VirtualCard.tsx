import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { formatBalance } from '../../lib/formatBalance';

interface VirtualCardProps {
  imageSrc?: string;
  balance?: number;
  isBalanceVisible?: boolean;
  isFront?: boolean; // Si la tarjeta está al frente del deck
  isMiddle?: boolean; // Si la tarjeta está en la mitad (segunda posición)
  isBack?: boolean; // Si la tarjeta está atrás (tercera posición)
}

/**
 * Card de tarjeta virtual
 * Alto: 136px
 * Ancho: depende del ancho de la pantalla
 * Border radius: 24px (3xl)
 * Fondo con color principal de la marca (morado)
 * Balance con color inteligente según el fondo
 */
export function VirtualCard({ 
  imageSrc, 
  balance, 
  isBalanceVisible = true,
  isFront = true,
  isMiddle = false,
  isBack = false
}: VirtualCardProps) {
  // Determinar si el fondo es oscuro o claro para el color del texto
  // El color principal #3A29E9 es oscuro, así que el texto debe ser claro (blanco)
  const isDarkBackground = true; // El morado es oscuro
  const textColor = isDarkBackground ? colors.semantic.background.white : colors.semantic.text.primary;

  // Padding superior del contenedor: 0 cuando está al frente (el header tiene margin-top), 12px cuando está detrás
  const containerTopPadding = isFront ? 0 : spacing[3]; // 0 al frente, 12px detrás
  
  // Padding superior del header: 24px cuando está al frente, 12px cuando está en medio o atrás
  const headerTopPadding = isFront ? spacing[6] : spacing[3]; // 24px al frente, 12px detrás

  return (
    <div
      style={{
        width: '100%',
        height: '136px',
        borderRadius: borderRadius['3xl'], // 24px
        marginBottom: spacing[6], // 24px de margin después de la card
        position: 'relative',
        boxSizing: 'border-box',
      }}
      role="img"
      aria-label="Tarjeta Virtual"
    >
      {/* Contenedor interno con el fondo y contenido */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: borderRadius['3xl'], // 24px (sin ajuste porque no hay borde)
          backgroundColor: colors.primary.main, // Color principal morado de la marca
          paddingTop: containerTopPadding, // 0 al frente (header tiene padding-top), 12px detrás
          paddingBottom: spacing[6], // 24px de padding inferior
          paddingLeft: spacing[6], // 24px de padding izquierdo
          paddingRight: spacing[6], // 24px de padding derecho
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Segundo gradiente con blend mode soft-light */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: borderRadius['3xl'], // 24px (sin ajuste porque no hay borde)
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.12))',
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
          }}
        />
        
        {/* Header de la card - Logo de Visa y botón de icono */}
        <div
          style={{
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 2,
            paddingTop: headerTopPadding, // Dinámico: 24px al frente, 12px en medio o atrás
          }}
        >
          {/* Logo de Visa a la izquierda */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src="/img/icons/payment/logo-visa.svg"
              alt="Visa"
              style={{
                height: '16px', // 16px de alto
                width: 'auto',
                display: 'block',
              }}
            />
          </div>
          
          {/* Botón de icono dots a la derecha */}
          <button
            type="button"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: borderRadius.full,
              backgroundColor: colors.semantic.background.cardButtonIcon, // Tokenizado: blanco con 15% de opacidad
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.background.cardButtonIconHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.background.cardButtonIcon;
            }}
            aria-label="Más opciones"
          >
            <img
              src="/img/icons/global/icon-dots.svg"
              alt="Más opciones"
              style={{
                width: '16px',
                height: '16px',
                filter: 'brightness(0) invert(1)', // Convertir el icono a blanco
                display: 'block',
              }}
            />
          </button>
        </div>
        
        {/* Balance dentro de la card - alineado a la izquierda */}
        {balance !== undefined && (
          <div
            style={{
              position: 'absolute',
              bottom: spacing[6], // 24px desde el borde inferior (padding incluido)
              left: spacing[6], // 24px desde el borde izquierdo (alineado a la izquierda)
              fontFamily: typography.fontFamily.sans.join(', '), // Manrope
              fontWeight: typography.fontWeight.bold, // Bold
              fontSize: '32px', // 32px
              lineHeight: '32px', // 32px
              letterSpacing: '-0.04em', // -4% convertido a em
              color: textColor, // Color inteligente según el fondo (blanco para fondo oscuro)
              textAlign: 'left',
              zIndex: 1,
            }}
          >
            {formatBalance(balance, isBalanceVisible)}
          </div>
        )}
      </div>
    </div>
  );
}
