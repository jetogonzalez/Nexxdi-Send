import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { formatCurrency } from '../../lib/formatBalance';

interface CurrencyCardProps {
  currency?: string; // Código de la divisa (USD, USDT, USDC, etc.)
  currencyName?: string; // Nombre completo de la divisa
  balance?: number;
  isBalanceVisible?: boolean;
  logoUrl?: string; // URL del logo de la divisa/stablecoin
  backgroundColor?: string; // Color de fondo personalizado (opcional)
  isFront?: boolean; // Si la tarjeta está al frente del deck
  isMiddle?: boolean; // Si la tarjeta está en la mitad (segunda posición)
  isBack?: boolean; // Si la tarjeta está atrás (tercera posición)
  isPreviousCardLight?: boolean; // Si la tarjeta anterior es CurrencyCard clara/blanca
  isNextCardLight?: boolean; // Si la tarjeta siguiente es CurrencyCard clara/blanca
}

/**
 * Card de divisa/stablecoin
 * Alto: 136px
 * Ancho: depende del ancho de la pantalla
 * Border radius: 24px (3xl)
 * Fondo personalizable según la divisa/stablecoin
 * Balance con color inteligente según el fondo
 * Incluye: Logo de la divisa (superior izquierda), Botón de opciones (superior derecha), Balance (inferior izquierda)
 */
export function CurrencyCard({ 
  currency = 'USD', 
  currencyName,
  balance, 
  isBalanceVisible = true,
  logoUrl,
  backgroundColor,
  isFront = true,
  isMiddle = false,
  isBack = false,
  isPreviousCardLight = false,
  isNextCardLight = false
}: CurrencyCardProps) {
  // Determinar color de fondo (por defecto usar el color principal si no se especifica)
  const cardBackgroundColor = backgroundColor || colors.primary.main;
  
  // Determinar si el fondo es oscuro o claro para el color del texto
  // Si el fondo es blanco, el texto debe ser oscuro
  const isDarkBackground = backgroundColor === colors.semantic.background.white ? false : true;
  const textColor = isDarkBackground ? colors.semantic.background.white : colors.semantic.text.primary;
  
  
  // Mapear código de moneda a la bandera correspondiente
  const getFlagUrl = (currencyCode: string): string => {
    const flagMap: Record<string, string> = {
      'USD': '/img/icons/global/currency-us.svg',
      'COP': '/img/icons/global/currency-co.svg',
      'MXN': '/img/icons/global/currency-mx.svg', // Asumiendo que existe
      // Agregar más mapeos según sea necesario
    };
    return flagMap[currencyCode] || '/img/icons/global/currency-us.svg'; // Default a USA
  };
  
  const flagUrl = getFlagUrl(currency);

  // Padding superior del header: 12px cuando está detrás, 24px cuando está al frente
  const headerTopPadding = isFront ? spacing[6] : spacing[3]; // 24px al frente, 12px detrás

  // Margin bottom para la tarjeta principal (al frente) y las demás
  const cardMarginBottom = isFront ? spacing[5] : spacing[6]; // 20px al frente, 24px detrás

  return (
    <div
      style={{
        width: '100%',
        height: '136px',
        borderRadius: borderRadius['3xl'], // 24px
        marginBottom: cardMarginBottom, // Reducido para tarjeta principal
        backgroundColor: cardBackgroundColor,
        padding: spacing[6], // 24px de padding en todos los lados
        paddingTop: headerTopPadding, // Dinámico según posición: 24px al frente, 12px detrás
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        // Borde más visible de 1px para mejor diferenciación de las tarjetas de currency
        border: `1px solid rgba(0, 0, 0, 0.10)`, // Opacidad del 10% para mejor visibilidad
      }}
      role="img"
      aria-label={`Card de ${currencyName || currency}`}
    >
        {/* Segundo gradiente con blend mode soft-light */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: borderRadius['3xl'],
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.12))',
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        
        {/* Header de la card */}
        <div
          style={{
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Bandera y código de moneda alineados a la izquierda */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2], // 8px entre la bandera y el texto
            }}
          >
            {/* Bandera */}
            <img
              src={flagUrl}
              alt={`Bandera ${currency}`}
              style={{
                width: '24px',
                height: '24px',
                display: 'block',
              }}
            />
            {/* Código de moneda */}
            <span
              style={{
                fontFamily: typography.currencyCode.fontFamily,
                fontWeight: typography.currencyCode.fontWeight,
                fontSize: '16px', // 14px + 2px = 16px
                lineHeight: typography.currencyCode.lineHeight,
                letterSpacing: typography.currencyCode.letterSpacing,
                color: textColor,
                textAlign: 'center',
              }}
            >
              {currency}
            </span>
          </div>
          
          {/* Botón de icono dots a la derecha */}
          <button
            type="button"
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '28px',
              height: '28px',
              borderRadius: borderRadius.full,
              backgroundColor: isDarkBackground 
                ? 'rgba(255, 255, 255, 0.05)' // Blanco con 5% opacidad para fondo oscuro
                : 'rgba(0, 0, 0, 0.05)', // Negro con 5% opacidad para fondo claro
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkBackground 
                ? 'rgba(255, 255, 255, 0.15)' // Blanco con 15% opacidad en hover para fondo oscuro
                : 'rgba(0, 0, 0, 0.15)'; // Negro con 15% opacidad en hover para fondo claro
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDarkBackground 
                ? 'rgba(255, 255, 255, 0.05)' // Blanco con 5% opacidad para fondo oscuro
                : 'rgba(0, 0, 0, 0.05)'; // Negro con 5% opacidad para fondo claro
            }}
            aria-label="Más opciones"
          >
            <img
              src="/img/icons/global/icon-dots.svg"
              alt="Más opciones"
              style={{
                width: '16px',
                height: '16px',
                filter: isDarkBackground ? 'brightness(0) invert(1)' : 'none', // Convertir el icono a blanco solo si el fondo es oscuro
                display: 'block',
              }}
            />
          </button>
        </div>
        
        {/* Balance dentro de la card - sin mostrar USD, solo el valor - alineado a la izquierda */}
        {balance !== undefined && (
          <div
            style={{
              position: 'absolute',
              bottom: spacing[6], // 24px desde el borde inferior
              left: spacing[6], // 24px desde el borde izquierdo
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
            {isBalanceVisible 
              ? formatCurrency(balance, currency, false) // Solo el valor, sin moneda
              : '•••' // Solo los puntos cuando está oculto
            }
          </div>
        )}
        
    </div>
  );
}
