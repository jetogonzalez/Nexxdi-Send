"use client";

import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { segmentedButton } from '../../config/segmented-button-tokens';

interface AddWalletOutActionsProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function AddWalletOutActions({ onClick, disabled = false }: AddWalletOutActionsProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        height: segmentedButton.dimensions.height, // Misma altura que segmented button
        paddingTop: segmentedButton.spacing.buttonPaddingY, // Padding vertical del segmented button
        paddingBottom: segmentedButton.spacing.buttonPaddingY, // Padding vertical del segmented button
        borderRadius: borderRadius.full, // Full radius
        backgroundColor: colors.semantic.button.primary, // Negro del token
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Centrar icono y texto
        gap: spacing[3], // 12px entre icono y texto
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '0.9';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '1';
        }
      }}
      aria-label="Agregar a Apple Wallet"
    >
      {/* Icono */}
      <img
        src="/img/icons/payment/apple-wallet.svg"
        alt="Apple Wallet"
        style={{
          width: '20px', // Tamaño proporcional al texto (14px * 1.43 ≈ 20px)
          height: '20px',
          display: 'block',
          filter: disabled ? 'grayscale(100%) opacity(0.5)' : 'none',
        }}
      />
      {/* Texto */}
      <span
        style={{
          fontFamily: segmentedButton.typography.fontFamily,
          fontSize: segmentedButton.typography.fontSize, // Mismo tamaño que segmented button
          fontWeight: segmentedButton.typography.fontWeight, // Mismo peso que segmented button
          lineHeight: segmentedButton.typography.lineHeight, // Misma altura de línea que segmented button
          color: colors.semantic.background.white, // Blanco del token
        }}
      >
        Agregar a Apple Wallet
      </span>
    </button>
  );
}
