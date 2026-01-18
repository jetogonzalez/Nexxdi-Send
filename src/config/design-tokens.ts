/**
 * Design Tokens - Nexxdi Cash
 * 
 * Tokens de diseño centralizados para mantener consistencia
 * en toda la aplicación. Estos tokens pueden ser importados
 * y usados en componentes Astro y React.
 */

import { segmentedButton } from './segmented-button-tokens';
import { transitions } from './transitions-tokens';

// ============================================
// Colores
// ============================================

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
    tarjetaStart: '#F16DE6', // Inicio del gradiente en tarjeta (rosa claro)
    tarjetaEnd: '#AD419B', // Fin del gradiente en tarjeta (rosa oscuro)
    // Gradiente de fondo para vista Tarjeta
    tarjetaViewStart: '#0D0097', // Azul oscuro (inicio)
    tarjetaViewMid: '#3A29E9', // Azul principal (medio)
    tarjetaViewEnd: '#F0EFF8', // Gris claro (fin - igual que background.main)
  },
  // Colores de iconos
  icon: {
    default: '#101828', // Color por defecto de iconos
  },
} as const;

export const colors = {
  // ============================================
  // Colores Primarios - Nexxdi Cash
  // ============================================
  primary: {
    main: '#3A29E9', // Color principal (splash)
    light: '#5A4AFF',
    dark: '#2A19D9',
  },
  
  // ============================================
  // Colores Semánticos - Nexxdi Cash
  // ============================================
  semantic: {
    // Backgrounds
    background: {
      main: '#F0EFF8', // Fondo general
      secondary: '#f3f4f6', // Fondo secundario (gris claro para hover)
      imageCircle: 'rgba(255, 255, 255, 0.4)', // Círculo detrás de imágenes (40% opacidad)
      white: primitiveColors.white, // Blanco (referencia a primitivo)
      tabButtonActive: 'rgba(255, 255, 255, 0.4)', // Fondo del tab button activo
      tabBar: 'rgba(255, 255, 255, 0.4)', // Fondo del tab bar
      navItemActive: 'rgba(239, 238, 253, 0.8)', // #EFEEFD con 80% de opacidad (item activo bottom navigation)
      cardButtonIcon: 'rgba(255, 255, 255, 0.15)', // Fondo del botón de icono en la card (15% opacidad)
      cardButtonIconHover: 'rgba(255, 255, 255, 0.25)', // Hover del botón de icono en la card (25% opacidad)
      frequentSendIcon: '#00000010', // Fondo del icono en cards de envíos frecuentes (#00000010 - hex con alpha)
    },
    
    // Text
    text: {
      primary: primitiveColors.icon.default, // Texto primario (referencia a primitivo)
      secondary: '#6b7280', // Texto secundario
      tertiary: '#9ca3af', // Texto terciario
      tabInactive: '#9ca3af', // Color para tabs inactivos (iconos y textos)
      contactName: '#080816', // Color específico para nombres de contactos
    },
    
    // Iconos
    icon: {
      default: primitiveColors.icon.default, // Color por defecto de iconos (referencia a primitivo)
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
    
    // Buttons
    button: {
      primary: primitiveColors.icon.default, // Botón primario (referencia a primitivo)
      primaryHover: '#1f2937', // Hover del botón primario
      secondary: 'rgba(0, 0, 0, 0.05)', // Botón secundario (5% opacidad)
      secondaryHover: 'rgba(0, 0, 0, 0.08)', // Hover del botón secundario
    },
    
    // Borders
    border: {
      subtle: 'rgba(0, 0, 0, 0.08)', // Borde sutil para cards
      light: 'rgba(0, 0, 0, 0.05)', // Borde muy suave (5% opacidad)
      medium: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(0, 0, 0, 0.2)',
    },
    
    // Colores de fondo para avatares de movimientos (capa media)
    movementAvatar: {
      carulla: '#7DBE42', // Verde Carulla
      netflix: '#141414', // Color oscuro Netflix
      amazon: '#ffffff', // Blanco Amazon
    },
  },
  
  // Colores legacy (mantener compatibilidad)
  splash: '#3A29E9',
  background: '#F0EFF8',
  textPrimary: '#101828',
  buttonPrimary: '#101828',
  buttonSecondary: 'rgba(0, 0, 0, 0.05)',
  
  // Colores primarios (escala numérica - usar primary.main para el color principal)
  primaryScale: {
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

  // Colores secundarios
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Color secundario
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Colores de estado
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
    500: '#F04438', // Color del indicador de notificación del header
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

  // Escala de grises
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

  // Colores base (referencias a primitivos)
  white: primitiveColors.white,
  black: primitiveColors.black,
  transparent: primitiveColors.transparent,
  
  // ============================================
  // Colores Primitivos - Exportados para referencia directa
  // ============================================
  primitive: primitiveColors,
} as const;

// ============================================
// Tipografía
// ============================================

export const typography = {
  // Familias de fuentes
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

  // Tamaños de fuente (convertidos de pt a rem: pt/16)
  fontSize: {
    xs: '0.75rem',      // 12px / 12pt
    sm: '0.875rem',     // 14px / 14pt
    base: '1rem',       // 16px / 16pt (párrafos)
    lg: '1.125rem',     // 18px / 18pt
    xl: '1.25rem',      // 20px / 20pt
    '2xl': '1.5rem',    // 24px / 24pt
    '3xl': '1.625rem',  // 26px / 26pt (títulos onboarding)
    '4xl': '2.25rem',   // 36px / 36pt
    '5xl': '3rem',      // 48px / 48pt
  },

  // Pesos de fuente
  fontWeight: {
    light: '300',
    normal: '400',      // Regular (párrafos)
    medium: '500',
    semibold: '600',    // Semibold (títulos)
    bold: '700',        // Bold (botones)
    extrabold: '800',
  },

  // Alturas de línea
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
    fontSize: '2.25rem', // 36px (4xl)
    fontWeight: 800, // extrabold
    lineHeight: '1', // none
    color: colors.semantic.text.primary, // #101828
    fontFamily: ['Manrope', 'sans-serif'].join(', '), // Manrope
  },
  
  // Texto de código de moneda en cards de divisa/stablecoin
  currencyCode: {
    fontSize: '0.875rem', // 14px
    fontWeight: 700, // bold
    lineHeight: '1.25rem', // 20px
    letterSpacing: '0%', // 0%
    fontFamily: ['Manrope', 'sans-serif'].join(', '), // Manrope
  },
} as const;

// ============================================
// Espaciado
// ============================================

export const spacing = {
  // Regla de 8px (0.5rem) con casos especiales de 2px y 4px
  0: '0',
  0.5: '0.125rem',  // 2px (caso especial)
  1: '0.25rem',     // 4px (caso especial)
  1.5: '0.375rem',  // 6px (caso especial para notification dot)
  2: '0.5rem',      // 8px (base)
  3: '0.75rem',     // 12px (8px + 4px)
  4: '1rem',        // 16px (8px * 2)
  5: '1.25rem',     // 20px (8px * 2.5)
  6: '1.5rem',      // 24px (8px * 3)
  7: '1.75rem',     // 28px (8px * 3.5)
  8: '2rem',        // 32px (8px * 4)
  10: '2.5rem',     // 40px (8px * 5)
  12: '3rem',       // 48px (8px * 6)
  16: '4rem',       // 64px (8px * 8)
  20: '5rem',       // 80px (8px * 10)
  24: '6rem',       // 96px (8px * 12)
  25: '6.25rem',    // 100px - header overlap
  32: '8rem',       // 128px (8px * 16)
  // Tamaños específicos para imágenes
  imageCircle: '17.5rem', // 280px - círculo detrás de imágenes
  imageSize: '16rem',    // 256px - tamaño de imagen
} as const;

// ============================================
// Bordes
// ============================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  '4xl': '2.125rem', // 34px - para bottom sheets
  full: '9999px',
} as const;

