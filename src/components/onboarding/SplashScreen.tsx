import { useEffect, useState, useRef } from 'react';
import { colors } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

export default function SplashScreen() {
  const [isExiting, setIsExiting] = useState(false);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Mostrar splash por 2.5 segundos, luego fade out y redirigir
    const showTimer = setTimeout(() => {
      setIsExiting(true);
      
      // Redirigir después del fade out
      redirectTimerRef.current = setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/onboarding';
        }
      }, parseInt(motion.duration.base.replace('ms', ''))); // Esperar a que termine el fade out
    }, 2500); // Mostrar por 2.5 segundos - más tiempo para que no sea tan inmediato

    return () => {
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
        transition: `opacity ${motion.duration.base} ${motion.easing.smoothOut}`,
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
          transition: `opacity ${motion.duration.base} ${motion.easing.smoothOut}, transform ${motion.duration.base} ${motion.easing.smoothOut}`,
          animation: !isExiting ? `fadeInScale ${motion.duration.base} ${motion.easing.smoothOut}` : 'none',
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
