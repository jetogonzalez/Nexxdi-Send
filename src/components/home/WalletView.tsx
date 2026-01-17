"use client";

import { useState, useRef, useEffect } from 'react';
import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { transitions } from '../../config/transitions-tokens';
import { RecentMovementsSection } from './RecentMovementsSection';
import { SegmentedButton } from '../ui/SegmentedButton';
import { GroupCard } from '../ui/GroupCard';
import { ActionCard } from '../ui/ActionCard';
import { PreferencesCard, PreferenceIcons } from '../ui/PreferencesCard';
import { formatBalance } from '../../lib/formatBalance';

interface WalletViewProps {
  isBalanceVisible?: boolean;
  titleRef?: (el: HTMLElement | null) => void;
  scrollProgress?: number;
  usdBalance?: number;
  copBalance?: number;
}

export function WalletView({ isBalanceVisible = true, titleRef, scrollProgress = 0, usdBalance = 5678.90, copBalance = 1500000.50 }: WalletViewProps) {
  const title = 'Wallet';
  const [selectedFilter, setSelectedFilter] = useState<string>('Actividad');
  const previousFilterRef = useRef<string>('Actividad');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  
  // Calcular saldo total: sumar USD y convertir COP a USD (aproximadamente 1 USD = 4000 COP)
  // Para simplificar, mostraremos el total en USD sumando ambos valores
  // En producción, esto debería usar la tasa de cambio real
  const exchangeRate = 4000; // Tasa aproximada: 1 USD = 4000 COP
  const copInUsd = copBalance / exchangeRate;
  const totalBalance = usdBalance + copInUsd;

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
        paddingTop: spacing[4], // 16px
        paddingBottom: spacing[6], // 24px - espacio hasta navigation bar
        backgroundColor: colors.semantic.background.main,
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
          color: typography.sectionTitle.color,
          fontFamily: typography.sectionTitle.fontFamily,
          marginBottom: spacing[6], // 1.5rem después del título (default para todas las páginas)
        }}
      >
        {title}
      </h1>
      
      {/* Label "Saldo total" */}
      <div
        style={{
          height: '24px',
          fontFamily: typography.fontFamily.sans.join(', '), // Manrope
          fontWeight: typography.fontWeight.normal, // 400
          fontSize: typography.fontSize.base, // 16px
          color: '#101828',
          lineHeight: '24px',
          marginBottom: 0, // Sin espacio entre label y saldo
        }}
      >
        Saldo total
      </div>
      
      {/* Balance principal */}
      <div
        style={{
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.bold,
          letterSpacing: '-0.04em', // -4% letter spacing
          color: colors.semantic.text.primary,
          fontFamily: typography.fontFamily.sans.join(', '),
          marginTop: 0, // Sin espacio entre label y saldo
          marginBottom: spacing[6], // 1.5rem después del contenido
          display: 'flex',
          alignItems: 'baseline',
          gap: spacing[1], // 4px entre número y moneda
        }}
      >
        {isBalanceVisible ? (
          <>
            <span>{formatBalance(totalBalance, isBalanceVisible).replace(' USD', '')}</span>
            <span
              style={{
                fontSize: typography.fontSize.sm, // Token semántico: 14px (más pequeño que el monto)
                fontWeight: typography.fontWeight.bold, // Token semántico: 700 Bold
                fontFamily: typography.fontFamily.sans.join(', '), // Token semántico: Manrope
                color: colors.semantic.text.primary, // Token semántico: mismo color que el monto
              }}
            >
              USD
            </span>
          </>
        ) : (
          <span>•••</span>
        )}
      </div>
      
      {/* Tarjeta USD grande con acciones */}
      <div
        style={{
          width: '100%',
          borderRadius: borderRadius['3xl'], // 24px
          backgroundColor: colors.semantic.background.white,
          padding: spacing[6], // 24px de padding
          marginBottom: spacing[6], // 24px de margin inferior
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[2], // 8px entre header y contenido de balance
          boxSizing: 'border-box',
        }}
      >
        {/* Header con logo USD y botón de tres puntos */}
        <div
          style={{
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            marginBottom: 0, // Sin espacio adicional entre header y balance
          }}
        >
          {/* Logo USD */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2], // 8px entre bandera y texto
            }}
          >
            <img
              src="/img/icons/global/currency-us.svg"
              alt="USD"
              style={{
                width: '24px',
                height: '24px',
                display: 'block',
              }}
            />
            <span
              style={{
                fontFamily: typography.fontFamily.sans.join(', '),
                fontWeight: typography.fontWeight.bold,
                fontSize: typography.fontSize.lg, // 18px
                lineHeight: '24px',
                color: colors.semantic.text.primary,
              }}
            >
              USD
            </span>
          </div>
          
          {/* Botón de icono dots a la derecha */}
          <button
            type="button"
            onClick={() => console.log('Más opciones')}
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: borderRadius.full,
              backgroundColor: 'rgba(0, 0, 0, 0.05)', // Negro con 5% opacidad para fondo claro
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.15)'; // Negro con 15% opacidad en hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'; // Negro con 5% opacidad
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
              }}
            />
          </button>
        </div>
        
        {/* Contenedor de balance */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0, // Sin espacio entre elementos
          }}
        >
            {/* Label "Saldo disponible" */}
            <div
              style={{
                width: '100%', // Fill container
                height: '22px', // Hug content (22px según especificación)
                fontFamily: typography.fontFamily.sans.join(', '), // Manrope
                fontWeight: typography.fontWeight.bold, // 700 Bold
                fontSize: typography.fontSize.base, // 16px
                lineHeight: '100%', // 100% del font size
                letterSpacing: '0%',
                color: '#101828', // Color específico según especificación
                textAlign: 'center', // Horizontal alignment: center
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Saldo disponible
            </div>
            
            {/* Contenedor de Balance y nombre de moneda sin espacio entre ellos */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0, // Sin espacio entre valor y nombre de moneda
                alignItems: 'center',
              }}
            >
              {/* Balance */}
              <div
                style={{
                  width: '100%', // Fill container
                  fontFamily: typography.fontFamily.sans.join(', '), // Manrope
                  fontSize: '48px', // 48px según especificación
                  fontWeight: typography.fontWeight.extrabold, // 800
                  letterSpacing: '-0.04em', // -4%
                  color: colors.semantic.text.primary,
                  textAlign: 'center', // Centrado
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isBalanceVisible ? (
                  <span>{formatBalance(usdBalance, isBalanceVisible).replace(' USD', '')}</span>
                ) : (
                  <span>•••</span>
                )}
              </div>
              
              {/* Nombre de moneda */}
              <div
                style={{
                  width: '100%',
                  fontFamily: typography.fontFamily.sans.join(', '), // Manrope
                  fontSize: '14px', // 14px según especificación
                  fontWeight: typography.fontWeight.normal,
                  color: '#676767', // Color específico según especificación
                  textAlign: 'center', // Centrado
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Dólares americanos
              </div>
            </div>
        </div>
        
        {/* Botones de acción */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '40px', // 40px entre botones según especificación
            marginTop: spacing[4], // 16px adicional para compensar el gap reducido
          }}
        >
          {/* Botón Agregar saldo con label */}
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
                width: '64px', // Contenedor de 64px
                height: '64px', // Contenedor de 64px
                borderRadius: borderRadius.full, // Círculo completo
                backgroundColor: colors.gray[100], // Fondo gris claro
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.gray[200];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.gray[100];
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
                fontSize: typography.fontSize.sm, // 14px
                fontWeight: typography.fontWeight.normal,
                color: colors.semantic.text.primary,
                textAlign: 'center',
              }}
            >
              Agregar saldo
            </span>
          </div>
          
          {/* Botón Cambiar con label (centro) */}
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
              onClick={() => console.log('Cambiar')}
              style={{
                width: '64px', // Contenedor de 64px
                height: '64px', // Contenedor de 64px
                borderRadius: borderRadius.full, // Círculo completo
                backgroundColor: colors.gray[100], // Fondo gris claro
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.gray[200];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.gray[100];
              }}
              aria-label="Cambiar"
            >
              <img
                src="/img/icons/global/fx.svg"
                alt="Cambiar"
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
                fontSize: typography.fontSize.sm, // 14px
                fontWeight: typography.fontWeight.normal,
                color: colors.semantic.text.primary,
                textAlign: 'center',
              }}
            >
              Cambiar
            </span>
          </div>
          
          {/* Botón Enviar con label (derecha) */}
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
              onClick={() => console.log('Enviar')}
              style={{
                width: '64px', // Contenedor de 64px
                height: '64px', // Contenedor de 64px
                borderRadius: borderRadius.full, // Círculo completo
                backgroundColor: colors.gray[100], // Fondo gris claro
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.gray[200];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.gray[100];
              }}
              aria-label="Enviar"
            >
              <img
                src="/img/icons/global/send.svg"
                alt="Enviar"
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
                fontSize: typography.fontSize.sm, // 14px
                fontWeight: typography.fontWeight.normal,
                color: colors.semantic.text.primary,
                textAlign: 'center',
              }}
            >
              Enviar
            </span>
          </div>
        </div>
      </div>
      
      {/* Segmented Button - Debajo del valor del saldo total */}
      <div
        style={{
          position: 'relative', // Asegurar posición estable
          width: '100%', // Ancho completo
          marginBottom: spacing[6], // 1.5rem después del segmented button
          zIndex: 10, // Asegurar que esté por encima del contenido animado
        }}
      >
        <SegmentedButton
          options={['Actividad', 'Opciones']}
          defaultValue={selectedFilter}
          onChange={setSelectedFilter}
        />
      </div>
      
      {/* Contenedor de contenido con animación de slide horizontal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden', // Prevenir scroll horizontal
          minHeight: '400px', // Altura mínima aumentada para acomodar 3 movimientos
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
            filterBySource="wallet" 
          />
          
          {/* Group Card - Debajo de Últimos movimientos */}
          <div
            style={{
              marginTop: spacing[4], // Token semántico: 16px de espacio arriba
            }}
          >
            <GroupCard
              title="Grupos"
              amount={8120}
              currency="USD"
              groupName="Viaje fin de año"
              progress={38}
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
                id: 'receive-money',
                label: 'Recibir dinero',
                onClick: () => {
                  // TODO: Implementar acción de recibir dinero
                  console.log('Recibir dinero');
                },
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
    </div>
  );
}
