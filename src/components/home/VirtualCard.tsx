import { useState, useEffect } from 'react';
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
  // Inicializar siempre como false para evitar diferencias entre servidor y cliente
  const [isLocked, setIsLocked] = useState<boolean>(false);
  
  // Cargar el estado desde localStorage solo en el cliente después del mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLockState = localStorage.getItem('cardLocked');
      if (savedLockState === 'true') {
        setIsLocked(true);
      }
    }
  }, []);

  // Escuchar cambios en localStorage para sincronizar entre componentes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cardLocked') {
        setIsLocked(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También verificar periódicamente por si el cambio viene del mismo tab
    const interval = setInterval(() => {
      const savedLockState = localStorage.getItem('cardLocked');
      setIsLocked(savedLockState === 'true');
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Determinar si el fondo es oscuro o claro para el color del texto
  // El color principal #3A29E9 es oscuro, así que el texto debe ser claro (blanco)
  const isDarkBackground = true; // El morado es oscuro
  const textColor = isDarkBackground ? colors.semantic.background.white : colors.semantic.text.primary;

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
          backgroundImage: 'url(/img/icons/cards/card-thumb-default-3x.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: 0,
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
        
        {/* Header de la card - Logo de Visa */}
        <div
          style={{
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'absolute',
            top: isFront ? spacing[6] : `calc(${spacing[1]} + ${spacing[3]})`, // 24px al frente, 16px detrás (4px + 12px)
            left: spacing[6], // 24px desde el borde izquierdo
            zIndex: 2,
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
        </div>
        
        {/* Botón de icono dots - Siempre visible en posición superior derecha */}
        <button
          type="button"
          style={{
            position: 'absolute',
            top: isFront ? spacing[6] : `calc(${spacing[1]} + ${spacing[3]})`, // 24px al frente, 16px detrás
            right: spacing[6], // 24px desde el borde derecho
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
            zIndex: 15, // Encima del overlay cuando está bloqueada
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
        
        {/* Overlay negro con opacidad 40% cuando la tarjeta está bloqueada */}
        {isLocked && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: borderRadius['3xl'], // 24px
              backgroundColor: 'rgba(0, 0, 0, 0.4)', // Negro con 40% de opacidad
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
        )}

        {/* Contenedor central cuando está bloqueada */}
        {isLocked && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[2], // 8px entre icono y texto (reducido de 12px)
              zIndex: 10,
            }}
          >
            {/* Icono de lock */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: borderRadius.full,
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo blanco con 70% opacidad
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none', // Sin sombra
              }}
            >
              <img
                src="/img/icons/global/lock.svg"
                alt="Tarjeta bloqueada"
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'block',
                  filter: 'none', // Color negro (sin filtro)
                }}
              />
            </div>
            {/* Texto "Tarjeta bloqueada" - Primera letra en mayúscula */}
            <span
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.sm, // 14px
                fontWeight: typography.fontWeight.bold, // 700 Bold (aumentado de medium a bold)
                color: colors.semantic.background.white,
                textAlign: 'center',
              }}
            >
              Tarjeta bloqueada
            </span>
          </div>
        )}

        {/* Balance dentro de la card - alineado a la izquierda - Solo se muestra si NO está bloqueada */}
        {balance !== undefined && !isLocked && (
          <div
            style={{
              position: 'absolute',
              bottom: spacing[6], // 24px desde el borde inferior
              left: spacing[6], // 24px desde el borde izquierdo (alineado a la izquierda)
              fontFamily: typography.fontFamily.sans.join(', '), // Manrope
              fontWeight: typography.fontWeight.bold, // Bold
              fontSize: '32px', // 32px
              lineHeight: '32px', // 32px
              letterSpacing: '-0.04em', // -4% convertido a em
              color: textColor, // Color inteligente según el fondo (blanco para fondo oscuro)
              textAlign: 'left',
              zIndex: 1,
              display: 'flex',
              alignItems: 'baseline',
              gap: spacing[1], // 4px entre número y moneda
            }}
          >
            {isBalanceVisible ? (
              <>
                <span>{formatBalance(balance, isBalanceVisible).replace(' USD', '')}</span>
                <span
                  style={{
                    fontSize: typography.fontSize.sm, // Token semántico: 14px (más pequeño que el monto)
                    fontWeight: typography.fontWeight.bold, // Token semántico: 700 Bold
                    fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
                    color: textColor, // Mismo color que el monto
                  }}
                >
                  USD
                </span>
              </>
            ) : (
              <span>•••</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
