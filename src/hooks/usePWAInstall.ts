"use client";

import { useEffect, useCallback, useRef } from 'react';
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
 * 1. Primera visita → Pedir permiso nativo de notificaciones
 * 2. Usuario cierra la app
 * 3. Después de 1 minuto → Enviar notificación push
 * 4. Usuario abre la app → Ver el dinero recibido
 */
export function usePWAInstall() {
  const { addMovement } = useMovements();
  const { updateUsdBalance } = useBalances();
  const hasProcessedRef = useRef(false);

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
      try {
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
      } catch (error) {
        console.error('Error al programar notificación:', error);
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

  // Primera visita - Pedir permiso nativo de notificaciones
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);
    const permissionAsked = localStorage.getItem(NOTIFICATION_PERMISSION_ASKED_KEY);
    
    if (!firstVisit) {
      // Primera visita - guardar timestamp
      localStorage.setItem(FIRST_VISIT_KEY, Date.now().toString());
    }
    
    // Si no se ha pedido permiso y el navegador soporta notificaciones
    if (!permissionAsked && 'Notification' in window) {
      // Pequeño delay para que la app cargue primero
      const timer = setTimeout(async () => {
        if (Notification.permission === 'default') {
          try {
            // Usar solo el permiso nativo del sistema operativo
            const permission = await Notification.requestPermission();
            localStorage.setItem(NOTIFICATION_PERMISSION_ASKED_KEY, 'true');
            
            if (permission === 'granted') {
              console.log('Permiso de notificaciones concedido');
              scheduleNotification();
            } else {
              console.log('Permiso de notificaciones:', permission);
            }
          } catch (error) {
            console.error('Error al pedir permiso:', error);
            localStorage.setItem(NOTIFICATION_PERMISSION_ASKED_KEY, 'true');
          }
        } else if (Notification.permission === 'granted') {
          // Ya tiene permiso, programar notificación si no está programada
          scheduleNotification();
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    } else if (permissionAsked && Notification.permission === 'granted') {
      // Ya tiene permiso, verificar si necesita programar
      const alreadyScheduled = localStorage.getItem(NOTIFICATION_SCHEDULED_KEY);
      if (!alreadyScheduled) {
        scheduleNotification();
      }
    }
  }, [scheduleNotification]);

  // Detectar cuando la app pierde el foco (usuario sale)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
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
  }, [addMoneyReceivedMovement]);

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
    resetAll,
  };
}
