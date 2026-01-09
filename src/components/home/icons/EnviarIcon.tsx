import { colors } from '../../../config/design-tokens';

interface EnviarIconProps {
  isActive?: boolean;
  size?: number;
}

export function EnviarIcon({ isActive = false, size = 24 }: EnviarIconProps) {
  const color = isActive ? colors.primary.main : colors.semantic.text.tertiary;
  
  if (isActive) {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M181.612 18.3756C177.79 14.5533 172.223 13.2311 167.112 14.8756L23.5235 61.0311C18.0679 62.7867 14.2901 67.4089 13.6679 73.1089C13.0457 78.7978 15.7457 84.1311 20.6901 87.0089L71.5346 116.664L115.457 72.7311C118.712 69.4756 123.99 69.4756 127.246 72.7311C130.501 75.9867 130.501 81.2644 127.246 84.52L83.3123 128.453L112.968 179.298C115.579 183.764 120.19 186.398 125.268 186.398C125.801 186.398 126.346 186.364 126.89 186.309C132.579 185.687 137.212 181.909 138.957 176.464L185.123 32.8867C186.768 27.7422 185.423 22.1867 181.612 18.3756Z" fill={color}/>
      </svg>
    );
  }
  
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M175.702 24.2949L85.0801 114.917" stroke={color} strokeWidth="16.6667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M177.191 30.3339L131.036 173.923C129.458 178.845 122.78 179.578 120.18 175.101L85.0802 114.923L24.9024 79.8228C20.4358 77.2117 21.158 70.545 26.0802 68.9672L169.669 22.8117C174.302 21.3228 178.68 25.7006 177.191 30.3339Z" stroke={color} strokeWidth="16.6667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
