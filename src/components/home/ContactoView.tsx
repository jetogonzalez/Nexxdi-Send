import { colors, spacing, typography } from '../../config/design-tokens';
import { ContactoIcon } from './icons/ContactoIcon';

export function ContactoView() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: spacing[5],
        backgroundColor: colors.semantic.background.main,
      }}
    >
      <h1
        style={{
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.bold,
          color: colors.semantic.text.primary,
          fontFamily: typography.fontFamily.sans.join(', '),
          marginBottom: spacing[4],
        }}
      >
        Contactos
      </h1>
      <p
        style={{
          fontSize: typography.fontSize.base,
          color: colors.semantic.text.secondary,
          fontFamily: typography.fontFamily.sans.join(', '),
          marginBottom: spacing[6],
        }}
      >
        Tus contactos y personas
      </p>
      
      {/* Botón para agregar grupo */}
      <button
        type="button"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3],
          padding: spacing[4],
          backgroundColor: colors.semantic.background.white,
          border: `1px solid ${colors.semantic.border.subtle}`,
          borderRadius: spacing[3],
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.semantic.background.secondary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.semantic.background.white;
        }}
      >
        <ContactoIcon isActive={true} size={24} />
        <span
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.medium,
            color: colors.semantic.text.primary,
            fontFamily: typography.fontFamily.sans.join(', '),
          }}
        >
          Agregar a grupo
        </span>
      </button>
    </div>
  );
}
