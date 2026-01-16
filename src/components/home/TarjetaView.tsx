import { colors, spacing, typography } from '../../config/design-tokens';
import { RecentMovementsSection } from './RecentMovementsSection';

interface TarjetaViewProps {
  titleRef?: (el: HTMLElement | null) => void;
  scrollProgress?: number;
  isBalanceVisible?: boolean;
}

export function TarjetaView({ titleRef, scrollProgress = 0, isBalanceVisible = true }: TarjetaViewProps) {
  const title = 'Tarjeta virtual';

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
          color: colors.semantic.background.white, // Blanco solo en tarjetas
          fontFamily: typography.sectionTitle.fontFamily,
          marginBottom: spacing[6], // 1.5rem después del título (default para todas las páginas)
        }}
      >
        {title}
      </h1>
      
      <p
        style={{
          fontSize: typography.fontSize.base,
          color: colors.semantic.text.secondary,
          fontFamily: typography.fontFamily.sans.join(', '),
          marginBottom: spacing[6], // 1.5rem después del contenido
        }}
      >
        Gestiona tu tarjeta virtual
      </p>

      {/* Sección Últimos movimientos - Componente completo reutilizable */}
      <RecentMovementsSection 
        isBalanceVisible={isBalanceVisible} 
        maxItems={3} 
        filterBySource="card" 
      />
    </div>
  );
}
