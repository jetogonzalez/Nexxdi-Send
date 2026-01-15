import { colors } from '../../../config/design-tokens';

interface HomeIconProps {
  isActive?: boolean;
  size?: number;
}

export function HomeIcon({ isActive = false, size = 24 }: HomeIconProps) {
  const color = isActive ? colors.primary.main : colors.semantic.text.tabInactive;

  // Icono "home" simple, estilo iOS (fill activo, stroke inactivo)
  if (isActive) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 3.2L3.6 10.2C3.35 10.4 3.2 10.71 3.2 11.04V20C3.2 20.44 3.56 20.8 4 20.8H9.2V14.8C9.2 14.36 9.56 14 10 14H14C14.44 14 14.8 14.36 14.8 14.8V20.8H20C20.44 20.8 20.8 20.44 20.8 20V11.04C20.8 10.71 20.65 10.4 20.4 10.2L12 3.2Z"
          fill={color}
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.2 10.7L12 4.2L19.8 10.7V20.3H14.2V14.7H9.8V20.3H4.2V10.7Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

