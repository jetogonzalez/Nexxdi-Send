"use client";

import { colors, spacing, typography } from '../../config/design-tokens';

interface MasViewProps {
  isBalanceVisible?: boolean;
  cardBalance?: number;
}

export function MasView({ isBalanceVisible = true, cardBalance = 379.21 }: MasViewProps) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: spacing[4],
        backgroundColor: colors.semantic.background.main,
      }}
    >
      <h1
        style={{
          fontSize: typography.sectionTitle.fontSize,
          fontWeight: typography.sectionTitle.fontWeight,
          lineHeight: typography.sectionTitle.lineHeight,
          color: typography.sectionTitle.color,
          fontFamily: typography.sectionTitle.fontFamily,
          marginBottom: spacing[6],
        }}
      >
        Más
      </h1>

      {/* Contenido deshabilitado temporalmente */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            fontSize: typography.fontSize.base,
            color: colors.semantic.text.tertiary,
            fontFamily: typography.fontFamily.sans.join(', '),
            textAlign: 'center',
          }}
        >
          Próximamente
        </p>
      </div>
    </div>
  );
}
