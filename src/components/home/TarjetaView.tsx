import { colors, spacing, typography } from '../../config/design-tokens';
import { formatBalance } from '../../lib/formatBalance';

interface TarjetaViewProps {
  titleRef?: (el: HTMLElement | null) => void;
  scrollProgress?: number;
  isBalanceVisible?: boolean;
}

export function TarjetaView({ titleRef, scrollProgress = 0, isBalanceVisible = true }: TarjetaViewProps) {
  const title = 'Tarjeta Virtual';
  const balance = 2344.02;

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
        }}
      >
        {title}
      </h1>
      
      {/* Balance principal */}
      <div
        style={{
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.bold,
          color: colors.semantic.background.white, // Blanco en tarjeta
          fontFamily: typography.fontFamily.sans.join(', '),
        }}
      >
        {formatBalance(balance, isBalanceVisible)}
      </div>
      
      <p
        style={{
          fontSize: typography.fontSize.base,
          color: colors.semantic.text.secondary,
          fontFamily: typography.fontFamily.sans.join(', '),
        }}
      >
        Gestiona tu tarjeta virtual
      </p>

      {/* Texto de diferentes tamaños */}
      <h2 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.background.white, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Título Extra Grande (4xl - 36px)
      </h2>
      <p style={{ fontSize: typography.fontSize['2xl'], color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Párrafo muy grande (2xl - 24px) para información destacada sobre tarjetas virtuales.
      </p>

      <h3 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.background.white, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Título Grande (3xl - 26px)
      </h3>
      <p style={{ fontSize: typography.fontSize.xl, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Párrafo grande (xl - 20px) con detalles sobre las características de la tarjeta virtual.
      </p>

      <h4 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.background.white, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Subtítulo (2xl - 24px)
      </h4>
      <p style={{ fontSize: typography.fontSize.lg, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Texto grande (lg - 18px) con información sobre seguridad y uso de la tarjeta.
      </p>

      <p style={{ fontSize: typography.fontSize.base, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Texto base (base - 16px) con instrucciones y guías de uso de la tarjeta virtual.
      </p>

      <p style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Texto pequeño (sm - 14px) con información adicional sobre límites y restricciones.
      </p>

      <p style={{ fontSize: typography.fontSize.xs, color: colors.semantic.text.tertiary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Texto muy pequeño (xs - 12px) para términos y condiciones específicos de la tarjeta.
      </p>

      {/* Más contenido para scroll */}
      <h2 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.background.white, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Crear Nueva Tarjeta
      </h2>
      <p style={{ fontSize: typography.fontSize['2xl'], color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Genera tarjetas virtuales instantáneamente para tus compras online. Cada tarjeta tiene su propio número, fecha de vencimiento y código de seguridad único.
      </p>

      <h3 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.background.white, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Configuración de Límites
      </h3>
      <p style={{ fontSize: typography.fontSize.xl, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Establece límites de gasto diarios, mensuales o por transacción para cada tarjeta. Esto te ayuda a controlar tus gastos y mantener tu presupuesto bajo control.
      </p>

      <h4 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.background.white, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Bloqueo y Desbloqueo
      </h4>
      <p style={{ fontSize: typography.fontSize.lg, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Bloquea o desbloquea tus tarjetas virtuales en cualquier momento con un solo toque. Si pierdes acceso a tu dispositivo o sospechas de actividad fraudulenta, puedes bloquear todas tus tarjetas inmediatamente.
      </p>

      <h2 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.background.white, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Historial de Compras
      </h2>
      <p style={{ fontSize: typography.fontSize['2xl'], color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Revisa todas las compras realizadas con cada tarjeta virtual. El historial incluye detalles completos de cada transacción, incluyendo fecha, hora, comercio y monto.
      </p>

      <h3 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.background.white, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Tarjetas de Un Solo Uso
      </h3>
      <p style={{ fontSize: typography.fontSize.xl, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Crea tarjetas que se desactivan automáticamente después de una sola transacción. Perfectas para compras en sitios web desconocidos o para mantener máxima seguridad en tus transacciones online.
      </p>

      <h4 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.background.white, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Notificaciones de Transacciones
      </h4>
      <p style={{ fontSize: typography.fontSize.lg, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Recibe notificaciones instantáneas cada vez que se realiza una transacción con cualquiera de tus tarjetas. Mantente siempre informado sobre el uso de tus tarjetas virtuales.
      </p>

      <h2 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.background.white, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Seguridad Avanzada
      </h2>
      <p style={{ fontSize: typography.fontSize['2xl'], color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Todas las tarjetas virtuales están protegidas con tecnología de tokenización. Los números de tarjeta nunca se almacenan en los servidores de los comercios, manteniendo tu información completamente segura.
      </p>

      <h3 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.background.white, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Compartir Tarjetas
      </h3>
      <p style={{ fontSize: typography.fontSize.xl, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Comparte tarjetas virtuales con familiares o miembros de tu equipo con límites y permisos personalizados. Ideal para controlar gastos familiares o empresariales.
      </p>

      <h4 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.background.white, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Renovación Automática
      </h4>
      <p style={{ fontSize: typography.fontSize.lg, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Configura la renovación automática de tus tarjetas virtuales antes de que expiren. Nunca te quedes sin acceso a tus métodos de pago preferidos.
      </p>

      <p style={{ fontSize: typography.fontSize.xs, color: colors.semantic.text.tertiary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Las tarjetas virtuales están disponibles las 24 horas del día. Puedes crear, modificar o eliminar tarjetas en cualquier momento desde esta sección.
      </p>
    </div>
  );
}
