import { colors } from '../../../config/design-tokens';

interface TarjetaIconProps {
  isActive?: boolean;
  size?: number;
}

export function TarjetaIcon({ isActive = false, size = 24 }: TarjetaIconProps) {
  const color = isActive ? colors.primary.main : colors.semantic.text.tertiary;
  
  if (isActive) {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M188.889 63.8886C188.889 47.033 175.189 33.333 158.333 33.333H41.6666C24.8111 33.333 11.1111 47.033 11.1111 63.8886V72.2219H188.889V63.8886Z" fill={color}/>
        <path d="M11.1111 136.111C11.1111 152.966 24.8111 166.666 41.6666 166.666H158.333C175.189 166.666 188.889 152.966 188.889 136.111V88.8887H11.1111V136.111ZM141.667 116.666H152.778C157.378 116.666 161.111 120.4 161.111 125C161.111 129.6 157.378 133.333 152.778 133.333H141.667C137.067 133.333 133.333 129.6 133.333 125C133.333 120.4 137.067 116.666 141.667 116.666ZM47.2222 116.666H80.5555C85.1555 116.666 88.8889 120.4 88.8889 125C88.8889 129.6 85.1555 133.333 80.5555 133.333H47.2222C42.6222 133.333 38.8889 129.6 38.8889 125C38.8889 120.4 42.6222 116.666 47.2222 116.666Z" fill={color}/>
      </svg>
    );
  }
  
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.4443 80.5557H180.555" stroke={color} strokeWidth="16.6667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M41.6668 158.333L158.333 158.333C170.606 158.333 180.556 148.384 180.556 136.111V63.8886C180.556 51.6156 170.606 41.6663 158.333 41.6663L41.6668 41.6663C29.3938 41.6663 19.4445 51.6156 19.4445 63.8886V136.111C19.4445 148.384 29.3938 158.333 41.6668 158.333Z" stroke={color} strokeWidth="16.6667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M47.2222 125H80.5555" stroke={color} strokeWidth="16.6667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M141.667 125H152.778" stroke={color} strokeWidth="16.6667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
