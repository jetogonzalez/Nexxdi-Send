/**
 * Motion & Transitions - Send App
 * 
 * Configuración centralizada de animaciones y transiciones
 */

export const motion = {
  // Duración de transiciones
  duration: {
    fast: '200ms',
    base: '300ms',
    slow: '500ms',
    slower: '800ms',
    slowest: '1200ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Easing suave para onboarding
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    // Easing para transiciones de pantalla
    screenTransition: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Transiciones predefinidas
  transitions: {
    // Transición de pantalla (slide)
    screenSlide: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
    // Fade in/out
    fade: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    // Fade + scale
    fadeScale: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    // Slide + fade
    slideFade: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Delays
  delay: {
    none: '0ms',
    fast: '100ms',
    base: '200ms',
    slow: '300ms',
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
