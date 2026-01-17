import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';

interface BiometricErrorDialogProps {
  message: string;
  onRetry: () => void;
  onUsePassword: () => void;
  onClose?: () => void;
}

export function BiometricErrorDialog({ 
  message, 
  onRetry, 
  onUsePassword,
  onClose 
}: BiometricErrorDialogProps) {
  return (
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
          zIndex: 2000,
          animation: 'fadeIn 0.3s ease',
        }}
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100% - 40px)',
          maxWidth: '400px',
          backgroundColor: colors.semantic.background.white,
          borderRadius: borderRadius['2xl'],
          padding: spacing[6],
          zIndex: 2001,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          animation: 'scaleIn 0.3s ease',
        }}
      >
        {/* Mensaje */}
        <p
          style={{
            fontFamily: typography.fontFamily.sans.join(', '),
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal,
            color: colors.semantic.text.primary,
            textAlign: 'center',
            margin: 0,
            marginBottom: spacing[6],
            lineHeight: '1.5',
          }}
        >
          {message}
        </p>
        
        {/* Botones */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[3],
          }}
        >
          {/* Botón Reintentar */}
          <button
            type="button"
            onClick={onRetry}
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: colors.semantic.text.primary,
              color: colors.semantic.background.white,
              border: 'none',
              borderRadius: borderRadius.full,
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold,
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Reintentar Face ID
          </button>
          
          {/* Botón Usuario y contraseña */}
          <button
            type="button"
            onClick={onUsePassword}
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: 'transparent',
              color: colors.semantic.text.primary,
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: borderRadius.full,
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[50];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Usuario y contraseña
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
}
