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

  // Aplicar blur glassmorphism en home, wallet y tarjeta cuando hay scroll
  const shouldApplyBlur = (activeTab === 'home' || activeTab === 'wallet' || activeTab === 'tarjeta') && isScrolled;
  
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

  // Animación del avatar: de 48px a 40px al hacer scroll (mismo tamaño que los iconos)
  // Solo aplica en home, wallet y tarjeta
  const shouldAnimateAvatar = activeTab === 'home' || activeTab === 'wallet' || activeTab === 'tarjeta';
  // Valores en px: spacing[12]=48px, spacing[10]=40px, spacing[3]=12px
  const avatarStartSize = 48; // header.sizes.profileImage = spacing[12]
  const avatarEndSize = 40; // header.sizes.actionIcon = spacing[10]
  const avatarScrollThreshold = 80; // Scroll necesario para completar la transición (más suave)
  
  // Calcular el progreso con una función de easing suave (ease-out quadratic)
  const rawProgress = shouldAnimateAvatar 
    ? Math.min(scrollTop / avatarScrollThreshold, 1) 
    : 0;
  // Aplicar easing cuadrático para una transición más fluida
  const avatarProgress = rawProgress * (2 - rawProgress); // ease-out quad
  const currentAvatarSize = avatarStartSize - (avatarProgress * (avatarStartSize - avatarEndSize));
  
  // Calcular el tamaño del punto de notificación proporcionalmente
  const notificationStartSize = 12; // header.sizes.notificationDot = spacing[3]
  const notificationEndSize = 10; // Proporcionalmente más pequeño
  const currentNotificationSize = notificationStartSize - (avatarProgress * (notificationStartSize - notificationEndSize));

  // Padding dinámico: de 24px a 16px al hacer scroll (solo en home, wallet, tarjeta)
  const paddingStartValue = 24; // spacing[6] = 1.5rem = 24px
  const paddingEndValue = 16; // spacing[4] = 1rem = 16px
  const currentPadding = shouldAnimateAvatar 
    ? paddingStartValue - (avatarProgress * (paddingStartValue - paddingEndValue))
    : paddingStartValue;

  // Color dinámico del stroke de notificación según vista y scroll
  // Transición suave: el color se desvanece gradualmente al hacer scroll
  const strokeScrollThreshold = 60; // Scroll necesario para completar la transición del stroke
  const strokeProgress = Math.min(scrollTop / strokeScrollThreshold, 1);
  // Aplicar easing para transición más suave
  const strokeAlpha = 1 - (strokeProgress * (2 - strokeProgress)); // ease-out quad inverso
  
  const getNotificationStrokeColor = () => {
    if (activeTab === 'tarjeta') {
      // Tarjeta: de azul oscuro (#0D0097) a transparente con transición suave
      return `rgba(13, 0, 151, ${strokeAlpha})`;
    }
    // Home/Wallet: de gris claro (#F0EFF8) a transparente con transición suave
    return `rgba(240, 239, 248, ${strokeAlpha})`;
  };
  const notificationStrokeColor = getNotificationStrokeColor();

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
        paddingTop: `calc(${currentPadding}px + env(safe-area-inset-top))`, // Dinámico + safe area top
        paddingBottom: `${currentPadding}px`, // Dinámico
        background: shouldApplyBlur
          ? `linear-gradient(to bottom, ${gradientStops})`
          : 'transparent',
        backdropFilter: shouldApplyBlur ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: shouldApplyBlur ? 'blur(20px) saturate(180%)' : 'none',
        transition: 'padding 0.25s ease-out, background 0.2s ease-out, backdrop-filter 0.2s ease-out',
        willChange: shouldApplyBlur ? 'background, backdrop-filter, padding' : 'auto',
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
          width: `${currentAvatarSize}px`,
          height: `${currentAvatarSize}px`,
          willChange: 'width, height',
        }}
      >
        {/* Avatar con imagen */}
        <div
          style={{
            width: '100%',
            height: '100%',
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
            width: `${currentNotificationSize}px`,
            height: `${currentNotificationSize}px`,
            backgroundColor: header.colors.notification,
            borderRadius: borderRadius.full,
            outline: `${header.borders.notificationBorderWidth} solid ${notificationStrokeColor}`,
            outlineOffset: '0px',
            zIndex: 10,
            willChange: 'width, height, outline-color',
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
            backgroundColor: (activeTab === 'tarjeta' && isScrolled) 
              ? 'rgba(255, 255, 255, 0.6)' 
              : (header.colors.buttonBackground[activeTab] || header.colors.buttonBackground.home),
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
            e.currentTarget.style.backgroundColor = (activeTab === 'tarjeta' && isScrolled)
              ? colors.gray[100]
              : (header.colors.buttonBackgroundHover[activeTab] || header.colors.buttonBackgroundHover.home);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = (activeTab === 'tarjeta' && isScrolled)
              ? 'rgba(255, 255, 255, 0.6)'
              : (header.colors.buttonBackground[activeTab] || header.colors.buttonBackground.home);
          }}
          aria-label={isBalanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
        >
          <EyeIcon activeTab={activeTab} isVisible={isBalanceVisible} isScrolled={isScrolled} />
        </button>

        {/* Icono Regalo - Referidos y promociones */}
        <button
          type="button"
          style={{
            backgroundColor: (activeTab === 'tarjeta' && isScrolled) 
              ? 'rgba(255, 255, 255, 0.6)' 
              : (header.colors.buttonBackground[activeTab] || header.colors.buttonBackground.home),
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
            e.currentTarget.style.backgroundColor = (activeTab === 'tarjeta' && isScrolled)
              ? colors.gray[100]
              : (header.colors.buttonBackgroundHover[activeTab] || header.colors.buttonBackgroundHover.home);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = (activeTab === 'tarjeta' && isScrolled)
              ? 'rgba(255, 255, 255, 0.6)'
              : (header.colors.buttonBackground[activeTab] || header.colors.buttonBackground.home);
          }}
          aria-label="Referidos y promociones"
        >
          <GiftIcon activeTab={activeTab} isScrolled={isScrolled} />
        </button>

        {/* Icono Búsqueda */}
        <button
          type="button"
          style={{
            backgroundColor: (activeTab === 'tarjeta' && isScrolled) 
              ? 'rgba(255, 255, 255, 0.6)' 
              : (header.colors.buttonBackground[activeTab] || header.colors.buttonBackground.home),
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
            e.currentTarget.style.backgroundColor = (activeTab === 'tarjeta' && isScrolled)
              ? colors.gray[100]
              : (header.colors.buttonBackgroundHover[activeTab] || header.colors.buttonBackgroundHover.home);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = (activeTab === 'tarjeta' && isScrolled)
              ? 'rgba(255, 255, 255, 0.6)'
              : (header.colors.buttonBackground[activeTab] || header.colors.buttonBackground.home);
          }}
          aria-label="Buscar"
        >
          <SearchIcon activeTab={activeTab} isScrolled={isScrolled} />
        </button>
      </div>
      </div>
    </div>
  );
}
