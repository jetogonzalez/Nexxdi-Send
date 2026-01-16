/**
 * Tokens para Segmented Button
 * Archivo separado para evitar problemas de compilación con Astro 5
 */

export const segmentedButton = {
  // Dimensiones
  dimensions: {
    height: '52px', // Altura fija según especificaciones
    minWidth: '0', // Sin ancho mínimo, se adapta al contenido
  },
  // Espaciado (valores literales para evitar problemas de orden de evaluación)
  spacing: {
    containerPadding: '0', // Sin padding en el contenedor
    buttonPaddingX: '1rem', // 16px horizontal (spacing[4])
    buttonPaddingY: '0.75rem', // 12px vertical (spacing[3])
    gap: '0', // Sin gap entre botones (se unen visualmente)
  },
  // Tipografía (valores literales)
  typography: {
    fontSize: '0.875rem', // 14px (typography.fontSize.sm)
    fontWeight: '700', // Bold (typography.fontWeight.bold)
    lineHeight: '1.5', // Normal (typography.lineHeight.normal)
    fontFamily: 'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', // Manrope
  },
  // Colores (valores literales)
  colors: {
    background: '#ddd9e7', // Fondo del contenedor
    activeIndicator: {
      background: '#ffffff', // Fondo blanco del indicador activo (colors.semantic.background.white)
      shadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', // Sombra sutil (shadows.sm)
    },
    text: {
      active: '#101828', // Texto activo (colors.semantic.text.primary - tokenizado)
      inactive: '#4b5563', // Texto inactivo (colors.gray[600] - tokenizado, mejor contraste ~4.8:1, accesible WCAG AA)
    },
  },
  // Animación (valores literales)
  animation: {
    duration: '300ms', // Slow (transitions.duration.slow)
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // easeInOut (transitions.easing.easeInOut)
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  // Bordes (valores literales)
  borders: {
    radius: '9999px', // Full rounded (borderRadius.full)
    width: '0', // Sin borde (borderWidth[0])
  },
  // Layout
  layout: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    width: '100%', // Ancho completo
  },
} as const;