export const borderWidth = {
  0: '0',
  1: '2px', // 2px para bordes estándar
  2: '2px',
  4: '4px',
  8: '8px',
} as const;

// ============================================
// Tokens para Botones
// ============================================

export const button = {
  // Padding vertical (regla de 4px)
  paddingY: spacing[3], // 12px (4px * 3)
  // Padding horizontal
  paddingX: spacing[6], // 24px (4px * 6)
  // Altura mínima (regla de 4px)
  minHeight: spacing[12], // 48px (4px * 12) - mínimo táctil iOS
  // Altura compacta (regla de 4px)
  heightCompact: spacing[10], // 40px (4px * 10)
} as const;

// ============================================
// Tokens para Bottom Navigation
// ============================================

export const bottomNavigation = {
  // Tipografía
  typography: {
    fontSize: typography.fontSize.xs, // 12px
    fontWeight: typography.fontWeight.semibold, // 600 (semibold - un peso menos que bold)
    lineHeight: '1.5', // 18px (1.5 * 12px según Figma)
    fontFamily: typography.fontFamily.sans.join(', '), // Manrope, sans-serif
  },
  // Iconos
  icon: {
    size: 24, // 24px - iconos más pequeños
    containerSize: spacing[8], // 32px - tamaño del contenedor del icono
  },
  // Colores
  colors: {
    activeText: '#402FEC', // Color del texto activo en navigation bar
    inactiveText: '#8d8d8e', // Gris según Figma
    activeBackground: colors.semantic.background.navItemActive, // #EFEEFD al 80% (tokenizado)
    // Colores de iconos (tokenizados globalmente)
    iconActive: '#402FEC', // Color azul para iconos activos
    iconInactive: '#8d8d8e', // Gris para iconos inactivos
  },
  // Espaciado
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
  // Layout
  layout: {
    flexNormal: 1, // Flex normal para items estándar
    flexWide: 1.2, // Flex más ancho para SendCard y Contactos
    minHeight: spacing[12], // 48px mínimo táctil
  },
  // Z-Index
  zIndex: {
    background: 0, // Fondo animado (número, no string)
    content: 10, // Contenido sobre el fondo (número, no string)
  },
  // Efectos
  effects: {
    backgroundTransition: `left ${transitions.duration.base} ${transitions.easing.easeOut}, width ${transitions.duration.base} ${transitions.easing.easeOut}`,
    colorTransition: `color ${transitions.duration.base} ${transitions.easing.easeInOut}`,
    backgroundColorTransition: `background-color ${transitions.duration.base} ${transitions.easing.easeInOut}`,
  },
  // Bordes
  borders: {
    none: borderWidth[0], // Sin borde
    radius: borderRadius.full, // Full rounded (9999px)
  },
  // Estilos del navigation bar
  navigationBar: {
    background: 'rgba(255, 255, 255, 0.51)', // Background del navigation bar
    border: '1px solid rgba(154, 150, 184, 0.10)', // Border tokenizado
    borderRadius: borderRadius.full, // 9999px
    backdropFilter: 'blur(6px)', // blur(6px) tokenizado
  },
} as const;

