import { useState, useEffect, useRef, useMemo } from 'react';
import { spacing, typography, borderRadius, bottomNavigation } from '../../config/design-tokens';
import { motion } from '../../lib/motion';
import { LiquidGlassButtonBar } from '../ui/LiquidGlassButtonBar';
import { getTabIconConfig } from './iconHelper';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [backgroundStyle, setBackgroundStyle] = useState({ left: 0, width: 0 });
  // Configuración de tabs - memoizada para evitar re-renders infinitos
  const tabs = useMemo(() => {
    return [
      { id: 'home', label: 'Inicio' },
      { id: 'wallet', label: 'Wallet' },
      { id: 'cash', label: 'Cash' },
      { id: 'tarjeta', label: 'Tarjeta' },
      { id: 'mas', label: 'Más' },
    ].map(tab => getTabIconConfig(tab.id, tab.label));
  }, []); // Array vacío porque los tabs nunca cambian

  // Calcular posición del fondo activo
  useEffect(() => {
    const updateBackground = () => {
      if (!containerRef.current) return;

      const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
      if (activeIndex === -1) return;

      const container = containerRef.current;
      const buttons = container.querySelectorAll('button');
      const activeButton = buttons[activeIndex] as HTMLButtonElement;

      if (activeButton && activeButton.offsetWidth > 0) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        
        setBackgroundStyle({
          left: buttonRect.left - containerRect.left,
          width: buttonRect.width,
        });
      }
    };

    // Usar useLayoutEffect para calcular antes del paint
    updateBackground();

    // Recalcular después de que el DOM esté listo
    const timeoutId = setTimeout(updateBackground, 0);

    // Recalcular en resize
    window.addEventListener('resize', updateBackground);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateBackground);
    };
  }, [activeTab]); // Solo activeTab como dependencia, tabs está memoizado

  return (
    <LiquidGlassButtonBar position="bottom" showBackground={true}>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'stretch', // Estirar items para que ocupen el espacio disponible
          width: '100%',
          flexDirection: 'row', // Horizontal para tabs
          gap: 0, // Sin gap entre tabs
        }}
      >
        {/* Fondo animado líquido */}
        {backgroundStyle.width > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${backgroundStyle.left}px`,
              width: `${backgroundStyle.width}px`,
              height: '100%',
              backgroundColor: bottomNavigation.colors.activeBackground,
              borderRadius: borderRadius.full,
              transition: bottomNavigation.effects.backgroundTransition,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        )}
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                // Deshabilitar la página "Más" - no hace nada al hacer clic
                if (tab.id === 'mas') return;
                onTabChange(tab.id);
              }}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: bottomNavigation.spacing.gap,
                paddingTop: bottomNavigation.spacing.itemPaddingY,
                paddingBottom: bottomNavigation.spacing.itemPaddingY,
                backgroundColor: 'transparent',
                borderRadius: borderRadius.full,
                border: 'none',
                cursor: tab.id === 'mas' ? 'default' : 'pointer', // Sin cursor de pointer para "Más"
                flex: 1,
                minHeight: spacing[12],
                margin: '0',
                transition: bottomNavigation.effects.backgroundColorTransition,
                opacity: tab.id === 'mas' ? 0.5 : 1, // Reducir opacidad para indicar que está deshabilitado
              }}
              aria-label={tab.label}
              aria-disabled={tab.id === 'mas'}
            >
              <div 
                style={{ 
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: bottomNavigation.icon.containerSize,
                  height: bottomNavigation.icon.containerSize,
                  marginBottom: 0,
                }}
              >
                {tab.iconActive && tab.iconInactive ? (
                  <div
                    style={{
                      width: bottomNavigation.icon.size,
                      height: bottomNavigation.icon.size,
                      display: 'block',
                      backgroundColor: isActive 
                        ? bottomNavigation.colors.iconActive 
                        : bottomNavigation.colors.iconInactive,
                      maskImage: `url(${isActive ? tab.iconActive : tab.iconInactive})`,
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskImage: `url(${isActive ? tab.iconActive : tab.iconInactive})`,
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                    }}
                    aria-label={tab.label}
                  />
                ) : tab.icon ? (
                  <tab.icon isActive={isActive} size={bottomNavigation.icon.size} />
                ) : null}
              </div>
              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: bottomNavigation.typography.fontSize,
                  fontWeight: bottomNavigation.typography.fontWeight,
                  lineHeight: bottomNavigation.typography.lineHeight,
                  color: isActive ? bottomNavigation.colors.activeText : bottomNavigation.colors.inactiveText,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  marginTop: bottomNavigation.spacing.labelMarginTop,
                  whiteSpace: 'nowrap',
                  transition: bottomNavigation.effects.colorTransition,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </LiquidGlassButtonBar>
  );
}
