import { useState, useEffect, useCallback } from 'react';

// Tipo para las tasas de cambio
export interface ExchangeRates {
  [currency: string]: number;
}

// Tipo para el estado del hook
interface ExchangeRatesState {
  rates: ExchangeRates;
  baseCurrency: string;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

// API base - Usando fawazahmed0/currency-api (gratuito, sin CORS issues)
// Documentación: https://github.com/fawazahmed0/currency-api
const API_BASE_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';

// Caché local para evitar múltiples requests
let cachedRates: ExchangeRates | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 60 * 1000; // 1 minuto de caché

/**
 * Hook para obtener tasas de cambio en tiempo real
 * Usa la misma API que CurrencyChangeCard para consistencia
 * Aplica el mismo descuento del 0.5% para que siempre sea más barato que Google/Wise/Remitly
 * @param baseCurrency - Moneda base (default: USD)
 * @param refreshInterval - Intervalo de actualización en ms (default: 60000 = 1 minuto)
 */
export function useExchangeRates(
  baseCurrency: string = 'USD',
  refreshInterval: number = 60000
): ExchangeRatesState & { 
  refreshRates: () => Promise<void>;
  getRate: (from: string, to: string) => number;
  convert: (amount: number, from: string, to: string) => number;
} {
  const [state, setState] = useState<ExchangeRatesState>({
    rates: {},
    baseCurrency,
    lastUpdated: null,
    isLoading: true,
    error: null,
  });

  // Función para obtener las tasas de cambio
  const fetchRates = useCallback(async (forceRefresh: boolean = false) => {
    // Verificar caché
    if (!forceRefresh && cachedRates && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setState(prev => ({
        ...prev,
        rates: cachedRates!,
        isLoading: false,
        error: null,
        lastUpdated: new Date(cacheTimestamp!),
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const currencyKey = baseCurrency.toLowerCase();
      const response = await fetch(`${API_BASE_URL}/${currencyKey}.json`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching exchange rates: ${response.status}`);
      }

      const data = await response.json();
      
      // currency-api retorna: { date: "2024-01-01", usd: { cop: 4100, ... } }
      if (!data || !data[currencyKey]) {
        throw new Error('Respuesta inválida de la API');
      }

      // Convertir las tasas al formato esperado (mayúsculas) y aplicar descuento
      const rates: ExchangeRates = {};
      for (const [key, value] of Object.entries(data[currencyKey])) {
        if (typeof value === 'number' && value > 0 && !isNaN(value) && isFinite(value)) {
          // Aplicar descuento del 0.5% para ser más competitivos que Google/Wise
          let discountRate = value * 1.005;
          
          // Para pesos colombianos (COP), agregar 50 pesos adicionales
          if (key.toUpperCase() === 'COP') {
            discountRate = discountRate + 50;
          }
          
          rates[key.toUpperCase()] = discountRate;
        }
      }
      
      // Asegurar que USD siempre esté
      rates['USD'] = 1;
      
      // Actualizar caché
      cachedRates = rates;
      cacheTimestamp = Date.now();

      setState({
        rates,
        baseCurrency: baseCurrency.toUpperCase(),
        lastUpdated: new Date(),
        isLoading: false,
        error: null,
      });
      
      console.log(`✅ Tasas actualizadas desde API: ${Object.keys(rates).length} monedas`);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      
      // Si hay caché, usar el caché incluso si está expirado
      if (cachedRates) {
        setState(prev => ({
          ...prev,
          rates: cachedRates!,
          isLoading: false,
          error: 'Error al actualizar tasas. Usando datos en caché.',
        }));
      } else {
        // Fallback con tasas predefinidas si no hay caché ni datos
        // Aplicar el mismo descuento del 0.5% para consistencia
        const fallbackRates: ExchangeRates = {
          USD: 1,
          COP: 4200 * 1.005 + 50, // ~4271
          EUR: 0.92,
          GBP: 0.79,
          MXN: 17.15 * 1.005, // ~17.24
          PEN: 3.72 * 1.005, // ~3.74
          BRL: 4.97 * 1.005, // ~4.99
          ARS: 875 * 1.005, // ~879
          CLP: 890 * 1.005, // ~894
          CAD: 1.36 * 1.005,
          JPY: 149.5 * 1.005,
          CHF: 0.88 * 1.005,
          AUD: 1.53 * 1.005,
          CNY: 7.24 * 1.005,
          INR: 83.12 * 1.005,
          KRW: 1320 * 1.005,
        };
        
        setState({
          rates: fallbackRates,
          baseCurrency: 'USD',
          lastUpdated: null,
          isLoading: false,
          error: 'No se pudo conectar al servidor. Usando tasas aproximadas.',
        });
      }
    }
  }, [baseCurrency]);

  // Obtener la tasa de cambio entre dos monedas
  const getRate = useCallback((from: string, to: string): number => {
    const { rates } = state;
    
    if (from === to) return 1;
    
    // Si la base es USD
    if (from === 'USD') {
      return rates[to] || 1;
    }
    
    // Si el destino es USD
    if (to === 'USD') {
      return 1 / (rates[from] || 1);
    }
    
    // Conversión cruzada a través de USD
    const fromToUsd = 1 / (rates[from] || 1);
    const usdToTo = rates[to] || 1;
    return fromToUsd * usdToTo;
  }, [state]);

  // Convertir un monto de una moneda a otra
  const convert = useCallback((amount: number, from: string, to: string): number => {
    const rate = getRate(from, to);
    return amount * rate;
  }, [getRate]);

  // Función para refrescar manualmente las tasas
  const refreshRates = useCallback(async () => {
    await fetchRates(true);
  }, [fetchRates]);

  // Efecto para cargar las tasas iniciales
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // Efecto para actualizar las tasas periódicamente
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(() => {
      fetchRates(true);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchRates]);

  return {
    ...state,
    refreshRates,
    getRate,
    convert,
  };
}

// Hook simplificado para obtener solo la tasa entre dos monedas específicas
export function useExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  refreshInterval: number = 60000
): {
  rate: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
} {
  const { getRate, isLoading, error, lastUpdated, refreshRates } = useExchangeRates('USD', refreshInterval);
  
  return {
    rate: getRate(fromCurrency, toCurrency),
    isLoading,
    error,
    lastUpdated,
    refresh: refreshRates,
  };
}
