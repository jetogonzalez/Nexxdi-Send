/**
 * Design Tokens - Nexxdi Cash (JavaScript version for Tailwind)
 * 
 * Versión JavaScript de los tokens para compatibilidad con Tailwind
 * Los tokens TypeScript son la fuente de verdad, este es un alias
 */

// ============================================
// Colores Primitivos - Colores base del sistema
// ============================================
const primitiveColors = {
  // Colores base
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  
  // Colores de gradientes para header
  gradient: {
    giftHomeStart: '#3023C3', // Inicio del gradiente del regalo en home
    giftHomeEnd: '#25133D', // Fin del gradiente del regalo en home
    tarjetaStart: '#FFFFFF', // Inicio del gradiente en tarjeta (blanco)
    tarjetaEnd: '#F97FC4', // Fin del gradiente en tarjeta (rosa)
  },
  // Colores de iconos
  icon: {
    default: '#101828', // Color por defecto de iconos
  },
};

export const colors = {
  // Colores Primarios - Nexxdi Cash
  primary: {
    main: '#3A29E9',
    light: '#5A4AFF',
    dark: '#2A19D9',
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Colores Semánticos - Nexxdi Cash
  semantic: {
    background: {
      main: '#F0EFF8',
      imageCircle: 'rgba(255, 255, 255, 0.4)',
      white: primitiveColors.white, // Referencia a primitivo
      tabButtonActive: 'rgba(255, 255, 255, 0.4)',
      tabBar: 'rgba(255, 255, 255, 0.4)',
      navItemActive: 'rgba(239, 238, 253, 0.8)', // #EFEEFD con 80% de opacidad (item activo bottom navigation)
      cardButtonIcon: 'rgba(255, 255, 255, 0.15)', // Fondo del botón de icono en la card (15% opacidad)
      cardButtonIconHover: 'rgba(255, 255, 255, 0.25)', // Hover del botón de icono en la card (25% opacidad)
    },
    text: {
      primary: primitiveColors.icon.default, // Referencia a primitivo
      secondary: '#6b7280',
      tertiary: '#9ca3af',
      tabInactive: '#9ca3af',
    },
    // Iconos
    icon: {
      default: primitiveColors.icon.default, // Referencia a primitivo
      // Gradientes semánticos
      gradient: {
        giftHome: {
          start: primitiveColors.gradient.giftHomeStart,
          end: primitiveColors.gradient.giftHomeEnd,
        },
        tarjeta: {
          start: primitiveColors.gradient.tarjetaStart,
          end: primitiveColors.gradient.tarjetaEnd,
        },
      },
    },
    button: {
      primary: '#101828',
      primaryHover: '#1f2937',
      secondary: 'rgba(0, 0, 0, 0.05)',
      secondaryHover: 'rgba(0, 0, 0, 0.08)',
    },
    border: {
      light: 'rgba(0, 0, 0, 0.1)',
      medium: 'rgba(0, 0, 0, 0.2)',
    },
  },
  
  // Colores legacy (compatibilidad)
  splash: '#3A29E9',
  background: '#F0EFF8',
  textPrimary: '#101828',
  buttonPrimary: '#101828',
  buttonSecondary: 'rgba(0, 0, 0, 0.05)',
  
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

export const spacing = {
  // Regla de 8px (0.5rem) con casos especiales de 2px y 4px
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px (base)
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
  // Tamaños específicos para imágenes
  imageCircle: '17.5rem', // 280px - círculo detrás de imágenes
  imageSize: '16rem',    // 256px - tamaño de imagen
};

export const typography = {
  fontFamily: {
    sans: [
      'Manrope',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ],
    mono: [
      'Menlo',
      'Monaco',
      '"Courier New"',
      'monospace',
    ],
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px (párrafos)
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.625rem',  // 26px (títulos onboarding)
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Títulos de sección (tokenizados)
  sectionTitle: {
    fontSize: '2.25rem', // 36px
    fontWeight: '800', // Extrabold
    lineHeight: '1', // normal
    color: '#101828', // Color primario de texto
    fontFamily: 'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', // Manrope
  },
  
  // Texto de código de moneda en cards de divisa/stablecoin
  currencyCode: {
    fontSize: '0.875rem', // 14px
    fontWeight: '700', // Bold
    lineHeight: '1.25rem', // 20px
    letterSpacing: '0%', // 0%
    fontFamily: 'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', // Manrope
  },
};

// Tokens para Header
export const header = {
  // Tamaños
  sizes: {
    profileImage: spacing[12], // 48px
    actionIcon: spacing[10], // 40px
    notificationDot: spacing[3], // 12px de diámetro
  },
  // Espaciado
  spacing: {
    actionsGap: spacing[3], // 12px entre acciones del header
  },
  // Colores
  colors: {
    // Fondo del header según la vista
    background: {
      home: '#FFFFFF', // Blanco en home
      wallet: '#FFFFFF', // Blanco en wallet
      tarjeta: 'rgba(255, 255, 255, 0.1)', // Blanco al 10% en tarjeta
    },
    // Fondo de botones de iconos según la vista (tokenizado por componente)
    buttonBackground: {
      home: '#FFFFFF', // Blanco en home
      wallet: '#FFFFFF', // Blanco en wallet
      tarjeta: 'rgba(255, 255, 255, 0.1)', // Blanco al 10% en tarjeta
    },
    // Hover state de botones de iconos (tokenizado por componente)
    buttonBackgroundHover: {
      home: '#f9fafb', // Gris claro en home/wallet (gray[50])
      wallet: '#f9fafb', // Gris claro en home/wallet (gray[50])
      tarjeta: 'rgba(255, 255, 255, 0.15)', // Blanco al 15% en tarjeta (hover)
    },
    // Fondo del avatar (tokenizado por componente)
    avatarBackground: '#d1d5db', // Gris claro para fondo del avatar (gray[300])
    // Color de iconos según la vista (referencias a semánticos)
    icon: {
      default: primitiveColors.icon.default, // Color por defecto
      home: primitiveColors.icon.default, // Color en home
      wallet: primitiveColors.icon.default, // Color en wallet
      // En tarjeta: ojo y búsqueda usan default, solo regalo usa gradiente
      tarjeta: primitiveColors.icon.default, // Color default también en tarjeta para ojo y búsqueda
      tarjetaGift: primitiveColors.white, // Solo para regalo en tarjeta (gradiente)
    },
    // Gradientes para iconos específicos (referencias a semánticos)
    gradients: {
      // Gradiente para el icono de regalo en home
      giftHome: {
        id: 'paint0_linear_gift_home',
        start: primitiveColors.gradient.giftHomeStart,
        end: primitiveColors.gradient.giftHomeEnd,
      },
      // Gradiente para iconos en tarjeta
      tarjeta: {
        id: 'paint0_linear_tarjeta',
        start: primitiveColors.gradient.tarjetaStart,
        end: primitiveColors.gradient.tarjetaEnd,
      },
    },
    // Indicador de notificación
    notification: '#F04438',
    // Borde del indicador de notificación (igual al fondo de contenido)
    notificationBorder: '#F0EFF8',
  },
  // Bordes
  borders: {
    notificationBorderWidth: '2px',
  },
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

// Tokens para Botones (regla de 4px)
export const button = {
  paddingY: spacing[3], // 12px (4px * 3)
  paddingX: spacing[6], // 24px (4px * 6)
  minHeight: spacing[12], // 48px (4px * 12) - mínimo táctil iOS
  heightCompact: spacing[10], // 40px (4px * 10)
};

// Tokens para Bottom Navigation
export const bottomNavigation = {
  typography: {
    fontSize: typography.fontSize.xs, // 12px
    fontWeight: typography.fontWeight.semibold, // 600 (semibold - un peso menos que bold)
    lineHeight: '1.5', // 18px (1.5 * 12px según Figma)
    fontFamily: typography.fontFamily.sans.join(', '), // Manrope, sans-serif
  },
  icon: {
    size: 24, // 24px - iconos más pequeños
    containerSize: spacing[8], // 32px - tamaño del contenedor del icono
  },
  colors: {
    activeText: '#2A1AD1', // Color del texto activo en navigation bar
    inactiveText: '#8d8d8e', // Gris según Figma
    activeBackground: 'rgba(239, 238, 253, 0.8)', // #EFEEFD al 80% (tokenizado)
    // Colores de iconos (tokenizados globalmente)
    iconActive: '#3A29E9', // Color azul para iconos activos
    iconInactive: '#8d8d8e', // Gris para iconos inactivos
  },
  spacing: {
    gap: '-2px', // Gap negativo para acercar icono y texto
    labelMarginTop: '-2px', // Margin negativo pequeño para acercar
    containerPadding: spacing[1], // 4px según Figma
    itemPaddingY: spacing[1], // 4px según Figma
    itemPaddingYContactos: spacing[2], // 8px para Contactos
    itemPaddingXContactos: spacing[1], // 4px para Contactos
    itemPaddingXSendCard: spacing[0.5], // 2px para SendCard
    iconMarginBottomContactos: spacing[0.5], // 2px debajo del icono para Contactos
    containerGap: spacing[0], // 0px - sin gap entre tabs
  },
  layout: {
    flexNormal: 1, // Flex normal para items estándar
    flexWide: 1.2, // Flex más ancho para SendCard y Contactos
    minHeight: spacing[12], // 48px mínimo táctil
  },
  zIndex: {
    background: 0, // Fondo animado (número, no string)
    content: 10, // Contenido sobre el fondo (número, no string)
  },
  effects: {
    backgroundTransition: 'left 400ms cubic-bezier(0.16, 1, 0.3, 1), width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
    colorTransition: 'color 400ms cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColorTransition: 'background-color 400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  borders: {
    none: '0', // Sin borde
    radius: borderRadius.full, // Full rounded
  },
  // Estilos del navigation bar
  navigationBar: {
    background: 'rgba(255, 255, 255, 0.51)', // Background del navigation bar
    border: '1px solid rgba(154, 150, 184, 0.10)', // Border tokenizado
    borderRadius: borderRadius.full, // 9999px
    backdropFilter: 'blur(6px)', // blur(6px) tokenizado
  },
};

// Liquid Glass Effect (iOS 16 style)
export const liquidGlass = {
  blur: {
    xs: 'blur(6px)', // Blur suave para navigation bottom (según Figma)
    sm: 'blur(10px)',
    md: 'blur(20px)',
    lg: 'blur(32px)', // Blur para tab bar (tokenizado)
    xl: 'blur(40px)',
  },
  background: {
    light: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(0, 0, 0, 0.3)',
    lightTranslucent: 'rgba(255, 255, 255, 0.8)',
    darkTranslucent: 'rgba(0, 0, 0, 0.4)',
    navigationBottom: 'rgba(255, 255, 255, 0.51)', // 51% de opacidad según Figma
  },
  border: {
    light: 'rgba(255, 255, 255, 0.18)',
    dark: 'rgba(0, 0, 0, 0.1)',
    // Navigation bar border específico
    navigationBar: 'rgba(154, 150, 184, 0.10)', // Border del navigation bar
  },
  saturation: {
    normal: 'saturate(180%)',
    high: 'saturate(200%)',
  },
};
