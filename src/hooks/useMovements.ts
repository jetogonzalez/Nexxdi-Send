"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Movement } from '../components/home/RecentMovements';

const MOVEMENTS_STORAGE_KEY = 'nexxdi_cash_movements';

/**
 * Hook para gestionar movimientos dinámicamente
 * Los movimientos se almacenan en localStorage y se sincronizan entre vistas
 */
export function useMovements() {
  const [movements, setMovements] = useState<Movement[]>([]);

  // Guardar movimientos en localStorage
  // Los movimientos se ordenan por fecha (más reciente primero) antes de guardar
  const saveMovements = useCallback((movementsToSave: Movement[]) => {
    if (typeof window !== 'undefined') {
      // Ordenar por fecha: más reciente primero (fecha más grande primero)
      const sortedMovements = [...movementsToSave].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
      localStorage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(sortedMovements));
    }
  }, []);

  // Inicializar movimientos por defecto
  // IMPORTANTE: Siempre debe haber al menos 3 movimientos de wallet para que WalletView muestre 3 movimientos
  const initializeDefaultMovements = useCallback(() => {
    const now = new Date();
    const defaultMovements: Movement[] = [
      // Movimientos de Wallet (cuentas/monedas) - SIEMPRE 3 movimientos
      {
        id: 'wallet-1',
        name: 'Saldo agregado',
        amount: 1200,
        currency: 'USD',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 21),
        logoUrl: '/img/icons/logos/logo-bank-us-citybank.svg', // City
        type: 'deposit',
        source: 'wallet',
      },
      {
        id: 'wallet-2',
        name: 'Dinero enviado a Sandra',
        amount: -250000,
        currency: 'COP',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 14, 21),
        contactName: 'Sandra Zuluaga',
        imageUrl: '/img/user/sandra-zuluaga.png', // Sandra
        type: 'transfer',
        source: 'wallet',
      },
      {
        id: 'wallet-3',
        name: 'Saldo agregado',
        amount: 2500,
        currency: 'USD',
        date: new Date(now.getFullYear(), 0, 3, 11, 11), // 03 de enero, 11:11
        logoUrl: '/img/icons/logos/logo-bank-of-america.svg', // Bank of America
        type: 'deposit',
        source: 'wallet',
      },
      // Movimientos de Tarjeta (compras/consumos) - SIEMPRE 3 movimientos
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
    ];
    setMovements(defaultMovements);
    saveMovements(defaultMovements);
  }, [saveMovements]);

  // Cargar movimientos desde localStorage al montar
  // Asegurar que siempre haya al menos 3 movimientos de wallet y 3 movimientos de tarjeta
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(MOVEMENTS_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Convertir fechas de string a Date
          const movementsWithDates = parsed.map((m: any) => ({
            ...m,
            date: new Date(m.date),
          }));
          
          const now = new Date();
          let needsUpdate = false;
          const updatedMovements = [...movementsWithDates];
          
          // Verificar que haya al menos 3 movimientos de wallet
          const walletMovements = movementsWithDates.filter((m: Movement) => m.source === 'wallet');
          if (walletMovements.length < 3) {
            const defaultWalletMovements: Movement[] = [
              {
                id: 'wallet-1',
                name: 'Saldo agregado',
                amount: 1200,
                currency: 'USD',
                date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 21),
                logoUrl: '/img/icons/logos/logo-bank-us-citybank.svg',
                type: 'deposit',
                source: 'wallet',
              },
              {
                id: 'wallet-2',
                name: 'Dinero enviado a Sandra',
                amount: -250000,
                currency: 'COP',
                date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 14, 21),
                contactName: 'Sandra Zuluaga',
                imageUrl: '/img/user/sandra-zuluaga.png',
                type: 'transfer',
                source: 'wallet',
              },
              {
                id: 'wallet-3',
                name: 'Saldo agregado',
                amount: 2500,
                currency: 'USD',
                date: new Date(now.getFullYear(), 0, 3, 11, 11), // 03 de enero, 11:11
                logoUrl: '/img/icons/logos/logo-bank-of-america.svg',
                type: 'deposit',
                source: 'wallet',
              },
            ];
            
            const existingWalletIds = walletMovements.map((m: Movement) => m.id);
            const missingWalletMovements = defaultWalletMovements.filter(
              (m) => !existingWalletIds.includes(m.id)
            );
            
            if (missingWalletMovements.length > 0) {
              updatedMovements.push(...missingWalletMovements);
              needsUpdate = true;
            }
          }
          
          // Verificar que haya al menos 3 movimientos de tarjeta
          const cardMovements = movementsWithDates.filter((m: Movement) => m.source === 'card');
          
          // Actualizar nombre de Carulla si existe con el nombre antiguo
          const carullaMovement = updatedMovements.find((m: Movement) => m.id === 'card-1' && m.name === 'Compra en Carulla');
          if (carullaMovement) {
            carullaMovement.name = 'Compra en Carulla Holguínes';
            needsUpdate = true;
          }
          
          // Actualizar logo de Netflix si existe con la ruta antigua
          const netflixMovements = updatedMovements.filter((m: Movement) => m.id === 'card-2' || (m.name && m.name.includes('Netflix')));
          netflixMovements.forEach((movement) => {
            if (movement.logoUrl && (
              movement.logoUrl.includes('Netflix_2015_logo') || 
              movement.logoUrl.includes('logo-local-netflix_files') ||
              movement.logoUrl !== '/img/icons/logos/logo-local-netflix.svg'
            )) {
              movement.logoUrl = '/img/icons/logos/logo-local-netflix.svg';
              needsUpdate = true;
            }
          });
          
          if (cardMovements.length < 3) {
            const defaultCardMovements: Movement[] = [
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
            ];
            
            const existingCardIds = cardMovements.map((m: Movement) => m.id);
            const missingCardMovements = defaultCardMovements.filter(
              (m) => !existingCardIds.includes(m.id)
            );
            
            if (missingCardMovements.length > 0) {
              updatedMovements.push(...missingCardMovements);
              needsUpdate = true;
            }
          }
          
          if (needsUpdate) {
            // Ordenar antes de guardar: más reciente primero
            const sortedUpdated = [...updatedMovements].sort(
              (a, b) => b.date.getTime() - a.date.getTime()
            );
            setMovements(sortedUpdated);
            saveMovements(sortedUpdated);
          } else {
            // Ordenar también cuando no hay actualizaciones para mantener consistencia
            const sortedMovements = [...movementsWithDates].sort(
              (a, b) => b.date.getTime() - a.date.getTime()
            );
            setMovements(sortedMovements);
          }
        } catch (error) {
          console.error('Error loading movements:', error);
          // Si hay error, inicializar con movimientos por defecto
          initializeDefaultMovements();
        }
      } else {
        // Si no hay movimientos guardados, inicializar con los por defecto
        initializeDefaultMovements();
      }
    }
  }, [initializeDefaultMovements, saveMovements]);

  // Agregar un nuevo movimiento
  // Si no se especifica source, se asigna automáticamente según el tipo:
  // - 'purchase' o 'withdrawal' -> 'card' (tarjeta)
  // - 'deposit' o 'transfer' -> 'wallet' (cuentas)
  const addMovement = useCallback((movement: Omit<Movement, 'id' | 'date' | 'source'> & { date?: Date; source?: 'wallet' | 'card' | 'general' }) => {
    // Determinar source automáticamente si no se especifica
    let source: 'wallet' | 'card' | 'general' = movement.source || 'general';
    if (!movement.source) {
      if (movement.type === 'purchase' || movement.type === 'withdrawal') {
        source = 'card'; // Compras y retiros son de tarjeta
      } else if (movement.type === 'deposit' || movement.type === 'transfer') {
        source = 'wallet'; // Depósitos y transferencias son de wallet
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
      // Ordenar por fecha: más reciente primero antes de guardar
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
