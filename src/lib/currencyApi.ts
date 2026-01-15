/**
 * API para obtener tasas de cambio de monedas
 * Usa exchangerate.host que es gratuita y no requiere API key
 */

export interface CurrencyRate {
  date: string;
  rate: number;
}

export interface CurrencyHistoryResponse {
  rates: Record<string, Record<string, number>>;
  base: string;
  start_date: string;
  end_date: string;
}

export interface CurrencyLatestResponse {
  success: boolean;
  rates: Record<string, number>;
  base: string;
  date: string;
}

/**
 * Obtiene el historial de tasas de cambio para los últimos 5 días
 * La tasa muestra cuántas unidades de targetCurrency equivalen a 1 unidad de baseCurrency
 * Ejemplo: 1 USD = X COP
 * Aplica el mismo descuento del 0.5% para consistencia con getCurrentRate
 * @param baseCurrency Moneda base (ej: 'USD')
 * @param targetCurrency Moneda objetivo (ej: 'COP')
 * @returns Array de tasas de cambio con fechas (con descuento aplicado)
 */
export async function getCurrencyHistory(
  baseCurrency: string = 'USD',
  targetCurrency: string = 'COP'
): Promise<CurrencyRate[]> {
  try {
    // Calcular fechas: últimos 7 días (una semana)
    // Asegurar que las fechas no sean futuras
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar a medianoche
    
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - 1); // Ayer (último día disponible)
    
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 7); // Hace 7 días (una semana)
    
    // Asegurar que las fechas no sean futuras
    if (endDate > today) {
      endDate.setTime(today.getTime());
      endDate.setDate(endDate.getDate() - 1);
    }
    if (startDate > today) {
      startDate.setTime(today.getTime());
      startDate.setDate(startDate.getDate() - 7);
    }
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    // Usar currency-api haciendo llamadas individuales para cada día (más confiable)
    // currency-api funciona mejor desde el navegador sin problemas de CORS
    const rates: CurrencyRate[] = [];
    const currencyKey = baseCurrency.toLowerCase();
    const targetKey = targetCurrency.toLowerCase();
    
    // Obtener datos para cada día de la semana
    const promises: Promise<void>[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = formatDate(currentDate);
      const dateCopy = new Date(currentDate);
      
      promises.push(
        fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dateStr}/v1/currencies/${currencyKey}.json`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        })
          .then(async (response) => {
            if (!response.ok) {
              // Si falla este día, usar la tasa actual como aproximación
              return;
            }
            
            const data = await response.json();
            
            if (data && data[currencyKey] && data[currencyKey][targetKey]) {
              const rate = data[currencyKey][targetKey];
              
              if (rate && rate > 0 && !isNaN(rate) && isFinite(rate)) {
                // Aplicar el mismo descuento del 0.5% para consistencia
                let discountRate = rate * 1.005;
                
                // Para pesos colombianos (COP), agregar pesos adicionales para ser mejores en tasa
                if (targetCurrency === 'COP') {
                  discountRate = discountRate + 50; // Agregar 50 pesos adicionales para ser mejores
                }
                
                rates.push({
                  date: dateStr,
                  rate: discountRate,
                });
              }
            }
          })
          .catch(() => {
            // Ignorar errores individuales, continuar con otros días
          })
      );
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Esperar a que todas las peticiones terminen
    await Promise.all(promises);
    
    // Ordenar por fecha
    rates.sort((a, b) => a.date.localeCompare(b.date));
    
    // Si no hay datos válidos, retornar datos de ejemplo
    if (rates.length === 0) {
      console.warn('No se encontraron datos históricos válidos, usando datos de ejemplo');
      return generateMockData(7); // 7 días para una semana
    }
    
    console.log(`✅ Historial obtenido: ${rates.length} días de datos reales`);
    return rates;
  } catch (error) {
    console.error('❌ Error obteniendo historial:', error);
    // Retornar datos de ejemplo en caso de error (no lanzar error, solo usar fallback)
    return generateMockData(7); // 7 días para una semana
  }
}

/**
 * Obtiene la tasa de cambio actual
 * Retorna cuántas unidades de targetCurrency equivalen a 1 unidad de baseCurrency
 * Ejemplo: 1 USD = X COP (como Google o Wise)
 * Aplica un descuento del 0.5% para que siempre sea más barato que Google/Wise/Remitly
 * @param baseCurrency Moneda base (ej: 'USD')
 * @param targetCurrency Moneda objetivo (ej: 'COP')
 * @returns Tasa de cambio actual con descuento aplicado (ej: 4080 significa 1 USD = 4080 COP)
 */
export async function getCurrentRate(
  baseCurrency: string = 'USD',
  targetCurrency: string = 'COP'
): Promise<number> {
  try {
    // Usar currency-api que funciona mejor desde el navegador (sin problemas de CORS)
    // Formato: 1 baseCurrency = X targetCurrency
    // Esta API retorna: { usd: { cop: 4100, ... } }
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency.toLowerCase()}.json`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // currency-api retorna: { date: "2024-01-01", usd: { cop: 4100, ... } }
    const currencyKey = baseCurrency.toLowerCase();
    const targetKey = targetCurrency.toLowerCase();
    
    if (!data || !data[currencyKey] || !data[currencyKey][targetKey]) {
      throw new Error('Respuesta inválida de la API');
    }
    
    const rate = data[currencyKey][targetKey];
    
    // Validar que el rate sea un número válido y mayor a 0
    // La API retorna: 1 USD = rate COP (como Google/Wise)
    if (!rate || rate === 0 || isNaN(rate) || !isFinite(rate)) {
      throw new Error(`Tasa de cambio inválida: ${rate}`);
    }
    
    // Aplicar descuento del 0.5% para que siempre sea más barato que Google/Wise/Remitly
    // Esto significa que por cada USD recibes más COP que en otras plataformas
    let discountRate = rate * 1.005; // Aumentamos el rate en 0.5% (más COP por USD = más barato)
    
    // Para pesos colombianos (COP), agregar pesos adicionales para ser mejores en tasa
    if (targetCurrency === 'COP') {
      discountRate = discountRate + 50; // Agregar 50 pesos adicionales para ser mejores
    }
    
    console.log(`✅ Tasa real obtenida: 1 ${baseCurrency} = ${discountRate.toFixed(2)} ${targetCurrency}`);
    return discountRate;
  } catch (error) {
    console.error('❌ Error obteniendo tasa de cambio:', error);
    // Retornar valor de ejemplo válido: 1 USD = 4080 COP (con descuento aplicado)
    // No lanzar error, solo usar fallback para que la app siga funcionando
    console.warn('⚠️ Usando valor de fallback: 4080 * 1.005');
    return 4080 * 1.005;
  }
}

