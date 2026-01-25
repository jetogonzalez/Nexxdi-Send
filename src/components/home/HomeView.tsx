import { useState, useEffect } from 'react';
import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { currentUser } from '../../config/userProfile';
import { formatBalance } from '../../lib/formatBalance';
import { CardWalletSlider } from '../ui/CardWalletSlider';
import { CurrencyChangeCard } from './CurrencyChangeCard';
import { RecentMovementsSection } from './RecentMovementsSection';
import { BalanceCard } from '../ui/BalanceCard';
import { PersonalizeHomeSheet } from './PersonalizeHomeSheet';
import { SendMoneySheet } from '../ui/SendMoneySheet';
import { ExchangeMoneySheet } from '../ui/ExchangeMoneySheet';
import { useBalances } from '../../hooks/useBalances';

// Tipo para las secciones del home
interface HomeSection {
  id: string;
  name: string;
  enabled: boolean;
}

// Configuración por defecto de las secciones
const defaultSections: HomeSection[] = [
  { id: 'productos', name: 'Productos', enabled: true },
  { id: 'acciones', name: 'Acciones rápidas', enabled: true },
  { id: 'widget-cambio', name: 'Widget de cambio', enabled: true },
  { id: 'envios-frecuentes', name: 'Envíos frecuentes', enabled: true },
  { id: 'ultimos-movimientos', name: 'Últimos movimientos', enabled: true },
];

interface HomeViewProps {
  titleRef?: (el: HTMLElement | null) => void;
  scrollProgress?: number;
  isBalanceVisible?: boolean;
  usdBalance?: number;
  copBalance?: number;
  cardBalance?: number;
  onNavigate?: (tab: string) => void;
  isCardBlocked?: boolean;
}

