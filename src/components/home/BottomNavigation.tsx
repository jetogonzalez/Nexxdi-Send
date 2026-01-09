import { colors, spacing, typography } from '../../config/design-tokens';
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
  const tabs = [
    { id: 'wallet', label: 'Wallet', icon: WalletIcon },
    { id: 'tarjeta', label: 'SendCard', icon: TarjetaIcon },
    { id: 'enviar', label: 'Enviar', icon: EnviarIcon },
    { id: 'contacto', label: 'Contactos', icon: ContactoIcon },
    { id: 'mas', label: 'Más', icon: MasIcon },
  ];

  return (
    <LiquidGlassButtonBar position="bottom">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          flexDirection: 'row', // Horizontal para tabs
          gap: 0, // Sin gap entre tabs
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[1],
                padding: spacing[2],
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                minWidth: spacing[16], // 64px mínimo táctil
                minHeight: spacing[12], // 48px mínimo táctil
                transition: `color ${motion.duration.base} ${motion.easing.easeInOut}`,
              }}
              aria-label={tab.label}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px' }}>
                <IconComponent isActive={isActive} size={28} />
              </div>
              <span
                style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.normal,
                  color: isActive ? colors.primary.main : colors.semantic.text.tertiary,
                  fontFamily: typography.fontFamily.sans.join(', '),
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
