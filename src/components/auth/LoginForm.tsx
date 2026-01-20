import { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { FaceIDButton } from './FaceIDButton';
import { colors, spacing, typography, borderRadius, button } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface LoginFormProps {
  onLogin?: (email: string, password: string, activateBiometric?: boolean) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onFaceID?: () => Promise<boolean> | boolean;
  showBiometricCheckbox?: boolean;
}

export function LoginForm({ onLogin, onForgotPassword, onSignUp, onFaceID, showBiometricCheckbox = false }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [activateBiometric, setActivateBiometric] = useState(false);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validar formulario en tiempo real
  useEffect(() => {
    const emailValid = email.trim() !== '' && validateEmail(email);
    const passwordValid = password.trim() !== '' && password.length >= 8;
    setIsFormValid(emailValid && passwordValid);
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Login form submitted'); // DEBUG
    
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsLoading(true);
    
    try {
      console.log('Calling onLogin with:', { email, hasPassword: !!password, activateBiometric }); // DEBUG
      await onLogin?.(email, password, activateBiometric);
      console.log('Login completed successfully'); // DEBUG
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ password: 'Error al iniciar sesión. Por favor intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ marginBottom: spacing[6] }}>
        <Input
          type="email"
          inputMode="email"
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors({ ...errors, email: undefined });
            }
          }}
          error={errors.email}
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
        />
      </div>

      <div style={{ marginBottom: spacing[6] }}>
        <Input
          type="password"
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) {
              setErrors({ ...errors, password: undefined });
            }
          }}
          error={errors.password}
          autoComplete="current-password"
          showPasswordToggle={true}
        />
      </div>

      {/* Checkbox para activar Face ID */}
      {showBiometricCheckbox && (
        <div style={{ marginBottom: spacing[6], display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          <input
            type="checkbox"
            id="activate-biometric"
            checked={activateBiometric}
            onChange={(e) => setActivateBiometric(e.target.checked)}
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              accentColor: colors.primary.main,
            }}
          />
          <label
            htmlFor="activate-biometric"
            style={{
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.primary,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            Activar Face ID para ingresar más rápido
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        onClick={(e) => {
          console.log('Login button clicked', { isLoading, isFormValid, email, hasPassword: !!password }); // DEBUG
          e.preventDefault();
          e.stopPropagation();
          // Disparar submit manualmente si el form es válido
          if (isFormValid && !isLoading) {
            handleSubmit(e as any);
          }
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          // Prevenir que el touch se propague y cause scroll
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{
          width: '100%',
          paddingTop: button.paddingY, // 12px (regla de 4px)
          paddingBottom: button.paddingY, // 12px (regla de 4px)
          paddingLeft: button.paddingX, // 24px (regla de 4px)
          paddingRight: button.paddingX, // 24px (regla de 4px)
          minHeight: button.heightCompact, // 40px (regla de 4px)
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.bold,
          color: colors.semantic.background.white,
          backgroundColor: isLoading || !isFormValid 
            ? colors.semantic.text.tertiary 
            : colors.semantic.button.primary,
          border: 'none',
          borderRadius: borderRadius.full, // Full rounded como el onboarding
          cursor: isLoading || !isFormValid ? 'not-allowed' : 'pointer',
          fontFamily: typography.fontFamily.sans.join(', '),
          transition: `background-color ${motion.duration.fast} ${motion.easing.smoothOut}, opacity ${motion.duration.fast} ${motion.easing.smoothOut}`,
          marginBottom: spacing[4],
          opacity: isLoading || !isFormValid ? 0.6 : 1,
          touchAction: 'manipulation', // Prevenir gestos táctiles que interfieran
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
        onMouseEnter={(e) => {
          if (!isLoading && isFormValid) {
            e.currentTarget.style.backgroundColor = colors.semantic.button.primaryHover;
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading && isFormValid) {
            e.currentTarget.style.backgroundColor = colors.semantic.button.primary;
          }
        }}
      >
        {isLoading ? 'Iniciando sesión...' : 'Inicia sesión'}
      </button>

      {onForgotPassword && (
        <div style={{ marginTop: spacing[4], textAlign: 'center' }}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onForgotPassword();
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.semantic.text.primary,
              cursor: 'pointer',
              padding: spacing[2], // Padding para área táctil más grande
              minHeight: '44px', // Tamaño mínimo táctil iOS
              fontFamily: typography.fontFamily.sans.join(', '),
              textDecoration: 'underline',
              transition: `opacity ${motion.duration.base} ${motion.easing.easeInOut}`,
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              WebkitTouchCallout: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            ¿Problemas al iniciar sesión?
          </button>
        </div>
      )}

      {/* Face ID Button - Solo se muestra si hay credenciales guardadas */}
      {onFaceID && (
        <FaceIDButton 
          onFaceID={onFaceID}
        />
      )}
    </form>
  );
}
