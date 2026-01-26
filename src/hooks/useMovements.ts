"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Movement } from '../components/home/RecentMovements';

const MOVEMENTS_STORAGE_KEY = 'nexxdi_cash_movements';
const MOVEMENTS_VERSION_KEY = 'nexxdi_cash_movements_version';
const MOVEMENTS_UPDATE_EVENT = 'nexxdi_movements_updated';
const CURRENT_VERSION = '11'; // Incrementar cuando cambie la estructura de movimientos

/**
 * Hook para gestionar movimientos dinámicamente
 * Los movimientos se almacenan en localStorage y se sincronizan entre vistas
 * usando eventos personalizados para actualización en tiempo real
 */
export function useMovements() {
  const [movements, setMovements] = useState<Movement[]>([]);

  // Guardar movimientos en localStorage y notificar a otros componentes
  const saveMovements = useCallback((movementsToSave: Movement[]) => {
    if (typeof window !== 'undefined') {
      // Ordenar por fecha: más reciente primero (fecha más grande primero)
      const sortedMovements = [...movementsToSave].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
      localStorage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(sortedMovements));
      localStorage.setItem(MOVEMENTS_VERSION_KEY, CURRENT_VERSION);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent(MOVEMENTS_UPDATE_EVENT, { 
        detail: sortedMovements 
      }));
    }
  }, []);

  // Inicializar movimientos por defecto
  const initializeDefaultMovements = useCallback(() => {
    const now = new Date();
    const defaultMovements: Movement[] = [
      // MOVIMIENTOS DE WALLET (cuentas/monedas)
      {
        id: 'wallet-1',
        name: 'Saldo agregado · Citibank',
        amount: 1200,
        currency: 'USD',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 21),
        logoUrl: '/img/icons/logos/logo-bank-us-citybank.svg',
        type: 'deposit',
        source: 'wallet',
      },
      {
        id: 'wallet-3',
        name: 'Saldo agregado · Bank of America',
        amount: 2500,
        currency: 'USD',
        date: new Date(now.getFullYear(), 0, 3, 11, 11),
        logoUrl: '/img/icons/logos/logo-bank-of-america.svg',
        type: 'deposit',
        source: 'wallet',
      },
      // MOVIMIENTOS DE TARJETA (compras)
      {
        id: 'card-1',
        name: 'Compra en Carulla Holguínes',
        amount: -82.23,
        currency: 'USD',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 43),
        logoUrl: '/img/icons/logos/logo-local-carulla.png',
        type: 'purchase',
        source: 'card',
      },
      {
        id: 'card-2',
        name: 'Compra en Netflix',
        amount: -15.99,
        currency: 'USD',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 45),
        logoUrl: '/img/icons/logos/logo-local-netflix.svg',
        type: 'purchase',
        source: 'card',
      },
      {
        id: 'card-3',
        name: 'Compra en Amazon',
        amount: -481.56,
        currency: 'USD',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 15, 20),
        logoUrl: '/img/icons/logos/logo-local-amazon.svg',
        type: 'purchase',
        source: 'card',
      },
      // MOVIMIENTOS DE CASH (transferencias entre personas)
      {
        id: 'wallet-2',
        name: 'Dinero enviado a Sandra',
        amount: -300,
        currency: 'USD',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 14, 21),
        contactName: 'Sandra Zuluaga',
        imageUrl: '/img/user/sandra-zuluaga.png',
        type: 'transfer',
        source: 'cash',
      },
      // CONVERSIÓN DE MONEDA
      {
        id: 'cash-2a',
        name: 'Conversión recibida · USD → COP',
        amount: 2100000,
        currency: 'COP',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 16, 31),
        logoUrl: '/img/icons/global/refresh-cw.svg',
        type: 'deposit',
        source: 'cash',
        isIcon: true,
      },
      {
        id: 'cash-2b',
        name: 'Cambio de moneda · USD → COP',
        amount: -500,
        currency: 'USD',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 16, 30),
        logoUrl: '/img/icons/global/refresh-cw.svg',
        type: 'transfer',
        source: 'cash',
        isIcon: true,
      },
    ];
    setMovements(defaultMovements);
    saveMovements(defaultMovements);
  }, [saveMovements]);

  // Cargar movimientos desde localStorage al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedVersion = localStorage.getItem(MOVEMENTS_VERSION_KEY);
      
      if (storedVersion !== CURRENT_VERSION) {
        localStorage.removeItem(MOVEMENTS_STORAGE_KEY);
        localStorage.setItem(MOVEMENTS_VERSION_KEY, CURRENT_VERSION);
        initializeDefaultMovements();
        return;
      }
      
      const stored = localStorage.getItem(MOVEMENTS_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const movementsWithDates = parsed.map((m: any) => ({
            ...m,
            date: new Date(m.date),
          }));
          
          const sortedMovements = [...movementsWithDates].sort(
            (a, b) => b.date.getTime() - a.date.getTime()
          );
          setMovements(sortedMovements);
        } catch (error) {
          console.error('Error loading movements:', error);
          initializeDefaultMovements();
        }
      } else {
        initializeDefaultMovements();
      }
    }
  }, [initializeDefaultMovements]);

  // Escuchar eventos de actualización de movimientos de otros componentes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMovementsUpdate = (event: CustomEvent<Movement[]>) => {
      // Convertir fechas de string a Date si es necesario
      const movementsWithDates = event.detail.map((m: any) => ({
        ...m,
        date: m.date instanceof Date ? m.date : new Date(m.date),
      }));
      setMovements(movementsWithDates);
    };

    window.addEventListener(MOVEMENTS_UPDATE_EVENT, handleMovementsUpdate as EventListener);

    return () => {
      window.removeEventListener(MOVEMENTS_UPDATE_EVENT, handleMovementsUpdate as EventListener);
    };
  }, []);

  // Agregar un nuevo movimiento
  const addMovement = useCallback((movement: Omit<Movement, 'id' | 'date' | 'source'> & { date?: Date; source?: 'wallet' | 'card' | 'general' | 'cash' }) => {
    let source: 'wallet' | 'card' | 'general' | 'cash' = movement.source || 'general';
    if (!movement.source) {
      if (movement.type === 'purchase' || movement.type === 'withdrawal') {
        source = 'card';
      } else if (movement.type === 'deposit' || movement.type === 'transfer') {
        source = 'wallet';
      }
    }
    
    const newMovement: Movement = {
      ...movement,
      id: Date.now().toString(),
      date: movement.date || new Date(),
      source,
    };
    
    setMovements((prev) => {
      const updated = [newMovement, ...prev];
      const sorted = [...updated].sort((a, b) => b.date.getTime() - a.date.getTime());
      saveMovements(sorted);
      return sorted;
    });
  }, [saveMovements]);

  // Actualizar un movimiento existente
  const updateMovement = useCallback((id: string, updates: Partial<Movement>) => {
    setMovements((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, ...updates } : m));
      saveMovements(updated);
      return updated;
    });
  }, [saveMovements]);

  // Eliminar un movimiento
  const removeMovement = useCallback((id: string) => {
    setMovements((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveMovements(updated);
      return updated;
    });
  }, [saveMovements]);

  return {
    movements,
    addMovement,
    updateMovement,
    removeMovement,
  };
}