export function HomeView({ titleRef, scrollProgress = 0, isBalanceVisible = true, usdBalance: initialUsdBalance = 5678.90, copBalance: initialCopBalance = 1500000.50, cardBalance = 379.21, onNavigate, isCardBlocked = false }: HomeViewProps) {
  const title = currentUser.greeting;
  const [showPersonalizeSheet, setShowPersonalizeSheet] = useState(false);
  const [homeSections, setHomeSections] = useState<HomeSection[]>(defaultSections);
  const [isSendMoneySheetOpen, setIsSendMoneySheetOpen] = useState(false);
  const [isExchangeMoneySheetOpen, setIsExchangeMoneySheetOpen] = useState(false);
  
  // Hook para saldos dinámicos sincronizados con sessionStorage
  const { usdBalance, copBalance } = useBalances(initialUsdBalance, initialCopBalance);

  // Cargar configuración de secciones desde localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSections = localStorage.getItem('homeSections');
      if (savedSections) {
        try {
          setHomeSections(JSON.parse(savedSections));
        } catch (e) {
          console.error('Error parsing home sections:', e);
        }
      }
    }
  }, []);

  // Función para guardar las secciones
  const handleSaveSections = (sections: HomeSection[]) => {
    setHomeSections(sections);
    if (typeof window !== 'undefined') {
      localStorage.setItem('homeSections', JSON.stringify(sections));
    }
  };

  // Obtener el orden de las secciones habilitadas
  const enabledSections = homeSections.filter(s => s.enabled);

  // Función para renderizar el contenido de cada sección (sin márgenes)
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'productos':
        return (
          <div style={{ marginBottom: '1.5rem' }}>
            <CardWalletSlider
              isBalanceVisible={isBalanceVisible}
              cardBalance={cardBalance}
              isCardBlocked={isCardBlocked}
              onCardSelect={(card) => {
                console.log('HomeView: onCardSelect called', { cardType: card.type });
                // Solo navegar si es la card principal (front card)
                // El componente ya maneja esto internamente
                if (card.type === 'usd' || card.type === 'cop') {
                  console.log('HomeView: Navigating to wallet');
                  onNavigate?.('wallet');
                } else if (card.type === 'visa') {
                  console.log('HomeView: Navigating to tarjeta');
                  onNavigate?.('tarjeta');
                }
              }}
              onCardDoubleTap={(card) => {
                console.log('HomeView: onCardDoubleTap called', { cardType: card.type });
                if (card.type === 'usd' || card.type === 'cop') {
                  console.log('HomeView: Double tap - Navigating to wallet');
                  onNavigate?.('wallet');
                } else if (card.type === 'visa') {
                  console.log('HomeView: Double tap - Navigating to tarjeta');
                  onNavigate?.('tarjeta');
                }
              }}
            />
          </div>
        );
      
      case 'acciones':
        return (
          <div
            style={{
              marginBottom: spacing[6],
            }}
          >
            <h2
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                lineHeight: typography.lineHeight.tight,
                letterSpacing: '0%',
                color: '#101828',
                margin: 0,
                padding: 0,
                marginBottom: '1rem',
              }}
            >
              Acciones rápidas
            </h2>
            <div
              style={{
                display: 'flex',
                gap: '24px',
                justifyContent: 'flex-start',
              }}
            >
            {/* Botón Agregar saldo */}
            <button
              onClick={() => console.log('Agregar saldo')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.semantic.background.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/img/icons/global/add.svg"
                  alt="Agregar saldo"
                  style={{
                    width: '24px',
                    height: '24px',
                    display: 'block',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.normal,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                }}
              >
                Agregar saldo
              </span>
            </button>

            {/* Botón Recibir */}
            <button
              onClick={() => console.log('Recibir')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.semantic.background.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/img/icons/global/receive.svg"
                  alt="Recibir"
                  style={{
                    width: '24px',
                    height: '24px',
                    display: 'block',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.normal,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                }}
              >
                Recibir
              </span>
            </button>

            {/* Botón Cambiar */}
            <button
              onClick={() => setIsExchangeMoneySheetOpen(true)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.semantic.background.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/img/icons/global/fx.svg"
                  alt="Cambiar"
                  style={{
                    width: '24px',
                    height: '24px',
                    display: 'block',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.normal,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                }}
              >
                Cambiar
              </span>
            </button>

            {/* Botón Enviar */}
            <button
              onClick={() => setIsSendMoneySheetOpen(true)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.semantic.background.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/img/icons/global/send.svg"
                  alt="Enviar"
                  style={{
                    width: '24px',
                    height: '24px',
                    display: 'block',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.normal,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                }}
              >
                Enviar
              </span>
            </button>
            </div>
          </div>
        );
      
      case 'widget-cambio':
        return (
          <CurrencyChangeCard
            currencyName="Peso colombiano"
            currencyCode="COP"
            vsCurrency="USD"
            timeFrame="hoy"
            autoUpdate={true}
            updateInterval={20}
          />
        );
      
      case 'envios-frecuentes':
        return (
          <div
            style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              paddingLeft: spacing[5],
              paddingRight: spacing[5],
              marginBottom: spacing[6], // 1.5rem = 24px
              overflowX: 'visible',
              overflowY: 'visible',
              boxSizing: 'border-box',
            }}
          >
            <h2
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                lineHeight: typography.lineHeight.tight,
                letterSpacing: '0%',
                color: '#101828',
                margin: 0,
                padding: 0,
                marginBottom: '1rem',
              }}
            >
              Envíos frecuentes
            </h2>
            
            <div
              style={{
                display: 'flex',
                gap: spacing[3],
                paddingLeft: spacing[5],
                paddingRight: spacing[5],
                marginLeft: `-${spacing[5]}`,
                marginRight: `-${spacing[5]}`,
                overflowX: 'auto',
                overflowY: 'visible',
                flexWrap: 'nowrap',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                width: 'calc(100% + 40px)',
                boxSizing: 'border-box',
              } as React.CSSProperties}
              className="hide-scrollbar"
            >
              {['Olga Castillo', 'Ricardo Gonzalez', 'Abigail Castillo', 'Lorena Velez'].map((name) => (
                <div
                  key={name}
                  style={{
                    minWidth: spacing.imageCircle,
                    height: spacing[20],
                    borderRadius: borderRadius.full,
                    backgroundColor: colors.semantic.background.white,
                    padding: `${spacing[3]} ${spacing[6]}`,
                    border: 'none',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[3],
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      width: spacing[10],
                      height: spacing[10],
                      borderRadius: borderRadius.full,
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke={colors.semantic.text.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.normal,
                      color: colors.semantic.text.contactName,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {name}
                  </div>
                  <button
                    type="button"
                    style={{
                      padding: `${spacing[2]} ${spacing[4]}`,
                      borderRadius: borderRadius.full,
                      backgroundColor: colors.semantic.text.primary,
                      color: colors.semantic.background.white,
                      border: 'none',
                      fontFamily: typography.fontFamily.sans.join(', '),
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.bold,
                      cursor: 'pointer',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Enviar
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'ultimos-movimientos':
        return (
          <RecentMovementsSection 
            isBalanceVisible={isBalanceVisible} 
            maxItems={3} 
            filterBySource="general" 
          />
        );
      
      default:
        return null;
    }
  };

  // Función para renderizar sección sin márgenes adicionales
  const renderSection = (sectionId: string, index: number) => {
    return (
      <div
        key={sectionId}
        style={{
          marginTop: 0,
          marginBottom: 0,
        }}
      >
        {renderSectionContent(sectionId)}
      </div>
    );
  };
  
  // Tasa de cambio: 1 USD = 4000 COP
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
          letterSpacing: '-0.04em', // -4% letter spacing
          color: colors.semantic.text.primary,
          fontFamily: typography.fontFamily.sans.join(', '),
          marginTop: 0, // Sin espacio entre label y saldo
          marginBottom: spacing[6], // 1.5rem después del contenido
          display: 'flex',
          alignItems: 'baseline',
          gap: spacing[1], // 4px entre número y moneda
        }}
      >
        {isBalanceVisible ? (
          <>
            <span>{formatBalance(totalBalance, isBalanceVisible).replace(' USD', '')}</span>
            <span
              style={{
                fontSize: typography.fontSize.sm, // Token semántico: 14px (más pequeño que el monto)
                fontWeight: typography.fontWeight.bold, // Token semántico: 700 Bold
                fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
                color: colors.semantic.text.primary, // Token semántico: mismo color que el monto
              }}
            >
              USD
            </span>
          </>
        ) : (
          <span>•••</span>
        )}
      </div>
      
      {/* Secciones dinámicas según el orden configurado */}
      {enabledSections.map((section, index) => renderSection(section.id, index))}

      {/* Sección Personalizar Home - siempre visible al final */}
      <div
        style={{
          marginTop: '0.75rem',
          marginBottom: 0,
        }}
      >
        <button
          type="button"
          onClick={() => {
            setShowPersonalizeSheet(true);
          }}
          style={{
            width: '100%',
            backgroundColor: colors.semantic.background.white,
            border: 'none',
            borderRadius: borderRadius.full,
            paddingTop: spacing[4],
            paddingBottom: spacing[4],
            paddingLeft: spacing[6],
            paddingRight: spacing[6],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <span
            style={{
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold,
              color: colors.semantic.text.primary,
              textAlign: 'center',
            }}
          >
            Personaliza tu Inicio
          </span>
        </button>
      </div>

      {/* Bottom Sheet para personalizar home */}
      <PersonalizeHomeSheet
        isOpen={showPersonalizeSheet}
        onClose={() => setShowPersonalizeSheet(false)}
        sections={homeSections}
        onSave={handleSaveSections}
      />

      {/* Bottom Sheet para enviar dinero */}
      <SendMoneySheet
        isOpen={isSendMoneySheetOpen}
        onClose={() => setIsSendMoneySheetOpen(false)}
        usdBalance={usdBalance}
        copBalance={copBalance}
      />

      {/* Bottom Sheet para cambiar moneda */}
      <ExchangeMoneySheet
        isOpen={isExchangeMoneySheetOpen}
        onClose={() => setIsExchangeMoneySheetOpen(false)}
        initialUsdBalance={usdBalance}
        initialCopBalance={copBalance}
      />
    </div>
  );
}
