interface MasIconProps {
  isActive?: boolean;
  size?: number;
}

export function MasIcon({ isActive = false, size = 24 }: MasIconProps) {
  const color = isActive ? '#3A29E9' : '#8d8d8e'; // Tokenizado: azul activo, gris inactivo
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Menú hamburguesa de dos líneas */}
      <rect
        x="4"
        y="8"
        width="16"
        height="2"
        rx="1"
        fill={color}
      />
      <rect
        x="4"
        y="14"
        width="16"
        height="2"
        rx="1"
        fill={color}
      />
    </svg>
  );
}
