import { colors, spacing, typography } from '../../config/design-tokens';

export function ActividadView() {
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
        Actividad
      </h1>
      <p
        style={{
          fontSize: typography.fontSize.base,
          color: colors.semantic.text.secondary,
          fontFamily: typography.fontFamily.sans.join(', '),
        }}
      >
        Historial de transacciones
      </p>
    </div>
  );
}