// ============================================
// Tokens para Bottom Sheet
// ============================================

export const bottomSheet = {
  // Padding general
  padding: spacing[2], // 8px
  // Border radius general
  borderRadius: borderRadius['4xl'], // 34px
  // Graber (barra superior para arrastrar)
  graber: {
    width: '34px', // Ancho del graber
    height: '4px', // Altura del graber
    topDistance: '5px', // Distancia del top (5px)
    touchArea: '40px', // Área reactiva de 40x40px
  },
  // Header
  header: {
    height: '34px', // Altura del header
    iconButtonSize: '34px', // Tamaño de botones de iconos (34x34px)
  },
} as const;

// ============================================
// Sombras
// ============================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

// ============================================
// Liquid Glass Effect (iOS 16 style)
// ============================================

export const liquidGlass = {
  // Backdrop blur values
  blur: {
    xs: 'blur(6px)', // Blur suave para navigation bottom (según Figma)
    sm: 'blur(10px)',
    md: 'blur(20px)',
    lg: 'blur(32px)', // Blur para tab bar (tokenizado)
    xl: 'blur(40px)',
  },
  // Background colors with transparency
  background: {
    light: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(0, 0, 0, 0.3)',
    // iOS 16 style - más translúcido
    lightTranslucent: 'rgba(255, 255, 255, 0.8)',
    darkTranslucent: 'rgba(0, 0, 0, 0.4)',
    // Navigation bottom según Figma
    navigationBottom: 'rgba(255, 255, 255, 0.51)', // 51% de opacidad según Figma
  },
  // Border colors
  border: {
    light: 'rgba(255, 255, 255, 0.18)',
    dark: 'rgba(0, 0, 0, 0.1)',
    // Navigation bar border específico
    navigationBar: 'rgba(154, 150, 184, 0.10)', // Border del navigation bar
  },
  // Saturation for the glass effect
  saturation: {
    normal: 'saturate(180%)',
    high: 'saturate(200%)',
  },
} as const;

// ============================================
// Breakpoints (para responsive)
// ============================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================
// Transiciones
// ============================================
// Importado desde transitions-tokens.ts para evitar problemas de bundling

