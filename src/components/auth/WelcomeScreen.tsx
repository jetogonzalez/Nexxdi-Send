import { useState } from 'react';
import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';

export default function WelcomeScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Función de autenticación del sistema (biometría o PIN/patrón del celular)
  const handleSystemAuth = async () => {
    setIsAuthenticating(true);
    
    try {
      // Simular autenticación del sistema operativo
      // En producción, aquí se integraría con:
      // - Capacitor BiometricAuth plugin para biometría
      // - O WebAuthn API para autenticación del sistema
      
      // Pequeño delay para simular el proceso de autenticación
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Redirigir al home (autenticación exitosa simulada)
      window.location.href = '/home';
    } catch (error) {
      console.error('Error en autenticación del sistema:', error);
      setIsAuthenticating(false);
    }
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
          top: '35%', // Posición dinámica desde el top
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
        {/* Foto de perfil con borde púrpura */}
        <div
          style={{
            width: '232px',
            height: '232px',
            borderRadius: borderRadius.full,
            border: `6px solid ${colors.primary.main}`,
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <img
            src="/img/user/fernando-plaza.jpg"
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

        {/* Texto de bienvenida */}
        <h1
          style={{
            fontFamily: typography.fontFamily.sans.join(', '),
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.normal,
            color: colors.semantic.text.primary,
            textAlign: 'center',
            margin: 0,
          }}
        >
          Bienvenido de vuelta, <span style={{ fontWeight: typography.fontWeight.bold }}>Luis</span>
        </h1>
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
        }}
      >
        {/* Botón Facephi - Principal */}
        <button
          type="button"
          onClick={handleSystemAuth}
          disabled={isAuthenticating}
          style={{
            width: '100%',
            height: '56px',
            backgroundColor: colors.semantic.text.primary,
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
            transition: 'opacity 0.2s ease, background-color 0.2s ease',
          }}
        >
          <img
            src="/img/icons/login/Icon-faceid.svg"
            alt=""
            style={{
              width: '26px',
              height: '26px',
              filter: 'brightness(0) invert(1)',
            }}
          />
          {isAuthenticating ? 'Autenticando...' : 'Inicia con Facephi'}
        </button>

        {/* Botón Login con PIN/Patrón del celular - Secundario */}
        <button
          type="button"
          onClick={handleSystemAuth}
          disabled={isAuthenticating}
          style={{
            width: '100%',
            height: '56px',
            backgroundColor: 'rgba(0, 0, 0, 0.0627)',
            color: colors.semantic.text.primary,
            border: 'none',
            borderRadius: borderRadius.full,
            fontFamily: typography.fontFamily.sans.join(', '),
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.bold,
            cursor: isAuthenticating ? 'wait' : 'pointer',
            transition: 'opacity 0.2s ease',
            opacity: isAuthenticating ? 0.7 : 1,
          }}
        >
          {isAuthenticating ? 'Autenticando...' : 'Inicia con PIN o patrón'}
        </button>
      </div>

    </div>
  );
}
