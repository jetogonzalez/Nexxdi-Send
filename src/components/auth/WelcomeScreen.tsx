import { useState, useEffect } from 'react';
import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';
import { LoginForm } from './LoginForm';
import { BiometricErrorDialog } from './BiometricErrorDialog';
import { BiometricInfoDialog } from './BiometricInfoDialog';
import {
  authenticateWithBiometric,
  isBiometricAvailable,
  isBiometricEnrolled,
  hasStoredToken,
  storeSessionToken,
  type BiometricAuthError,
} from '../../lib/biometricAuth';

type ErrorState = {
  show: boolean;
  error: BiometricAuthError | null;
  message: string;
};

export default function WelcomeScreen() {
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorState, setErrorState] = useState<ErrorState>({
    show: false,
    error: null,
    message: '',
  });
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  // Verificar disponibilidad de biometría al montar
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await isBiometricAvailable();
    const enrolled = await isBiometricEnrolled();
    
    if (!available || !enrolled) {
      // No mostrar diálogo automáticamente, solo cuando el usuario intente usar Face ID
    }
  };

  // Función de autenticación biométrica
  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    setErrorState({ show: false, error: null, message: '' });

    try {
      // Verificar si hay token guardado
      if (!hasStoredToken()) {
        setErrorState({
          show: true,
          error: 'NO_TOKEN',
          message: 'No hay sesión guardada. Por favor, iniciá sesión con tu usuario y contraseña.',
        });
        setIsAuthenticating(false);
        return;
      }

      // Intentar autenticación biométrica
      const result = await authenticateWithBiometric('Confirmá tu identidad para ingresar');

      if (result.success) {
        // Autenticación exitosa: renovar token y navegar al home
        storeSessionToken(result.token);
        window.location.href = '/home';
      } else {
        // Manejar diferentes tipos de errores
        handleBiometricError(result.error);
      }
    } catch (error) {
      console.error('Error en autenticación biométrica:', error);
      setErrorState({
        show: true,
        error: 'FAILED',
        message: 'No se pudo verificar tu identidad.',
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleBiometricError = (error: BiometricAuthError) => {
    let message = 'No se pudo verificar tu identidad.';

    switch (error) {
      case 'NOT_AVAILABLE':
      case 'NOT_ENROLLED':
        setShowInfoDialog(true);
        setIsAuthenticating(false);
        return;
      
      case 'NO_TOKEN':
        message = 'No hay sesión guardada. Por favor, iniciá sesión con tu usuario y contraseña.';
        break;
      
      case 'CANCELLED':
        // Usuario canceló, no mostrar error
        setIsAuthenticating(false);
        return;
      
      case 'LOCKED':
        message = 'Face ID está bloqueado. Por favor, desbloqueá tu dispositivo y volvé a intentar.';
        break;
      
      case 'FAILED':
      default:
        message = 'No se pudo verificar tu identidad.';
        break;
    }

    setErrorState({
      show: true,
      error,
      message,
    });
  };

  const handleRetryBiometric = () => {
    setErrorState({ show: false, error: null, message: '' });
    handleBiometricAuth();
  };

  const handleUsePassword = () => {
    setErrorState({ show: false, error: null, message: '' });
    setShowLoginSheet(true);
  };

  const handleLoginSuccess = async (email: string, password: string) => {
    // Simular login con usuario/contraseña
    // En producción: llamar al backend
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generar token de sesión
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Guardar token (en producción: en Keychain/Keystore con protección biométrica)
    storeSessionToken(sessionToken);
    
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
        {/* Botón Face ID - Principal */}
        <button
          type="button"
          onClick={handleBiometricAuth}
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
          {isAuthenticating ? 'Autenticando...' : 'Inicia con Face ID'}
        </button>

        {/* Botón Login con usuario/contraseña - Secundario */}
        <button
          type="button"
          onClick={() => setShowLoginSheet(true)}
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
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
        >
          Inicia con tu usuario y contraseña
        </button>
      </div>

      {/* Bottom Sheet de Login */}
      {showLoginSheet && (
        <>
          {/* Overlay */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              animation: 'fadeIn 0.3s ease',
            }}
            onClick={() => setShowLoginSheet(false)}
          />
          
          {/* Sheet */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: colors.semantic.background.white,
              borderTopLeftRadius: borderRadius['3xl'],
              borderTopRightRadius: borderRadius['3xl'],
              padding: spacing[6],
              paddingBottom: `calc(${spacing[8]} + env(safe-area-inset-bottom))`,
              zIndex: 1001,
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'slideUp 0.3s ease',
            }}
          >
            {/* Handle */}
            <div
              style={{
                width: '36px',
                height: '4px',
                backgroundColor: colors.gray[300],
                borderRadius: borderRadius.full,
                margin: '0 auto',
                marginBottom: spacing[6],
              }}
            />
            
            {/* Título */}
            <h2
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.semibold,
                color: colors.semantic.text.primary,
                textAlign: 'center',
                margin: 0,
                marginBottom: spacing[6],
              }}
            >
              Iniciar sesión
            </h2>
            
            {/* Formulario de login */}
            <LoginForm
              onLogin={handleLoginSuccess}
              onForgotPassword={() => console.log('Forgot password')}
            />
          </div>
        </>
      )}

      {/* Diálogo de error de biometría */}
      {errorState.show && (
        <BiometricErrorDialog
          message={errorState.message}
          onRetry={handleRetryBiometric}
          onUsePassword={handleUsePassword}
          onClose={() => setErrorState({ show: false, error: null, message: '' })}
        />
      )}

      {/* Diálogo informativo (biometría no disponible/no enrolada) */}
      {showInfoDialog && (
        <BiometricInfoDialog
          message="Activá Face ID en tu dispositivo para usar este acceso."
          onUnderstand={() => {
            setShowInfoDialog(false);
            setShowLoginSheet(true);
          }}
        />
      )}

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