// ============================================
// Z-index layers
// ============================================

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ============================================
// Tema (modo claro/oscuro)
// ============================================

export const theme = {
  light: {
    background: colors.white,
    foreground: colors.gray[900],
    primary: colors.primaryScale[500],
    secondary: colors.secondary[500],
    muted: colors.gray[100],
    border: colors.gray[200],
  },
  dark: {
    background: colors.gray[900],
    foreground: colors.white,
    primary: colors.primaryScale[400],
    secondary: colors.secondary[400],
    muted: colors.gray[800],
    border: colors.gray[700],
  },
} as const;

// ============================================
// Tokens para Header
// ============================================

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
  // Colores (referencias a semánticos y primitivos)
  colors: {
    // Fondo del header según la vista
    background: {
      home: colors.semantic.background.white, // Blanco en home (referencia a semántico)
      wallet: colors.semantic.background.white, // Blanco en wallet (referencia a semántico)
      cash: colors.semantic.background.white, // Blanco en cash
      tarjeta: 'rgba(255, 255, 255, 0.1)', // Blanco al 10% en tarjeta
      mas: colors.semantic.background.white, // Blanco en mas
    },
    // Fondo de botones de iconos según la vista (tokenizado por componente)
    buttonBackground: {
      home: colors.semantic.background.white, // Blanco en home
      wallet: colors.semantic.background.white, // Blanco en wallet
      cash: colors.semantic.background.white, // Blanco en cash
      tarjeta: 'rgba(255, 255, 255, 0.1)', // Blanco al 10% en tarjeta
      mas: colors.semantic.background.white, // Blanco en mas
    },
    // Hover state de botones de iconos (tokenizado por componente)
    buttonBackgroundHover: {
      home: colors.gray[50], // Gris claro en home/wallet (referencia a primitivo)
      wallet: colors.gray[50], // Gris claro en home/wallet (referencia a primitivo)
      cash: colors.gray[50], // Gris claro en cash
      tarjeta: 'rgba(255, 255, 255, 0.15)', // Blanco al 15% en tarjeta (hover)
      mas: colors.gray[50], // Gris claro en mas
    },
    // Fondo del avatar
    avatarBackground: colors.gray[300], // Gris claro para fondo del avatar (referencia a primitivo)
    // Color de iconos según la vista (referencias a semánticos)
    icon: {
      default: colors.semantic.icon.default, // Color por defecto (referencia a semántico)
      home: colors.semantic.icon.default, // Color en home (referencia a semántico)
      wallet: colors.semantic.icon.default, // Color en wallet (referencia a semántico)
      cash: colors.semantic.icon.default, // Color en cash (referencia a semántico)
      // En tarjeta: ojo y búsqueda usan default, solo regalo usa gradiente
      tarjeta: colors.semantic.icon.default, // Color default también en tarjeta para ojo y búsqueda
      tarjetaGift: colors.semantic.background.white, // Solo para regalo en tarjeta (gradiente)
      mas: colors.semantic.icon.default, // Color en mas (referencia a semántico)
    },
    // Gradientes para iconos específicos (referencias a semánticos)
    gradients: {
      // Gradiente para el icono de regalo en home
      giftHome: {
        id: 'paint0_linear_gift_home',
        start: colors.semantic.icon.gradient.giftHome.start, // Referencia a semántico
        end: colors.semantic.icon.gradient.giftHome.end, // Referencia a semántico
      },
      // Gradiente para iconos en tarjeta
      tarjeta: {
        id: 'paint0_linear_tarjeta',
        start: colors.semantic.icon.gradient.tarjeta.start, // Referencia a semántico
        end: colors.semantic.icon.gradient.tarjeta.end, // Referencia a semántico
      },
    },
    // Indicador de notificación
    notification: colors.error[500], // #F04438
    // Borde del indicador de notificación (igual al fondo de contenido)
    notificationBorder: colors.semantic.background.main, // #F0EFF8 (referencia a semántico)
  },
  // Bordes
  borders: {
    notificationBorderWidth: borderWidth[1], // 2px
  },
} as const;

// ============================================
// Re-exportar tokens importados para mantener compatibilidad
// ============================================

export { segmentedButton, transitions, bottomSheet };

// ============================================
// Exportación por defecto
// ============================================

export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  borderWidth,
  shadows,
  breakpoints,
  transitions,
  zIndex,
  theme,
  button,
  bottomNavigation,
  bottomSheet,
  segmentedButton,
} as const;

export default designTokens;
