import { colors, typography, borderRadius, spacing } from '../../config/design-tokens';
import type { RefObject } from 'react';

// Importar bottomSheet directamente desde el módulo
const bottomSheet = {
  margin: spacing[2], // 8px - margin global alrededor del bottom sheet
  padding: spacing[6], // 24px - padding interno global
  borderRadius: '44px', // Border radius global de 44px
  graber: {
    width: '34px',
    height: '4px',
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
        gap: spacing[2], // 8px entre graber y contenido del header
        touchAction: 'manipulation', // Permitir interacciones táctiles pero prevenir gestos
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {/* Graber - en el header si está habilitado */}
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
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: bottomSheet.graber.topDistance,
            paddingBottom: spacing[2],
            cursor: 'grab',
            touchAction: 'none', // CRÍTICO: Prevenir todo comportamiento táctil por defecto solo en el graber
            WebkitUserSelect: 'none',
            userSelect: 'none',
            minHeight: bottomSheet.graber.touchArea, // Área táctil mínima de 40px
          }}
        >
          {/* Barra del graber */}
          <div
            style={{
              width: bottomSheet.graber.width,
              height: bottomSheet.graber.height,
              backgroundColor: colors.gray[300],
              borderRadius: '9999px',
            }}
          />
        </div>
      )}

      {/* Contenido del header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: bottomSheet.header.horizontalSpacing, // 8px distancia visual horizontal
          marginBottom: spacing[4], // 16px de espacio después del header
          position: 'relative',
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
            e.stopPropagation(); // Prevenir que el drag capture este evento
          }}
          style={{
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
            fontSize: typography.fontSize.xl,
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
            e.stopPropagation(); // Prevenir que el drag capture este evento
          }}
          style={{
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
