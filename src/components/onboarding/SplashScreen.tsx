import { useEffect, useState, useRef } from 'react';
import { colors } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

export default function SplashScreen() {
  const [isExiting, setIsExiting] = useState(false);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('SplashScreen montado, iniciando timer de redirección');
    
    // Mostrar splash por 2.5 segundos, luego fade out y redirigir
    const showTimer = setTimeout(() => {
      console.log('Iniciando fade out');
      setIsExiting(true);
      
      // Redirigir después del fade out (400ms = motion.duration.base)
      redirectTimerRef.current = setTimeout(() => {
        console.log('Redirigiendo a /onboarding');
        if (typeof window !== 'undefined') {
          try {
            window.location.href = '/onboarding';
          } catch (error) {
            console.error('Error al redirigir:', error);
            // Fallback: usar replace
            window.location.replace('/onboarding');
          }
        }
      }, 400); // Esperar a que termine el fade out (motion.duration.base = 400ms)
    }, 2500); // Mostrar por 2.5 segundos

    return () => {
      console.log('Limpiando timers del SplashScreen');
      clearTimeout(showTimer);
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.primary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: isExiting ? 0 : 1,
        transition: `opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
        pointerEvents: isExiting ? 'none' : 'auto',
      }}
    >
      <img
        src="/img/nexxdi-send-logo.svg"
        alt="Nexxdi Send"
        style={{
          width: '200px',
          height: 'auto',
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? 'scale(0.9)' : 'scale(1)',
          transition: `opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
          animation: !isExiting ? `fadeInScale 400ms cubic-bezier(0.16, 1, 0.3, 1)` : 'none',
        }}
      />
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
