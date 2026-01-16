import { colors, spacing, typography } from '../../config/design-tokens';
import { formatBalance } from '../../lib/formatBalance';
import { RecentMovementsSection } from './RecentMovementsSection';

interface WalletViewProps {
  isBalanceVisible?: boolean;
  titleRef?: (el: HTMLElement | null) => void;
  scrollProgress?: number;
  usdBalance?: number;
  copBalance?: number;
}

export function WalletView({ isBalanceVisible = true, titleRef, scrollProgress = 0, usdBalance = 5678.90, copBalance = 1500000.50 }: WalletViewProps) {
  const title = 'Wallet';
  
  // Calcular saldo total: sumar USD y convertir COP a USD (aproximadamente 1 USD = 4000 COP)
  // Para simplificar, mostraremos el total en USD sumando ambos valores
  // En producción, esto debería usar la tasa de cambio real
  const exchangeRate = 4000; // Tasa aproximada: 1 USD = 4000 COP
  const copInUsd = copBalance / exchangeRate;
  const totalBalance = usdBalance + copInUsd;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: spacing[4], // 16px
        paddingBottom: spacing[10], // 40px
        backgroundColor: colors.semantic.background.main,
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
      
      {/* Sección Últimos movimientos - Componente completo reutilizable */}
      {/* Solo muestra movimientos de cuentas (wallet) - estos también aparecen en el home cuando se filtra por "general" */}
      <RecentMovementsSection 
        isBalanceVisible={isBalanceVisible} 
        maxItems={3} 
        filterBySource="wallet" 
      />
    </div>
  );
}
