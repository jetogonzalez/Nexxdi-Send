import { useState, useEffect } from 'react';
import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';
import { currentUser } from '../../config/userProfile';
import { LoginForm } from './LoginForm';
import { BottomSheet } from '../ui/BottomSheet';
import {
  createBiometricCredential,
} from '../../lib/biometricAuth';

export default function WelcomeScreen() {
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authProgress, setAuthProgress] = useState(0); // Progreso de autenticación (0-100)
  const [isFaceIDButtonActive, setIsFaceIDButtonActive] = useState(false);
  const [isLoginButtonActive, setIsLoginButtonActive] = useState(false);
  
  // Resetear progreso cuando no está autenticando
  useEffect(() => {
    if (!isAuthenticating) {
      setAuthProgress(0);
    }
  }, [isAuthenticating]);

  // Función de autenticación biométrica con animación progresiva del borde
  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    setAuthProgress(0);
    
    // Delay inicial antes de empezar la animación (400ms para que se vea natural)
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Duración total de la animación (2.2 segundos estilo Apple - cool e increíble)
    const duration = 2200; // ms
    const startTime = Date.now();
    
    // Función de easing personalizada estilo Apple:
    // - Empieza lento (ease-in)
    // - Acelera en el medio
    // - Se desacelera al final (ease-out)
    // - Curva muy suave y natural
    const appleEasing = (t: number): number => {
      // Curva personalizada que combina ease-in-out con un toque de elasticidad suave
      // Empieza lento, acelera rápido en el medio, y se desacelera suavemente al final
      if (t < 0.3) {
        // Primera parte: empieza muy lento (0-30%)
        return 0.15 * Math.pow(t / 0.3, 2);
      } else if (t < 0.85) {
        // Parte media: acelera rápido (30-85%)
        const midT = (t - 0.3) / 0.55;
        return 0.15 + 0.75 * (1 - Math.pow(1 - midT, 2.5));
      } else {
        // Parte final: se desacelera suavemente (85-100%)
        const endT = (t - 0.85) / 0.15;
        return 0.9 + 0.1 * (1 - Math.pow(1 - endT, 3));
      }
    };
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const normalizedTime = Math.min(elapsed / duration, 1);
      
      // Aplicar easing personalizado estilo Apple
      const easedProgress = appleEasing(normalizedTime) * 100;
      
      setAuthProgress(easedProgress);
      
      if (normalizedTime < 1) {
        requestAnimationFrame(animate);
      } else {
        // Cuando llegue al 100%, esperar un momento y navegar al home
        setTimeout(() => {
          window.location.href = '/home';
        }, 250);
      }
    };
    
    // Iniciar animación
    requestAnimationFrame(animate);
  };

  const handleUsePassword = () => {
    setShowLoginSheet(true);
  };

  const handleLoginSuccess = async (email: string, password: string, activateBiometric: boolean = false) => {
    // Validar que se ingresaron email y contraseña
    if (!email || !password) {
      return; // El formulario mostrará los errores de validación
    }
    
    // Simular login con usuario/contraseña
    // En producción: llamar al backend para validar credenciales
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Si el usuario quiere activar Face ID, crear credencial biométrica
    if (activateBiometric) {
      const userId = email.split('@')[0]; // Extraer userId del email
      const success = await createBiometricCredential(userId);
      
      if (!success) {
        // Si falla la creación de credencial biométrica, continuar con login normal
        console.warn('No se pudo activar Face ID, continuando con login normal');
      }
    }
    
    // Cerrar el bottom sheet y navegar al home
    setShowLoginSheet(false);
    window.location.href = '/home';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.semantic.background.main,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[5],
        position: 'relative',
      }}
    >
      {/* Contenido principal - posicionado dinámicamente */}
      <div
        style={{
          position: 'absolute',
          top: '34%', // Posición dinámica desde el top
          left: 0,
          right: 0,
          transform: 'translateY(-16%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing[6],
          padding: spacing[5],
        }}
      >
        {/* Foto de perfil con borde animado */}
        <div
          style={{
            width: '200px',
            height: '200px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Avatar sin borde */}
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: borderRadius.full,
              overflow: 'hidden',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <img
              src={currentUser.photo}
              alt="Usuario"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: borderRadius.full,
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          
          {/* Borde circular animado - solo visible cuando está autenticando */}
          {isAuthenticating && (
            <svg
              width="200"
              height="200"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: 'rotate(-90deg)', // Rotar para que empiece desde arriba
                zIndex: 2,
                borderRadius: '50%', // Asegurar que el SVG sea completamente circular
                overflow: 'visible', // Permitir que el stroke se vea completamente
              }}
            >
              {/* Borde animado que se completa progresivamente - completamente circular */}
              <circle
                cx="100"
                cy="100"
                r="97"
                fill="none"
                stroke={colors.primary.main}
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 97} // Circunferencia completa
                strokeDashoffset={2 * Math.PI * 97 * (1 - authProgress / 100)} // Offset basado en progreso
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  // Sin transición CSS, la animación se maneja con requestAnimationFrame para mayor control
                  willChange: 'stroke-dashoffset', // Optimización de rendimiento
                }}
              />
            </svg>
          )}
        </div>

        {/* Bloque de bienvenida - dos líneas con jerarquía visual */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing[1], // Espacio corto entre líneas (4px)
          }}
        >
          {/* Texto secundario - "Bienvenido de vuelta" */}
          <p
            style={{
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.base, // 16px - texto secundario
              fontWeight: typography.fontWeight.medium, // Un poco más de peso (500)
              color: colors.semantic.text.secondary, // Color secundario
              textAlign: 'center',
              margin: 0,
            }}
          >
            Bienvenido de vuelta
          </p>
          
          {/* Nombre - foco visual principal */}
          <h1
            style={{
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize['2xl'], // 24px - tamaño óptimo
              fontWeight: typography.fontWeight.extrabold, // Mayor peso visual
              color: colors.semantic.text.primary,
              textAlign: 'center',
              margin: 0,
              lineHeight: typography.lineHeight.tight, // Altura de línea ajustada
            }}
          >
            {currentUser.firstName}
          </h1>
        </div>
      </div>

      {/* Botones fijos en la parte inferior */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: spacing[5],
          paddingBottom: `calc(${spacing[10]} + env(safe-area-inset-bottom))`,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[4],
          backgroundColor: colors.semantic.background.main,
          zIndex: 1000, // Asegurar que los botones estén por encima de todo
          pointerEvents: 'auto', // Asegurar que los eventos funcionen
        }}
      >
        {/* Botón Face ID - Principal */}
        <button
          type="button"
          onClick={(e) => {
            console.log('Face ID button clicked'); // DEBUG
            e.stopPropagation();
            setIsFaceIDButtonActive(false); // Resetear estado activo
            if (!isAuthenticating) {
              handleBiometricAuth();
            }
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            setIsFaceIDButtonActive(true);
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            setIsFaceIDButtonActive(false);
          }}
          onPointerLeave={(e) => {
            e.stopPropagation();
            setIsFaceIDButtonActive(false);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            setIsFaceIDButtonActive(true);
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            setIsFaceIDButtonActive(false);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsFaceIDButtonActive(true);
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            setIsFaceIDButtonActive(false);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setIsFaceIDButtonActive(false);
          }}
          disabled={isAuthenticating}
          style={{
            width: '100%',
            height: '56px',
            backgroundColor: isFaceIDButtonActive 
              ? 'rgba(28, 31, 33, 0.8)' // Ligeramente más claro cuando está activo
              : colors.semantic.text.primary,
            color: colors.semantic.background.white,
            border: 'none',
            borderRadius: borderRadius.full,
            fontFamily: typography.fontFamily.sans.join(', '),
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.bold,
            cursor: isAuthenticating ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[3],
            opacity: isAuthenticating ? 0.7 : 1,
            transition: 'opacity 0.2s ease, background-color 0.15s ease',
            touchAction: 'manipulation', // Prevenir gestos táctiles que interfieran
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitTouchCallout: 'none',
            position: 'relative',
            zIndex: 1001, // Asegurar que esté por encima de otros elementos
            outline: 'none', // Remover outline por defecto
            WebkitTapHighlightColor: 'transparent', // Remover highlight en iOS
          }}
        >
          <img
            src="/img/icons/login/Icon-faceid.svg"
            alt=""
            style={{
              width: '26px',
              height: '26px',
              filter: 'brightness(0) invert(1)',
              pointerEvents: 'none', // Prevenir que el icono capture eventos
            }}
          />
          {isAuthenticating ? 'Autenticando...' : 'Inicia con Face ID'}
        </button>

        {/* Botón Login con usuario/contraseña - Secundario */}
        <button
          type="button"
          onClick={(e) => {
            console.log('Login button clicked'); // DEBUG
            e.stopPropagation();
            setIsLoginButtonActive(false); // Resetear estado activo
            setShowLoginSheet(true);
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            setIsLoginButtonActive(true);
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            setIsLoginButtonActive(false);
          }}
          onPointerLeave={(e) => {
            e.stopPropagation();
            setIsLoginButtonActive(false);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            setIsLoginButtonActive(true);
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            setIsLoginButtonActive(false);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsLoginButtonActive(true);
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            setIsLoginButtonActive(false);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setIsLoginButtonActive(false);
          }}
          style={{
            width: '100%',
            height: '56px',
            backgroundColor: isLoginButtonActive 
              ? 'rgba(0, 0, 0, 0.1)' // Ligeramente más oscuro cuando está activo
              : 'rgba(0, 0, 0, 0.0627)',
            color: colors.semantic.text.primary,
            border: 'none',
            borderRadius: borderRadius.full,
            fontFamily: typography.fontFamily.sans.join(', '),
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.bold,
            cursor: 'pointer',
            transition: 'opacity 0.2s ease, background-color 0.15s ease',
            touchAction: 'manipulation', // Prevenir gestos táctiles que interfieran
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitTouchCallout: 'none',
            position: 'relative',
            zIndex: 1001, // Asegurar que esté por encima de otros elementos
            outline: 'none', // Remover outline por defecto
            WebkitTapHighlightColor: 'transparent', // Remover highlight en iOS
          }}
        >
          Inicia con tu usuario y contraseña
        </button>
      </div>

      {/* Bottom Sheet de Login */}
      <BottomSheet
        isOpen={showLoginSheet}
        onClose={() => setShowLoginSheet(false)}
        title="Iniciar sesión"
        rightIcon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke={colors.semantic.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        onRightIconClick={() => setShowLoginSheet(false)}
        maxHeight={90}
      >
        <LoginForm
          onLogin={handleLoginSuccess}
          onForgotPassword={() => console.log('Forgot password')}
          showBiometricCheckbox={true}
        />
      </BottomSheet>


      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
