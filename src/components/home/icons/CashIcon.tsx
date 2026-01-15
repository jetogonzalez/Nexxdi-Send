interface CashIconProps {
  isActive?: boolean;
  size?: number;
}

export function CashIcon({ isActive = false, size = 24 }: CashIconProps) {
  const color = isActive ? '#3A29E9' : '#8d8d8e'; // Tokenizado: azul activo, gris inactivo

  // Icono "cash" (moneda): fill activo, stroke inactivo
  if (isActive) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 21.2C16.97 21.2 21 17.17 21 12.2C21 7.23 16.97 3.2 12 3.2C7.03 3.2 3 7.23 3 12.2C3 17.17 7.03 21.2 12 21.2Z"
          fill={color}
          opacity="0.95"
        />
        <path
          d="M12 6.8V17.6"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M14.2 9.1C14.2 8.14 13.19 7.4 12 7.4C10.81 7.4 9.8 8.14 9.8 9.1C9.8 10.05 10.61 10.59 12 10.95C13.55 11.35 14.2 11.93 14.2 13.05C14.2 14.21 13.19 15 12 15C10.81 15 9.8 14.21 9.8 13.05"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 20.5C16.69 20.5 20.5 16.69 20.5 12C20.5 7.31 16.69 3.5 12 3.5C7.31 3.5 3.5 7.31 3.5 12C3.5 16.69 7.31 20.5 12 20.5Z"
        stroke={color}
        strokeWidth="1.8"
      />
      <path
        d="M12 7.2V16.8"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14.1 9.3C14.1 8.45 13.2 7.8 12 7.8C10.8 7.8 9.9 8.45 9.9 9.3C9.9 10.1 10.55 10.55 12 10.9C13.55 11.28 14.1 11.85 14.1 12.8C14.1 13.8 13.2 14.5 12 14.5C10.8 14.5 9.9 13.8 9.9 12.8"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

