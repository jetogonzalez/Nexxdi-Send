import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { formatBalance } from '../../lib/formatBalance';
import { VirtualCard } from './VirtualCard';
import { CurrencyCard } from './CurrencyCard';
import { CardDeck } from './CardDeck';
import { CurrencyChangeCard } from './CurrencyChangeCard';
import { RecentMovementsSection } from './RecentMovementsSection';

interface HomeViewProps {
  titleRef?: (el: HTMLElement | null) => void;
  scrollProgress?: number;
  isBalanceVisible?: boolean;
  usdBalance?: number;
  copBalance?: number;
}

export function HomeView({ titleRef, scrollProgress = 0, isBalanceVisible = true, usdBalance = 5678.90, copBalance = 1500000.50 }: HomeViewProps) {
  const title = 'Hola, Luis';
  
  // Calcular saldo total: sumar USD y convertir COP a USD (aproximadamente 1 USD = 4000 COP)
  // Para simplificar, mostraremos el total en USD sumando ambos valores
  // En producción, esto debería usar la tasa de cambio real
  const exchangeRate = 4000; // Tasa aproximada: 1 USD = 4000 COP
  const copInUsd = copBalance / exchangeRate;
  const totalBalance = usdBalance + copInUsd;
  
  // Valores para las cards de divisa/stablecoin
  const currencyBalanceUSD = usdBalance; // Valor de ejemplo para USD
  const currencyBalanceCOP = copBalance; // Valor de ejemplo para COP (peso colombiano)

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: spacing[4], // 16px
        paddingBottom: 0, // Sin padding inferior, se maneja en el contenedor padre
        backgroundColor: colors.semantic.background.main,
        overflowX: 'visible', // Permitir overflow horizontal para que las cards no se corten
        overflowY: 'visible',
      }}
    >
      <h1
        ref={(el) => {
          if (titleRef) titleRef(el);
        }}
        style={{
          fontSize: typography.sectionTitle.fontSize,
          fontWeight: typography.sectionTitle.fontWeight,
          lineHeight: typography.sectionTitle.lineHeight,
          color: typography.sectionTitle.color,
          fontFamily: typography.sectionTitle.fontFamily,
          marginBottom: spacing[6], // 1.5rem después del título (default para todas las páginas)
        }}
      >
        {title}
      </h1>
      
      {/* Label "Saldo total" */}
      <div
        style={{
          height: '24px',
          fontFamily: typography.fontFamily.sans.join(', '), // Manrope
          fontWeight: typography.fontWeight.normal, // 400
          fontSize: typography.fontSize.base, // 16px
          color: '#101828',
          lineHeight: '24px',
          marginBottom: 0, // Sin espacio entre label y saldo
        }}
      >
        Saldo total
      </div>
      
      {/* Balance principal */}
      <div
        style={{
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.bold,
          color: colors.semantic.text.primary,
          fontFamily: typography.fontFamily.sans.join(', '),
          marginTop: 0, // Sin espacio entre label y saldo
          marginBottom: spacing[6], // 1.5rem después del contenido
        }}
      >
        {formatBalance(totalBalance, isBalanceVisible)}
      </div>
      
      {/* Sección carddesk - Tarjetas apiladas con 56px de distancia */}
      {/* Orden: USD al frente, COP en medio, VISA atrás */}
      <CardDeck>
        <CurrencyCard 
          currency="USD"
          currencyName="Dólares"
          balance={currencyBalanceUSD}
          isBalanceVisible={isBalanceVisible}
          backgroundColor={colors.semantic.background.white}
        />
        <CurrencyCard 
          currency="COP"
          currencyName="Peso Colombiano"
          balance={currencyBalanceCOP}
          isBalanceVisible={isBalanceVisible}
          backgroundColor={colors.semantic.background.white}
        />
        <VirtualCard balance={totalBalance} isBalanceVisible={isBalanceVisible} />
      </CardDeck>
      
      {/* Card de cambio de moneda - Datos reales de API */}
      <CurrencyChangeCard
        currencyName="Peso colombiano"
        currencyCode="COP"
        vsCurrency="USD"
        timeFrame="hoy"
        autoUpdate={true}
        updateInterval={20} // Actualizar cada 20 segundos
      />
      
      {/* Sección Envíos frecuentes */}
      <div
        style={{
          width: '100vw', // Ancho completo de la ventana
          marginLeft: 'calc(-50vw + 50%)', // Extender hasta los bordes de la ventana
          paddingLeft: spacing[5], // 20px de padding izquierdo (igual que el margen del contenedor padre)
          paddingRight: spacing[5], // 20px de padding derecho
          overflowX: 'visible', // Permitir que las cards sobresalgan horizontalmente
          overflowY: 'visible',
          boxSizing: 'border-box',
        }}
      >
        {/* Header con título */}
        <h2
          style={{
            fontFamily: typography.fontFamily.sans.join(', '), // Manrope
            fontSize: typography.fontSize.xl, // 20px (1.25rem) - Tokenizado
            fontWeight: typography.fontWeight.bold, // 700 Bold
            lineHeight: typography.lineHeight.tight, // 1.25 - Tokenizado (mejor proporción para títulos)
            letterSpacing: '0%',
            color: '#101828', // Color del texto
            margin: 0,
            padding: 0,
            marginBottom: '1rem', // 1rem de espacio debajo del header
          }}
        >
          Envíos frecuentes
        </h2>
        
        {/* Cards con desplazamiento horizontal de derecha a izquierda */}
        <div
          style={{
            display: 'flex',
            gap: spacing[3], // 12px entre cards
            paddingLeft: spacing[5], // 20px de padding izquierdo para alinear con el contenido
            paddingRight: spacing[5], // 20px de padding derecho
            marginLeft: `-${spacing[5]}`, // Compensar el padding del padre para extender hacia la izquierda
            marginRight: `-${spacing[5]}`, // Compensar el padding del padre para extender hacia la derecha
            overflowX: 'auto', // Scroll horizontal habilitado
            overflowY: 'visible',
            flexWrap: 'nowrap', // Mantener todas las cards en una línea horizontal
            scrollbarWidth: 'none', // Ocultar scrollbar en Firefox
            msOverflowStyle: 'none', // Ocultar scrollbar en IE/Edge
            WebkitOverflowScrolling: 'touch', // Scroll suave en iOS
            width: 'calc(100% + 40px)', // Extender más allá del contenedor padre (20px + 20px)
            boxSizing: 'border-box',
          } as React.CSSProperties & {
            '&::-webkit-scrollbar'?: React.CSSProperties;
          }}
          className="hide-scrollbar"
        >
          {/* Card 1 - Olga María Castillo */}
          <div
            style={{
              minWidth: spacing.imageCircle, // 280px usando token
              height: spacing[20], // 80px usando token
              borderRadius: borderRadius.full, // Border radius completo (pill-shaped)
              backgroundColor: colors.semantic.background.white,
              padding: `${spacing[3]} ${spacing[6]}`, // 12px vertical, 24px horizontal
              border: 'none', // Sin borde
              boxShadow: 'none', // Sin sombras
              flexShrink: 0, // No encoger las cards
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3], // 12px entre elementos
              boxSizing: 'border-box',
            }}
          >
            {/* Icono circular */}
            <div
              style={{
                width: spacing[10], // 40px usando token
                height: spacing[10], // 40px usando token
                borderRadius: borderRadius.full,
                backgroundColor: 'rgba(0, 0, 0, 0.05)', // Fondo negro con 5% opacidad forzado
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  width: spacing[5], // 20px usando token
                  height: spacing[5], // 20px usando token
                }}
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke={colors.semantic.text.primary} // #101828 tokenizado
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            {/* Nombre */}
            <div
              style={{
                flex: 1,
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base, // 16px
                fontWeight: typography.fontWeight.normal, // Regular
                color: colors.semantic.text.contactName, // Color específico para nombres de contactos
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Olga Castillo
            </div>
            
            {/* Botón Enviar */}
            <button
              type="button"
              style={{
                padding: `${spacing[2]} ${spacing[4]}`, // 8px vertical, 16px horizontal
                borderRadius: borderRadius.full, // Completamente redondeado (pill-shaped)
                backgroundColor: colors.semantic.text.primary, // #101828 tokenizado
                color: colors.semantic.background.white,
                border: 'none',
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.xs, // 12px
                fontWeight: typography.fontWeight.bold,
                cursor: 'pointer',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Enviar
            </button>
          </div>
          
          {/* Card 2 - Ricardo Gonzalez */}
          <div
            style={{
              minWidth: spacing.imageCircle, // 280px usando token
              height: spacing[20], // 80px usando token
              borderRadius: borderRadius.full, // Border radius completo (pill-shaped)
              backgroundColor: colors.semantic.background.white,
              padding: `${spacing[3]} ${spacing[6]}`, // 12px vertical, 24px horizontal
              border: 'none', // Sin borde
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3], // 12px entre elementos
              boxSizing: 'border-box',
            }}
          >
            {/* Icono circular */}
            <div
              style={{
                width: spacing[10], // 40px usando token
                height: spacing[10], // 40px usando token
                borderRadius: borderRadius.full,
                backgroundColor: 'rgba(0, 0, 0, 0.05)', // Fondo negro con 5% opacidad forzado
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  width: spacing[5], // 20px usando token
                  height: spacing[5], // 20px usando token
                }}
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke={colors.semantic.text.primary} // #101828 tokenizado
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            {/* Nombre */}
            <div
              style={{
                flex: 1,
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.normal, // Regular
                color: '#080816',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Ricardo Gonzalez
            </div>
            
            {/* Botón Enviar */}
            <button
              type="button"
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                borderRadius: borderRadius.full, // Completamente redondeado (pill-shaped)
                backgroundColor: colors.semantic.text.primary,
                color: colors.semantic.background.white,
                border: 'none',
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.xs, // 12px
                fontWeight: typography.fontWeight.bold,
                cursor: 'pointer',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Enviar
            </button>
          </div>
          
          {/* Card 3 - Abigail Castillo */}
          <div
            style={{
              minWidth: spacing.imageCircle, // 280px usando token
              height: spacing[20], // 80px usando token
              borderRadius: borderRadius.full, // Border radius completo (pill-shaped)
              backgroundColor: colors.semantic.background.white,
              padding: `${spacing[3]} ${spacing[6]}`, // 12px vertical, 24px horizontal
              border: 'none', // Sin borde
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3], // 12px entre elementos
              boxSizing: 'border-box',
            }}
          >
            {/* Icono circular */}
            <div
              style={{
                width: spacing[10], // 40px usando token
                height: spacing[10], // 40px usando token
                borderRadius: borderRadius.full,
                backgroundColor: 'rgba(0, 0, 0, 0.05)', // Fondo negro con 5% opacidad forzado
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  width: spacing[5], // 20px usando token
                  height: spacing[5], // 20px usando token
                }}
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke={colors.semantic.text.primary} // #101828 tokenizado
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            {/* Nombre */}
            <div
              style={{
                flex: 1,
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.normal, // Regular
                color: '#080816',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Abigail Castillo
            </div>
            
            {/* Botón Enviar */}
            <button
              type="button"
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                borderRadius: borderRadius.full, // Completamente redondeado (pill-shaped)
                backgroundColor: colors.semantic.text.primary,
                color: colors.semantic.background.white,
                border: 'none',
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.xs, // 12px
                fontWeight: typography.fontWeight.bold,
                cursor: 'pointer',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Enviar
            </button>
          </div>
          
          {/* Card 4 - Lorena Velez */}
          <div
            style={{
              minWidth: spacing.imageCircle, // 280px usando token
              height: spacing[20], // 80px usando token
              borderRadius: borderRadius.full, // Border radius completo (pill-shaped)
              backgroundColor: colors.semantic.background.white,
              padding: `${spacing[3]} ${spacing[6]}`, // 12px vertical, 24px horizontal
              border: 'none', // Sin borde
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3], // 12px entre elementos
              boxSizing: 'border-box',
            }}
          >
            {/* Icono circular */}
            <div
              style={{
                width: spacing[10], // 40px usando token
                height: spacing[10], // 40px usando token
                borderRadius: borderRadius.full,
                backgroundColor: 'rgba(0, 0, 0, 0.05)', // Fondo negro con 5% opacidad forzado
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  width: spacing[5], // 20px usando token
                  height: spacing[5], // 20px usando token
                }}
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke={colors.semantic.text.primary} // #101828 tokenizado
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            {/* Nombre */}
            <div
              style={{
                flex: 1,
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.normal, // Regular
                color: '#080816',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Lorena Velez
            </div>
            
            {/* Botón Enviar */}
            <button
              type="button"
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                borderRadius: borderRadius.full, // Completamente redondeado (pill-shaped)
                backgroundColor: colors.semantic.text.primary,
                color: colors.semantic.background.white,
                border: 'none',
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.xs, // 12px
                fontWeight: typography.fontWeight.bold,
                cursor: 'pointer',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
      
      {/* Sección Últimos movimientos - Unión de wallet y tarjeta, ordenados cronológicamente */}
      <div
        style={{
          marginTop: spacing[5], // 20px de margin superior (igual que CardDeck)
          marginBottom: 0, // Sin margin inferior, el espaciado se maneja en el contenedor padre
        }}
      >
        <RecentMovementsSection 
          isBalanceVisible={isBalanceVisible} 
          maxItems={3} 
          filterBySource="wallet-and-card" 
        />
      </div>
    </div>
  );
}

