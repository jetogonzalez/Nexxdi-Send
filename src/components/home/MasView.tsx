import { colors, spacing, typography } from '../../config/design-tokens';

export function MasView() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: spacing[4], // 16px
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
        Más
      </h1>
      <p
        style={{
          fontSize: typography.fontSize.base,
          color: colors.semantic.text.secondary,
          fontFamily: typography.fontFamily.sans.join(', '),
        }}
      >
        Configuración y más opciones
      </p>

      {/* Texto de diferentes tamaños */}
      <h2 style={{ fontSize: typography.fontSize['5xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Título Enorme (5xl - 48px)
      </h2>
      <p style={{ fontSize: typography.fontSize['3xl'], color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Párrafo extra grande (3xl - 26px) para secciones muy importantes en configuración.
      </p>

      <h3 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Título Muy Grande (4xl - 36px)
      </h3>
      <p style={{ fontSize: typography.fontSize['2xl'], color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Párrafo grande (2xl - 24px) con información sobre configuraciones disponibles.
      </p>

      <h4 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Título Grande (3xl - 26px)
      </h4>
      <p style={{ fontSize: typography.fontSize.xl, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Texto grande (xl - 20px) con detalles sobre opciones de personalización.
      </p>

      <p style={{ fontSize: typography.fontSize.lg, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Texto mediano (lg - 18px) con información sobre preferencias y ajustes.
      </p>

      <p style={{ fontSize: typography.fontSize.base, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Texto base (base - 16px) con instrucciones y guías de configuración.
      </p>

      <p style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Texto pequeño (sm - 14px) con información adicional sobre opciones avanzadas.
      </p>

      <p style={{ fontSize: typography.fontSize.xs, color: colors.semantic.text.tertiary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Texto muy pequeño (xs - 12px) para información técnica o términos legales.
      </p>

      {/* Más contenido para scroll */}
      <h2 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Perfil y Configuración
      </h2>
      <p style={{ fontSize: typography.fontSize['2xl'], color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Personaliza tu perfil y ajusta las configuraciones de la aplicación según tus preferencias. Cambia tu foto de perfil, actualiza tu información personal y gestiona tus preferencias de privacidad.
      </p>

      <h3 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Notificaciones
      </h3>
      <p style={{ fontSize: typography.fontSize.xl, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Controla qué notificaciones recibes y cómo las recibes. Activa o desactiva alertas para transacciones, promociones, actualizaciones de seguridad y más. Personaliza los sonidos y vibraciones para cada tipo de notificación.
      </p>

      <h4 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Seguridad y Autenticación
      </h4>
      <p style={{ fontSize: typography.fontSize.lg, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Gestiona tu seguridad: cambia tu contraseña, configura autenticación de dos factores, establece un PIN de seguridad y revisa los dispositivos conectados a tu cuenta.
      </p>

      <h2 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Métodos de Pago
      </h2>
      <p style={{ fontSize: typography.fontSize['2xl'], color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Administra tus métodos de pago guardados. Agrega nuevas tarjetas, cuentas bancarias o billeteras digitales. Establece métodos de pago predeterminados para transacciones rápidas.
      </p>

      <h3 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Preferencias de Idioma
      </h3>
      <p style={{ fontSize: typography.fontSize.xl, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Cambia el idioma de la aplicación según tu preferencia. Disponible en múltiples idiomas incluyendo español, inglés, portugués y más. La interfaz se actualiza automáticamente.
      </p>

      <h4 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Tema y Apariencia
      </h4>
      <p style={{ fontSize: typography.fontSize.lg, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Personaliza la apariencia de la aplicación. Elige entre modo claro u oscuro, ajusta el tamaño de fuente y personaliza los colores según tus preferencias visuales.
      </p>

      <h2 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Ayuda y Soporte
      </h2>
      <p style={{ fontSize: typography.fontSize['2xl'], color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Accede a la base de conocimiento, preguntas frecuentes y tutoriales en video. Contacta con nuestro equipo de soporte a través de chat en vivo, correo electrónico o teléfono.
      </p>

      <h3 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Términos y Condiciones
      </h3>
      <p style={{ fontSize: typography.fontSize.xl, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Revisa los términos y condiciones de uso, política de privacidad y acuerdos de servicio. Mantente informado sobre tus derechos y responsabilidades como usuario de la plataforma.
      </p>

      <h4 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
        Información de la Aplicación
      </h4>
      <p style={{ fontSize: typography.fontSize.lg, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Consulta la versión de la aplicación, información sobre actualizaciones disponibles y el historial de versiones. Mantén tu aplicación actualizada para acceder a las últimas funciones y mejoras de seguridad.
      </p>

      <p style={{ fontSize: typography.fontSize.xs, color: colors.semantic.text.tertiary, fontFamily: typography.fontFamily.sans.join(', '), lineHeight: typography.lineHeight.relaxed }}>
        Versión 1.0.0 - Última actualización: Enero 2024. Todos los derechos reservados.
      </p>
    </div>
  );
}
