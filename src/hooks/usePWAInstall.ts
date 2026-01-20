"use client";

import { useEffect, useCallback, useRef, useState } from 'react';
import { useMovements } from './useMovements';
import { useBalances } from './useBalances';

const FIRST_VISIT_KEY = 'nexxdi_first_visit_timestamp';
const NOTIFICATION_SCHEDULED_KEY = 'nexxdi_notification_scheduled';
const MONEY_RECEIVED_KEY = 'nexxdi_money_received';
const NOTIFICATION_PERMISSION_ASKED_KEY = 'nexxdi_notification_permission_asked';

// Tiempo de espera para enviar la notificación (1 minuto = 60000ms)
const NOTIFICATION_DELAY = 60000;

/**
 * Hook para gestionar notificaciones push y el flujo de bienvenida
 * 
 * Flujo:
 * 1. Primera visita → Pedir permiso de notificaciones
 * 2. Usuario cierra la app
 * 3. Después de 1 minuto → Enviar notificación push
 * 4. Usuario abre la app → Ver el dinero recibido
 */
export function usePWAInstall() {
  const { addMovement } = useMovements();
  const { updateUsdBalance } = useBalances();
  const hasProcessedRef = useRef(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Función para agregar el movimiento de dinero recibido
  const addMoneyReceivedMovement = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const alreadyReceived = localStorage.getItem(MONEY_RECEIVED_KEY);
    if (alreadyReceived) return;

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

    // Marcar como recibido
    localStorage.setItem(MONEY_RECEIVED_KEY, 'true');
    
    console.log('Movimiento de dinero recibido agregado: +3000 USD de Sandra');
  }, [addMovement, updateUsdBalance]);

  // Función para enviar la notificación
  const sendNotification = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        // Intentar usar Service Worker para la notificación
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification('💸 Dinero recibido', {
            body: 'Sandra te envió 3.000 USD\nYa está disponible en tu saldo.',
            icon: '/favicon.png',
            badge: '/favicon.png',
            tag: 'money-received',
            renotify: true,
            requireInteraction: true,
            data: {
              type: 'money-received',
              amount: 3000,
              sender: 'Sandra',
            }
          } as NotificationOptions);
          console.log('Notificación enviada via Service Worker');
        }
      }
    } catch (error) {
      console.error('Error al enviar notificación:', error);
    }
  }, []);

  // Función para pedir permiso de notificaciones
  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === 'undefined') return false;
    
    if (!('Notification' in window)) {
      console.log('Este navegador no soporta notificaciones');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      localStorage.setItem(NOTIFICATION_PERMISSION_ASKED_KEY, 'true');
      
      if (permission === 'granted') {
        console.log('Permiso de notificaciones concedido');
        // Programar la notificación para cuando cierre la app
        scheduleNotification();
        return true;
      } else {
        console.log('Permiso de notificaciones denegado');
        return false;
      }
    } catch (error) {
      console.error('Error al pedir permiso:', error);
      return false;
    }
  }, []);

  // Función para programar la notificación via Service Worker
  const scheduleNotification = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    const alreadyScheduled = localStorage.getItem(NOTIFICATION_SCHEDULED_KEY);
    if (alreadyScheduled) return;

    // Guardar timestamp de cuando se programó
    const scheduledTime = Date.now() + NOTIFICATION_DELAY;
    localStorage.setItem(NOTIFICATION_SCHEDULED_KEY, scheduledTime.toString());
    
    // Enviar mensaje al Service Worker para programar la notificación
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration.active) {
        registration.active.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          title: '💸 Dinero recibido',
          body: 'Sandra te envió 3.000 USD\nYa está disponible en tu saldo.',
          icon: '/favicon.png',
          delay: NOTIFICATION_DELAY,
        });
        console.log('Notificación programada via Service Worker para:', new Date(scheduledTime).toLocaleTimeString());
      }
    }
  }, []);

  // Verificar si hay una notificación pendiente al abrir la app
  useEffect(() => {
    if (typeof window === 'undefined' || hasProcessedRef.current) return;

    const checkPendingNotification = () => {
      const scheduledTimeStr = localStorage.getItem(NOTIFICATION_SCHEDULED_KEY);
      const alreadyReceived = localStorage.getItem(MONEY_RECEIVED_KEY);
      
      if (scheduledTimeStr && !alreadyReceived) {
        const scheduledTime = parseInt(scheduledTimeStr, 10);
        const now = Date.now();
        
        // Si ya pasó el tiempo programado, agregar el movimiento
        if (now >= scheduledTime) {
          hasProcessedRef.current = true;
          addMoneyReceivedMovement();
        }
      }
    };

    // Verificar inmediatamente
    checkPendingNotification();
  }, [addMoneyReceivedMovement]);

  // Primera visita - Pedir permiso de notificaciones
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);
    const permissionAsked = localStorage.getItem(NOTIFICATION_PERMISSION_ASKED_KEY);
    
    if (!firstVisit) {
      // Primera visita - guardar timestamp
      localStorage.setItem(FIRST_VISIT_KEY, Date.now().toString());
      
      // Mostrar solicitud de permiso después de un pequeño delay
      if (!permissionAsked && 'Notification' in window && Notification.permission === 'default') {
        const timer = setTimeout(() => {
          setShowPermissionModal(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Detectar cuando la app pierde el foco (usuario sale)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Usuario salió de la app
        const scheduledTimeStr = localStorage.getItem(NOTIFICATION_SCHEDULED_KEY);
        const alreadyReceived = localStorage.getItem(MONEY_RECEIVED_KEY);
        
        if (scheduledTimeStr && !alreadyReceived && Notification.permission === 'granted') {
          const scheduledTime = parseInt(scheduledTimeStr, 10);
          const now = Date.now();
          const timeRemaining = scheduledTime - now;
          
          if (timeRemaining > 0) {
            // Programar notificación para cuando pase el tiempo
            console.log(`Notificación se enviará en ${Math.round(timeRemaining / 1000)} segundos`);
            
            // Usar setTimeout para enviar cuando pase el tiempo
            // Nota: Esto solo funciona si el service worker sigue activo
            setTimeout(() => {
              sendNotification();
            }, timeRemaining);
          } else if (timeRemaining <= 0) {
            // Ya pasó el tiempo, enviar ahora
            sendNotification();
          }
        }
      } else if (document.visibilityState === 'visible') {
        // Usuario volvió a la app
        const scheduledTimeStr = localStorage.getItem(NOTIFICATION_SCHEDULED_KEY);
        const alreadyReceived = localStorage.getItem(MONEY_RECEIVED_KEY);
        
        if (scheduledTimeStr && !alreadyReceived) {
          const scheduledTime = parseInt(scheduledTimeStr, 10);
          const now = Date.now();
          
          // Si ya pasó el tiempo, agregar el movimiento
          if (now >= scheduledTime) {
            addMoneyReceivedMovement();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sendNotification, addMoneyReceivedMovement]);

  // Función para manejar la respuesta del usuario al modal de permisos
  const handlePermissionResponse = useCallback(async (accepted: boolean) => {
    setShowPermissionModal(false);
    
    if (accepted) {
      await requestNotificationPermission();
    } else {
      localStorage.setItem(NOTIFICATION_PERMISSION_ASKED_KEY, 'true');
    }
  }, [requestNotificationPermission]);

  // Función para resetear (útil para testing)
  const resetAll = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(FIRST_VISIT_KEY);
      localStorage.removeItem(NOTIFICATION_SCHEDULED_KEY);
      localStorage.removeItem(MONEY_RECEIVED_KEY);
      localStorage.removeItem(NOTIFICATION_PERMISSION_ASKED_KEY);
      hasProcessedRef.current = false;
      console.log('Estado de notificaciones reseteado');
    }
  }, []);

  return {
    showPermissionModal,
    handlePermissionResponse,
    requestNotificationPermission,
    resetAll,
  };
}
