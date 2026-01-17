"use client";

import { header, colors } from '../../config/design-tokens';

interface IconProps {
  activeTab: 'home' | 'wallet' | 'cash' | 'tarjeta' | 'mas';
  isScrolled?: boolean;
}

interface EyeIconProps extends IconProps {
  isVisible?: boolean;
}

export function EyeIcon({ activeTab, isVisible = true, isScrolled = false }: EyeIconProps) {
  // En tarjeta: blanco sin scroll, negro con scroll; en otras pestañas usa el color default
  const iconColor = activeTab === 'tarjeta' 
    ? (isScrolled ? header.colors.icon.default : '#FFFFFF') 
    : header.colors.icon.default;
  
  if (!isVisible) {
    // Icono de ojo oculto
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18.5173 7.48224C18.1895 7.16002 17.6618 7.16557 17.3384 7.49446C15.3895 9.48224 12.7829 10.5767 9.99955 10.5767C7.21621 10.5767 4.60955 9.48224 2.66066 7.49446C2.33844 7.16669 1.81066 7.16113 1.48177 7.48224C1.15288 7.80446 1.14732 8.33224 1.46955 8.66113C2.04177 9.24446 2.66288 9.76113 3.32399 10.2089L2.3451 11.81C2.1051 12.2022 2.22844 12.7156 2.62177 12.9556C2.75732 13.0389 2.90732 13.0778 3.05621 13.0778C3.33621 13.0778 3.61066 12.9367 3.76732 12.6789L4.77399 11.0322C5.52732 11.4 6.31621 11.6856 7.13399 11.8867L6.76399 13.7256C6.67288 14.1767 6.96621 14.6167 7.41621 14.7067C7.47177 14.7178 7.52732 14.7234 7.58177 14.7234C7.97066 14.7234 8.31844 14.45 8.39732 14.0545L8.77399 12.1822C9.17844 12.2234 9.58732 12.2456 9.99955 12.2456C10.4118 12.2456 10.8207 12.2234 11.2251 12.1822L11.6018 14.0545C11.6818 14.45 12.0295 14.7234 12.4173 14.7234C12.4718 14.7234 12.5273 14.7178 12.5829 14.7067C13.034 14.6156 13.3262 14.1767 13.2351 13.7256L12.8651 11.8867C13.6829 11.6856 14.4718 11.4 15.2251 11.0322L16.2318 12.6789C16.3884 12.9356 16.6629 13.0778 16.9429 13.0778C17.0918 13.0778 17.2418 13.0378 17.3773 12.9556C17.7707 12.7156 17.894 12.2022 17.654 11.81L16.6751 10.2089C17.3351 9.76113 17.9573 9.24558 18.5295 8.66113C18.8518 8.33335 18.8462 7.80446 18.5173 7.48224Z"
          fill={iconColor}
        />
      </svg>
    );
  }
  
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.6759 6.75873L17.6548 5.15762C17.8948 4.76428 17.7715 4.25206 17.3793 4.01206C16.9859 3.77317 16.4737 3.8954 16.2337 4.28762L15.2259 5.93428C14.4726 5.56651 13.6837 5.28095 12.8659 5.07984L13.2359 3.24095C13.3271 2.78984 13.0337 2.34984 12.5837 2.25984C12.1337 2.17317 11.6926 2.46095 11.6026 2.91206L11.2259 4.78428C10.8215 4.74317 10.4126 4.72095 10.0004 4.72095C9.58817 4.72095 9.17928 4.74317 8.77483 4.78428L8.39817 2.91206C8.30706 2.46095 7.86483 2.17206 7.41706 2.25984C6.96594 2.35095 6.67372 2.78984 6.76483 3.24095L7.13483 5.07984C6.31706 5.28095 5.52817 5.56651 4.77483 5.93428L3.76706 4.28762C3.52817 3.8954 3.01483 3.77317 2.6215 4.01206C2.22928 4.25206 2.10594 4.7654 2.34594 5.15762L3.32483 6.75873C2.66483 7.2054 2.04261 7.72206 1.4715 8.30539C1.14928 8.63317 1.15483 9.16206 1.48372 9.48428C1.8115 9.80651 2.33928 9.80095 2.66261 9.47206C4.6115 7.48428 7.21817 6.38984 10.0015 6.38984C12.7848 6.38984 15.3915 7.48428 17.3404 9.47206C17.5037 9.63873 17.7193 9.72206 17.9359 9.72206C18.1459 9.72206 18.3571 9.64317 18.5193 9.48428C18.8482 9.16206 18.8537 8.63428 18.5315 8.30539C17.9593 7.72206 17.3382 7.2054 16.6782 6.75873H16.6759Z"
        fill={iconColor}
      />
      <path
        d="M10.0002 15.5554C12.148 15.5554 13.8891 13.8143 13.8891 11.6665C13.8891 9.5187 12.148 7.77759 10.0002 7.77759C7.85244 7.77759 6.11133 9.5187 6.11133 11.6665C6.11133 13.8143 7.85244 15.5554 10.0002 15.5554Z"
        fill={iconColor}
      />
    </svg>
  );
}

