"use client";

import { useState, useRef, useEffect } from 'react';
import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
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
  const [isLocked, setIsLocked] = useState<boolean>(false); // Estado inicial: desbloqueada (muestra "Bloqueo temporal")
  const [isBlockSheetOpen, setIsBlockSheetOpen] = useState<boolean>(false); // Control del bottom sheet de bloqueo
  const [showToast, setShowToast] = useState<boolean>(false); // Control del toast de confirmación

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
          paddingBottom: 0, // Sin padding abajo
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
        
        {/* Balance principal - mismo estilo que WalletView */}
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
        </div>
        
        {/* Tarjeta visual */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '232px',
          borderRadius: borderRadius['3xl'], // 24px
          overflow: 'hidden',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15), 0px 4px 8px rgba(0, 0, 0, 0.1)',
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
            border: '2px solid rgba(255, 255, 255, 0.2)', // Stroke inside 2px
            pointerEvents: 'none',
          }}
        />
        {/* Overlay negro con opacidad 40% cuando la tarjeta está bloqueada */}
        {isLocked && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: borderRadius['3xl'], // 24px
              backgroundColor: 'rgba(0, 0, 0, 0.4)', // Negro con 40% de opacidad
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
        )}
        {/* Badge con últimos dígitos de la tarjeta - arriba a la izquierda */}
        <div
          style={{
            position: 'absolute',
            top: spacing[6], // 24px desde arriba
            left: spacing[6], // 24px desde la izquierda
            backgroundColor: 'rgba(0, 0, 0, 0.25)', // #000000 con 25% opacidad
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
            bottom: spacing[6], // 24px desde abajo
            right: spacing[6], // 24px desde la derecha
            height: '24px',
            width: 'auto',
            // Aplicar color #E9E8EC usando CSS filter
            filter: 'brightness(0) saturate(100%) invert(95%) sepia(5%) saturate(200%) hue-rotate(200deg) brightness(98%) contrast(92%)',
          }}
        />
        
        {/* Overlay de bloqueo cuando la tarjeta está bloqueada */}
        {isLocked && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px', // Más pequeño: 80px en lugar de 120px
              height: '80px', // Más pequeño: 80px en lugar de 120px
              borderRadius: borderRadius.full, // Full rounded (círculo)
              backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo con menos opacidad (70%)
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Icono de candado cerrado */}
            <img
              src="/img/icons/global/lock.svg"
              alt="Tarjeta bloqueada"
              style={{
                width: '32px', // Más pequeño: 32px en lugar de 48px
                height: '32px', // Más pequeño: 32px en lugar de 48px
                display: 'block',
                filter: 'none', // Color negro (sin filtro)
              }}
            />
          </div>
        )}
      </div>
      </div>
      {/* Fin del contenedor con gradiente */}

      {/* Botones de acción debajo de la tarjeta */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '40px', // 40px entre botones
          marginTop: spacing[6], // 24px arriba (igual que segmented → movimientos)
          marginBottom: spacing[6], // 24px abajo (igual que segmented → movimientos)
        }}
      >
        {/* Botón Agregar saldo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing[2], // 8px entre icono y label
          }}
        >
          <button
            type="button"
            onClick={() => console.log('Agregar saldo')}
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
              transition: 'background-color 0.2s ease',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.background.white;
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
            onTouchEnd={(e) => {
              // Resetear inmediatamente después del touch
              setTimeout(() => {
                e.currentTarget.style.backgroundColor = colors.semantic.background.white;
              }, 100);
            }}
            aria-label="Agregar saldo"
          >
            <img
              src="/img/icons/global/add.svg"
              alt="Agregar saldo"
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
            Agregar saldo
          </span>
        </div>

        {/* Botón Ver datos */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <button
            type="button"
            onClick={() => console.log('Ver datos')}
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
              transition: 'background-color 0.2s ease',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.background.white;
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
            onTouchEnd={(e) => {
              // Resetear inmediatamente después del touch
              setTimeout(() => {
                e.currentTarget.style.backgroundColor = colors.semantic.background.white;
              }, 100);
            }}
            aria-label="Ver datos"
          >
            <img
              src="/img/icons/button-bar/icon-card-inactive.svg"
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
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (!isLocked) {
                // Si está desbloqueada, abrir el bottom sheet
                setIsBlockSheetOpen(true);
              } else {
                // Si está bloqueada, desbloquear directamente
                setIsLocked(false);
                console.log('Desbloquear');
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
              transition: 'background-color 0.2s ease',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.background.white; // Siempre volver a blanco tokenizado
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
            onTouchEnd={(e) => {
              // Resetear inmediatamente después del touch
              const target = e.currentTarget;
              setTimeout(() => {
                target.style.backgroundColor = colors.semantic.background.white;
              }, 100);
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

      {/* Banner informativo cuando la tarjeta está bloqueada - Siempre visible y fijo */}
      {isLocked && (
        <div style={{ marginBottom: spacing[4] }}>
          <InfoBanner
            title="Esta tarjeta está bloqueada"
            description="Desbloquéala para hacer cambios o usarla."
          />
        </div>
      )}

      {/* Contenedor de contenido con animación de slide horizontal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden', // Cambiado a 'hidden' para prevenir scroll horizontal
          minHeight: '400px', // Altura mínima aumentada para acomodar 3 movimientos
          boxSizing: 'border-box',
        }}
      >
        {/* Vista de Actividad - Últimos movimientos */}
        <div
          style={{
            position: selectedFilter === 'Actividad' ? 'relative' : 'absolute', // 'relative' cuando está visible para que afecte la altura del contenedor
            top: 0,
            left: selectedFilter === 'Actividad' ? '0%' : slideDirection === 'left' ? '-100%' : '100%',
            width: '100%',
            opacity: selectedFilter === 'Actividad' ? 1 : 0,
            transform: selectedFilter === 'Actividad' 
              ? 'translateX(0)' 
              : slideDirection === 'left' 
                ? 'translateX(-100%)' 
                : 'translateX(100%)',
            transition: `opacity ${transitions.duration.slow} ${transitions.easing.easeInOut}, transform ${transitions.duration.slow} ${transitions.easing.easeInOut}`,
            pointerEvents: selectedFilter === 'Actividad' ? 'auto' : 'none',
            zIndex: selectedFilter === 'Actividad' ? 1 : 0,
          }}
        >
          {/* Sección Últimos movimientos - Solo visible en Actividad */}
          <RecentMovementsSection 
            isBalanceVisible={isBalanceVisible} 
            maxItems={3} 
            filterBySource="card" 
          />
          
          {/* Monthly Purchases Card - Debajo de Últimos movimientos */}
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

        {/* Vista de Opciones - Tarjeta de Acciones y Preferencias */}
        <div
          style={{
            position: selectedFilter === 'Opciones' ? 'relative' : 'absolute', // 'relative' cuando está visible para que afecte la altura del contenedor
            top: selectedFilter === 'Opciones' ? 0 : 'auto',
            left: selectedFilter === 'Opciones' ? '0%' : slideDirection === 'right' ? '100%' : '-100%',
            width: '100%',
            opacity: selectedFilter === 'Opciones' ? 1 : 0,
            transform: selectedFilter === 'Opciones' 
              ? 'translateX(0)' 
              : slideDirection === 'right' 
                ? 'translateX(100%)' // Opciones → Actividad: sale por la derecha
                : 'translateX(-100%)', // Actividad → Opciones: sale por la izquierda
            transition: `opacity ${transitions.duration.slow} ${transitions.easing.easeInOut}, transform ${transitions.duration.slow} ${transitions.easing.easeInOut}`,
            pointerEvents: selectedFilter === 'Opciones' ? 'auto' : 'none',
            zIndex: selectedFilter === 'Opciones' ? 1 : 0,
          }}
        >
          {/* Tarjeta de Acciones */}
          <ActionCard
            title="Acciones"
            actions={[
              {
                id: 'add-apple-pay',
                label: 'Agregar a Apple Wallet',
                icon: (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: borderRadius.full,
                      backgroundColor: isLocked ? colors.gray[200] : colors.semantic.text.primary, // Gris cuando está bloqueada
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src="/img/icons/payment/apple-wallet.svg"
                      alt="Apple Wallet"
                      style={{
                        width: '20px',
                        height: '20px',
                        display: 'block',
                        filter: isLocked ? 'grayscale(100%) opacity(0.5)' : 'none', // Escala de grises cuando está bloqueada
                      }}
                    />
                  </div>
                ),
                onClick: () => {
                  // TODO: Implementar acción de agregar a Apple Wallet
                  console.log('Agregar a Apple Wallet');
                },
                noBackground: true, // Sin fondo adicional del ActionCard, ya tiene su propio contenedor
                disabled: isLocked, // Deshabilitado cuando la tarjeta está bloqueada
              },
              {
                id: 'send-balance-usd',
                label: 'Enviar saldo a tu cuenta en USD',
                icon: (
                  <img
                    src="/img/icons/button-bar/icon-wallet-inactive.svg"
                    alt="Wallet"
                    style={{
                      width: '20px', // Token: ACTION_ICON_IMAGE_SIZE (20px)
                      height: '20px', // Token: ACTION_ICON_IMAGE_SIZE (20px)
                      display: 'block',
                      // Aplicar filtro para estandarizar el color del icono (#101828)
                      // Convierte cualquier color a negro/gris oscuro para que coincida con los demás iconos (shield, limit, atm, color-card)
                      filter: isLocked 
                        ? 'brightness(0) saturate(100%) grayscale(100%) opacity(0.5)' 
                        : 'brightness(0) saturate(100%)',
                    }}
                  />
                ),
                onClick: () => {
                  // TODO: Implementar acción de enviar saldo
                  console.log('Enviar saldo a tu cuenta en USD');
                },
                // Sin noBackground: usa fondo circular como los demás iconos de acciones
                disabled: isLocked, // Deshabilitado cuando la tarjeta está bloqueada
              },
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
      </div>

      {/* Bottom Sheet para bloquear tarjeta */}
      <BottomSheet
        isOpen={isBlockSheetOpen}
        onClose={() => {
          setIsBlockSheetOpen(false);
          // Resetear el estado del slider cuando se cierra sin completar
          if (!isLocked) {
            // El slider se reseteará automáticamente cuando se vuelva a abrir
          }
        }}
        title="Bloque temporal"
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
                  setShowToast(true);
                }, 300);
                console.log('Bloqueo temporal');
              }}
              disabled={isLocked}
            />
          </div>
        </div>
      </BottomSheet>

      {/* Toast de confirmación */}
      <Toast
        message="Bloqueo temporal activado"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
    </div>
  );
}
