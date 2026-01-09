import { colors } from '../../../config/design-tokens';

interface ActividadIconProps {
  isActive?: boolean;
  size?: number;
}

export function ActividadIcon({ isActive = false, size = 24 }: ActividadIconProps) {
  const color = isActive ? colors.primary.main : colors.semantic.text.tertiary; // Color más claro para inactivo
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Siempre relleno */}
      <rect x="4" y="6" width="16" height="2" rx="1" fill={color} />
      <rect x="4" y="11" width="12" height="2" rx="1" fill={color} />
      <rect x="4" y="16" width="14" height="2" rx="1" fill={color} />
    </svg>
  );
}
