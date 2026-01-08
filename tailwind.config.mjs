/** @type {import('tailwindcss').Config} */
import { colors, spacing, typography, borderRadius, shadows } from './src/config/design-tokens.js';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ...colors,
        // Aliases para uso más fácil
        primary: colors.primary[500],
        secondary: colors.secondary[500],
        success: colors.success[500],
        error: colors.error[500],
        warning: colors.warning[500],
        info: colors.info[500],
        // Colores específicos de Nexxdi Send
        splash: colors.splash,
        background: colors.background,
        textPrimary: colors.textPrimary,
        buttonPrimary: colors.buttonPrimary,
        buttonSecondary: colors.buttonSecondary,
      },
      spacing: spacing,
      fontSize: typography.fontSize,
      fontFamily: {
        sans: typography.fontFamily.sans,
        mono: typography.fontFamily.mono,
      },
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      borderRadius: borderRadius,
      boxShadow: shadows,
    },
  },
  plugins: [],
}
