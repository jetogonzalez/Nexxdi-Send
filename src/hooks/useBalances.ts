"use client";

import { useState, useEffect, useCallback } from 'react';

const BALANCES_STORAGE_KEY = 'nexxdi_cash_balances';

interface Balances {
  usd: number;
  cop: number;
}

const DEFAULT_BALANCES: Balances = {
  usd: 5678.90,
  cop: 1500000.50,
};

/**
 * Hook para gestionar saldos dinámicamente
 * Los saldos se almacenan en sessionStorage y persisten durante la sesión
 */
export function useBalances(initialUsd?: number, initialCop?: number) {
  const [balances, setBalances] = useState<Balances>({
    usd: initialUsd ?? DEFAULT_BALANCES.usd,
    cop: initialCop ?? DEFAULT_BALANCES.cop,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar saldos desde sessionStorage al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(BALANCES_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setBalances({
            usd: parsed.usd ?? DEFAULT_BALANCES.usd,
            cop: parsed.cop ?? DEFAULT_BALANCES.cop,
          });
        } catch (error) {
          console.error('Error loading balances:', error);
          // Si hay error, usar valores por defecto
          setBalances({
            usd: initialUsd ?? DEFAULT_BALANCES.usd,
            cop: initialCop ?? DEFAULT_BALANCES.cop,
          });
        }
      }
      setIsLoaded(true);
    }
  }, [initialUsd, initialCop]);

  // Guardar saldos en sessionStorage cuando cambien
  const saveBalances = useCallback((newBalances: Balances) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(BALANCES_STORAGE_KEY, JSON.stringify(newBalances));
    }
  }, []);

  // Actualizar saldo USD
  const updateUsdBalance = useCallback((amount: number) => {
    setBalances((prev) => {
      const newBalances = { ...prev, usd: Math.max(0, prev.usd + amount) };
      saveBalances(newBalances);
      return newBalances;
    });
  }, [saveBalances]);

  // Actualizar saldo COP
  const updateCopBalance = useCallback((amount: number) => {
    setBalances((prev) => {
      const newBalances = { ...prev, cop: Math.max(0, prev.cop + amount) };
      saveBalances(newBalances);
      return newBalances;
    });
  }, [saveBalances]);

  // Establecer saldos directamente
  const setUsdBalance = useCallback((amount: number) => {
    setBalances((prev) => {
      const newBalances = { ...prev, usd: Math.max(0, amount) };
      saveBalances(newBalances);
      return newBalances;
    });
  }, [saveBalances]);

  const setCopBalance = useCallback((amount: number) => {
    setBalances((prev) => {
      const newBalances = { ...prev, cop: Math.max(0, amount) };
      saveBalances(newBalances);
      return newBalances;
    });
  }, [saveBalances]);

  // Realizar conversión de moneda
  const exchangeCurrency = useCallback((
    fromCurrency: 'USD' | 'COP',
    toCurrency: 'USD' | 'COP',
    fromAmount: number,
    toAmount: number
  ) => {
    setBalances((prev) => {
      let newBalances: Balances;
      
      if (fromCurrency === 'USD' && toCurrency === 'COP') {
        newBalances = {
          usd: Math.max(0, prev.usd - fromAmount),
          cop: prev.cop + toAmount,
        };
      } else if (fromCurrency === 'COP' && toCurrency === 'USD') {
        newBalances = {
          cop: Math.max(0, prev.cop - fromAmount),
          usd: prev.usd + toAmount,
        };
      } else {
        // Same currency, no change
        return prev;
      }
      
      saveBalances(newBalances);
      return newBalances;
    });
  }, [saveBalances]);

  // Resetear a valores por defecto
  const resetBalances = useCallback(() => {
    const defaultBalances = {
      usd: initialUsd ?? DEFAULT_BALANCES.usd,
      cop: initialCop ?? DEFAULT_BALANCES.cop,
    };
    setBalances(defaultBalances);
    saveBalances(defaultBalances);
  }, [initialUsd, initialCop, saveBalances]);

  return {
    usdBalance: balances.usd,
    copBalance: balances.cop,
    updateUsdBalance,
    updateCopBalance,
    setUsdBalance,
    setCopBalance,
    exchangeCurrency,
    resetBalances,
    isLoaded,
  };
}