export function GiftIcon({ activeTab, isScrolled = false }: IconProps) {
  const isHome = activeTab === 'home';
  const isWallet = activeTab === 'wallet';
  const isTarjeta = activeTab === 'tarjeta';
  const useHomeGradient = isHome || isWallet; // Home y Wallet usan el mismo gradiente
  // Para cash y mas: usar color default sin gradiente
  // En tarjeta: usar gradiente rosa (#F16DE6 → #79114C) siempre
  const useDefaultColor = activeTab === 'cash' || activeTab === 'mas';
  const gradientId = useHomeGradient ? 'gift-gradient-home' : isTarjeta ? 'gift-gradient-tarjeta' : 'gift-gradient-default';
  
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {!useDefaultColor && (
        <defs>
          {useHomeGradient ? (
            <linearGradient id={gradientId} x1="2.00024" y1="1.99951" x2="18.0002" y2="17.9995" gradientUnits="userSpaceOnUse">
              <stop stopColor={header.colors.gradients.giftHome.start} />
              <stop offset="1" stopColor={header.colors.gradients.giftHome.end} />
            </linearGradient>
          ) : isTarjeta ? (
            <linearGradient id={gradientId} x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F16DE6" />
              <stop offset="100%" stopColor="#AD419B" />
            </linearGradient>
          ) : (
            <linearGradient id={gradientId} x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor={header.colors.icon.default} />
              <stop offset="1" stopColor={header.colors.icon.default} />
            </linearGradient>
          )}
        </defs>
      )}
      <path
        d="M9.99976 5.83366V18.0559M9.99976 5.83366C9.99976 5.83366 8.98753 1.94531 6.11087 1.94531C5.03753 1.94531 4.16642 2.81642 4.16642 3.88976C4.16642 4.96309 5.03753 5.8342 6.11087 5.8342L9.99976 5.83366ZM9.99976 5.83366L13.8886 5.8342C14.962 5.8342 15.8331 4.96309 15.8331 3.88976C15.8331 2.81642 14.962 1.94531 13.8886 1.94531C11.012 1.94531 9.99976 5.83366 9.99976 5.83366ZM15.8331 9.16699V15.8337C15.8331 17.0614 14.8386 18.0559 13.6109 18.0559H6.38864C5.16087 18.0559 4.16642 17.0614 4.16642 15.8337V9.16699M3.05545 5.83366H16.9443C17.558 5.83366 18.0554 6.33112 18.0554 6.94477V8.05588C18.0554 8.66953 17.558 9.16699 16.9443 9.16699H3.05545C2.4418 9.16699 1.94434 8.66953 1.94434 8.05588V6.94477C1.94434 6.33112 2.4418 5.83366 3.05545 5.83366Z"
        stroke={useDefaultColor ? header.colors.icon.default : (useHomeGradient || isTarjeta ? `url(#${gradientId})` : header.colors.icon.default)}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchIcon({ activeTab, isScrolled = false }: IconProps) {
  // En tarjeta: blanco sin scroll, negro con scroll; en otras pestañas usa el color default
  const iconColor = activeTab === 'tarjeta' 
    ? (isScrolled ? header.colors.icon.default : '#FFFFFF') 
    : header.colors.icon.default;
  
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
