import { useEffect } from 'react';

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
        backgroundColor: '#3A29E9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 500ms ease-out',
      }}
    >
      <img
        src="/img/nexxdi-send-logo.svg"
        alt="Nexxdi Send"
        style={{
          width: '200px',
          height: 'auto',
          animation: 'fadeIn 500ms ease-out',
        }}
      />
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
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
