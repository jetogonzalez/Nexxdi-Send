import { useState, useEffect, useRef } from 'react';

interface UseScrollTitleOptions {
  threshold?: number; // Píxeles de scroll antes de activar el título en header
}

/**
 * Hook para detectar scroll y determinar cuándo mostrar el título en el header
 * Inspirado en el comportamiento nativo de iOS
 */
export function useScrollTitle(options: UseScrollTitleOptions = {}) {
  const { threshold = 60 } = options;
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const titleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!titleRef.current) return;

      const titleRect = titleRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Calcular cuándo el título sale de la vista superior
      // Cuando titleRect.top es negativo, el título está fuera de la vista
      const titleTop = titleRect.top;
      const titleHeight = titleRect.height;
      
      // Progreso: 0 cuando el título está completamente visible, 1 cuando está completamente oculto
      // Usamos threshold como punto de inicio para la transición
      const startPoint = threshold;
      const endPoint = threshold + titleHeight;
      const currentPosition = scrollTop;
      
      let progress = 0;
      if (currentPosition >= startPoint) {
        progress = Math.min((currentPosition - startPoint) / (endPoint - startPoint), 1);
      }
      
      setScrollProgress(progress);
      setIsScrolled(progress > 0.1); // Activar cuando el título empiece a salir
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Llamar inmediatamente para estado inicial

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return {
    isScrolled,
    scrollProgress,
    titleRef,
  };
}
