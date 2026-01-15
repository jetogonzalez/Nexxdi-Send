import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { formatBalance } from '../../lib/formatBalance';
import { VirtualCard } from './VirtualCard';
import { CurrencyCard } from './CurrencyCard';
import { CardDeck } from './CardDeck';
import { CurrencyChangeCard } from './CurrencyChangeCard';

interface HomeViewProps {
  titleRef?: (el: HTMLElement | null) => void;
  scrollProgress?: number;
  isBalanceVisible?: boolean;
}

export function HomeView({ titleRef, scrollProgress = 0, isBalanceVisible = true }: HomeViewProps) {
  const title = 'Hola, Luis';
  const balance = 2344.02;
  // Valores para las cards de divisa/stablecoin
  const currencyBalanceUSD = 5678.90; // Valor de ejemplo para USD
  const currencyBalanceCOP = 1500000.50; // Valor de ejemplo para COP (peso colombiano)

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
          marginBottom: spacing[10], // 40px de distancia entre Luis y la card
        }}
      >
        {title}
      </h1>
      
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
        <VirtualCard balance={balance} isBalanceVisible={isBalanceVisible} />
      </CardDeck>
      
      {/* Card de cambio de moneda - Datos reales de API */}
      <CurrencyChangeCard
        currencyName="Peso colombiano"
        currencyCode="COP"
        vsCurrency="USD"
        timeFrame="hoy"
        autoUpdate={true}
        updateInterval={1} // Actualizar cada 1 minuto para tiempo real
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
            fontSize: typography.fontSize.lg, // 18px (1.125rem)
            fontWeight: typography.fontWeight.bold, // 700 Bold
            lineHeight: '24px', // 24px
            letterSpacing: '0%',
            height: '24px', // Altura del header: 24px
            color: '#101828', // Color del texto
            margin: 0,
            padding: 0,
            marginBottom: spacing[4], // 16px de espacio debajo del header
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
              Olga María Castillo
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
          
          {/* Card 4 - Laura Sarmiento */}
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
      
      {/* Sección Últimos movimientos */}
      <div
        style={{
          width: '100%',
          borderRadius: borderRadius['3xl'], // 24px
          backgroundColor: colors.semantic.background.white, // Blanco tokenizado
          paddingTop: spacing[6], // 24px arriba
          paddingRight: spacing[6], // 24px derecha
          paddingBottom: spacing[4], // 16px abajo
          paddingLeft: spacing[6], // 24px izquierda
          marginTop: spacing[5], // 20px de margin superior (igual que CardDeck)
          marginBottom: 0, // Sin margin inferior, el espaciado se maneja en el contenedor padre
          boxSizing: 'border-box',
        }}
      >
        {/* Header interno */}
        <div
          style={{
            height: spacing[8], // 32px
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing[6], // 24px de espacio debajo del header
          }}
        >
          {/* Título */}
          <h2
            style={{
              fontFamily: typography.fontFamily.sans.join(', '), // Manrope
              fontSize: typography.fontSize.lg, // 18px (igual que "Envíos frecuentes")
              fontWeight: typography.fontWeight.bold, // 700 Bold
              lineHeight: '24px', // 24px
              letterSpacing: '0%',
              color: colors.semantic.text.primary, // #101828 (igual que "Envíos frecuentes")
              margin: 0,
              padding: 0,
            }}
          >
            Últimos movimientos
          </h2>
          
          {/* Botón Ver todo */}
          <button
            type="button"
            style={{
              padding: `${spacing[2]} ${spacing[4]}`, // 8px vertical, 16px horizontal (igual que botón Enviar)
              borderRadius: borderRadius.full, // Full rounded
              backgroundColor: 'rgba(0, 0, 0, 0.0627)', // Fondo #00000010 forzado (16/255 ≈ 6.27% opacidad)
              color: colors.semantic.text.primary, // #101828 tokenizado
              border: 'none',
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: '0.75rem', // 12px (0.75rem)
              fontWeight: '700', // Bold (700)
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            Ver todo
          </button>
        </div>
        
        {/* Contenido de últimos movimientos - Inset Grouped List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: borderRadius.lg, // 8px border radius para el grupo
            overflow: 'hidden',
            backgroundColor: colors.semantic.background.white,
          }}
        >
          {/* Item 1 - Compra en Amazon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start', // Alinear al inicio para que el valor coincida con el nombre
              paddingTop: spacing[3], // 12px vertical arriba
              paddingBottom: spacing[3], // 12px vertical abajo
              paddingLeft: 0, // Sin padding horizontal izquierdo
              paddingRight: 0, // Sin padding horizontal derecho
              position: 'relative',
            }}
          >
            {/* Divider que empieza después del avatar */}
            <div
              style={{
                position: 'absolute',
                left: `calc(${spacing[10]} + ${spacing[3]})`, // Empieza después del avatar (40px) + gap (12px)
                right: 0, // Termina en el borde derecho (sin padding)
                bottom: 0,
                height: '1px',
                backgroundColor: colors.semantic.border.light,
              }}
            />
            {/* Avatar */}
            <div
              style={{
                width: spacing[10], // 40px
                height: spacing[10], // 40px
                borderRadius: borderRadius.full,
                backgroundColor: colors.semantic.background.tabButtonActive, // Fondo gris claro
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginRight: spacing[3], // 12px de espacio a la derecha
                position: 'relative',
              }}
            >
              {/* Badge pequeño en la esquina */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: spacing[4], // 16px
                  height: spacing[4], // 16px
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.semantic.background.tabButtonActive,
                  border: `2px solid ${colors.semantic.background.white}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '10px', color: colors.semantic.text.primary }}>+</span>
              </div>
              {/* Logo/Icono de Amazon - placeholder */}
              <span style={{ fontSize: '20px', color: colors.semantic.text.primary }}>A</span>
            </div>
            
            {/* Información del movimiento */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[0.5], // 2px entre nombre y fecha
                alignItems: 'flex-start', // Alinear todo a la izquierda
              }}
            >
              {/* Nombre del movimiento */}
              <div
                style={{
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.base, // 16px
                  fontWeight: typography.fontWeight.normal,
                  color: colors.semantic.text.primary,
                  lineHeight: typography.lineHeight.normal,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                Compra en Amazon
              </div>
              
              {/* Fecha y hora */}
              <div
                style={{
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.xs, // 12px
                  fontWeight: typography.fontWeight.normal,
                  color: colors.semantic.text.secondary,
                  lineHeight: typography.lineHeight.normal,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                Hoy, 23:01
              </div>
            </div>
            
            {/* Valor */}
            <div
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base, // 16px (igual que el nombre del movimiento)
                fontWeight: typography.fontWeight.normal,
                color: colors.semantic.text.primary,
                marginLeft: spacing[4], // 16px de espacio a la izquierda
                textAlign: 'right',
                lineHeight: typography.lineHeight.normal, // Misma línea de altura que el nombre
                marginTop: 0, // Alineado con el nombre del movimiento
                alignSelf: 'flex-start', // Alinear al inicio para coincidir con el nombre
              }}
            >
              - 340 USD
            </div>
          </div>
          
          {/* Item 2 - Saldo agregado */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start', // Alinear al inicio para que el valor coincida con el nombre
              paddingTop: spacing[3], // 12px vertical arriba
              paddingBottom: spacing[3], // 12px vertical abajo
              paddingLeft: 0, // Sin padding horizontal izquierdo
              paddingRight: 0, // Sin padding horizontal derecho
              position: 'relative',
            }}
          >
            {/* Divider que empieza después del avatar */}
            <div
              style={{
                position: 'absolute',
                left: `calc(${spacing[10]} + ${spacing[3]})`, // Empieza después del avatar (40px) + gap (12px)
                right: 0, // Termina en el borde derecho (sin padding)
                bottom: 0,
                height: '1px',
                backgroundColor: colors.semantic.border.light,
              }}
            />
            {/* Avatar */}
            <div
              style={{
                width: spacing[10], // 40px
                height: spacing[10], // 40px
                borderRadius: borderRadius.full,
                backgroundColor: colors.semantic.background.tabButtonActive,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginRight: spacing[3], // 12px de espacio a la derecha
                position: 'relative',
              }}
            >
              {/* Badge pequeño en la esquina */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: spacing[4], // 16px
                  height: spacing[4], // 16px
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.semantic.background.tabButtonActive,
                  border: `2px solid ${colors.semantic.background.white}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '10px', color: colors.semantic.text.primary }}>+</span>
              </div>
              {/* Logo Citi - placeholder */}
              <span style={{ fontSize: '16px', color: '#0064D2', fontWeight: typography.fontWeight.bold }}>citi</span>
            </div>
            
            {/* Información del movimiento */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[0.5], // 2px entre nombre y fecha
                alignItems: 'flex-start', // Alinear todo a la izquierda
              }}
            >
              {/* Nombre del movimiento */}
              <div
                style={{
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.base, // 16px
                  fontWeight: typography.fontWeight.normal,
                  color: colors.semantic.text.primary,
                  lineHeight: typography.lineHeight.normal,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                Saldo agregado
              </div>
              
              {/* Fecha y hora */}
              <div
                style={{
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.xs, // 12px
                  fontWeight: typography.fontWeight.normal,
                  color: colors.semantic.text.secondary,
                  lineHeight: typography.lineHeight.normal,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                Hoy, 14:21
              </div>
            </div>
            
            {/* Valor */}
            <div
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base, // 16px
                fontWeight: typography.fontWeight.normal,
                color: colors.semantic.text.primary,
                marginLeft: spacing[4], // 16px de espacio a la izquierda
                textAlign: 'right',
              }}
            >
              + 1.200 USD
            </div>
          </div>
          
          {/* Item 3 - Dinero enviado */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start', // Alinear al inicio para que el valor coincida con el nombre
              paddingTop: spacing[3], // 12px vertical arriba
              paddingBottom: spacing[3], // 12px vertical abajo
              paddingLeft: 0, // Sin padding horizontal izquierdo
              paddingRight: 0, // Sin padding horizontal derecho
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: spacing[10], // 40px
                height: spacing[10], // 40px
                borderRadius: borderRadius.full,
                backgroundColor: colors.semantic.background.tabButtonActive,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginRight: spacing[3], // 12px de espacio a la derecha
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Badge pequeño en la esquina con icono de avión */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: spacing[4], // 16px
                  height: spacing[4], // 16px
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.semantic.background.white,
                  border: `1px solid ${colors.semantic.border.light}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 22L22 2M22 2H16M22 2V8" stroke={colors.semantic.text.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {/* Avatar con imagen - placeholder */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.semantic.background.tabButtonActive,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                👤
              </div>
            </div>
            
            {/* Información del movimiento */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[0.5], // 2px entre nombre y fecha
                alignItems: 'flex-start', // Alinear todo a la izquierda
              }}
            >
              {/* Nombre del movimiento */}
              <div
                style={{
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.base, // 16px
                  fontWeight: typography.fontWeight.normal,
                  color: colors.semantic.text.primary,
                  lineHeight: typography.lineHeight.normal,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                Dinero enviado
              </div>
              
              {/* Fecha y hora */}
              <div
                style={{
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.xs, // 12px
                  fontWeight: typography.fontWeight.normal,
                  color: colors.semantic.text.secondary,
                  lineHeight: typography.lineHeight.normal,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                Ayer, 14:21
              </div>
            </div>
            
            {/* Valor */}
            <div
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base, // 16px
                fontWeight: typography.fontWeight.normal,
                color: colors.semantic.text.primary,
                marginLeft: spacing[4], // 16px de espacio a la izquierda
                textAlign: 'right',
              }}
            >
              - 80 USD
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

