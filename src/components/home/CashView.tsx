import { colors, spacing, typography } from '../../config/design-tokens';

export function CashView() {
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
        style={{
          fontSize: typography.sectionTitle.fontSize,
          fontWeight: typography.sectionTitle.fontWeight,
          lineHeight: typography.sectionTitle.lineHeight,
          color: typography.sectionTitle.color,
          fontFamily: typography.sectionTitle.fontFamily,
          marginBottom: spacing[6], // 1.5rem después del título (default para todas las páginas)
        }}
      >
        Cash
      </h1>
      <p
        style={{
          fontSize: typography.fontSize.base,
          color: colors.semantic.text.secondary,
          fontFamily: typography.fontFamily.sans.join(', '),
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        En esta sección el usuario podrá enviar y recibir dinero. Definimos el flujo y componentes después.
      </p>

      {/* Texto de diferentes tamaños */}
      <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Título Muy Grande (3xl - 26px)
      </h2>
      <p style={{ fontSize: typography.fontSize.xl, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Este es un párrafo extra grande (xl - 20px) para destacar información muy importante en la sección de Cash.
      </p>

      <h3 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Título Grande (2xl - 24px)
      </h3>
      <p style={{ fontSize: typography.fontSize.lg, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Párrafo grande (lg - 18px) con información relevante sobre transferencias y pagos.
      </p>

      <h4 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Subtítulo (xl - 20px)
      </h4>
      <p style={{ fontSize: typography.fontSize.base, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Texto base (base - 16px) con detalles sobre las funcionalidades de envío y recepción de dinero.
      </p>

      <p style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Texto pequeño (sm - 14px) con información adicional sobre límites y condiciones.
      </p>

      <p style={{ fontSize: typography.fontSize.xs, color: colors.semantic.text.tertiary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Texto muy pequeño (xs - 12px) para términos y condiciones o información legal.
      </p>

      {/* Más contenido para scroll */}
      <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Enviar Dinero
      </h2>
      <p style={{ fontSize: typography.fontSize.base, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Envía dinero de forma rápida y segura a cualquier parte del mundo. Puedes transferir fondos a otros usuarios de la plataforma o a cuentas bancarias externas. Las transferencias internacionales pueden tardar entre 1 y 3 días hábiles.
      </p>

      <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Recibir Dinero
      </h3>
      <p style={{ fontSize: typography.fontSize.base, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Recibe pagos de manera instantánea. Comparte tu código QR o número de cuenta para que otros puedan enviarte dinero directamente. Todas las transacciones entrantes se reflejan inmediatamente en tu balance.
      </p>

      <h4 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Historial de Transacciones
      </h4>
      <p style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Revisa todas tus transacciones de envío y recepción en un solo lugar. Puedes filtrar por fecha, monto, tipo de operación o contacto. Exporta tus movimientos para llevar un registro detallado.
      </p>

      <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Límites y Comisiones
      </h2>
      <p style={{ fontSize: typography.fontSize.base, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Conoce los límites de tus transacciones y las comisiones aplicables. Los usuarios verificados tienen límites más altos y comisiones reducidas. Completa tu verificación de identidad para acceder a beneficios adicionales.
      </p>

      <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Métodos de Pago
      </h3>
      <p style={{ fontSize: typography.fontSize.base, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Acepta múltiples métodos de pago incluyendo tarjetas de crédito, débito, transferencias bancarias y billeteras digitales. Todos los métodos están protegidos con los más altos estándares de seguridad.
      </p>

      <h4 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Programación de Pagos
      </h4>
      <p style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Programa pagos recurrentes para nunca olvidar tus obligaciones. Establece transferencias automáticas para facturas, suscripciones o pagos mensuales. Puedes modificar o cancelar estos pagos en cualquier momento.
      </p>

      <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Contactos Frecuentes
      </h2>
      <p style={{ fontSize: typography.fontSize.base, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Guarda tus contactos frecuentes para realizar transferencias más rápidas. Agrega nombres, fotos y notas a tus contactos para identificarlos fácilmente. Los contactos guardados hacen que enviar dinero sea más rápido y seguro.
      </p>

      <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Solicitudes de Pago
      </h3>
      <p style={{ fontSize: typography.fontSize.base, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Envía solicitudes de pago a tus contactos. Crea facturas personalizadas con descripción de productos o servicios. Los destinatarios recibirán una notificación y podrán pagar directamente desde la aplicación.
      </p>

      <p style={{ fontSize: typography.fontSize.xs, color: colors.semantic.text.tertiary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Las transacciones están protegidas con encriptación SSL y cumplen con los estándares PCI DSS. Todas las operaciones son monitoreadas las 24 horas para detectar actividad fraudulenta.
      </p>
    </div>
  );
}

