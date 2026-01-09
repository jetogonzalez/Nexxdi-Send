import { useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { WalletView } from './WalletView';
import { TarjetaView } from './TarjetaView';
import { EnviarView } from './EnviarView';
import { ContactoView } from './ContactoView';
import { MasView } from './MasView';
import { colors } from '../../config/design-tokens';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('wallet');

  const renderContent = () => {
    switch (activeTab) {
      case 'wallet':
        return <WalletView />;
      case 'tarjeta':
        return <TarjetaView />;
      case 'enviar':
        return <EnviarView />;
      case 'contacto':
        return <ContactoView />;
      case 'mas':
        return <MasView />;
      default:
        return <WalletView />;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.semantic.background.main,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 'calc(100px + env(safe-area-inset-bottom))', // Espacio para la navegación inferior con glass effect
      }}
    >
      {renderContent()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
