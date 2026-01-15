import { useState, useEffect } from 'react';
import { colors, spacing, typography, borderRadius, header } from '../../config/design-tokens';
import { EyeIcon, GiftIcon, SearchIcon } from './HeaderIcons';

interface HeaderProps {
  activeTab: 'home' | 'wallet' | 'cash' | 'tarjeta' | 'mas';
  onBalanceVisibilityChange?: (isVisible: boolean) => void;
  showTitle?: boolean;
  title?: string;
  scrollProgress?: number;
  isScrolled?: boolean;
  scrollTop?: number;
}

const BALANCE_VISIBILITY_KEY = 'nexxdi_cash_balance_visible';

export function Header({ activeTab, onBalanceVisibilityChange, showTitle = false, title = '', scrollProgress = 0, isScrolled = false, scrollTop = 0 }: HeaderProps) {
  // Cargar estado inicial desde localStorage
  const [isBalanceVisible, setIsBalanceVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(BALANCE_VISIBILITY_KEY);
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  // Sincronizar con localStorage cuando cambia el estado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(BALANCE_VISIBILITY_KEY, String(isBalanceVisible));
    }
  }, [isBalanceVisible]);

  // Sincronizar cuando cambia desde fuera (HomePage)
  useEffect(() => {
    if (onBalanceVisibilityChange) {
      // Notificar el estado inicial al componente padre
      onBalanceVisibilityChange(isBalanceVisible);
    }
  }, []); // Solo al montar

  const handleToggleBalance = () => {
    const newVisibility = !isBalanceVisible;
    setIsBalanceVisible(newVisibility);
    if (onBalanceVisibilityChange) {
      onBalanceVisibilityChange(newVisibility);
    }
  };

  // Determinar color de iconos según la vista activa
  // Para pestañas que no tienen configuración específica, usar 'home' como default
  const iconColor = header.colors.icon[activeTab] || header.colors.icon.home || header.colors.icon.default;
  
  // Color del título según la vista (blanco en tarjeta, color primario en home/wallet/cash/mas)
  const titleColor = activeTab === 'tarjeta' 
    ? colors.semantic.background.white 
    : typography.sectionTitle.color;

  // Aplicar blur glassmorphism solo en home y wallet cuando hay scroll
  const shouldApplyBlur = (activeTab === 'home' || activeTab === 'wallet') && isScrolled;
  
  // Calcular opacidad máxima del gradiente basado en el scroll (progresivo, similar a Apple)
  // Opacidad mínima: 0.3, máxima: 0.8, transición suave entre 0 y 100px de scroll
  // Redondear para evitar cambios muy pequeños que causan vibración
  const maxScrollForOpacity = 100;
  const minOpacity = 0.3;
  const maxOpacity = 0.8;
  const rawOpacity = shouldApplyBlur 
    ? Math.min(maxOpacity, minOpacity + ((scrollTop / maxScrollForOpacity) * (maxOpacity - minOpacity)))
    : 0;
  // Redondear a 2 decimales para suavizar los cambios
  const maxGradientOpacity = Math.round(rawOpacity * 100) / 100;

  // Gradiente gaussiano: blanco arriba que se desvanece a transparente abajo
  // Usando múltiples stops para simular efecto gaussiano suave
  // El gradiente va de opaco arriba a completamente transparente abajo
  const gradientStops = shouldApplyBlur
    ? `rgba(255, 255, 255, ${maxGradientOpacity}) 0%, rgba(255, 255, 255, ${maxGradientOpacity * 0.95}) 10%, rgba(255, 255, 255, ${maxGradientOpacity * 0.85}) 25%, rgba(255, 255, 255, ${maxGradientOpacity * 0.6}) 50%, rgba(255, 255, 255, ${maxGradientOpacity * 0.3}) 75%, rgba(255, 255, 255, ${maxGradientOpacity * 0.1}) 90%, rgba(255, 255, 255, 0) 100%`
    : 'transparent';

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: 'calc(100% + 40px)', // 100% + 40px (20px margin izquierdo + 20px margin derecho) para ser full width
        marginLeft: `-${spacing[5]}`, // -20px para compensar el margin del contenedor padre
        marginRight: `-${spacing[5]}`, // -20px para compensar el margin del contenedor padre
        paddingLeft: spacing[5], // 20px para alinear con el contenido
        paddingRight: spacing[5], // 20px para alinear con el contenido
        paddingTop: `calc(${spacing[6]} + env(safe-area-inset-top))`, // 24px + safe area top
        paddingBottom: spacing[6], // 24px
        background: shouldApplyBlur
          ? `linear-gradient(to bottom, ${gradientStops})`
          : 'transparent',
        backdropFilter: shouldApplyBlur ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: shouldApplyBlur ? 'blur(20px) saturate(180%)' : 'none',
        transition: 'background 0.2s ease-out, backdrop-filter 0.2s ease-out',
        willChange: shouldApplyBlur ? 'background, backdrop-filter' : 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
      {/* Avatar de perfil a la izquierda */}
      <div
        style={{
          position: 'relative',
          width: header.sizes.profileImage,
          height: header.sizes.profileImage,
        }}
      >
        {/* Avatar con imagen */}
        <div
          style={{
            width: header.sizes.profileImage,
            height: header.sizes.profileImage,
            borderRadius: borderRadius.full,
            overflow: 'hidden',
            backgroundColor: header.colors.avatarBackground, // Tokenizado por componente
          }}
        >
          <img
            src="/img/user/fernando-plaza.jpg"
            alt="Perfil"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
        {/* Notificación - posicionada en la parte superior derecha del avatar */}
        <div
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            width: header.sizes.notificationDot,
            height: header.sizes.notificationDot,
            backgroundColor: header.colors.notification,
            borderRadius: borderRadius.full,
            outline: `${header.borders.notificationBorderWidth} solid ${header.colors.notificationBorder}`,
            outlineOffset: '0px',
            zIndex: 10,
          }}
        />
      </div>

      {/* Acciones a la derecha */}
      <div
        style={{
          display: 'flex',
          gap: header.spacing.actionsGap, // 12px tokenizado
          alignItems: 'center',
        }}
      >
        {/* Icono Ojo - Toggle para mostrar/ocultar saldo */}
        <button
          type="button"
          onClick={handleToggleBalance}
          style={{
            backgroundColor: header.colors.buttonBackground[activeTab] || header.colors.buttonBackground.home, // Fallback a 'home' si no existe
            borderRadius: borderRadius.full,
            width: header.sizes.actionIcon,
            height: header.sizes.actionIcon,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = header.colors.buttonBackgroundHover[activeTab] || header.colors.buttonBackgroundHover.home; // Fallback a 'home' si no existe
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = header.colors.buttonBackground[activeTab] || header.colors.buttonBackground.home;
          }}
          aria-label={isBalanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
        >
          <EyeIcon activeTab={activeTab} isVisible={isBalanceVisible} />
        </button>

        {/* Icono Regalo - Referidos y promociones */}
        <button
          type="button"
          style={{
            backgroundColor: header.colors.buttonBackground[activeTab] || header.colors.buttonBackground.home, // Fallback a 'home' si no existe
            borderRadius: borderRadius.full,
            width: header.sizes.actionIcon,
            height: header.sizes.actionIcon,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = header.colors.buttonBackgroundHover[activeTab] || header.colors.buttonBackgroundHover.home; // Fallback a 'home' si no existe
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = header.colors.buttonBackground[activeTab] || header.colors.buttonBackground.home;
          }}
          aria-label="Referidos y promociones"
        >
          <GiftIcon activeTab={activeTab} />
        </button>

        {/* Icono Búsqueda */}
        <button
          type="button"
          style={{
            backgroundColor: header.colors.buttonBackground[activeTab] || header.colors.buttonBackground.home, // Fallback a 'home' si no existe
            borderRadius: borderRadius.full,
            width: header.sizes.actionIcon,
            height: header.sizes.actionIcon,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = header.colors.buttonBackgroundHover[activeTab] || header.colors.buttonBackgroundHover.home; // Fallback a 'home' si no existe
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = header.colors.buttonBackground[activeTab] || header.colors.buttonBackground.home;
          }}
          aria-label="Buscar"
        >
          <SearchIcon activeTab={activeTab} />
        </button>
      </div>
      </div>
    </div>
  );
}
