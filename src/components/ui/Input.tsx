import { useState } from 'react';
import { colors, spacing, typography, borderRadius, button } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
}

export function Input({ label, error, helperText, showPasswordToggle = false, className = '', type, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.semantic.text.primary,
            marginBottom: spacing[4],
            fontFamily: typography.fontFamily.sans.join(', '),
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          {...props}
          type={inputType}
          className={className}
          inputMode={type === 'email' ? 'email' : props.inputMode}
          style={{
            width: '100%',
            paddingTop: button.paddingY,
            paddingBottom: button.paddingY,
            paddingLeft: button.paddingX,
            paddingRight: showPasswordToggle && isPassword ? spacing[12] : button.paddingX,
            minHeight: button.minHeight, // 48px igual a los botones
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal,
            color: colors.semantic.text.primary,
            backgroundColor: colors.semantic.background.white,
            border: `1px solid ${error ? colors.error[500] : colors.semantic.border.light}`,
            borderRadius: borderRadius.full,
            fontFamily: typography.fontFamily.sans.join(', '),
            outline: 'none',
            transition: `border-color ${motion.duration.base} ${motion.easing.easeInOut}, box-shadow ${motion.duration.base} ${motion.easing.easeInOut}`,
            ...(props.style || {}),
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = colors.primary.main;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary.main}20`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? colors.error[500] : colors.semantic.border.light;
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {showPasswordToggle && isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: spacing[4],
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: spacing[1],
              fontSize: typography.fontSize.sm,
              color: colors.semantic.text.secondary,
              fontFamily: typography.fontFamily.sans.join(', '),
              fontWeight: typography.fontWeight.medium,
              transition: `color ${motion.duration.base} ${motion.easing.easeInOut}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.semantic.text.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.semantic.text.secondary;
            }}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        )}
      </div>
      {error && (
        <p
          style={{
            marginTop: spacing[1],
            fontSize: typography.fontSize.sm,
            color: colors.error[500],
            fontFamily: typography.fontFamily.sans.join(', '),
          }}
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          style={{
            marginTop: spacing[1],
            fontSize: typography.fontSize.sm,
            color: colors.semantic.text.secondary,
            fontFamily: typography.fontFamily.sans.join(', '),
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
