import { colors, typography, borderRadius, spacing } from '../../config/design-tokens';
import type { RefObject } from 'react';

// Importar bottomSheet directamente desde el módulo
const bottomSheet = {
  margin: spacing[2], // 8px - margin global alrededor del bottom sheet
  padding: spacing[6], // 24px - padding interno global
  borderRadius: '44px', // Border radius global de 44px
  graber: {
    width: '34px',
    height: '5px',
    topDistance: '5px',
    touchArea: '40px',
  },
  header: {
    actionButtonSize: '44px', // Tamaño de botones de acción según Apple HIG
    iconSize: '24px', // Tamaño de iconos según Apple HIG
    horizontalSpacing: spacing[2], // 8px - distancia visual horizontal
    buttonBackground: 'rgba(0, 0, 0, 0.05)', // Negro con 5% opacidad
  },
};

interface BottomSheetHeaderProps {
  title?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  showGraber?: boolean;
  graberRef?: RefObject<HTMLDivElement>;
  onGraberTouchStart?: (e: React.TouchEvent) => void;
  onGraberTouchMove?: (e: React.TouchEvent) => void;
  onGraberTouchEnd?: () => void;
  onGraberMouseDown?: (e: React.MouseEvent) => void;
}

export function BottomSheetHeader({
  title,
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
  showGraber = false,
  graberRef,
  onGraberTouchStart,
  onGraberTouchMove,
  onGraberTouchEnd,
  onGraberMouseDown,
}: BottomSheetHeaderProps) {
  return (
    <div
      data-bottom-sheet-header
      style={{
        display: 'flex',
        flexDirection: 'column',
        touchAction: 'manipulation', // Permitir interacciones táctiles pero prevenir gestos
        WebkitUserSelect: 'none',
        userSelect: 'none',
        minHeight: '70px', // Altura total del header aproximadamente 70px
        position: 'relative', // Para posicionar el graber absolutamente
        paddingBottom: spacing[4], // 16px spacing bottom del header
      }}
    >
      {/* Graber - dentro del header, posicionado absolutamente sin afectar layout */}
      {showGraber && (
        <div
          ref={graberRef}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onGraberTouchStart?.(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onGraberTouchMove?.(e);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onGraberTouchEnd?.();
          }}
          onMouseDown={onGraberMouseDown}
          style={{
            position: 'absolute',
            top: bottomSheet.graber.topDistance, // 5px desde el top
            left: '50%',
            transform: 'translateX(-50%)',
            width: bottomSheet.graber.width,
            height: bottomSheet.graber.height,
            backgroundColor: colors.gray[300],
            borderRadius: '9999px',
            padding: 0,
            margin: 0,
            cursor: 'grab',
            touchAction: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            zIndex: 1, // Encima del contenido pero debajo de botones
            pointerEvents: 'auto', // Asegurar que sea clickeable
          }}
        />
      )}

      {/* Contenido del header - área arrastrable completa */}
      <div
        onTouchStart={(e) => {
          // Permitir que el drag funcione desde cualquier parte del header excepto botones
          const target = e.target as HTMLElement;
          const isButton = target.closest('button') !== null;
          // Si es un botón, NO hacer nada - dejar que el botón maneje el evento
          if (isButton) {
            return; // Salir inmediatamente sin prevenir nada
          }
          // CRÍTICO: Prevenir comportamiento por defecto en iOS solo si NO es un botón
          e.preventDefault();
          e.stopPropagation();
          onGraberTouchStart?.(e);
        }}
        onTouchMove={(e) => {
          const target = e.target as HTMLElement;
          const isButton = target.closest('button') !== null;
          if (isButton) {
            return; // Salir inmediatamente sin prevenir nada
          }
          e.preventDefault();
          e.stopPropagation();
          onGraberTouchMove?.(e);
        }}
        onTouchEnd={(e) => {
          const target = e.target as HTMLElement;
          const isButton = target.closest('button') !== null;
          if (isButton) {
            return; // Salir inmediatamente sin prevenir nada
          }
          e.preventDefault();
          e.stopPropagation();
          onGraberTouchEnd?.();
        }}
        onMouseDown={(e) => {
          const target = e.target as HTMLElement;
          const isButton = target.closest('button') !== null;
          if (isButton) {
            return; // Salir inmediatamente sin prevenir nada
          }
          onGraberMouseDown?.(e);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: bottomSheet.header.horizontalSpacing, // 8px distancia visual horizontal
          width: '100%',
          minHeight: '70px', // Altura mínima para área táctil grande
          position: 'relative',
          zIndex: 0, // Debajo del graber visual
          cursor: 'grab', // Cursor de arrastre en toda el área
          touchAction: 'manipulation', // Permitir interacciones táctiles pero prevenir gestos
          WebkitTouchCallout: 'none', // Prevenir menú contextual en iOS
        }}
      >
      {/* Botón izquierdo */}
      {leftIcon ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLeftIconClick?.();
          }}
          onTouchStart={(e) => {
            // Detener propagación para que el contenedor no capture el evento
            e.stopPropagation();
            if (e.nativeEvent.stopImmediatePropagation) {
              e.nativeEvent.stopImmediatePropagation();
            }
          }}
          onTouchEnd={(e) => {
            // Asegurar que el click funcione en touch
            e.stopPropagation();
            if (e.nativeEvent.stopImmediatePropagation) {
              e.nativeEvent.stopImmediatePropagation();
            }
          }}
          onMouseDown={(e) => {
            // Detener propagación para que el drag no se active
            e.stopPropagation();
            if (e.nativeEvent.stopImmediatePropagation) {
              e.nativeEvent.stopImmediatePropagation();
            }
          }}
          style={{
            touchAction: 'manipulation', // Permitir interacciones táctiles
            zIndex: 10, // Asegurar que esté por encima del área arrastrable
            position: 'relative', // Asegurar que el z-index funcione
            width: bottomSheet.header.actionButtonSize, // 44px
            height: bottomSheet.header.actionButtonSize, // 44px
            minWidth: bottomSheet.header.actionButtonSize,
            minHeight: bottomSheet.header.actionButtonSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bottomSheet.header.buttonBackground, // Negro 10% opacidad
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            borderRadius: borderRadius.full,
            transition: 'background-color 0.2s ease, opacity 0.2s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <div
            style={{
              width: bottomSheet.header.iconSize, // 24px
              height: bottomSheet.header.iconSize, // 24px
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {leftIcon}
          </div>
        </button>
      ) : (
        <div style={{ width: bottomSheet.header.actionButtonSize, flexShrink: 0 }} />
      )}

      {/* Título centrado - con ellipsis si es necesario */}
      {title && (
        <h2
          style={{
            fontFamily: typography.fontFamily.sans.join(', '),
            fontSize: '18px',
            fontWeight: typography.fontWeight.semibold,
            color: colors.semantic.text.primary,
            textAlign: 'center',
            margin: 0,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0, // Permite que el flex shrink funcione correctamente
          }}
          title={title} // Tooltip con texto completo si hay ellipsis
        >
          {title}
        </h2>
      )}

      {/* Spacer si no hay título */}
      {!title && <div style={{ flex: 1 }} />}

      {/* Botón derecho */}
      {rightIcon ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRightIconClick?.();
          }}
          onTouchStart={(e) => {
            // Detener propagación para que el contenedor no capture el evento
            e.stopPropagation();
            if (e.nativeEvent.stopImmediatePropagation) {
              e.nativeEvent.stopImmediatePropagation();
            }
          }}
          onTouchEnd={(e) => {
            // Asegurar que el click funcione en touch
            e.stopPropagation();
            if (e.nativeEvent.stopImmediatePropagation) {
              e.nativeEvent.stopImmediatePropagation();
            }
          }}
          onMouseDown={(e) => {
            // Detener propagación para que el drag no se active
            e.stopPropagation();
            if (e.nativeEvent.stopImmediatePropagation) {
              e.nativeEvent.stopImmediatePropagation();
            }
          }}
          style={{
            touchAction: 'manipulation', // Permitir interacciones táctiles
            zIndex: 10, // Asegurar que esté por encima del área arrastrable
            position: 'relative', // Asegurar que el z-index funcione
            width: bottomSheet.header.actionButtonSize, // 44px
            height: bottomSheet.header.actionButtonSize, // 44px
            minWidth: bottomSheet.header.actionButtonSize,
            minHeight: bottomSheet.header.actionButtonSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bottomSheet.header.buttonBackground, // Negro 10% opacidad
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            borderRadius: borderRadius.full,
            transition: 'background-color 0.2s ease, opacity 0.2s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <div
            style={{
              width: bottomSheet.header.iconSize, // 24px
              height: bottomSheet.header.iconSize, // 24px
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {rightIcon}
          </div>
        </button>
        ) : (
          <div style={{ width: bottomSheet.header.actionButtonSize, flexShrink: 0 }} />
        )}
      </div>
    </div>
  );
}
