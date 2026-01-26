
"use client";

import { useState, useEffect } from 'react';
import { colors, spacing, typography, borderRadius, shadows } from '../../config/design-tokens';
import { BottomSheet } from './BottomSheet';
import { SliderToBlock } from './SliderToBlock';
import { formatCurrency } from '../../lib/formatBalance';
import { useExchangeRates } from '../../hooks/useExchangeRates';
import { useBalances } from '../../hooks/useBalances';
import { useMovements } from '../../hooks/useMovements';

interface ExchangeMoneySheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialUsdBalance: number;
  initialCopBalance: number;
}

// Tipo para las monedas disponibles
interface CurrencyOption {
  id: string;
  name: string;
  symbol: string;
  balance: string;
}

// Función para obtener la bandera de una moneda (local SVG)
const getCurrencyFlag = (symbol: string): string => {
  const currencyToCountry: Record<string, string> = {
    'USD': 'US', 'COP': 'CO',
  };
  const countryCode = currencyToCountry[symbol] || 'US';
  return `/img/icons/country-flags/${countryCode}.svg`;
};

export function ExchangeMoneySheet({ isOpen, onClose, initialUsdBalance, initialCopBalance }: ExchangeMoneySheetProps) {
  const { getRate, convert, refreshRates } = useExchangeRates();
  const { usdBalance, copBalance, exchangeCurrency: performExchange } = useBalances(initialUsdBalance, initialCopBalance);
  const { addMovement } = useMovements();
  
  // Monedas disponibles con valores dinámicos
  const currencies: CurrencyOption[] = [
    { id: 'usd', name: 'Dólar estadounidense', symbol: 'USD', balance: formatCurrency(usdBalance, 'USD', false) },
    { id: 'cop', name: 'Peso colombiano', symbol: 'COP', balance: formatCurrency(copBalance, 'COP', false) },
  ];
  
  // Estados para el cambio de moneda
  const [exchangeFromCurrency, setExchangeFromCurrency] = useState<CurrencyOption>(currencies[0]);
  const [exchangeToCurrency, setExchangeToCurrency] = useState<CurrencyOption>(currencies[1]);
  const [exchangeFromAmount, setExchangeFromAmount] = useState<string>('');
  const [exchangeToAmount, setExchangeToAmount] = useState<string>('');
  const [exchangeLastEditedField, setExchangeLastEditedField] = useState<'from' | 'to'>('from');
  
  // Estado para modales de selección de moneda
  const [isFromCurrencySheetOpen, setIsFromCurrencySheetOpen] = useState(false);
  const [isToCurrencySheetOpen, setIsToCurrencySheetOpen] = useState(false);
  
  // Timer para la tasa de cambio
  const [rateTimer, setRateTimer] = useState(60);
  
  // Estado para error de saldo insuficiente
  const [balanceError, setBalanceError] = useState(false);
  
  // Estado para focus de inputs (mostrar botones MIN/MAX solo cuando está enfocado)
  const [isFromInputFocused, setIsFromInputFocused] = useState(false);
  const [isToInputFocused, setIsToInputFocused] = useState(false);
  
  // Monto mínimo en USD (y su equivalente en otras monedas)
  const MIN_AMOUNT_USD = 10;
  
  // Validar si el monto cumple con el mínimo
  const isAmountBelowMinimum = (): boolean => {
    const amount = parseFormattedValue(exchangeFromAmount);
    if (amount <= 0) return true;
    
    if (exchangeFromCurrency.symbol === 'USD') {
      return amount < MIN_AMOUNT_USD;
    } else {
      // Convertir el mínimo USD a la moneda de origen
      const minInSourceCurrency = convert(MIN_AMOUNT_USD, 'USD', exchangeFromCurrency.symbol);
      return amount < minInSourceCurrency;
    }
  };
  
  // Verificar si hay algún error que impida la transacción
  const hasTransactionError = (): boolean => {
    return balanceError || isAmountBelowMinimum();
  };
  
  // Calcular font size dinámico basado en longitud del valor (incluye separadores)
  const getDynamicFontSize = (value: string): number => {
    // Usar longitud total incluyendo separadores para mejor cálculo
    const totalLength = value.length;
    if (totalLength <= 3) return 36;
    if (totalLength <= 5) return 32;
    if (totalLength <= 7) return 28;
    if (totalLength <= 9) return 24;
    if (totalLength <= 11) return 20;
    if (totalLength <= 13) return 17;
    if (totalLength <= 15) return 14;
    return 12;
  };
  
  // Obtener placeholder mínimo por moneda
  const getMinPlaceholder = (currency: string): string => {
    return '0';
  };
  
  // Obtener monto mínimo por moneda
  const getMinAmount = (currency: string): number => {
    if (currency === 'USD') return MIN_AMOUNT_USD;
    return convert(MIN_AMOUNT_USD, 'USD', currency);
  };
  
  // Obtener monto máximo (saldo disponible)
  const getMaxAmount = (currency: string): number => {
    return currency === 'USD' ? usdBalance : copBalance;
  };
  
  // Aplicar monto mínimo al input origen
  const handleFromMin = () => {
    const minAmount = getMinAmount(exchangeFromCurrency.symbol);
    // Para números enteros, no mostrar decimales
    const formatted = Number.isInteger(minAmount) 
      ? new Intl.NumberFormat('es-ES', { useGrouping: true }).format(minAmount)
      : formatCurrency(minAmount, exchangeFromCurrency.symbol as 'USD' | 'COP', false);
    setExchangeFromAmount(formatted);
    setExchangeLastEditedField('from');
    setBalanceError(minAmount > getMaxAmount(exchangeFromCurrency.symbol));
  };
  
  // Aplicar monto máximo al input origen
  const handleFromMax = () => {
    const maxAmount = getMaxAmount(exchangeFromCurrency.symbol);
    const formatted = formatCurrency(maxAmount, exchangeFromCurrency.symbol as 'USD' | 'COP', false);
    setExchangeFromAmount(formatted);
    setExchangeLastEditedField('from');
    setBalanceError(false);
  };
  
  // Aplicar monto mínimo al input destino
  const handleToMin = () => {
    const minInFrom = getMinAmount(exchangeFromCurrency.symbol);
    const minInTo = convert(minInFrom, exchangeFromCurrency.symbol, exchangeToCurrency.symbol);
    // Para números enteros, no mostrar decimales
    const formatted = Number.isInteger(minInTo) 
      ? new Intl.NumberFormat('es-ES', { useGrouping: true }).format(minInTo)
      : formatCurrency(minInTo, exchangeToCurrency.symbol as 'USD' | 'COP', false);
    setExchangeToAmount(formatted);
    setExchangeLastEditedField('to');
    setBalanceError(minInFrom > getMaxAmount(exchangeFromCurrency.symbol));
  };
  
  // Aplicar monto máximo al input destino
  const handleToMax = () => {
    const maxInFrom = getMaxAmount(exchangeFromCurrency.symbol);
    const maxInTo = convert(maxInFrom, exchangeFromCurrency.symbol, exchangeToCurrency.symbol);
    const formatted = formatCurrency(maxInTo, exchangeToCurrency.symbol as 'USD' | 'COP', false);
    setExchangeToAmount(formatted);
    setExchangeLastEditedField('to');
    setBalanceError(false);
  };
  
  // Límites de dígitos por moneda: 12 dígitos enteros para todas
  const getMaxDigits = (currency: string): number => {
    return 12; // 12 dígitos enteros + decimales si aplica
  };
  
  // Actualizar currencies cuando cambien los balances
  useEffect(() => {
    const updatedFromCurrency = currencies.find(c => c.id === exchangeFromCurrency.id);
    const updatedToCurrency = currencies.find(c => c.id === exchangeToCurrency.id);
    // Solo actualizar si el balance cambió para evitar loops infinitos
    if (updatedFromCurrency && updatedFromCurrency.balance !== exchangeFromCurrency.balance) {
      setExchangeFromCurrency(updatedFromCurrency);
    }
    if (updatedToCurrency && updatedToCurrency.balance !== exchangeToCurrency.balance) {
      setExchangeToCurrency(updatedToCurrency);
    }
  }, [usdBalance, copBalance]);
  
  // Timer para la tasa de cambio
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setRateTimer((prev) => {
        if (prev <= 1) {
          refreshRates();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isOpen, refreshRates]);
  
  // Resetear timer cuando se abre
  useEffect(() => {
    if (isOpen) {
      setRateTimer(60);
      refreshRates();
    }
  }, [isOpen, refreshRates]);
  
  // Parsear valor formateado a número
  const parseFormattedValue = (value: string): number => {
    if (!value) return 0;
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  };
  
  // Formatear con separadores de miles
  const formatWithThousands = (value: string, currency: { symbol: string }): string => {
    const maxDigits = getMaxDigits(currency.symbol);
    const cleanValue = value.replace(/[^\d,]/g, '');
    const parts = cleanValue.split(',');
    let integerPart = parts[0].replace(/\./g, '');
    
    if (integerPart.length > maxDigits) {
      integerPart = integerPart.slice(0, maxDigits);
    }
    
    const decimalPart = parts[1];
    
    if (integerPart.length > 3) {
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    if (decimalPart !== undefined) {
      const maxDecimals = currency.symbol === 'COP' ? 0 : 2;
      const truncatedDecimal = decimalPart.slice(0, maxDecimals);
      return `${integerPart},${truncatedDecimal}`;
    }
    
    return integerPart;
  };
  
  // Validar monto
  const validateAmount = (value: string, currency: { symbol: string }): string => {
    if (!value) return '';
    
    const maxDigits = getMaxDigits(currency.symbol);
    
    // Eliminar todo excepto dígitos y coma (el punto se ignora como separador de miles)
    let cleanValue = value.replace(/[^\d,]/g, '');
    
    // Manejar múltiples comas - solo permitir una
    const commaCount = (cleanValue.match(/,/g) || []).length;
    if (commaCount > 1) {
      const firstCommaIndex = cleanValue.indexOf(',');
      cleanValue = cleanValue.slice(0, firstCommaIndex + 1) + cleanValue.slice(firstCommaIndex + 1).replace(/,/g, '');
    }
    
    const parts = cleanValue.split(',');
    let integerPart = parts[0];
    
    if (integerPart.length > maxDigits) {
      integerPart = integerPart.slice(0, maxDigits);
    }
    
    if (parts.length > 1) {
      const maxDecimals = currency.symbol === 'COP' ? 0 : 2;
      const decimalPart = parts[1].slice(0, maxDecimals);
      cleanValue = `${integerPart},${decimalPart}`;
    } else {
      cleanValue = integerPart;
    }
    
    return formatWithThousands(cleanValue, currency);
  };
  
  // Cerrar y resetear
  const handleClose = () => {
    onClose();
    setExchangeFromAmount('100');
    setExchangeToAmount('');
    setExchangeLastEditedField('from');
  };

  return (
    <>
      {/* Bottom Sheet Principal - Cambiar Moneda */}
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title="Cambiar moneda"
        maxHeight={96}
        showGraber={true}
        zIndex={1050}
        rightIcon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke={colors.semantic.text.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        onRightIconClick={handleClose}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4], paddingBottom: spacing[8], marginTop: '1.5rem' }}>
          {/* Contenedor de inputs con swap button */}
          <div>
            {/* Sección: Cuenta origen */}
            <div style={{ backgroundColor: colors.semantic.background.main, borderRadius: '24px', padding: spacing[6] }}>
              <p style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', '), marginBottom: spacing[2] }}>
                Cuenta origen
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
                <button
                  onClick={() => setIsFromCurrencySheetOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    backgroundColor: colors.semantic.background.white,
                    borderRadius: borderRadius.full,
                    padding: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <img src={getCurrencyFlag(exchangeFromCurrency.symbol)} alt={exchangeFromCurrency.name} style={{ width: '24px', height: '24px', borderRadius: borderRadius.full, objectFit: 'cover' }} />
                  <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
                    {exchangeFromCurrency.symbol}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke={colors.semantic.text.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                
                <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: spacing[2] }}>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={exchangeLastEditedField === 'from' ? exchangeFromAmount : (
                      exchangeToAmount ? formatCurrency(
                        convert(parseFormattedValue(exchangeToAmount), exchangeToCurrency.symbol, exchangeFromCurrency.symbol),
                        exchangeFromCurrency.symbol as 'USD' | 'COP',
                        false
                      ) : ''
                    )}
                    onChange={(e) => {
                      const validated = validateAmount(e.target.value, exchangeFromCurrency);
                      setExchangeFromAmount(validated);
                      setExchangeLastEditedField('from');
                      // Verificar si excede el saldo
                      const amount = parseFormattedValue(validated);
                      const available = exchangeFromCurrency.symbol === 'USD' ? usdBalance : copBalance;
                      setBalanceError(amount > available);
                    }}
                    onFocus={() => setIsFromInputFocused(true)}
                    onBlur={() => setTimeout(() => setIsFromInputFocused(false), 150)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: `${getDynamicFontSize(exchangeFromAmount || '0')}px`,
                      fontWeight: typography.fontWeight.bold,
                      color: balanceError ? colors.error[500] : colors.semantic.text.primary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: 0,
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                      transition: 'font-size 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.15s ease',
                      WebkitAppearance: 'none',
                      MozAppearance: 'textfield',
                      textAlign: 'right',
                    }}
                    placeholder={getMinPlaceholder(exchangeFromCurrency.symbol)}
                  />
                  {/* Botones MIN/MAX - solo aparecen cuando el input está enfocado y ambos campos vacíos */}
                  {isFromInputFocused && !exchangeFromAmount && !exchangeToAmount && (
                    <div style={{ 
                      display: 'flex', 
                      gap: spacing[1],
                      flexShrink: 0,
                      opacity: 1,
                      transition: 'opacity 0.2s ease-out',
                    }}>
                      {getMaxAmount(exchangeFromCurrency.symbol) > 0 ? (
                        <>
                          <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleFromMin}
                            style={{
                              backgroundColor: colors.semantic.button.secondary,
                              color: colors.semantic.text.primary,
                              fontSize: typography.fontSize.xs,
                              fontWeight: typography.fontWeight.bold,
                              fontFamily: typography.fontFamily.sans.join(', '),
                              padding: `${spacing[1]} ${spacing[2]}`,
                              borderRadius: borderRadius.full,
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            MÍN
                          </button>
                          <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleFromMax}
                            style={{
                              backgroundColor: colors.semantic.text.primary,
                              color: colors.white,
                              fontSize: typography.fontSize.xs,
                              fontWeight: typography.fontWeight.bold,
                              fontFamily: typography.fontFamily.sans.join(', '),
                              padding: `${spacing[1]} ${spacing[2]}`,
                              borderRadius: borderRadius.full,
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            MÁX
                          </button>
                        </>
                      ) : (
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => onClose()}
                          style={{
                            backgroundColor: colors.semantic.text.primary,
                            color: colors.white,
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.semibold,
                            fontFamily: typography.fontFamily.sans.join(', '),
                            padding: `${spacing[1]} ${spacing[2]}`,
                            borderRadius: borderRadius.full,
                            border: 'none',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Agregar saldo
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing[3] }}>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0 }}>
                  Saldo disponible: <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary }}>
                    {exchangeFromCurrency.symbol === 'USD' 
                      ? formatCurrency(usdBalance, 'USD', false) 
                      : formatCurrency(copBalance, 'COP', false)} {exchangeFromCurrency.symbol}
                  </span>
                </p>
              </div>
              <p style={{ fontSize: typography.fontSize.xs, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0, marginTop: spacing[1] }}>
                {exchangeFromCurrency.symbol === 'USD' 
                  ? `Mín. 10 USD · Máx. ${formatCurrency(usdBalance, 'USD', false)} USD`
                  : `Mín. ${formatCurrency(10 * getRate('USD', 'COP'), 'COP', false)} COP · Máx. ${formatCurrency(copBalance, 'COP', false)} COP`
                }
              </p>
              {/* Mensaje de error cuando excede el saldo o no cumple mínimo */}
              {(balanceError || (isAmountBelowMinimum() && parseFormattedValue(exchangeFromAmount) > 0)) && exchangeLastEditedField === 'from' && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: spacing[2],
                }}>
                  <p style={{ 
                    fontSize: typography.fontSize.sm, 
                    color: colors.error[500], 
                    fontFamily: typography.fontFamily.sans.join(', '), 
                    margin: 0,
                    fontWeight: typography.fontWeight.semibold,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[1],
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke={colors.error[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {balanceError ? 'Saldo insuficiente' : 'Monto mínimo no alcanzado'}
                  </p>
                  {balanceError && (
                    <button
                      onClick={() => {
                        onClose();
                        // Navegar a agregar saldo
                      }}
                      style={{
                        backgroundColor: colors.semantic.text.primary,
                        color: colors.white,
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        fontFamily: typography.fontFamily.sans.join(', '),
                        padding: `${spacing[1]} ${spacing[3]}`,
                        borderRadius: borderRadius.full,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Agregar saldo
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Botón de intercambiar monedas */}
            <div style={{ display: 'flex', justifyContent: 'center', height: spacing[4], position: 'relative', zIndex: 10 }}>
              <button
                onClick={() => {
                  // Obtener el valor actual del "to" (ya sea editado o calculado)
                  const currentToValue = exchangeLastEditedField === 'to' 
                    ? exchangeToAmount 
                    : (exchangeFromAmount 
                      ? formatCurrency(convert(parseFormattedValue(exchangeFromAmount), exchangeFromCurrency.symbol, exchangeToCurrency.symbol), exchangeToCurrency.symbol as 'USD' | 'COP', false)
                      : '');
                  
                  // Intercambiar monedas
                  const tempCurrency = exchangeFromCurrency;
                  setExchangeFromCurrency(exchangeToCurrency);
                  setExchangeToCurrency(tempCurrency);
                  
                  // Mantener el valor de abajo (to) y recalcular el de arriba (from)
                  setExchangeToAmount(currentToValue);
                  setExchangeFromAmount('');
                  setExchangeLastEditedField('to');
                  
                  // Verificar si hay error de saldo con la nueva configuración
                  if (currentToValue) {
                    const toAmount = parseFormattedValue(currentToValue);
                    const fromAmount = convert(toAmount, exchangeToCurrency.symbol, exchangeFromCurrency.symbol);
                    const available = exchangeToCurrency.symbol === 'USD' ? usdBalance : copBalance;
                    setBalanceError(fromAmount > available);
                  }
                }}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.semantic.background.white,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                  boxShadow: shadows.button,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                onPointerDown={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(0.95)'; }}
                onPointerUp={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'; }}
                onPointerLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 16L7 4M7 4L3 8M7 4L11 8M17 8L17 20M17 20L21 16M17 20L13 16" stroke={colors.semantic.text.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Sección: Cuenta destino */}
            <div style={{ backgroundColor: colors.semantic.background.main, borderRadius: '24px', padding: spacing[6] }}>
              <p style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', '), marginBottom: spacing[2] }}>
                Cuenta destino
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
                <button
                  onClick={() => setIsToCurrencySheetOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    backgroundColor: colors.semantic.background.white,
                    borderRadius: borderRadius.full,
                    padding: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <img src={getCurrencyFlag(exchangeToCurrency.symbol)} alt={exchangeToCurrency.name} style={{ width: '24px', height: '24px', borderRadius: borderRadius.full, objectFit: 'cover' }} />
                  <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
                    {exchangeToCurrency.symbol}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke={colors.semantic.text.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                
                <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: spacing[2] }}>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={exchangeLastEditedField === 'to' ? exchangeToAmount : (
                      exchangeFromAmount ? formatCurrency(
                        convert(parseFormattedValue(exchangeFromAmount), exchangeFromCurrency.symbol, exchangeToCurrency.symbol),
                        exchangeToCurrency.symbol as 'USD' | 'COP',
                        false
                      ) : ''
                    )}
                    onChange={(e) => {
                      const validated = validateAmount(e.target.value, exchangeToCurrency);
                      setExchangeToAmount(validated);
                      setExchangeLastEditedField('to');
                      // Verificar si el monto convertido excede el saldo origen
                      const toAmount = parseFormattedValue(validated);
                      const fromAmount = convert(toAmount, exchangeToCurrency.symbol, exchangeFromCurrency.symbol);
                      const available = exchangeFromCurrency.symbol === 'USD' ? usdBalance : copBalance;
                      setBalanceError(fromAmount > available);
                    }}
                    onFocus={() => setIsToInputFocused(true)}
                    onBlur={() => setTimeout(() => setIsToInputFocused(false), 150)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: `${getDynamicFontSize(exchangeLastEditedField === 'to' ? (exchangeToAmount || '0') : (exchangeFromAmount ? formatCurrency(convert(parseFormattedValue(exchangeFromAmount), exchangeFromCurrency.symbol, exchangeToCurrency.symbol), exchangeToCurrency.symbol as 'USD' | 'COP', false) : '0'))}px`,
                      fontWeight: typography.fontWeight.bold,
                      color: balanceError ? colors.error[500] : colors.semantic.text.primary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: 0,
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                      transition: 'font-size 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.15s ease',
                      WebkitAppearance: 'none',
                      MozAppearance: 'textfield',
                      textAlign: 'right',
                    }}
                    placeholder={getMinPlaceholder(exchangeToCurrency.symbol)}
                  />
                  {/* Botones MIN/MAX - solo aparecen cuando el input está enfocado y ambos campos vacíos */}
                  {isToInputFocused && !exchangeFromAmount && !exchangeToAmount && (
                    <div style={{ 
                      display: 'flex', 
                      gap: spacing[1],
                      flexShrink: 0,
                      opacity: 1,
                      transition: 'opacity 0.2s ease-out',
                    }}>
                      {getMaxAmount(exchangeFromCurrency.symbol) > 0 ? (
                        <>
                          <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleToMin}
                            style={{
                              backgroundColor: colors.semantic.button.secondary,
                              color: colors.semantic.text.primary,
                              fontSize: typography.fontSize.xs,
                              fontWeight: typography.fontWeight.bold,
                              fontFamily: typography.fontFamily.sans.join(', '),
                              padding: `${spacing[1]} ${spacing[2]}`,
                              borderRadius: borderRadius.full,
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            MÍN
                          </button>
                          <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleToMax}
                            style={{
                              backgroundColor: colors.semantic.text.primary,
                              color: colors.white,
                              fontSize: typography.fontSize.xs,
                              fontWeight: typography.fontWeight.bold,
                              fontFamily: typography.fontFamily.sans.join(', '),
                              padding: `${spacing[1]} ${spacing[2]}`,
                              borderRadius: borderRadius.full,
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            MÁX
                          </button>
                        </>
                      ) : (
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => onClose()}
                          style={{
                            backgroundColor: colors.semantic.text.primary,
                            color: colors.white,
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.semibold,
                            fontFamily: typography.fontFamily.sans.join(', '),
                            padding: `${spacing[1]} ${spacing[2]}`,
                            borderRadius: borderRadius.full,
                            border: 'none',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Agregar saldo
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Mensaje de error cuando el monto destino excede el saldo origen */}
              {balanceError && exchangeLastEditedField === 'to' && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: spacing[2],
                }}>
                  <p style={{ 
                    fontSize: typography.fontSize.sm, 
                    color: colors.error[500], 
                    fontFamily: typography.fontFamily.sans.join(', '), 
                    margin: 0,
                    fontWeight: typography.fontWeight.semibold,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[1],
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke={colors.error[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Saldo insuficiente
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      // Navegar a agregar saldo
                    }}
                    style={{
                      backgroundColor: colors.semantic.text.primary,
                      color: colors.white,
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.semibold,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      padding: `${spacing[2]} ${spacing[3]}`,
                      borderRadius: borderRadius.full,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Agregar saldo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Detalle de la operación */}
          <div style={{ backgroundColor: 'rgb(110 147 221 / 12%)', border: '1px solid rgb(110 147 221 / 20%)', borderRadius: borderRadius['3xl'], padding: spacing[6], marginTop: spacing[2] }}>
            <p style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', '), marginBottom: spacing[3] }}>
              Detalle de la operación
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[2] }}>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
                Tarifa de cambio
              </span>
              <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
                {(() => {
                  const rate = getRate(exchangeFromCurrency.symbol, exchangeToCurrency.symbol);
                  return rate >= 1 
                    ? `1 ${exchangeFromCurrency.symbol} = ${formatCurrency(rate, exchangeToCurrency.symbol, false)} ${exchangeToCurrency.symbol}`
                    : `1 ${exchangeToCurrency.symbol} = ${formatCurrency(1 / rate, exchangeFromCurrency.symbol, false)} ${exchangeFromCurrency.symbol}`;
                })()}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[2] }}>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
                Válido por
              </span>
              <span style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: '#92400E', fontFamily: typography.fontFamily.sans.join(', '), backgroundColor: '#FEF3C7', padding: `${spacing[1]} ${spacing[2]}`, borderRadius: borderRadius.full }}>
                {rateTimer} s
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
                Nuestra tarifa
              </span>
              <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
                GRATIS
              </span>
            </div>
          </div>

          {/* Slider para confirmar cambio */}
          <div style={{ marginTop: spacing[4] }}>
            <SliderToBlock
              key={`exchange-${isOpen}`}
              mode="exchange"
              disabled={hasTransactionError()}
              onComplete={() => {
                // Calcular montos basados en el campo que se editó
                let fromAmount: number;
                let toAmount: number;
                const fromSymbol = exchangeFromCurrency.symbol as 'USD' | 'COP';
                const toSymbol = exchangeToCurrency.symbol as 'USD' | 'COP';
                
                if (exchangeLastEditedField === 'from') {
                  fromAmount = parseFormattedValue(exchangeFromAmount);
                  toAmount = convert(fromAmount, fromSymbol, toSymbol);
                } else {
                  toAmount = parseFormattedValue(exchangeToAmount);
                  fromAmount = convert(toAmount, toSymbol, fromSymbol);
                }
                
                // Validar que el monto no exceda el saldo disponible
                const availableBalance = fromSymbol === 'USD' ? usdBalance : copBalance;
                if (fromAmount > availableBalance) {
                  console.error('Monto excede saldo disponible');
                  return;
                }
                
                // Validar monto mínimo
                if (fromAmount <= 0) {
                  console.error('Monto inválido');
                  return;
                }
                
                console.log('Ejecutando cambio:', { 
                  fromAmount, 
                  fromSymbol, 
                  toAmount, 
                  toSymbol,
                  availableBalance,
                  usdBalance,
                  copBalance
                });
                
                // 1. Realizar el cambio de saldos
                performExchange(fromSymbol, toSymbol, fromAmount, toAmount);
                
                // 2. Agregar movimiento de salida (negativo) - aparece en wallet y general
                const now = new Date();
                addMovement({
                  name: `Cambio de moneda · ${fromSymbol} → ${toSymbol}`,
                  amount: -fromAmount,
                  currency: fromSymbol,
                  date: now,
                  logoUrl: '/img/icons/global/refresh-cw.svg',
                  type: 'transfer',
                  source: 'wallet', // Aparece en wallet y general
                  isIcon: true,
                });
                
                // 3. Agregar movimiento de entrada (positivo) - 1 segundo después
                const entryDate = new Date(now.getTime() + 1000);
                addMovement({
                  name: `Conversión recibida · ${fromSymbol} → ${toSymbol}`,
                  amount: toAmount,
                  currency: toSymbol,
                  date: entryDate,
                  logoUrl: '/img/icons/global/refresh-cw.svg',
                  type: 'deposit',
                  source: 'wallet', // Aparece en wallet y general
                  isIcon: true,
                });
              }}
              onCloseSheet={handleClose}
              onShowToast={(message) => { console.log('Toast:', message); }}
            />
          </div>
        </div>
      </BottomSheet>

      {/* Bottom Sheet - Seleccionar moneda origen */}
      <BottomSheet
        isOpen={isFromCurrencySheetOpen}
        onClose={() => setIsFromCurrencySheetOpen(false)}
        title="Cuenta origen"
        showGraber={true}
        zIndex={1100}
        rightIcon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke={colors.semantic.text.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        onRightIconClick={() => setIsFromCurrencySheetOpen(false)}
      >
        <div style={{ padding: 0 }}>
          {currencies.map((currency, index) => (
            <button
              key={currency.id}
              onClick={() => {
                if (currency.id === exchangeToCurrency.id) {
                  setExchangeToCurrency(exchangeFromCurrency);
                }
                setExchangeFromCurrency(currency);
                setIsFromCurrencySheetOpen(false);
              }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: spacing[3], padding: 0, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
              
              
            >
              <img src={getCurrencyFlag(currency.symbol)} alt={`Bandera ${currency.symbol}`} style={{ width: '40px', height: '40px', borderRadius: borderRadius.full, objectFit: 'cover', flexShrink: 0, marginTop: spacing[4], marginBottom: spacing[4] }} />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${spacing[4]} 0`, borderBottom: index < currencies.length - 1 ? `1px solid ${colors.semantic.border.light}` : 'none' }}>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0 }}>
                    {currency.name}
                  </p>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0, marginTop: spacing['0.5'] }}>
                    {currency.balance} {currency.symbol}
                  </p>
                </div>
                <div style={{ width: '24px', height: '24px', borderRadius: borderRadius.full, border: exchangeFromCurrency.id === currency.id ? `2px solid ${colors.primary.main}` : `2px solid ${colors.semantic.border.medium}`, backgroundColor: exchangeFromCurrency.id === currency.id ? colors.primary.main : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', flexShrink: 0 }}>
                  {exchangeFromCurrency.id === currency.id && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L10 17L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Bottom Sheet - Seleccionar moneda destino */}
      <BottomSheet
        isOpen={isToCurrencySheetOpen}
        onClose={() => setIsToCurrencySheetOpen(false)}
        title="Cuenta destino"
        showGraber={true}
        zIndex={1100}
        rightIcon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke={colors.semantic.text.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        onRightIconClick={() => setIsToCurrencySheetOpen(false)}
      >
        <div style={{ padding: 0 }}>
          {currencies.map((currency, index) => (
            <button
              key={currency.id}
              onClick={() => {
                if (currency.id === exchangeFromCurrency.id) {
                  setExchangeFromCurrency(exchangeToCurrency);
                }
                setExchangeToCurrency(currency);
                setIsToCurrencySheetOpen(false);
              }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: spacing[3], padding: 0, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
              
              
            >
              <img src={getCurrencyFlag(currency.symbol)} alt={`Bandera ${currency.symbol}`} style={{ width: '40px', height: '40px', borderRadius: borderRadius.full, objectFit: 'cover', flexShrink: 0, marginTop: spacing[4], marginBottom: spacing[4] }} />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${spacing[4]} 0`, borderBottom: index < currencies.length - 1 ? `1px solid ${colors.semantic.border.light}` : 'none' }}>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0 }}>
                    {currency.name}
                  </p>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0, marginTop: spacing['0.5'] }}>
                    {currency.balance} {currency.symbol}
                  </p>
                </div>
                <div style={{ width: '24px', height: '24px', borderRadius: borderRadius.full, border: exchangeToCurrency.id === currency.id ? `2px solid ${colors.primary.main}` : `2px solid ${colors.semantic.border.medium}`, backgroundColor: exchangeToCurrency.id === currency.id ? colors.primary.main : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', flexShrink: 0 }}>
                  {exchangeToCurrency.id === currency.id && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L10 17L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}