/**
 * Obtiene la tasa de cambio de hace 24 horas para calcular el cambio porcentual diario
 * @param baseCurrency Moneda base (ej: 'USD')
 * @param targetCurrency Moneda objetivo (ej: 'COP')
 * @returns Tasa de cambio de hace 24 horas
 */
export async function getRate24HoursAgo(
  baseCurrency: string = 'USD',
  targetCurrency: string = 'COP'
): Promise<number> {
  try {
    // Obtener la tasa de ayer usando currency-api con fecha específica
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Asegurar que la fecha no sea futura
    const today = new Date();
    if (yesterday > today) {
      yesterday.setTime(today.getTime());
      yesterday.setDate(yesterday.getDate() - 1);
    }
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const dateStr = formatDate(yesterday);
    
    // Usar currency-api con fecha específica
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dateStr}/v1/currencies/${baseCurrency.toLowerCase()}.json`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      // Si falla con fecha específica, usar la tasa actual como aproximación
      console.warn('No se pudo obtener tasa de ayer, usando tasa actual');
      return await getCurrentRate(baseCurrency, targetCurrency);
    }
    
    const data = await response.json();
    
    // currency-api retorna: { date: "2024-01-01", usd: { cop: 4100, ... } }
    const currencyKey = baseCurrency.toLowerCase();
    const targetKey = targetCurrency.toLowerCase();
    
    if (!data || !data[currencyKey] || !data[currencyKey][targetKey]) {
      // Si no hay datos históricos, usar tasa actual como aproximación
      console.warn('No hay datos históricos disponibles, usando tasa actual');
      return await getCurrentRate(baseCurrency, targetCurrency);
    }
    
    const rate = data[currencyKey][targetKey];
    
    // Validar que el rate sea un número válido y mayor a 0
    if (!rate || rate === 0 || isNaN(rate) || !isFinite(rate)) {
      throw new Error(`Tasa de cambio inválida: ${rate}`);
    }
    
    // Aplicar el mismo descuento del 0.5% para consistencia
    let discountRate = rate * 1.005;
    
    // Para pesos colombianos (COP), agregar pesos adicionales para ser mejores en tasa
    if (targetCurrency === 'COP') {
      discountRate = discountRate + 50; // Agregar 50 pesos adicionales para ser mejores
    }
    
    return discountRate;
  } catch (error) {
    console.error('❌ Error obteniendo tasa de ayer:', error);
    // Si falla, usar tasa actual como aproximación
    try {
      return await getCurrentRate(baseCurrency, targetCurrency);
    } catch {
      // Si también falla, usar fallback
      return 4080 * 1.005;
    }
  }
}

/**
 * Genera datos de ejemplo para desarrollo/testing
 * Simula tasas realistas: 1 USD = X COP (como Google/Wise)
 * Usa variación determinística basada en el índice para que sea consistente
 */
function generateMockData(days: number): CurrencyRate[] {
  const rates: CurrencyRate[] = [];
  const baseRate = 4080; // 1 USD = 4080 COP (tasa realista)
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simular variación determinística pequeña y realista basada en el índice
    // Usar una función determinística en lugar de Math.random() para consistencia
    const variation = (Math.sin(i * 0.5) * 0.01); // Variación determinística basada en seno
    const rate = baseRate * (1 + variation);
    
    // Asegurar que el rate sea válido (mayor a 0)
    const validRate = Math.max(rate, 100); // Mínimo 100 para evitar valores muy bajos
    
    rates.push({
      date: date.toISOString().split('T')[0],
      rate: Math.round(validRate * 100) / 100,
    });
  }
  
  return rates;
}

/**
 * Calcula el cambio porcentual entre dos valores
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
