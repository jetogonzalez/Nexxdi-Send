import { colors } from '../../../config/design-tokens';

interface GrupoIconProps {
  isActive?: boolean;
  size?: number;
}

export function GrupoIcon({ isActive = false, size = 24 }: GrupoIconProps) {
  const color = isActive ? colors.primary.main : colors.semantic.text.tertiary; // Color más claro para inactivo
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Órbita elíptica */}
      <ellipse
        cx="12"
        cy="12"
        rx="8"
        ry="6"
        stroke={color}
        strokeWidth={isActive ? "2" : "1.5"}
        fill="none"
        opacity={isActive ? 1 : 0.6}
      />
      {/* Primera esfera (arriba) */}
      <circle
        cx="12"
        cy="6"
        r="2.5"
        fill={color}
      />
      {/* Segunda esfera (abajo) */}
      <circle
        cx="12"
        cy="18"
        r="2.5"
        fill={color}
      />
    </svg>
  );
}
