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
  // Inicializar siempre como true para evitar diferencias entre servidor y cliente
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  
  // Cargar el estado desde localStorage solo en el cliente después del mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(BALANCE_VISIBILITY_KEY);
      if (saved !== null) {
        setIsBalanceVisible(saved === 'true');
      }
    }
  }, []);
  const previousTabRef = useRef('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const titleRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const contentRef = useRef<HTMLDivElement>(null);
  const [bottomPadding, setBottomPadding] = useState(`calc(100px + ${CONTENT_TO_NAVIGATION_GAP} + env(safe-area-inset-bottom))`);
  const preservedScrollTopRef = useRef<number | null>(null); // Preservar scrollTop cuando bottom sheet está abierto
  
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

  // Hook para detectar cuando se abre/cierra un bottom sheet y preservar scrollTop
  useEffect(() => {
    const checkBottomSheet = () => {
      const isBottomSheetOpen = document.body.style.position === 'fixed';
      if (isBottomSheetOpen && preservedScrollTopRef.current === null) {
        // Intentar obtener el scrollTop desde el top del body (formato: -123px)
        const bodyTop = document.body.style.top;
        if (bodyTop) {
          const scrollYFromTop = Math.abs(parseInt(bodyTop, 10)) || 0;
          if (scrollYFromTop > 0) {
            preservedScrollTopRef.current = scrollYFromTop;
            // Actualizar el estado inmediatamente para mantener el header
            const hasScrolled = scrollYFromTop > 10;
            setIsScrolled(hasScrolled);
            setScrollTop(scrollYFromTop);
          }
        }
      } else if (!isBottomSheetOpen && preservedScrollTopRef.current !== null) {
        // Resetear cuando se cierra
        preservedScrollTopRef.current = null;
      }
    };
    
    // Verificar periódicamente si hay un bottom sheet abierto
    const interval = setInterval(checkBottomSheet, 100);
    
    return () => clearInterval(interval);
  }, []);

  // Hook para detectar scroll (solo para blur glassmorphism)
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Verificar si hay un bottom sheet abierto (body tiene position: fixed)
          const isBottomSheetOpen = document.body.style.position === 'fixed';
          
          // Si el bottom sheet está abierto, preservar el scrollTop
          if (isBottomSheetOpen) {
            // Intentar obtener el scrollTop desde el top del body (formato: -123px)
            const bodyTop = document.body.style.top;
            if (bodyTop && preservedScrollTopRef.current === null) {
              const scrollYFromTop = Math.abs(parseInt(bodyTop, 10)) || 0;
              if (scrollYFromTop > 0) {
                preservedScrollTopRef.current = scrollYFromTop;
              }
            }
            // Usar el scrollTop preservado para mantener el estado del header
            if (preservedScrollTopRef.current !== null) {
              const preservedScroll = preservedScrollTopRef.current;
              const hasScrolled = preservedScroll > 10;
              setIsScrolled(hasScrolled);
              setScrollTop(preservedScroll);
              ticking = false;
              return;
            }
            // Si no hay scrollTop preservado, mantener el estado actual
            ticking = false;
            return;
          } else {
            // Si el bottom sheet se cerró, resetear el valor preservado
            if (preservedScrollTopRef.current !== null) {
              preservedScrollTopRef.current = null;
            }
          }
          
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
  // Valor de la tarjeta Visa (mismo que se muestra en TarjetaView)
  const cardBalance = 379.21; // Valor de la tarjeta virtual

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView titleRef={(el) => { titleRefs.current['home'] = el; }} scrollProgress={scrollProgress} isBalanceVisible={isBalanceVisible} usdBalance={currencyBalanceUSD} copBalance={currencyBalanceCOP} cardBalance={cardBalance} />;
      case 'wallet':
        return <WalletView isBalanceVisible={isBalanceVisible} titleRef={(el) => { titleRefs.current['wallet'] = el; }} scrollProgress={scrollProgress} usdBalance={currencyBalanceUSD} copBalance={currencyBalanceCOP} />;
      case 'cash':
        return <CashView isBalanceVisible={isBalanceVisible} usdBalance={currencyBalanceUSD} copBalance={currencyBalanceCOP} />;
      case 'tarjeta':
        return <TarjetaView titleRef={(el) => { titleRefs.current['tarjeta'] = el; }} scrollProgress={scrollProgress} isBalanceVisible={isBalanceVisible} />;
      case 'mas':
        return <MasView />;
      default:
        return <HomeView titleRef={(el) => { titleRefs.current['home'] = el; }} scrollProgress={scrollProgress} isBalanceVisible={isBalanceVisible} usdBalance={currencyBalanceUSD} copBalance={currencyBalanceCOP} cardBalance={cardBalance} />;
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
        opacity: 1, // Asegurar que sea visible inmediatamente
        visibility: 'visible', // Asegurar visibilidad inmediata
      }}
    >
      {/* Header - Siempre fijo y visible */}
      <Header 
        activeTab={activeTab as 'home' | 'wallet' | 'cash' | 'tarjeta' | 'mas'} 
        onBalanceVisibilityChange={handleBalanceVisibilityChange}
        isScrolled={isScrolled}
        scrollTop={scrollTop}
      />

      {/* Contenido sin transiciones - renderizado inmediato */}
      <div
        style={{
          width: '100%',
          minHeight: '100%',
          opacity: 1,
          visibility: 'visible',
        }}
      >
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
