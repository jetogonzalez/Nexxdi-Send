/**
 * Motion & Transitions - Nexxdi Cash
 * 
 * Configuración centralizada de animaciones y transiciones
 */

export const motion = {
  // Duración de transiciones (más variadas)
  duration: {
    instant: '150ms',
    fast: '250ms',
    base: '400ms',
    medium: '600ms',
    slow: '800ms',
    slower: '1000ms',
    slowest: '1200ms',
  },

  // Easing functions (más fluidas y diversas)
  easing: {
    linear: 'linear',
    // Easing estándar
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Easing suaves y fluidas
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    smoothOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    smoothIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
    // Easing para transiciones de pantalla (más fluidas)
    screenTransition: 'cubic-bezier(0.4, 0, 0.2, 1)',
    screenSlide: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    // Easing para elementos que aparecen
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    // Easing natural
    natural: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Transiciones predefinidas (más diversas y fluidas)
  transitions: {
    // Transición de pantalla (slide suave)
    screenSlide: 'transform 600ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    // Fade in/out suave
    fade: 'opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)',
    // Fade + scale (más fluida)
    fadeScale: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
    // Slide + fade (más fluida)
    slideFade: 'transform 600ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
    // Slide desde abajo (para textos)
    slideUp: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
    // Scale con bounce sutil
    scaleBounce: 'transform 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    // Fade con slide horizontal
    fadeSlideHorizontal: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },

  // Delays (más variados)
  delay: {
    none: '0ms',
    instant: '50ms',
    fast: '100ms',
    base: '150ms',
    medium: '200ms',
    slow: '300ms',
    slower: '400ms',
  },
} as const;

// Helper para crear transiciones personalizadas
export const createTransition = (
  properties: string[],
  duration: keyof typeof motion.duration = 'base',
  easing: keyof typeof motion.easing = 'easeInOut',
  delay: keyof typeof motion.delay = 'none'
): string => {
  const durationValue = motion.duration[duration];
  const easingValue = motion.easing[easing];
  const delayValue = motion.delay[delay];
  
  return properties
    .map(prop => `${prop} ${durationValue} ${easingValue} ${delayValue}`)
    .join(', ');
};

export default motion;
