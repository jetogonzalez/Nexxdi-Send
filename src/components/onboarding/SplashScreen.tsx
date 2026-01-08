import { useEffect } from 'react';
import { colors } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

export default function SplashScreen() {
  useEffect(() => {
    // Mostrar splash por 2 segundos, luego redirigir a onboarding
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/onboarding';
      }
    }, 2000);

    return () => clearTimeout(timer);
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
        transition: `opacity ${motion.duration.slow} ${motion.easing.smoothOut}`,
      }}
    >
      <img
        src="/img/nexxdi-send-logo.svg"
        alt="Nexxdi Send"
        style={{
          width: '200px',
          height: 'auto',
          animation: `fadeInScale ${motion.duration.slow} ${motion.easing.smoothOut}`,
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
