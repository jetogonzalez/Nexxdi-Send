import { colors, spacing, typography } from '../../config/design-tokens';

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1a1f3a', // Azul marino
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[5],
      }}
    >
      <h1
        style={{
          fontSize: typography.fontSize['4xl'],
          fontWeight: typography.fontWeight.bold,
          color: colors.semantic.background.white,
          fontFamily: typography.fontFamily.sans.join(', '),
          textAlign: 'center',
          marginBottom: spacing[4],
        }}
      >
        Home
      </h1>
      <p
        style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.normal,
          color: colors.semantic.background.white,
          fontFamily: typography.fontFamily.sans.join(', '),
          textAlign: 'center',
          opacity: 0.8,
        }}
      >
        Has accedido exitosamente
      </p>
    </div>
  );
}
