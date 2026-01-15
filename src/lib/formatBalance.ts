/**
 * Formatea un valor numérico como balance en USD
 * REGLA GLOBAL: Puntos (.) para miles y millones, coma (,) para decimales/centavos
 * Ejemplo: 1.000.000,23 USD
 * 
 * @param amount - Cantidad en dólares
 * @param isVisible - Si el balance es visible o debe mostrarse oculto
 * @returns String formateado (ej: "1.000.000,23 USD" o "••• USD")
 */
export function formatBalance(amount: number, isVisible: boolean = true): string {
  if (!isVisible) {
    return '••• USD';
  }
  
  // REGLA: Puntos para miles/millones, coma para decimales
  // Formatear con separador de miles (.) y decimales con coma (,)
  const formatted = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true, // Activar separadores de miles
  }).format(amount);
  
  return `${formatted} USD`;
}

/**
 * Formatea cualquier valor monetario siguiendo la regla global del producto
 * REGLA: Puntos (.) para miles y millones, coma (,) para decimales/centavos
 * REGLA ESPECIAL: Para pesos (COP, MXN, ARS, etc.) NO mostrar centavos/decimales
 * 
 * @param amount - Cantidad numérica
 * @param currency - Moneda (default: 'USD')
 * @param showCurrency - Si mostrar la moneda (default: true)
 * @returns String formateado (ej: "1.000.000,23 USD" o "1.000.000 COP")
 */
export function formatCurrency(
  amount: number, 
  currency: string = 'USD', 
  showCurrency: boolean = true
): string {
  // Monedas de pesos que NO deben mostrar centavos
  const pesosCurrencies = ['COP', 'MXN', 'ARS', 'CLP', 'PEN', 'UYU', 'PYG'];
  const isPesosCurrency = pesosCurrencies.includes(currency.toUpperCase());
  
  const formatted = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: isPesosCurrency ? 0 : 2,
    maximumFractionDigits: isPesosCurrency ? 0 : 2,
    useGrouping: true, // Puntos para miles/millones
  }).format(amount);
  
  return showCurrency ? `${formatted} ${currency}` : formatted;
}
