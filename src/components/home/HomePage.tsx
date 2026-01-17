import { useState, useRef, useEffect } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { Header } from './Header';
import { HomeView } from './HomeView';
import { CashView } from './CashView';
import { WalletView } from './WalletView';
import { TarjetaView } from './TarjetaView';
import { MasView } from './MasView';
import { SectionTransition } from './SectionTransition';
import { colors, spacing } from '../../config/design-tokens';

const CONTENT_TO_NAVIGATION_GAP = spacing[6]; // 24px entre el último elemento y la navegación

const BALANCE_VISIBILITY_KEY = 'nexxdi_cash_balance_visible';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');
  // Cargar estado inicial desde localStorage (por defecto true si no existe)
  const [isBalanceVisible, setIsBalanceVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(BALANCE_VISIBILITY_KEY);
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });
  const previousTabRef = useRef('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const titleRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const contentRef = useRef<HTMLDivElement>(null);
  const [bottomPadding, setBottomPadding] = useState(`calc(100px + ${CONTENT_TO_NAVIGATION_GAP} + env(safe-area-inset-bottom))`);
  
  // Header siempre visible en todas las pestañas
  const showHeader = true;
  
  // Títulos para cada sección
  const sectionTitles: Record<string, string> = {
    home: 'Hola, Luis',
    wallet: 'Wallet',
    tarjeta: 'Tarjeta Virtual',
  };

  // Calcular padding bottom dinámicamente basado en la altura real de la navegación
  useEffect(() => {
    const calculateBottomPadding = () => {
      // Buscar el elemento de navegación en el DOM
      const navElement = document.querySelector('[data-bottom-navigation="true"]') as HTMLElement;
      if (!navElement) {
        // Fallback: usar altura aproximada si no se encuentra
        setBottomPadding(`calc(100px + ${CONTENT_TO_NAVIGATION_GAP} + env(safe-area-inset-bottom))`);
        return;
      }

      const navRect = navElement.getBoundingClientRect();
      const navHeight = navRect.height;
      const navBottom = navRect.bottom;
      const viewportHeight = window.innerHeight;
      
      // Calcular el espacio desde el bottom de la navegación hasta el bottom del viewport
      // Esto incluye el spacing[6] (24px) que tiene la navegación desde el bottom
      const spaceBelowNav = viewportHeight - navBottom;
      
      // El padding debe ser: altura de navegación + gap deseado (24px) + espacio que ya hay debajo de la navegación
      // Esto asegura que haya exactamente CONTENT_TO_NAVIGATION_GAP entre el último elemento y la navegación
      const totalPadding = navHeight + CONTENT_TO_NAVIGATION_GAP + spaceBelowNav;
      setBottomPadding(`${totalPadding}px`);
    };

    // Calcular después de que el DOM esté listo y cuando cambie el tab
    const timeoutId = setTimeout(calculateBottomPadding, 100);
    window.addEventListener('resize', calculateBottomPadding);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculateBottomPadding);
    };
  }, [activeTab]); // Recalcular cuando cambia el tab activo

  // Hook para detectar scroll (solo para blur glassmorphism)
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
          
          // Asegurar que scrollTop nunca sea negativo (previene problemas con pull-to-refresh)
          const safeScrollTop = Math.max(0, currentScrollTop);
          
          // Detectar si hay scroll (más de 10px)
          const hasScrolled = safeScrollTop > 10;
          setIsScrolled(hasScrolled);
          // Redondear scrollTop para evitar cambios muy pequeños que causan vibración
          setScrollTop(Math.round(safeScrollTop));
          
          const currentTitleRef = titleRefs.current[activeTab];
          if (!currentTitleRef || !showHeader) {
            setScrollProgress(0);
            ticking = false;
            return;
          }

          const titleRect = currentTitleRef.getBoundingClientRect();
          const threshold = 60;
          
          const titleTop = titleRect.top;
          const titleHeight = titleRect.height;
          
          const startPoint = threshold;
          const endPoint = threshold + titleHeight;
          const currentPosition = safeScrollTop;
          
          let progress = 0;
          if (currentPosition >= startPoint) {
            progress = Math.min((currentPosition - startPoint) / (endPoint - startPoint), 1);
          }
          
          setScrollProgress(progress);
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Estado inicial

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab, showHeader]);

  // Guardar el estado de visibilidad en localStorage cuando cambia
  const handleBalanceVisibilityChange = (isVisible: boolean) => {
    setIsBalanceVisible(isVisible);
    if (typeof window !== 'undefined') {
      localStorage.setItem(BALANCE_VISIBILITY_KEY, String(isVisible));
    }
  };

  const handleTabChange = (newTab: string) => {
    previousTabRef.current = activeTab;
    setActiveTab(newTab);
    // Reset scroll state cuando cambias de tab
    setIsScrolled(false);
    setScrollTop(0);
    setScrollProgress(0);
    // Scroll al inicio de la página cuando cambias de sección
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Valores de saldo compartidos entre vistas (USD y COP)
  const currencyBalanceUSD = 5678.90; // Valor de ejemplo para USD
  const currencyBalanceCOP = 1500000.50; // Valor de ejemplo para COP (peso colombiano)

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView titleRef={(el) => { titleRefs.current['home'] = el; }} scrollProgress={scrollProgress} isBalanceVisible={isBalanceVisible} usdBalance={currencyBalanceUSD} copBalance={currencyBalanceCOP} />;
      case 'wallet':
        return <WalletView isBalanceVisible={isBalanceVisible} titleRef={(el) => { titleRefs.current['wallet'] = el; }} scrollProgress={scrollProgress} usdBalance={currencyBalanceUSD} copBalance={currencyBalanceCOP} />;
      case 'cash':
        return <CashView />;
      case 'tarjeta':
        return <TarjetaView titleRef={(el) => { titleRefs.current['tarjeta'] = el; }} scrollProgress={scrollProgress} isBalanceVisible={isBalanceVisible} />;
      case 'mas':
        return <MasView />;
      default:
        return <HomeView titleRef={(el) => { titleRefs.current['home'] = el; }} scrollProgress={scrollProgress} isBalanceVisible={isBalanceVisible} usdBalance={currencyBalanceUSD} copBalance={currencyBalanceCOP} />;
    }
  };

  return (
    <div
      ref={contentRef}
      style={{
        minHeight: '100vh',
        backgroundColor: colors.semantic.background.main,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: bottomPadding, // Espacio calculado dinámicamente: altura navegación + gap + safe area
        marginLeft: spacing[5], // 20px
        marginRight: spacing[5], // 20px
        overflowX: 'visible', // Permitir overflow horizontal para que las cards no se corten
        overflowY: 'visible',
      }}
    >
      {/* Header - Siempre fijo y visible */}
      <Header 
        activeTab={activeTab as 'home' | 'wallet' | 'cash' | 'tarjeta' | 'mas'} 
        onBalanceVisibilityChange={handleBalanceVisibilityChange}
        isScrolled={isScrolled}
        scrollTop={scrollTop}
      />

      {/* Contenido con transición */}
      <SectionTransition activeTab={activeTab} previousTab={previousTabRef.current}>
        {renderContent()}
      </SectionTransition>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
