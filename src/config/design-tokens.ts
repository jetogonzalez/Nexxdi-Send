/**
 * Design Tokens - Send App
 * 
 * Tokens de diseño centralizados para mantener consistencia
 * en toda la aplicación. Estos tokens pueden ser importados
 * y usados en componentes Astro y React.
 */

// ============================================
// Colores
// ============================================

export const colors = {
  // ============================================
  // Colores Primarios - Nexxdi Send
  // ============================================
  primary: {
    main: '#3A29E9', // Color principal (splash)
    light: '#5A4AFF',
    dark: '#2A19D9',
  },
  
  // ============================================
  // Colores Semánticos - Nexxdi Send
  // ============================================
  semantic: {
    // Backgrounds
    background: {
      main: '#F0EFF8', // Fondo general
      imageCircle: 'rgba(255, 255, 255, 0.4)', // Círculo detrás de imágenes (40% opacidad)
      white: '#FFFFFF',
    },
    
    // Text
    text: {
      primary: '#101828', // Texto primario
      secondary: '#6b7280', // Texto secundario
      tertiary: '#9ca3af', // Texto terciario
    },
    
    // Buttons
    button: {
      primary: '#101828', // Botón primario
      primaryHover: '#1f2937', // Hover del botón primario
      secondary: 'rgba(0, 0, 0, 0.05)', // Botón secundario (5% opacidad)
      secondaryHover: 'rgba(0, 0, 0, 0.08)', // Hover del botón secundario
    },
    
    // Borders
    border: {
      light: 'rgba(0, 0, 0, 0.1)',
      medium: 'rgba(0, 0, 0, 0.2)',
    },
  },
  
  // Colores legacy (mantener compatibilidad)
  splash: '#3A29E9',
  background: '#F0EFF8',
  textPrimary: '#101828',
  buttonPrimary: '#101828',
  buttonSecondary: 'rgba(0, 0, 0, 0.05)',
  
  // Colores primarios
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Color principal
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

  // Colores base
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
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
} as const;

// ============================================
// Espaciado
// ============================================

export const spacing = {
  // Regla de 8px (0.5rem) con casos especiales de 2px y 4px
  0: '0',
  0.5: '0.125rem',  // 2px (caso especial)
  1: '0.25rem',     // 4px (caso especial)
  2: '0.5rem',      // 8px (base)
  3: '0.75rem',     // 12px (8px + 4px)
  4: '1rem',        // 16px (8px * 2)
  5: '1.25rem',     // 20px (8px * 2.5)
  6: '1.5rem',      // 24px (8px * 3)
  8: '2rem',        // 32px (8px * 4)
  10: '2.5rem',     // 40px (8px * 5)
  12: '3rem',       // 48px (8px * 6)
  16: '4rem',       // 64px (8px * 8)
  20: '5rem',       // 80px (8px * 10)
  24: '6rem',       // 96px (8px * 12)
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
  full: '9999px',
} as const;

export const borderWidth = {
  0: '0',
  1: '1px',
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
    sm: 'blur(10px)',
    md: 'blur(20px)',
    lg: 'blur(30px)',
    xl: 'blur(40px)',
  },
  // Background colors with transparency
  background: {
    light: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(0, 0, 0, 0.3)',
    // iOS 16 style - más translúcido
    lightTranslucent: 'rgba(255, 255, 255, 0.8)',
    darkTranslucent: 'rgba(0, 0, 0, 0.4)',
  },
  // Border colors
  border: {
    light: 'rgba(255, 255, 255, 0.18)',
    dark: 'rgba(0, 0, 0, 0.1)',
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

export const transitions = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

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
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    muted: colors.gray[100],
    border: colors.gray[200],
  },
  dark: {
    background: colors.gray[900],
    foreground: colors.white,
    primary: colors.primary[400],
    secondary: colors.secondary[400],
    muted: colors.gray[800],
    border: colors.gray[700],
  },
} as const;

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
} as const;

export default designTokens;
