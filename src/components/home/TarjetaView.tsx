"use client";

import { useState, useRef, useEffect } from 'react';
import { borderRadius, colors, spacing, typography, shadows } from '../../config/design-tokens';
import { currentUser } from '../../config/userProfile';
import { transitions } from '../../config/transitions-tokens';
import { RecentMovementsSection } from './RecentMovementsSection';
import { SegmentedButton } from '../ui/SegmentedButton';
import { ActionCard } from '../ui/ActionCard';
import { PreferencesCard, PreferenceIcons } from '../ui/PreferencesCard';
import { MonthlyPurchasesCard } from '../ui/MonthlyPurchasesCard';
import { BottomSheet } from '../ui/BottomSheet';
import { SliderToBlock } from '../ui/SliderToBlock';
import { Toast } from '../ui/Toast';
import { InfoBanner } from '../ui/InfoBanner';
import { AddWalletOutActions } from '../ui/AddWalletOutActions';

interface TarjetaViewProps {
  titleRef?: (el: HTMLElement | null) => void;
  scrollProgress?: number;
  isBalanceVisible?: boolean;
}

export function TarjetaView({ titleRef, scrollProgress = 0, isBalanceVisible = true }: TarjetaViewProps) {
  const title = 'Tarjeta virtual';
  const [selectedFilter, setSelectedFilter] = useState<string>('Actividad');
  const previousFilterRef = useRef<string>('Actividad');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  
  // Leer el estado de bloqueo desde localStorage al inicializar
  // Inicializar siempre como false para evitar diferencias entre servidor y cliente
  const [isLocked, setIsLocked] = useState<boolean>(false);
  
  // Cargar el estado desde localStorage solo en el cliente después del mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLockState = localStorage.getItem('cardLocked');
      if (savedLockState === 'true') {
        setIsLocked(true);
      }
    }
  }, []);
  
  const [isBlockSheetOpen, setIsBlockSheetOpen] = useState<boolean>(false); // Control del bottom sheet de bloqueo
  const [isUnlockSheetOpen, setIsUnlockSheetOpen] = useState<boolean>(false); // Control del bottom sheet de desbloqueo
  const [isCardDataSheetOpen, setIsCardDataSheetOpen] = useState<boolean>(false); // Control del bottom sheet de datos de tarjeta
  const [showToast, setShowToast] = useState<boolean>(false); // Control del toast de confirmación
  const [toastMessage, setToastMessage] = useState<string>(''); // Mensaje del toast
  const lockButtonRef = useRef<HTMLButtonElement | null>(null); // Ref para el botón de bloqueo/desbloqueo
  
  // Estado para animación de estrellas del cashback
  const [cashbackAnimationStarted, setCashbackAnimationStarted] = useState<boolean>(false);
  const cashbackIconRef = useRef<HTMLDivElement>(null);
  const cashbackAnimatedRef = useRef<boolean>(false);
  
  // Efecto para observar cuando el icono de cashback entra en pantalla
  useEffect(() => {
    if (!cashbackIconRef.current) return;
    if (cashbackAnimatedRef.current) return;

    let observer: IntersectionObserver | null = null;

    const checkInitialVisibility = () => {
      if (!cashbackIconRef.current) return false;
      const rect = cashbackIconRef.current.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight && rect.bottom > 0;
    };

    const initialDelay = checkInitialVisibility() ? 300 : 0;

    const timeoutId = setTimeout(() => {
      if (!cashbackIconRef.current || cashbackAnimatedRef.current) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.1 && !cashbackAnimatedRef.current) {
              const rect = entry.boundingClientRect;
              const isInViewport = rect.top >= 0 && rect.top < window.innerHeight && rect.bottom > 0;
              
              if (isInViewport) {
                cashbackAnimatedRef.current = true;
                setTimeout(() => {
                  setCashbackAnimationStarted(true);
                }, 600);
                if (observer) {
                  observer.disconnect();
                }
              }
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px',
        }
      );

      if (cashbackIconRef.current) {
        observer.observe(cashbackIconRef.current);
      }
    }, initialDelay);

    return () => {
      clearTimeout(timeoutId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);
  
  // Sistema de toasts apilados - el más reciente ABAJO, anteriores suben
  interface ToastItem {
    id: number;
    message: string;
    opacity: number;
  }
  const [toastQueue, setToastQueue] = useState<ToastItem[]>([]);
  const toastIdRef = useRef<number>(0);
  const toastTimersRef = useRef<Map<string, { fadeTimeout: ReturnType<typeof setTimeout>; removeTimeout: ReturnType<typeof setTimeout> }>>(new Map());
  
  // Función para agregar un toast a la cola (evita duplicados)
  const addToast = (message: string) => {
    // Si ya existe un toast con el mismo mensaje, solo resetear timer
    const existingTimers = toastTimersRef.current.get(message);
    if (existingTimers) {
      clearTimeout(existingTimers.fadeTimeout);
      clearTimeout(existingTimers.removeTimeout);
      
      // Resetear opacidad
      setToastQueue(prev => 
        prev.map(t => t.message === message ? { ...t, opacity: 1 } : t)
      );
      
      const fadeTimeout = setTimeout(() => {
        setToastQueue(prev => 
          prev.map(t => t.message === message ? { ...t, opacity: 0 } : t)
        );
      }, 1500);
      
      const removeTimeout = setTimeout(() => {
        setToastQueue(prev => prev.filter(t => t.message !== message));
        toastTimersRef.current.delete(message);
      }, 2000);
      
      toastTimersRef.current.set(message, { fadeTimeout, removeTimeout });
      return;
    }
    
    const newId = toastIdRef.current++;
    
    // Agregar nuevo toast al final (aparece abajo, empuja los anteriores arriba)
    setToastQueue(prev => [...prev, { id: newId, message, opacity: 1 }]);
    
    // Iniciar fade out después de 1.5s
    const fadeTimeout = setTimeout(() => {
      setToastQueue(prev => 
        prev.map(t => t.id === newId ? { ...t, opacity: 0 } : t)
      );
    }, 1500);
    
    // Remover toast después del fade out
    const removeTimeout = setTimeout(() => {
      setToastQueue(prev => prev.filter(t => t.id !== newId));
      toastTimersRef.current.delete(message);
    }, 2000);
    
    toastTimersRef.current.set(message, { fadeTimeout, removeTimeout });
  };
  
  // Datos de la tarjeta (simulados)
  const cardData = {
    number: '4532 8790 1234 2345',
    name: currentUser.fullName,
    expiry: '12/28',
    cvv: '847',
  };

  // Guardar el estado de bloqueo en localStorage y notificar a otros componentes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cardLocked', String(isLocked));
      // Notificar a otros componentes (como HomePage) del cambio
      window.dispatchEvent(new CustomEvent('cardLockChanged'));
    }
  }, [isLocked]);

  // Resetear el estado visual del botón cuando se abre un bottom sheet
  useEffect(() => {
    if (lockButtonRef.current && (isBlockSheetOpen || isUnlockSheetOpen)) {
      lockButtonRef.current.style.backgroundColor = colors.semantic.background.white;
    }
  }, [isBlockSheetOpen, isUnlockSheetOpen]);

  // Determinar dirección de la animación según el cambio
  useEffect(() => {
    if (previousFilterRef.current !== selectedFilter) {
      // Activity → Options: slide left
      // Options → Activity: slide right
      if (previousFilterRef.current === 'Actividad' && selectedFilter === 'Opciones') {
        setSlideDirection('left');
      } else if (previousFilterRef.current === 'Opciones' && selectedFilter === 'Actividad') {
        setSlideDirection('right');
      }
      previousFilterRef.current = selectedFilter;
    }
  }, [selectedFilter]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.semantic.background.main,
      }}
    >
      {/* Contenedor con gradiente - desde antes del header hasta después de las acciones */}
      <div
        style={{
          background: `linear-gradient(180deg, #0D0097 0%, ${colors.primary.main} 50%, ${colors.semantic.background.main} 100%)`,
          marginLeft: `-${spacing[5]}`, // -20px para compensar el padding del contenedor padre
          marginRight: `-${spacing[5]}`, // -20px para compensar el padding del contenedor padre
          marginTop: '-100px', // Extender hacia arriba para cubrir detrás del header
          paddingLeft: spacing[5], // 20px para mantener el contenido alineado
          paddingRight: spacing[5], // 20px para mantener el contenido alineado
          paddingTop: `calc(100px + ${spacing[4]})`, // 100px + 16px compensar el margin negativo
          paddingBottom: spacing[6], // 24px abajo para espaciado con los botones
        }}
      >
        {/* Header de la sección con título y botón de opciones */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing[6], // 24px - mismo que en WalletView
          }}
        >
          <h1
            ref={(el) => {
              if (titleRef) titleRef(el);
            }}
            style={{
              fontSize: typography.sectionTitle.fontSize,
              fontWeight: typography.sectionTitle.fontWeight,
              lineHeight: typography.sectionTitle.lineHeight,
              color: colors.semantic.background.white,
              fontFamily: typography.sectionTitle.fontFamily,
              margin: 0,
            }}
          >
            Tarjeta virtual
          </h1>
          {/* Botón de tres puntos */}
          <button
            type="button"
            onClick={() => console.log('Más opciones')}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: borderRadius.full,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }}
            aria-label="Más opciones"
          >
            <img
              src="/img/icons/global/icon-dots.svg"
              alt="Más opciones"
              style={{
                width: '20px',
                height: '20px',
                display: 'block',
                filter: 'brightness(0) invert(1)', // Blanco
              }}
            />
          </button>
        </div>
        
        {/* Label "Saldo disponible" - mismo estilo que WalletView */}
        <div
          style={{
            height: '24px',
            fontFamily: typography.fontFamily.sans.join(', '), // Manrope
            fontWeight: typography.fontWeight.medium, // 500
            fontSize: typography.fontSize.base, // 16px
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '24px',
            marginBottom: 0, // Sin espacio entre label y saldo
          }}
        >
          Saldo disponible
        </div>
        
        {/* Balance principal - mismo estilo que WalletView - Enmascarado solo cuando isBalanceVisible es false */}
        <div
          style={{
            fontSize: typography.fontSize['3xl'], // 30px
            fontWeight: typography.fontWeight.bold,
            letterSpacing: '-0.04em', // -4% letter spacing
            color: colors.semantic.background.white,
            fontFamily: typography.fontFamily.sans.join(', '),
            marginTop: 0, // Sin espacio entre label y saldo
            marginBottom: spacing[6], // 24px después del contenido
            display: 'flex',
            alignItems: 'baseline',
            gap: spacing[1], // 4px entre número y moneda
          }}
        >
          {isBalanceVisible ? (
            <>
              <span>379,21</span>
              <span
                style={{
                  fontSize: typography.fontSize.sm, // 14px (más pequeño)
                  fontWeight: typography.fontWeight.bold,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  color: colors.semantic.background.white,
                }}
              >
                USD
              </span>
            </>
          ) : (
            <span>•••</span>
          )}
        </div>
        
        {/* Tarjeta visual */}
      <div
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '232px',
          borderRadius: borderRadius['3xl'], // 24px
          overflow: 'hidden',
          boxShadow: shadows.cardElevated,
        }}
      >
        <img
          src="/img/icons/cards/card-full-default-3x.png"
          alt="Tarjeta Virtual"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* Stroke inside - borde interior de 2px */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: borderRadius['3xl'], // 24px
            border: `2px solid ${colors.semantic.border.dark}`, // Stroke inside 2px
            pointerEvents: 'none',
          }}
        />
        {/* Overlay negro con opacidad 40% cuando la tarjeta está bloqueada - clickeable para desbloquear */}
        {isLocked && (
          <div
            onClick={() => setIsUnlockSheetOpen(true)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: borderRadius['3xl'], // 24px
              backgroundColor: 'rgba(0, 0, 0, 0.4)', // Negro con 40% de opacidad
              pointerEvents: 'auto',
              zIndex: 5,
              cursor: 'pointer',
            }}
          />
        )}
        {/* Badge con últimos dígitos de la tarjeta - arriba a la izquierda */}
        <div
          style={{
            position: 'absolute',
            top: spacing[6], // 24px desde arriba
            left: spacing[6], // 24px desde la izquierda
            backgroundColor: 'rgba(0, 0, 0, 0.25)', // Badge de tarjeta
            borderRadius: borderRadius.full, // Full rounded
            paddingTop: '6px',
            paddingBottom: '6px',
            paddingLeft: '12px',
            paddingRight: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: '14px',
              fontWeight: typography.fontWeight.bold,
              color: colors.semantic.background.white,
              lineHeight: 1,
              letterSpacing: '-0.1em', // Puntos más pegados
            }}
          >
            •••
          </span>
          <span
            style={{
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: '14px',
              fontWeight: typography.fontWeight.bold,
              color: colors.semantic.background.white,
              lineHeight: 1,
              marginLeft: '4px',
            }}
          >
            2345
          </span>
        </div>
        {/* Logo Visa - abajo a la derecha */}
        <img
          src="/img/icons/payment/logo-visa.svg"
          alt="Visa"
          style={{
            position: 'absolute',
            bottom: spacing[6],
            right: spacing[6],
            height: '24px',
            width: 'auto',
            // Aplicar color #E9E8EC usando CSS filter
            filter: 'brightness(0) saturate(100%) invert(95%) sepia(5%) saturate(200%) hue-rotate(200deg) brightness(98%) contrast(92%)',
            zIndex: 10,
          }}
        />
        
        {/* Overlay de bloqueo cuando la tarjeta está bloqueada - clickeable para desbloquear */}
        {isLocked && (
          <div
            onClick={() => setIsUnlockSheetOpen(true)}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              borderRadius: borderRadius.full, // Full rounded (círculo)
              backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo con menos opacidad (70%)
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              boxShadow: 'none', // Sin sombra
              cursor: 'pointer',
            }}
          >
            {/* Icono de candado cerrado */}
            <img
              src="/img/icons/global/lock.svg"
              alt="Tarjeta bloqueada"
              style={{
                width: '32px',
                height: '32px',
                display: 'block',
                filter: 'none', // Color negro (sin filtro)
                pointerEvents: 'none',
              }}
            />
          </div>
        )}
        </div>
      </div>
      </div>
      
      {/* Fin del contenedor con gradiente */}
      
      {/* Fin del contenedor con gradiente */}
      
      {/* Botones de acción debajo de la tarjeta */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '40px', // 40px entre botones
          marginTop: 0, // Sin margen superior
          marginBottom: spacing[6], // 24px abajo (igual que segmented → movimientos)
          paddingLeft: spacing[5], // 20px para mantener alineación con el contenido
          paddingRight: spacing[5], // 20px para mantener alineación con el contenido
        }}
      >
        {/* Botón Recargar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing[2], // 8px entre icono y label
            boxShadow: 'none', // Sin sombra
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Resetear estado inmediatamente
              e.currentTarget.style.backgroundColor = colors.semantic.background.white;
              console.log('Recargar tarjeta');
            }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: borderRadius.full,
              backgroundColor: colors.semantic.background.white,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'background-color 0.15s ease',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.background.white;
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              e.currentTarget.style.backgroundColor = colors.semantic.background.white;
            }}
            onPointerLeave={(e) => {
              e.stopPropagation();
              e.currentTarget.style.backgroundColor = colors.semantic.background.white;
            }}
            aria-label="Recargar tarjeta"
          >
            <img
              src="/img/icons/global/arrow-narrow-up.svg"
              alt="Recargar tarjeta"
              style={{
                width: '24px',
                height: '24px',
                display: 'block',
              }}
            />
          </button>
          <span
            style={{
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.primary,
              textAlign: 'center',
            }}
          >
            Recargar tarjeta
          </span>
        </div>

        {/* Botón Ver datos */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing[2],
            boxShadow: 'none', // Sin sombra
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Resetear estado inmediatamente
              e.currentTarget.style.backgroundColor = colors.semantic.background.white;
              setIsCardDataSheetOpen(true);
            }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: borderRadius.full,
              backgroundColor: colors.semantic.background.white,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'background-color 0.15s ease',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.background.white;
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              e.currentTarget.style.backgroundColor = colors.semantic.background.white;
            }}
            onPointerLeave={(e) => {
              e.stopPropagation();
              e.currentTarget.style.backgroundColor = colors.semantic.background.white;
            }}
            aria-label="Ver datos"
          >
            <img
              src="/img/icons/global/details.card.svg"
              alt="Ver datos"
              style={{
                width: '24px',
                height: '24px',
                display: 'block',
              }}
            />
          </button>
          <span
            style={{
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.primary,
              textAlign: 'center',
            }}
          >
            Ver datos
          </span>
        </div>

        {/* Botón Bloqueo temporal / Desbloquear */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing[2],
            boxShadow: 'none', // Sin sombra
          }}
        >
          <button
            ref={lockButtonRef}
            type="button"
            onClick={(e) => {
              console.log('Botón desbloquear/bloquear clicked', { isLocked }); // DEBUG
              e.stopPropagation();
              // Resetear estado inmediatamente antes de abrir el bottom sheet
              const button = e.currentTarget;
              button.style.backgroundColor = colors.semantic.background.white;
              
              // Usar setTimeout para asegurar que el reset se aplique después del evento
              setTimeout(() => {
                if (button) {
                  button.style.backgroundColor = colors.semantic.background.white;
                }
              }, 0);
              
              if (!isLocked) {
                // Si está desbloqueada, abrir el bottom sheet de bloqueo
                console.log('Abriendo bottom sheet de bloqueo'); // DEBUG
                setIsBlockSheetOpen(true);
              } else {
                // Si está bloqueada, abrir el bottom sheet de desbloqueo
                console.log('Abriendo bottom sheet de desbloqueo'); // DEBUG
                setIsUnlockSheetOpen(true);
              }
            }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: borderRadius.full,
              backgroundColor: colors.semantic.background.white, // Siempre blanco tokenizado, independiente del estado
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'background-color 0.15s ease',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              position: 'relative',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.background.white; // Siempre volver a blanco tokenizado
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              const button = e.currentTarget;
              button.style.backgroundColor = colors.semantic.background.white;
              // Asegurar reset después de un pequeño delay
              setTimeout(() => {
                if (button) {
                  button.style.backgroundColor = colors.semantic.background.white;
                }
              }, 50);
            }}
            onPointerLeave={(e) => {
              e.stopPropagation();
              const button = e.currentTarget;
              button.style.backgroundColor = colors.semantic.background.white;
            }}
            onPointerCancel={(e) => {
              e.stopPropagation();
              const button = e.currentTarget;
              button.style.backgroundColor = colors.semantic.background.white;
            }}
            aria-label={isLocked ? 'Desbloquear' : 'Bloqueo temporal'}
          >
            <img
              src={isLocked ? '/img/icons/global/lock-open.svg' : '/img/icons/global/lock.svg'}
              alt={isLocked ? 'Desbloquear' : 'Bloqueo temporal'}
              style={{
                width: '24px',
                height: '24px',
                display: 'block',
              }}
            />
          </button>
          <span
            style={{
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.primary,
              textAlign: 'center',
            }}
          >
            {isLocked ? 'Desbloquear' : 'Bloqueo temporal'}
          </span>
        </div>
      </div>

      {/* Segmented Button - Debajo de los botones de acción */}
      <div
        style={{
          marginBottom: spacing[6], // 24px abajo
        }}
      >
        <SegmentedButton
          options={['Actividad', 'Opciones']}
          defaultValue={selectedFilter}
          onChange={setSelectedFilter}
        />
      </div>

      {/* Banner informativo cuando la tarjeta está bloqueada - Debe aparecer primero cuando está bloqueada */}
      {isLocked && (
        <div style={{ marginBottom: '1.5rem' }}>
          <InfoBanner
            title="Esta tarjeta está bloqueada"
            description="Desbloquéala para hacer cambios o usarla."
          />
        </div>
      )}

      {/* AddWalletOutActions - Solo renderizar cuando está en Opciones */}
      {selectedFilter === 'Opciones' && (
        <div
          style={{
            width: '100%',
            maxWidth: '100%', // Prevenir overflow
            marginBottom: spacing[6], // 24px abajo
            boxSizing: 'border-box',
          }}
        >
          <AddWalletOutActions
            onClick={() => {
              // TODO: Implementar acción de agregar a Apple Wallet
              console.log('Agregar a Apple Wallet');
            }}
            disabled={isLocked}
          />
        </div>
      )}

      {/* Contenedor de contenido con animación de slide horizontal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '100%', // Prevenir overflow
          overflowX: 'hidden', // Prevenir scroll horizontal
          overflowY: 'visible', // Permitir scroll vertical del contenedor padre
          minHeight: '400px', // Altura mínima aumentada para acomodar 3 movimientos
          boxSizing: 'border-box',
        }}
      >
        {/* Vista de Actividad - Últimos movimientos - Solo renderizar cuando está activo */}
        {selectedFilter === 'Actividad' && (
          <div
            style={{
              width: '100%',
              maxWidth: '100%', // Prevenir overflow
              boxSizing: 'border-box',
            }}
          >
            {/* Sección Últimos movimientos - Solo visible en Actividad */}
            <RecentMovementsSection 
              isBalanceVisible={isBalanceVisible} 
              maxItems={3} 
              filterBySource="card" 
            />
            
            {/* Has recibido en cashback - Debajo de Últimos movimientos */}
            <div
              style={{
                marginTop: spacing[4], // 16px
                marginBottom: '1.5rem', // 24px
                backgroundColor: colors.semantic.background.white,
                borderRadius: borderRadius['3xl'], // 24px - igual que MonthlyPurchasesCard
                padding: spacing[6], // 24px - igual que MonthlyPurchasesCard
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing[6], // 24px
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              {/* Sección izquierda: Contenido de texto */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  gap: spacing['0.5'], // 2px - igual que MonthlyPurchasesCard
                  minWidth: 0,
                }}
              >
                {/* Título */}
                <h2
                  style={{
                    fontFamily: typography.fontFamily.sans.join(', '),
                    fontSize: typography.fontSize.lg, // 18px
                    fontWeight: typography.fontWeight.bold, // 700
                    lineHeight: '24px',
                    letterSpacing: '0%',
                    color: colors.semantic.text.primary,
                    margin: 0,
                    padding: 0,
                  }}
                >
                  Has recibido en cashback
                </h2>

                {/* Monto */}
                <div
                  style={{
                    fontFamily: typography.fontFamily.sans.join(', '),
                    fontSize: '1.75rem', // 28px
                    fontWeight: typography.fontWeight.extrabold, // 800
                    letterSpacing: '-0.04em', // -4%
                    color: colors.semantic.text.primary,
                    lineHeight: typography.lineHeight.none,
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: spacing[1], // 4px
                  }}
                >
                  <span>{isBalanceVisible ? '64,82' : '•••'}</span>
                  {isBalanceVisible && (
                    <span
                      style={{
                        fontSize: typography.fontSize.sm, // 14px
                        fontWeight: typography.fontWeight.bold, // 700
                        fontFamily: typography.fontFamily.sans.join(', '),
                        color: colors.semantic.text.primary,
                      }}
                    >
                      USD
                    </span>
                  )}
                </div>

                {/* Rango de fechas */}
                <div
                  style={{
                    fontFamily: typography.fontFamily.sans.join(', '),
                    fontSize: typography.fontSize.base, // 16px
                    fontWeight: typography.fontWeight.normal, // 400
                    lineHeight: typography.lineHeight.normal,
                    color: colors.semantic.text.secondary,
                    margin: 0,
                    padding: 0,
                  }}
                >
                  Del 01 enero hasta la fecha
                </div>
              </div>
              
              {/* Sección derecha: Icono de cashback con animación */}
              <div
                ref={cashbackIconRef}
                style={{
                  flexShrink: 0,
                  width: '64px',
                  height: '64px',
                  borderRadius: borderRadius.full,
                  background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Keyframes para las animaciones */}
                <style>{`
                  @keyframes starMainCashback {
                    0% {
                      transform: translateY(20px) scale(0);
                      opacity: 0;
                    }
                    50% {
                      opacity: 1;
                    }
                    100% {
                      transform: translateY(0) scale(1);
                      opacity: 1;
                    }
                  }
                  @keyframes starSparkle1Cashback {
                    0% {
                      transform: translate(0, 20px) scale(0);
                      opacity: 0;
                    }
                    20% {
                      opacity: 1;
                    }
                    60% {
                      transform: translate(-12px, -8px) scale(1);
                      opacity: 1;
                    }
                    100% {
                      transform: translate(-16px, -12px) scale(0);
                      opacity: 0;
                    }
                  }
                  @keyframes starSparkle2Cashback {
                    0% {
                      transform: translate(0, 20px) scale(0);
                      opacity: 0;
                    }
                    25% {
                      opacity: 1;
                    }
                    65% {
                      transform: translate(14px, -6px) scale(1);
                      opacity: 1;
                    }
                    100% {
                      transform: translate(18px, -10px) scale(0);
                      opacity: 0;
                    }
                  }
                  @keyframes starSparkle3Cashback {
                    0% {
                      transform: translate(0, 20px) scale(0);
                      opacity: 0;
                    }
                    30% {
                      opacity: 1;
                    }
                    70% {
                      transform: translate(-8px, -14px) scale(1);
                      opacity: 1;
                    }
                    100% {
                      transform: translate(-10px, -18px) scale(0);
                      opacity: 0;
                    }
                  }
                  @keyframes starSparkle4Cashback {
                    0% {
                      transform: translate(0, 20px) scale(0);
                      opacity: 0;
                    }
                    35% {
                      opacity: 1;
                    }
                    75% {
                      transform: translate(10px, -12px) scale(1);
                      opacity: 1;
                    }
                    100% {
                      transform: translate(14px, -16px) scale(0);
                      opacity: 0;
                    }
                  }
                  @keyframes starSparkle5Cashback {
                    0% {
                      transform: translate(0, 20px) scale(0);
                      opacity: 0;
                    }
                    40% {
                      opacity: 1;
                    }
                    80% {
                      transform: translate(0, -16px) scale(1);
                      opacity: 1;
                    }
                    100% {
                      transform: translate(0, -20px) scale(0);
                      opacity: 0;
                    }
                  }
                `}</style>
                
                {/* Estrella principal */}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    animation: cashbackAnimationStarted ? 'starMainCashback 0.9s ease-out 0.3s forwards' : 'none',
                    opacity: 0,
                    transform: 'translateY(20px) scale(0)',
                    zIndex: 2,
                  }}
                >
                  <path
                    d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                
                {/* Estrellas pequeñas que acompañan - solo se muestran durante la animación */}
                {cashbackAnimationStarted && (
                  <>
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        position: 'absolute',
                        bottom: '50%',
                        left: '50%',
                        animation: 'starSparkle1Cashback 1.4s ease-out 0.4s forwards',
                        zIndex: 1,
                      }}
                    >
                      <path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" />
                    </svg>
                    
                    <svg
                      width="6"
                      height="6"
                      viewBox="0 0 24 24"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        position: 'absolute',
                        bottom: '50%',
                        left: '50%',
                        animation: 'starSparkle2Cashback 1.5s ease-out 0.5s forwards',
                        zIndex: 1,
                      }}
                    >
                      <path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" />
                    </svg>
                    
                    <svg
                      width="5"
                      height="5"
                      viewBox="0 0 24 24"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        position: 'absolute',
                        bottom: '50%',
                        left: '50%',
                        animation: 'starSparkle3Cashback 1.5s ease-out 0.55s forwards',
                        zIndex: 1,
                      }}
                    >
                      <path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" />
                    </svg>
                    
                    <svg
                      width="7"
                      height="7"
                      viewBox="0 0 24 24"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        position: 'absolute',
                        bottom: '50%',
                        left: '50%',
                        animation: 'starSparkle4Cashback 1.6s ease-out 0.5s forwards',
                        zIndex: 1,
                      }}
                    >
                      <path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" />
                    </svg>
                    
                    <svg
                      width="4"
                      height="4"
                      viewBox="0 0 24 24"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        position: 'absolute',
                        bottom: '50%',
                        left: '50%',
                        animation: 'starSparkle5Cashback 1.7s ease-out 0.6s forwards',
                        zIndex: 1,
                      }}
                    >
                      <path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" />
                    </svg>
                  </>
                )}
              </div>
            </div>
            
            {/* Monthly Purchases Card - Debajo de Cashback */}
            <div
              style={{
                marginTop: spacing[4], // Token semántico: 16px de espacio arriba
              }}
            >
              <MonthlyPurchasesCard
                amount={893.01}
                currency="USD"
                isBalanceVisible={isBalanceVisible}
              />
            </div>
          </div>
        )}

        {/* Vista de Opciones - Tarjeta de Acciones y Preferencias - Solo renderizar cuando está activo */}
        {selectedFilter === 'Opciones' && (
          <div
            style={{
              width: '100%',
              maxWidth: '100%', // Prevenir overflow
              boxSizing: 'border-box',
            }}
          >
          {/* Tarjeta de Acciones */}
          <ActionCard
            title="Acciones"
            actions={[
              {
                id: 'withdraw-atm',
                label: 'Retiro en cajeros automáticos',
                icon: (
                  <img
                    src="/img/icons/global/atm.svg"
                    alt="ATM"
                    style={{
                      width: '20px', // Token: ACTION_ICON_IMAGE_SIZE (20px)
                      height: '20px', // Token: ACTION_ICON_IMAGE_SIZE (20px)
                      display: 'block',
                      filter: isLocked ? 'grayscale(100%) opacity(0.5)' : 'none', // Escala de grises cuando está bloqueada
                    }}
                  />
                ),
                onClick: () => {
                  // TODO: Implementar acción de retirar en ATM
                  console.log('Retirar en ATM');
                },
                disabled: isLocked, // Deshabilitado cuando la tarjeta está bloqueada
              },
            ]}
          />
          
          {/* Tarjeta de Preferencias */}
          <PreferencesCard
            title="Preferencias"
            preferences={[
              {
                id: 'security',
                label: 'Seguridad',
                icon: <PreferenceIcons.Security />,
                onClick: () => {
                  // TODO: Implementar navegación a Seguridad
                  console.log('Seguridad');
                },
              },
              {
                id: 'customize-card',
                label: 'Cambiar diseño',
                icon: (
                  <img
                    src="/img/icons/global/color-card.svg"
                    alt="Cambiar diseño"
                    style={{
                      width: '20px',
                      height: '20px',
                      display: 'block',
                    }}
                  />
                ),
                onClick: () => {
                  // TODO: Implementar navegación a Cambiar diseño
                  console.log('Cambiar diseño');
                },
              },
              {
                id: 'usage-limits',
                label: 'Límites de uso',
                icon: <PreferenceIcons.UsageLimits />,
                onClick: () => {
                  // TODO: Implementar navegación a Límites de uso
                  console.log('Límites de uso');
                },
              },
              {
                id: 'help-support',
                label: 'Ayuda y soporte',
                icon: <PreferenceIcons.HelpSupport />,
                onClick: () => {
                  // TODO: Implementar navegación a Ayuda y soporte
                  console.log('Ayuda y soporte');
                },
              },
              {
                id: 'delete-account',
                label: 'Eliminar cuenta',
                icon: <PreferenceIcons.DeleteAccount />,
                onClick: () => {
                  // TODO: Implementar acción de eliminar cuenta
                  console.log('Eliminar cuenta');
                },
                isDanger: true,
                showChevron: false, // Sin chevron para acciones directas
              },
            ]}
          />
          </div>
        )}
      </div>

      {/* Bottom Sheet para bloquear tarjeta */}
      <BottomSheet
        isOpen={isBlockSheetOpen}
        onClose={() => {
          setIsBlockSheetOpen(false);
          // Cerrar toast si está abierto cuando se cierra el bottom sheet
          setShowToast(false);
          // Resetear el estado del slider cuando se cierra sin completar
          if (!isLocked) {
            // El slider se reseteará automáticamente cuando se vuelva a abrir
          }
        }}
        title="Bloquear tarjeta"
        showGraber={true}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[6], // 24px entre elementos
          }}
        >
          {/* Descripción */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing[4], // 16px entre párrafos
            }}
          >
            <p
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base, // 16px
                fontWeight: typography.fontWeight.normal, // 400 Regular
                color: colors.semantic.text.secondary,
                lineHeight: '24px',
                margin: 0,
              }}
            >
              Esto bloqueará el uso de tu tarjeta virtual (incluido Apple Pay), las compras por internet y las suscripciones recurrentes.
            </p>
            <p
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base, // 16px
                fontWeight: typography.fontWeight.normal, // 400 Regular
                color: colors.semantic.text.secondary,
                lineHeight: '24px',
                margin: 0,
              }}
            >
              Podrás desbloquearla en cualquier momento.
            </p>
          </div>

          {/* Slider para bloquear */}
          <div style={{ marginTop: spacing[2] }}> {/* Espacio adicional antes del slider */}
            <SliderToBlock
              key={isBlockSheetOpen ? 'open' : 'closed'} // Resetear cuando se abre/cierra
              onComplete={() => {
                // 1. Ejecutar acción inmediatamente
                setIsLocked(true);
                // 2. Cerrar bottom sheet
                setIsBlockSheetOpen(false);
                // 3. Mostrar toast de confirmación después de un pequeño delay para que se vea el cierre del bottom sheet
                setTimeout(() => {
                  setToastMessage('Bloqueo temporal activado');
                  setShowToast(true);
                }, 300);
                console.log('Bloqueo temporal');
              }}
              onCloseSheet={() => setIsBlockSheetOpen(false)}
              onShowToast={(message) => {
                // No mostrar toast aquí, ya se maneja en onComplete
              }}
              disabled={isLocked}
            />
          </div>
        </div>
      </BottomSheet>

      {/* Bottom Sheet para desbloquear tarjeta */}
      <BottomSheet
        isOpen={isUnlockSheetOpen}
        onClose={() => {
          setIsUnlockSheetOpen(false);
          // Cerrar toast si está abierto cuando se cierra el bottom sheet
          setShowToast(false);
        }}
        title="Desbloquear tarjeta"
        showGraber={true}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[6], // 24px entre elementos
          }}
        >
          {/* Descripción */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing[4], // 16px entre párrafos
            }}
          >
            <p
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base, // 16px
                fontWeight: typography.fontWeight.normal, // 400 Regular
                color: colors.semantic.text.secondary,
                lineHeight: '24px',
                margin: 0,
              }}
            >
              Vuelve a usar tu tarjeta virtual al instante para compras online, Apple Pay y suscripciones recurrentes.
            </p>
            <p
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base, // 16px
                fontWeight: typography.fontWeight.normal, // 400 Regular
                color: colors.semantic.text.secondary,
                lineHeight: '24px',
                margin: 0,
              }}
            >
              Puedes volver a bloquearla cuando quieras.
            </p>
          </div>

          {/* Slider para desbloquear */}
          <div style={{ marginTop: spacing[2] }}> {/* Espacio adicional antes del slider */}
            <SliderToBlock
              key={isUnlockSheetOpen ? 'unlock-open' : 'unlock-closed'} // Resetear cuando se abre/cierra
              mode="unlock"
              onComplete={() => {
                // 1. Ejecutar acción inmediatamente
                setIsLocked(false);
                // 2. Cerrar bottom sheet
                setIsUnlockSheetOpen(false);
                // 3. Mostrar toast de confirmación después de un pequeño delay para que se vea el cierre del bottom sheet
                setTimeout(() => {
                  setToastMessage('Tarjeta desbloqueada');
                  setShowToast(true);
                }, 300);
                console.log('Desbloqueo completado');
              }}
              onCloseSheet={() => setIsUnlockSheetOpen(false)}
              onShowToast={(message) => {
                setToastMessage(message);
                setShowToast(true);
              }}
              disabled={!isLocked}
            />
          </div>
        </div>
      </BottomSheet>

      {/* Bottom Sheet para ver datos de la tarjeta */}
      <BottomSheet
        isOpen={isCardDataSheetOpen}
        onClose={() => setIsCardDataSheetOpen(false)}
        title="Datos de tu tarjeta"
        showGraber={true}
        rightIcon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke={colors.semantic.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        onRightIconClick={() => setIsCardDataSheetOpen(false)}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem', // 16px entre elementos
            padding: 0,
            marginTop: spacing[2], // 8px desde el header
          }}
        >
          {/* 1. Nombre del titular */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing[1], // 4px
              padding: 0,
            }}
          >
            <span
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.sm, // 14px
                fontWeight: typography.fontWeight.normal,
                color: colors.semantic.text.secondary,
                lineHeight: '20px',
              }}
            >
              Nombre del titular
            </span>
            <span
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontSize: typography.fontSize.base, // 16px
                fontWeight: typography.fontWeight.semibold,
                color: colors.semantic.text.primary,
                lineHeight: '24px',
              }}
            >
              {cardData.name}
            </span>
          </div>

          {/* 2. Número de tarjeta con botón de copiar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[1], // 4px
              }}
            >
              <span
                style={{
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.sm, // 14px
                  fontWeight: typography.fontWeight.normal,
                  color: colors.semantic.text.secondary,
                  lineHeight: '20px',
                }}
              >
                Número de tarjeta
              </span>
              <span
                style={{
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.base, // 16px
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.semantic.text.primary,
                  lineHeight: '24px',
                  letterSpacing: '0.02em',
                }}
              >
                {cardData.number}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(cardData.number.replace(/\s/g, '')).then(() => {
                  addToast('Número copiado');
                }).catch(() => {
                  console.error('Error al copiar');
                });
              }}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: borderRadius.full,
                backgroundColor: 'rgba(0, 0, 0, 0.063)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.2s ease',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                flexShrink: 0,
              }}
              onPointerDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
                e.currentTarget.style.opacity = '0.7';
              }}
              onPointerUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
              aria-label="Copiar número de tarjeta"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"
                  stroke={colors.semantic.text.secondary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* 3. Fecha de vencimiento y CVV en la misma fila */}
          <div
            style={{
              display: 'flex',
              gap: spacing[4], // 16px entre columnas
              padding: 0,
            }}
          >
            {/* Fecha de vencimiento */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[1], // 4px
                flex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.sm, // 14px
                  fontWeight: typography.fontWeight.normal,
                  color: colors.semantic.text.secondary,
                  lineHeight: '20px',
                }}
              >
                Fecha de vencimiento
              </span>
              <span
                style={{
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.base, // 16px
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.semantic.text.primary,
                  lineHeight: '24px',
                }}
              >
                {cardData.expiry}
              </span>
            </div>

            {/* CVV */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[1], // 4px
                flex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.sm, // 14px
                  fontWeight: typography.fontWeight.normal,
                  color: colors.semantic.text.secondary,
                  lineHeight: '20px',
                }}
              >
                CVV
              </span>
              <span
                style={{
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.base, // 16px
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.semantic.text.primary,
                  lineHeight: '24px',
                }}
              >
                {cardData.cvv}
              </span>
            </div>
          </div>

          {/* Botón Copiar todo - Secundario */}
          <button
            type="button"
            onClick={() => {
              const allData = `${cardData.number.replace(/\s/g, '')}\n${cardData.name}\n${cardData.expiry}\n${cardData.cvv}`;
              navigator.clipboard.writeText(allData).then(() => {
                addToast('Datos copiados');
              }).catch(() => {
                console.error('Error al copiar');
              });
            }}
            style={{
              width: '100%',
              padding: `${spacing[3]} ${spacing[4]}`,
              marginTop: spacing[2],
              backgroundColor: 'rgba(0, 0, 0, 0.063)',
              border: 'none',
              borderRadius: borderRadius.full,
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.bold,
              color: colors.semantic.text.primary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[2],
              transition: 'all 0.15s ease',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.063)';
            }}
            onPointerDown={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.063)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.063)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"
                stroke={colors.semantic.text.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Copiar todo
          </button>
        </div>
      </BottomSheet>

      {/* Toasts apilados - más reciente abajo, anteriores suben naturalmente */}
      <div
        style={{
          position: 'fixed',
          bottom: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '4px',
          zIndex: 10000,
          pointerEvents: 'none',
          alignItems: 'center',
        }}
      >
        {toastQueue.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              backgroundColor: colors.semantic.text.primary,
              color: colors.semantic.background.white,
              padding: `${spacing[3]} ${spacing[5]}`,
              borderRadius: borderRadius.full,
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              boxShadow: shadows.card,
              opacity: toast.opacity,
              // Animación natural tipo spring para el movimiento
              transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease-out',
              whiteSpace: 'nowrap',
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Toast de confirmación - Se muestra sobre el bottom sheet de datos, pero no sobre block/unlock */}
      <Toast
        message={toastMessage || (isLocked ? 'Bloqueo temporal activado' : 'Tarjeta desbloqueada')}
        isVisible={showToast && !isBlockSheetOpen && !isUnlockSheetOpen}
        onClose={() => setShowToast(false)}
        duration={2000}
      />
    </div>
  );
}
