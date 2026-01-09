import { useState, useEffect, useRef } from 'react';
import { spacing, borderRadius, bottomNavigation } from '../../config/design-tokens';
import { motion } from '../../lib/motion';
import { LiquidGlassButtonBar } from '../ui/LiquidGlassButtonBar';
import { WalletIcon } from './icons/WalletIcon';
import { TarjetaIcon } from './icons/TarjetaIcon';
import { EnviarIcon } from './icons/EnviarIcon';
import { ContactoIcon } from './icons/ContactoIcon';
import { MasIcon } from './icons/MasIcon';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [backgroundStyle, setBackgroundStyle] = useState({ left: 0, width: 0 });
  const tabs = [
    { id: 'wallet', label: 'Wallet', icon: WalletIcon },
    { id: 'tarjeta', label: 'SendCard', icon: TarjetaIcon },
    { id: 'enviar', label: 'Enviar', icon: EnviarIcon },
    { id: 'contacto', label: 'Contactos', icon: ContactoIcon },
    { id: 'mas', label: 'Más', icon: MasIcon },
  ];

  // Calcular posición del fondo activo
  useEffect(() => {
    if (!containerRef.current) return;

    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (activeIndex === -1) return;

    const container = containerRef.current;
    const buttons = container.querySelectorAll('button');
    const activeButton = buttons[activeIndex];

    if (activeButton) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      setBackgroundStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [activeTab, tabs]);

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
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${backgroundStyle.left}px`,
            width: `${backgroundStyle.width}px`,
            height: '100%',
            backgroundColor: bottomNavigation.colors.activeBackground,
            borderRadius: borderRadius.full,
            transition: `left ${motion.duration.medium} ${motion.easing.smoothOut}, width ${motion.duration.medium} ${motion.easing.smoothOut}`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
          // Items con texto más largo necesitan padding horizontal extra
          const needsExtraPadding = tab.id === 'contacto' || tab.id === 'tarjeta';
          // Contactos necesita 1px más de padding que SendCard
          const isContactos = tab.id === 'contacto';
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: bottomNavigation.spacing.gap, // Tokenizado
                paddingTop: isContactos ? spacing[2] : bottomNavigation.spacing.itemPaddingY, // 8px para Contactos, 4px para otros
                paddingBottom: isContactos ? spacing[2] : bottomNavigation.spacing.itemPaddingY, // 8px para Contactos, 4px para otros
                paddingLeft: isContactos ? spacing[1] : needsExtraPadding ? spacing[0.5] : 0, // 4px para Contactos, 2px para SendCard
                paddingRight: isContactos ? spacing[1] : needsExtraPadding ? spacing[0.5] : 0, // 4px para Contactos, 2px para SendCard
                backgroundColor: 'transparent', // El fondo se maneja con el elemento animado
                borderRadius: borderRadius.full, // Full rounded según Figma
                border: 'none',
                cursor: 'pointer',
                flex: 1, // Distribuir espacio equitativamente
                minHeight: spacing[12], // 48px mínimo táctil
                margin: '0', // Sin margin para que no se mueva
                transition: `background-color ${motion.duration.base} ${motion.easing.easeInOut}`,
              }}
              aria-label={tab.label}
            >
              <div 
                style={{ 
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: bottomNavigation.icon.containerSize, // Tokenizado
                  height: bottomNavigation.icon.containerSize, // Tokenizado
                  marginBottom: isContactos ? spacing[0.5] : 0, // 2px de espacio extra debajo del icono para Contactos
                }}
              >
                <IconComponent isActive={isActive} size={bottomNavigation.icon.size} />
              </div>
              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: bottomNavigation.typography.fontSize, // Tokenizado
                  fontWeight: bottomNavigation.typography.fontWeight, // Tokenizado (bold)
                  lineHeight: bottomNavigation.typography.lineHeight, // Tokenizado (1.5)
                  color: isActive ? bottomNavigation.colors.activeText : bottomNavigation.colors.inactiveText, // Colores según Figma
                  fontFamily: 'Manrope, sans-serif',
                  marginTop: bottomNavigation.spacing.labelMarginTop, // Tokenizado
                  whiteSpace: 'nowrap', // Evitar que el texto se divida
                  transition: `color ${motion.duration.base} ${motion.easing.easeInOut}`,
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
