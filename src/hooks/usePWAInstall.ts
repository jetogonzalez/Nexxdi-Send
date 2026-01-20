"use client";

import { useEffect, useCallback, useRef } from 'react';
import { useMovements } from './useMovements';
import { useBalances } from './useBalances';

const PWA_INSTALLED_KEY = 'nexxdi_pwa_installed';
const WELCOME_NOTIFICATION_SENT_KEY = 'nexxdi_welcome_notification_sent';

/**
 * Hook para detectar instalación de PWA y enviar notificación de bienvenida
 * Envía una notificación de "Dinero recibido" cuando el usuario instala la app
 */
export function usePWAInstall() {
  const { addMovement } = useMovements();
  const { updateUsdBalance } = useBalances();
  const hasProcessedRef = useRef(false);

  // Función para enviar la notificación
  const sendWelcomeNotification = useCallback(async () => {
    // Verificar si ya se envió la notificación
    if (typeof window === 'undefined') return;
    
    const alreadySent = localStorage.getItem(WELCOME_NOTIFICATION_SENT_KEY);
    if (alreadySent || hasProcessedRef.current) return;
    
    hasProcessedRef.current = true;

    try {
      // Verificar permiso de notificaciones
      if ('Notification' in window) {
        let permission = Notification.permission;
        
        if (permission === 'default') {
          permission = await Notification.requestPermission();
        }
        
        if (permission === 'granted') {
          // Intentar usar Service Worker para la notificación
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'SHOW_NOTIFICATION',
              title: '💸 Dinero recibido',
              body: 'Sandra te envió 3.000 USD\nYa está disponible en tu saldo.',
              icon: '/favicon.png',
            });
          } else {
            // Fallback: notificación directa
            new Notification('💸 Dinero recibido', {
              body: 'Sandra te envió 3.000 USD\nYa está disponible en tu saldo.',
              icon: '/favicon.png',
              badge: '/favicon.png',
              tag: 'money-received',
            });
          }
        }
      }

      // Agregar el movimiento de dinero recibido
      // Regla: "Dinero recibido de {Nombre}" (+) - pago por app
      addMovement({
        name: 'Dinero recibido de Sandra',
        amount: 3000,
        currency: 'USD',
        date: new Date(),
        contactName: 'Sandra Zuluaga',
        imageUrl: '/img/user/sandra-zuluaga.png',
        type: 'deposit',
        source: 'cash', // Pago por app - aparece en wallet y general
      });

      // Actualizar el saldo USD
      updateUsdBalance(3000);

      // Marcar como enviado
      localStorage.setItem(WELCOME_NOTIFICATION_SENT_KEY, 'true');
      
      console.log('Notificación de bienvenida enviada y movimiento agregado');
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      hasProcessedRef.current = false;
    }
  }, [addMovement, updateUsdBalance]);

  // Detectar instalación de PWA
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Verificar si ya se procesó
    const alreadySent = localStorage.getItem(WELCOME_NOTIFICATION_SENT_KEY);
    if (alreadySent) return;

    // Verificar si la app ya está instalada (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;

    // Si está en modo standalone y no se ha enviado la notificación
    if (isStandalone) {
      // Pequeño delay para asegurar que el service worker esté listo
      const timer = setTimeout(() => {
        sendWelcomeNotification();
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Escuchar evento de instalación
    const handleAppInstalled = () => {
      console.log('PWA instalada');
      localStorage.setItem(PWA_INSTALLED_KEY, 'true');
      // Delay para que el usuario vea la app instalada
      setTimeout(() => {
        sendWelcomeNotification();
      }, 3000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [sendWelcomeNotification]);

  // Función para resetear (útil para testing)
  const resetWelcomeNotification = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(WELCOME_NOTIFICATION_SENT_KEY);
      localStorage.removeItem(PWA_INSTALLED_KEY);
      hasProcessedRef.current = false;
      console.log('Notificación de bienvenida reseteada');
    }
  }, []);

  return {
    sendWelcomeNotification,
    resetWelcomeNotification,
  };
}
