import { colors, bottomSheet, typography, borderRadius } from '../../config/design-tokens';

interface BottomSheetHeaderProps {
  title?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
}

export function BottomSheetHeader({
  title,
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
}: BottomSheetHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: bottomSheet.header.height,
        marginBottom: bottomSheet.padding,
      }}
    >
      {/* Botón izquierdo */}
      {leftIcon && (
        <button
          type="button"
          onClick={onLeftIconClick}
          style={{
            width: bottomSheet.header.iconButtonSize,
            height: bottomSheet.header.iconButtonSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            borderRadius: borderRadius.full,
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {leftIcon}
        </button>
      )}

      {/* Título centrado */}
      {title && (
        <h2
          style={{
            fontFamily: typography.fontFamily.sans.join(', '),
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.semibold,
            color: colors.semantic.text.primary,
            textAlign: 'center',
            margin: 0,
            flex: 1,
          }}
        >
          {title}
        </h2>
      )}

      {/* Botón derecho */}
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          style={{
            width: bottomSheet.header.iconButtonSize,
            height: bottomSheet.header.iconButtonSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            borderRadius: borderRadius.full,
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {rightIcon}
        </button>
      )}

      {/* Spacer si no hay título pero hay iconos */}
      {!title && leftIcon && rightIcon && (
        <div style={{ flex: 1 }} />
      )}
    </div>
  );
}
