import { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { FaceIDButton } from './FaceIDButton';
import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface LoginFormProps {
  onLogin?: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onFaceID?: () => Promise<boolean> | boolean;
}

export function LoginForm({ onLogin, onForgotPassword, onSignUp, onFaceID }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

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
      await onLogin?.(email, password);
    } catch (error) {
      console.error('Login error:', error);
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

      <div style={{ marginBottom: spacing[10] }}>
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

      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        style={{
          width: '100%',
          padding: `${spacing[4]} ${spacing[6]}`,
          minHeight: '50px', // Tamaño mínimo según iOS HIG para botones principales
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
            onClick={onForgotPassword}
            style={{
              background: 'none',
              border: 'none',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.primary,
              cursor: 'pointer',
              padding: spacing[2], // Padding para área táctil más grande
              minHeight: '44px', // Tamaño mínimo táctil iOS
              fontFamily: typography.fontFamily.sans.join(', '),
              textDecoration: 'underline',
              transition: `opacity ${motion.duration.base} ${motion.easing.easeInOut}`,
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
