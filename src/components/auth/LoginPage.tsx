import { useEffect, useState } from 'react';
import { LoginForm } from './LoginForm';
import { SavePasswordModal } from '../ui/SavePasswordModal';
import { colors, spacing, typography } from '../../config/design-tokens';
import { motion } from '../../lib/motion';
import { hasSavedCredentials, saveCredentials, getSavedCredentials } from '../../lib/storage';

export default function LoginPage() {
  const [isClosing, setIsClosing] = useState(false);
  const [showSavePasswordModal, setShowSavePasswordModal] = useState(false);
  const [savedEmail, setSavedEmail] = useState<string>('');
  const [savedPassword, setSavedPassword] = useState<string>('');
  const [hasCredentials, setHasCredentials] = useState(false);

  useEffect(() => {
    // Permitir scroll si es necesario, pero prevenir pull-to-refresh
    document.body.style.overscrollBehavior = 'contain';
    
    // Verificar si hay credenciales guardadas
    const credentials = getSavedCredentials();
    setHasCredentials(credentials !== null);
    
    return () => {
      document.body.style.overscrollBehavior = '';
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    console.log('Login attempt:', { email, password });
    // Aquí iría la lógica de autenticación real
    // Por ahora simulamos un login exitoso
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // En producción, aquí validarías con tu backend
      // Por ahora, cualquier email válido y contraseña de al menos 8 caracteres funcionan
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const passwordValid = password && password.length >= 8;
      
      if (emailValid && passwordValid) {
        console.log('Login exitoso');
        
        // Si no hay credenciales guardadas, preguntar si quiere guardarlas
        if (!hasSavedCredentials()) {
          setSavedEmail(email);
          setSavedPassword(password);
          setShowSavePasswordModal(true);
        } else {
          // Si ya hay credenciales guardadas, redirigir directamente
          setIsClosing(true);
          setTimeout(() => {
            window.location.href = '/home';
          }, parseInt(motion.duration.slow.replace('ms', '')));
        }
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password');
    // window.location.href = '/forgot-password';
  };

  const handleSignUp = () => {
    window.location.href = '/signup';
  };

  const handleFaceID = async (): Promise<boolean> => {
    try {
      // Obtener credenciales guardadas
      const credentials = getSavedCredentials();
      if (!credentials) {
        console.warn('No hay credenciales guardadas');
        return false;
      }

      // Usar Web Authentication API para autenticación biométrica nativa (Face ID/Touch ID)
      if (!window.PublicKeyCredential) {
        console.warn('Web Authentication API no está disponible');
        // Fallback: usar credenciales guardadas directamente
        await handleLogin(credentials.email, credentials.password);
        return true;
      }

      // Verificar si hay credenciales disponibles
      const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      if (!isAvailable) {
        console.warn('Autenticación biométrica no disponible');
        // Fallback: usar credenciales guardadas directamente
        await handleLogin(credentials.email, credentials.password);
        return true;
      }

      // Crear opciones para la autenticación biométrica
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(32).fill(0), // En producción, esto debe ser un valor aleatorio del servidor
        allowCredentials: [],
        userVerification: 'required',
        timeout: 60000,
      };

      // Solicitar autenticación biométrica nativa
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      }) as PublicKeyCredential;

      if (credential) {
        console.log('Face ID/Touch ID autenticación exitosa');
        // Usar credenciales guardadas para hacer login automático
        await handleLogin(credentials.email, credentials.password);
        return true;
      }

      return false;
    } catch (error: any) {
      // Si el usuario cancela, no mostrar error
      if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
        console.log('Autenticación cancelada por el usuario');
        return false;
      }
      console.error('Error en Face ID:', error);
      return false;
    }
  };

  const handleSavePassword = () => {
    if (savedEmail && savedPassword) {
      saveCredentials(savedEmail, savedPassword);
      setHasCredentials(true);
    }
    setShowSavePasswordModal(false);
    // Redirigir al home después de guardar
    setIsClosing(true);
    setTimeout(() => {
      window.location.href = '/home';
    }, parseInt(motion.duration.slow.replace('ms', '')));
  };

  const handleSkipSavePassword = () => {
    setShowSavePasswordModal(false);
    // Redirigir al home sin guardar
    setIsClosing(true);
    setTimeout(() => {
      window.location.href = '/home';
    }, parseInt(motion.duration.slow.replace('ms', '')));
  };

  const handleClose = () => {
    // Animación de salida hacia abajo (estilo app iOS)
    setIsClosing(true);
    setTimeout(() => {
      // Navegación estilo iOS - volver atrás o cerrar
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/onboarding';
      }
    }, parseInt(motion.duration.slow.replace('ms', '')));
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: '100vh',
        backgroundColor: colors.semantic.background.white,
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        animation: isClosing 
          ? `slideDownToBottom ${motion.duration.slow} ${motion.easing.smoothOut} forwards`
          : `slideUpFromBottom ${motion.duration.slow} ${motion.easing.smoothOut} forwards`,
        zIndex: 1000,
      }}
    >
      {/* Barra de navegación estilo iOS - más grande según HIG */}
      <div
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingLeft: spacing[4],
          paddingRight: spacing[4],
          paddingBottom: spacing[5],
          minHeight: '44px', // Tamaño mínimo táctil según iOS HIG
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: colors.semantic.background.white,
        }}
      >
        <button
          onClick={handleClose}
          style={{
            width: '44px', // Tamaño mínimo táctil iOS
            height: '44px', // Tamaño mínimo táctil iOS
            borderRadius: '50%',
            backgroundColor: colors.semantic.button.secondary,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: `background-color ${motion.duration.base} ${motion.easing.easeInOut}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.semantic.button.secondaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.semantic.button.secondary;
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke={colors.semantic.text.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Contenido principal */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: spacing[5],
          paddingRight: spacing[5],
          paddingTop: spacing[4],
          paddingBottom: spacing[8],
          minHeight: 0, // Permite que el contenedor se encoja si es necesario
        }}
      >
        {/* Título */}
        <h1
          style={{
            fontSize: '34px', // Tamaño grande estilo iOS (Large Title)
            fontWeight: typography.fontWeight.bold,
            color: colors.semantic.text.primary,
            margin: 0,
            marginBottom: spacing[10], // Más espacio según iOS
            fontFamily: typography.fontFamily.sans.join(', '),
            textAlign: 'left',
            lineHeight: '1.05',
          }}
        >
          Inicia sesión
        </h1>

        {/* Login Form */}
        <div style={{ flex: 1 }}>
          <LoginForm
            onLogin={handleLogin}
            onForgotPassword={handleForgotPassword}
            onSignUp={handleSignUp}
            onFaceID={hasCredentials ? handleFaceID : undefined}
          />
        </div>
      </div>

      {/* Modal para guardar contraseña */}
      <SavePasswordModal
        isOpen={showSavePasswordModal}
        onSave={handleSavePassword}
        onSkip={handleSkipSavePassword}
      />

      <style>{`
        @keyframes slideUpFromBottom {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDownToBottom {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
}
