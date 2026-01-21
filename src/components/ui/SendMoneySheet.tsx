"use client";

import { useState, useEffect, useRef } from 'react';
import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';
import { BottomSheet } from './BottomSheet';
import { formatCurrency } from '../../lib/formatBalance';
import { useExchangeRates } from '../../hooks/useExchangeRates';

interface SendMoneySheetProps {
  isOpen: boolean;
  onClose: () => void;
  usdBalance: number;
  copBalance: number;
}

// Tipo para las monedas disponibles
interface CurrencyOption {
  id: string;
  name: string;
  symbol: string;
  balance: string;
}

// Tipo para moneda de destino (sin balance)
interface DestinationCurrency {
  id: string;
  name: string;
  symbol: string;
  country: string;
}

// Destinos populares
const popularDestinations: DestinationCurrency[] = [
  { id: 'usd', name: 'Dólar estadounidense', symbol: 'USD', country: 'US' },
  { id: 'eur', name: 'Euro', symbol: 'EUR', country: 'EU' },
  { id: 'cop', name: 'Peso colombiano', symbol: 'COP', country: 'CO' },
  { id: 'mxn', name: 'Peso mexicano', symbol: 'MXN', country: 'MX' },
  { id: 'pen', name: 'Sol peruano', symbol: 'PEN', country: 'PE' },
];

// Lista completa de monedas del mundo
const allWorldCurrencies: DestinationCurrency[] = [
  { id: 'aed', name: 'Dírham de los Emiratos Árabes', symbol: 'AED', country: 'AE' },
  { id: 'ars', name: 'Peso argentino', symbol: 'ARS', country: 'AR' },
  { id: 'aud', name: 'Dólar australiano', symbol: 'AUD', country: 'AU' },
  { id: 'brl', name: 'Real brasileño', symbol: 'BRL', country: 'BR' },
  { id: 'cad', name: 'Dólar canadiense', symbol: 'CAD', country: 'CA' },
  { id: 'chf', name: 'Franco suizo', symbol: 'CHF', country: 'CH' },
  { id: 'clp', name: 'Peso chileno', symbol: 'CLP', country: 'CL' },
  { id: 'cny', name: 'Yuan chino', symbol: 'CNY', country: 'CN' },
  { id: 'cop', name: 'Peso colombiano', symbol: 'COP', country: 'CO' },
  { id: 'dkk', name: 'Corona danesa', symbol: 'DKK', country: 'DK' },
  { id: 'eur', name: 'Euro', symbol: 'EUR', country: 'EU' },
  { id: 'gbp', name: 'Libra esterlina', symbol: 'GBP', country: 'GB' },
  { id: 'hkd', name: 'Dólar de Hong Kong', symbol: 'HKD', country: 'HK' },
  { id: 'inr', name: 'Rupia india', symbol: 'INR', country: 'IN' },
  { id: 'jpy', name: 'Yen japonés', symbol: 'JPY', country: 'JP' },
  { id: 'krw', name: 'Won surcoreano', symbol: 'KRW', country: 'KR' },
  { id: 'mxn', name: 'Peso mexicano', symbol: 'MXN', country: 'MX' },
  { id: 'nok', name: 'Corona noruega', symbol: 'NOK', country: 'NO' },
  { id: 'nzd', name: 'Dólar neozelandés', symbol: 'NZD', country: 'NZ' },
  { id: 'pen', name: 'Sol peruano', symbol: 'PEN', country: 'PE' },
  { id: 'pln', name: 'Złoty polaco', symbol: 'PLN', country: 'PL' },
  { id: 'sek', name: 'Corona sueca', symbol: 'SEK', country: 'SE' },
  { id: 'sgd', name: 'Dólar de Singapur', symbol: 'SGD', country: 'SG' },
  { id: 'thb', name: 'Baht tailandés', symbol: 'THB', country: 'TH' },
  { id: 'try', name: 'Lira turca', symbol: 'TRY', country: 'TR' },
  { id: 'twd', name: 'Nuevo dólar taiwanés', symbol: 'TWD', country: 'TW' },
  { id: 'usd', name: 'Dólar estadounidense', symbol: 'USD', country: 'US' },
  { id: 'uyu', name: 'Peso uruguayo', symbol: 'UYU', country: 'UY' },
  { id: 'zar', name: 'Rand sudafricano', symbol: 'ZAR', country: 'ZA' },
];

// Mapeo de países a monedas
const countryToCurrencyMap: Record<string, string[]> = {
  // Estados Unidos y dolarizados
  'estados unidos': ['usd'], 'usa': ['usd'], 'eeuu': ['usd'], 'america': ['usd'],
  'ecuador': ['usd'], 'el salvador': ['usd'], 'panama': ['usd'],
  // Europa
  'alemania': ['eur'], 'francia': ['eur'], 'españa': ['eur'], 'italia': ['eur'],
  'portugal': ['eur'], 'holanda': ['eur'], 'belgica': ['eur'], 'austria': ['eur'],
  'irlanda': ['eur'], 'grecia': ['eur'], 'finlandia': ['eur'],
  'reino unido': ['gbp'], 'inglaterra': ['gbp'], 'escocia': ['gbp'], 'gales': ['gbp'],
  'suiza': ['chf'],
  // Latinoamérica
  'colombia': ['cop'], 'mexico': ['mxn'], 'argentina': ['ars'], 'chile': ['clp'],
  'peru': ['pen'], 'brasil': ['brl'], 'uruguay': ['uyu'],
  // Asia
  'japon': ['jpy'], 'china': ['cny'], 'corea': ['krw'], 'india': ['inr'],
  'hong kong': ['hkd'], 'singapur': ['sgd'], 'tailandia': ['thb'], 'taiwan': ['twd'],
  // Otros
  'canada': ['cad'], 'australia': ['aud'], 'nueva zelanda': ['nzd'],
  'sudafrica': ['zar'], 'turquia': ['try'], 'emiratos': ['aed'],
  'dinamarca': ['dkk'], 'noruega': ['nok'], 'suecia': ['sek'], 'polonia': ['pln'],
};

// Función para obtener la bandera de una moneda (local SVG)
const getCurrencyFlag = (symbol: string): string => {
  const currencyToCountry: Record<string, string> = {
    'USD': 'US', 'EUR': 'EU', 'COP': 'CO', 'MXN': 'MX', 'PEN': 'PE',
    'ARS': 'AR', 'CLP': 'CL', 'BRL': 'BR', 'GBP': 'GB', 'JPY': 'JP',
    'CAD': 'CA', 'AUD': 'AU', 'CHF': 'CH', 'CNY': 'CN', 'INR': 'IN',
    'KRW': 'KR', 'HKD': 'HK', 'SGD': 'SG', 'NZD': 'NZ', 'SEK': 'SE',
    'NOK': 'NO', 'DKK': 'DK', 'PLN': 'PL', 'TRY': 'TR', 'ZAR': 'ZA',
    'THB': 'TH', 'TWD': 'TW', 'AED': 'AE', 'UYU': 'UY',
  };
  const countryCode = currencyToCountry[symbol] || 'US';
  return `/img/icons/country-flags/${countryCode}.svg`;
};

export function SendMoneySheet({ isOpen, onClose, usdBalance, copBalance }: SendMoneySheetProps) {
  const { getRate, convert, refreshRates } = useExchangeRates();
  
  // Monedas disponibles para enviar (con balance)
  const currencies: CurrencyOption[] = [
    { id: 'usd', name: 'Dólar estadounidense', symbol: 'USD', balance: formatCurrency(usdBalance, 'USD', false) },
    { id: 'cop', name: 'Peso colombiano', symbol: 'COP', balance: formatCurrency(copBalance, 'COP', false) },
  ];
  
  // Estados para el envío de dinero
  const [sendAmount, setSendAmount] = useState<string>('100');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [lastEditedField, setLastEditedField] = useState<'send' | 'receive'>('send');
  const [sendCurrency, setSendCurrency] = useState<CurrencyOption>(currencies[0]);
  const [receiveCurrency, setReceiveCurrency] = useState<DestinationCurrency>(
    { id: 'cop', name: 'Peso colombiano', symbol: 'COP', country: 'CO' }
  );
  
  // Estado para modales de selección de moneda
  const [isSendCurrencySheetOpen, setIsSendCurrencySheetOpen] = useState(false);
  const [isReceiveCurrencySheetOpen, setIsReceiveCurrencySheetOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  
  // Tasa de cambio
  const exchangeRate = getRate(sendCurrency.symbol, receiveCurrency.symbol);
  const [rateTimer, setRateTimer] = useState(60);
  
  // Refs para auto-escalar
  const sendInputRef = useRef<HTMLInputElement>(null);
  const receiveInputRef = useRef<HTMLInputElement>(null);
  const sendContainerRef = useRef<HTMLDivElement>(null);
  const receiveContainerRef = useRef<HTMLDivElement>(null);
  const [inputFontSize, setInputFontSize] = useState(36);
  
  const MIN_FONT_SIZE = 18;
  const MAX_FONT_SIZE = 36;
  
  // Límites de dígitos por moneda: COP = 10, USD = 7
  const getMaxDigits = (currency: string): number => {
    return currency === 'COP' ? 10 : 7;
  };
  
  // Actualizar currencies cuando cambien los balances
  useEffect(() => {
    const updatedSendCurrency = currencies.find(c => c.id === sendCurrency.id);
    if (updatedSendCurrency) {
      setSendCurrency(updatedSendCurrency);
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
  
  // Función para calcular el tamaño de fuente óptimo
  const calculateOptimalFontSizeForValue = (
    containerRef: React.RefObject<HTMLDivElement>,
    value: string
  ): number => {
    if (!containerRef.current) return MAX_FONT_SIZE;
    
    const containerWidth = containerRef.current.offsetWidth;
    const measureSpan = document.createElement('span');
    measureSpan.style.visibility = 'hidden';
    measureSpan.style.position = 'absolute';
    measureSpan.style.whiteSpace = 'nowrap';
    measureSpan.style.fontFamily = typography.fontFamily.sans.join(', ');
    measureSpan.style.fontWeight = String(typography.fontWeight.bold);
    measureSpan.style.letterSpacing = '-0.04em';
    measureSpan.textContent = value || '0';
    document.body.appendChild(measureSpan);
    
    let newSize = MAX_FONT_SIZE;
    
    while (newSize >= MIN_FONT_SIZE) {
      measureSpan.style.fontSize = `${newSize}px`;
      if (measureSpan.offsetWidth <= containerWidth - 10) {
        break;
      }
      newSize -= 2;
    }
    
    document.body.removeChild(measureSpan);
    return Math.max(newSize, MIN_FONT_SIZE);
  };
  
  // Efecto para ajustar tamaño de fuente
  useEffect(() => {
    const sendDisplayValue = lastEditedField === 'send' 
      ? sendAmount 
      : formatCurrency(calculateSendAmount(), sendCurrency.symbol as 'USD' | 'COP', false);
    
    const receiveDisplayValue = lastEditedField === 'receive' 
      ? receiveAmount 
      : formatCurrency(calculateReceiveAmount(), receiveCurrency.symbol as 'USD' | 'COP', false);
    
    const sendOptimalSize = calculateOptimalFontSizeForValue(sendContainerRef, sendDisplayValue);
    const receiveOptimalSize = calculateOptimalFontSizeForValue(receiveContainerRef, receiveDisplayValue);
    
    const unifiedSize = Math.min(sendOptimalSize, receiveOptimalSize);
    
    if (unifiedSize !== inputFontSize) {
      setInputFontSize(unifiedSize);
    }
  }, [sendAmount, receiveAmount, lastEditedField, sendCurrency.symbol, receiveCurrency.symbol, exchangeRate, isOpen]);
  
  // Parsear valor formateado a número
  const parseFormattedValue = (value: string): number => {
    if (!value) return 0;
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  };
  
  // Calcular montos
  const calculateReceiveAmount = () => {
    const amount = parseFormattedValue(sendAmount);
    if (sendCurrency.symbol === receiveCurrency.symbol) {
      return amount;
    }
    return convert(amount, sendCurrency.symbol, receiveCurrency.symbol);
  };
  
  const calculateSendAmount = () => {
    const amount = parseFormattedValue(receiveAmount);
    if (sendCurrency.symbol === receiveCurrency.symbol) {
      return amount;
    }
    return convert(amount, receiveCurrency.symbol, sendCurrency.symbol);
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
    let cleanValue = value.replace(/[^\d.,]/g, '');
    cleanValue = cleanValue.replace('.', ',');
    
    const commaCount = (cleanValue.match(/,/g) || []).length;
    if (commaCount > 1) {
      const firstCommaIndex = cleanValue.indexOf(',');
      cleanValue = cleanValue.slice(0, firstCommaIndex + 1) + cleanValue.slice(firstCommaIndex + 1).replace(/,/g, '');
    }
    
    const parts = cleanValue.split(',');
    let integerPart = parts[0].replace(/\./g, '');
    
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
  
  // Handlers para los inputs
  const handleSendAmountChange = (value: string) => {
    const validated = validateAmount(value, sendCurrency);
    setSendAmount(validated);
    setLastEditedField('send');
    setReceiveAmount('');
  };
  
  const handleReceiveAmountChange = (value: string) => {
    const validated = validateAmount(value, receiveCurrency);
    setReceiveAmount(validated);
    setLastEditedField('receive');
    setSendAmount('');
  };
  
  // Intercambiar monedas
  const swapCurrencies = () => {
    const matchingCurrency = currencies.find(c => c.symbol === receiveCurrency.symbol);
    if (matchingCurrency) {
      const tempSend = sendCurrency;
      setSendCurrency(matchingCurrency);
      setReceiveCurrency({ 
        id: tempSend.id, 
        name: tempSend.name, 
        symbol: tempSend.symbol, 
        country: tempSend.symbol === 'USD' ? 'US' : 'CO' 
      });
    }
  };
  
  // Buscar monedas por país
  const searchCurrenciesByCountry = (searchTerm: string): string[] => {
    const normalizedSearch = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const matchedIds: string[] = [];
    
    for (const [country, currencyIds] of Object.entries(countryToCurrencyMap)) {
      const normalizedCountry = country.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalizedCountry.includes(normalizedSearch)) {
        matchedIds.push(...currencyIds);
      }
    }
    
    return [...new Set(matchedIds)];
  };
  
  // Filtrar monedas
  const normalizedSearch = currencySearch.toLowerCase().trim();
  const countryMatchedIds = searchCurrenciesByCountry(normalizedSearch);
  
  const filteredPopular = popularDestinations.filter(currency => {
    if (!normalizedSearch) return true;
    const matchesDirect = currency.name.toLowerCase().includes(normalizedSearch) ||
                         currency.symbol.toLowerCase().includes(normalizedSearch);
    const matchesCountry = countryMatchedIds.includes(currency.id);
    return matchesDirect || matchesCountry;
  });
  
  const filteredOther = allWorldCurrencies
    .filter(currency => !popularDestinations.some(p => p.id === currency.id))
    .filter(currency => {
      if (!normalizedSearch) return true;
      const matchesDirect = currency.name.toLowerCase().includes(normalizedSearch) ||
                           currency.symbol.toLowerCase().includes(normalizedSearch);
      const matchesCountry = countryMatchedIds.includes(currency.id);
      return matchesDirect || matchesCountry;
    });

  return (
    <>
      {/* Bottom Sheet Principal - Enviar Dinero */}
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Enviar dinero"
        maxHeight={96}
        showGraber={true}
        zIndex={1050}
        rightIcon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke={colors.semantic.text.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        onRightIconClick={onClose}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4], paddingBottom: spacing[8], marginTop: '1.5rem' }}>
          {/* Contenedor de inputs con swap button */}
          <div>
            {/* Sección: Tú envías */}
            <div style={{ backgroundColor: colors.semantic.background.main, borderRadius: '24px', padding: spacing[6] }}>
              <p style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', '), marginBottom: spacing[2] }}>
                Tú envías
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
                <button
                  onClick={() => setIsSendCurrencySheetOpen(true)}
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
                  <img src={getCurrencyFlag(sendCurrency.symbol)} alt={sendCurrency.name} style={{ width: '24px', height: '24px', borderRadius: borderRadius.full, objectFit: 'cover' }} />
                  <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
                    {sendCurrency.symbol}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke={colors.semantic.text.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                
                <div ref={sendContainerRef} style={{ flex: 1, overflow: 'hidden' }}>
                  <input
                    ref={sendInputRef}
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={lastEditedField === 'send' ? sendAmount : formatCurrency(calculateSendAmount(), sendCurrency.symbol as 'USD' | 'COP', false)}
                    onChange={(e) => handleSendAmountChange(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: `${inputFontSize}px`,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.semantic.text.primary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: 0,
                      letterSpacing: '-0.04em',
                      transition: 'font-size 0.15s ease-out',
                      WebkitAppearance: 'none',
                      MozAppearance: 'textfield',
                      textAlign: 'right',
                    }}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing[3] }}>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0 }}>
                  Saldo disponible: <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary }}>
                    {sendCurrency.symbol === 'USD' 
                      ? formatCurrency(usdBalance, 'USD', false) 
                      : formatCurrency(copBalance, 'COP', false)} {sendCurrency.symbol}
                  </span>
                </p>
              </div>
              <p style={{ fontSize: typography.fontSize.xs, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0, marginTop: spacing[1] }}>
                {sendCurrency.symbol === 'USD' 
                  ? 'Mín. 10 USD · Máx. 5.000 USD'
                  : `Mín. ${formatCurrency(10 * getRate('USD', 'COP'), 'COP', false)} COP · Máx. ${formatCurrency(5000 * getRate('USD', 'COP'), 'COP', false)} COP`
                }
              </p>
            </div>

            {/* Botón de intercambiar monedas */}
            <div style={{ display: 'flex', justifyContent: 'center', height: spacing[2], position: 'relative', zIndex: 10 }}>
              <button
                onClick={swapCurrencies}
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
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
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

            {/* Sección: Destinatario recibe */}
            <div style={{ backgroundColor: colors.semantic.background.main, borderRadius: '24px', padding: spacing[6] }}>
              <p style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', '), marginBottom: spacing[2] }}>
                Destinatario recibe
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
                <button
                  onClick={() => setIsReceiveCurrencySheetOpen(true)}
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
                  <img src={getCurrencyFlag(receiveCurrency.symbol)} alt={receiveCurrency.name} style={{ width: '24px', height: '24px', borderRadius: borderRadius.full, objectFit: 'cover' }} />
                  <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
                    {receiveCurrency.symbol}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke={colors.semantic.text.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                
                <div ref={receiveContainerRef} style={{ flex: 1, overflow: 'hidden' }}>
                  <input
                    ref={receiveInputRef}
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={lastEditedField === 'receive' ? receiveAmount : formatCurrency(calculateReceiveAmount(), receiveCurrency.symbol as 'USD' | 'COP', false)}
                    onChange={(e) => handleReceiveAmountChange(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: `${inputFontSize}px`,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.semantic.text.primary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: 0,
                      letterSpacing: '-0.04em',
                      transition: 'font-size 0.15s ease-out',
                      WebkitAppearance: 'none',
                      MozAppearance: 'textfield',
                      textAlign: 'right',
                    }}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resumen con tasa de cambio */}
          <div style={{ backgroundColor: 'rgb(110 147 221 / 12%)', border: '1px solid rgb(110 147 221 / 20%)', borderRadius: '24px', padding: spacing[6], marginTop: spacing[2] }}>
            <p style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', '), marginBottom: spacing[3] }}>
              Resumen de conversión
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[2] }}>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
                Tasa de cambio
              </span>
              <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
                {exchangeRate >= 1 
                  ? `1 ${sendCurrency.symbol} = ${formatCurrency(exchangeRate, receiveCurrency.symbol, false)} ${receiveCurrency.symbol}`
                  : `1 ${receiveCurrency.symbol} = ${formatCurrency(1 / exchangeRate, sendCurrency.symbol, false)} ${sendCurrency.symbol}`
                }
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', ') }}>
                Válido por
              </span>
              <span style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: '#92400E', fontFamily: typography.fontFamily.sans.join(', '), backgroundColor: '#FEF3C7', padding: `${spacing[1]} ${spacing[2]}`, borderRadius: borderRadius.full }}>
                {rateTimer}s
              </span>
            </div>
          </div>

          {/* Botón Continuar */}
          <button
            onClick={() => {
              console.log('Continuar envío:', { amount: sendAmount, sendCurrency: sendCurrency.symbol, receiveCurrency: receiveCurrency.symbol, receiveAmount: calculateReceiveAmount() });
            }}
            style={{
              width: '100%',
              padding: spacing[4],
              backgroundColor: colors.semantic.button.primary,
              borderRadius: borderRadius.full,
              border: 'none',
              cursor: 'pointer',
              marginTop: spacing[4],
              transition: 'background-color 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.semantic.button.primaryHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.semantic.button.primary; }}
            onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onPointerUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            onPointerLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: 'white', fontFamily: typography.fontFamily.sans.join(', ') }}>
              Continuar
            </span>
          </button>
        </div>
      </BottomSheet>

      {/* Bottom Sheet - Seleccionar moneda de envío */}
      <BottomSheet
        isOpen={isSendCurrencySheetOpen}
        onClose={() => setIsSendCurrencySheetOpen(false)}
        title="Moneda a enviar"
        showGraber={true}
        zIndex={1100}
        rightIcon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke={colors.semantic.text.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        onRightIconClick={() => setIsSendCurrencySheetOpen(false)}
      >
        <div style={{ padding: 0 }}>
          {currencies.map((currency, index) => (
            <button
              key={currency.id}
              onClick={() => {
                setSendCurrency(currency);
                setIsSendCurrencySheetOpen(false);
              }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: spacing[3], padding: 0, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
              
              
            >
              <img src={getCurrencyFlag(currency.symbol)} alt={`Bandera ${currency.symbol}`} style={{ width: '40px', height: '40px', borderRadius: borderRadius.full, objectFit: 'cover', flexShrink: 0, marginTop: spacing[4], marginBottom: spacing[4] }} />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${spacing[4]} 0`, borderBottom: index < currencies.length - 1 ? `1px solid ${colors.semantic.border.light}` : 'none' }}>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0 }}>
                    {currency.name}
                  </p>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0, marginTop: spacing[1] }}>
                    {currency.balance} {currency.symbol}
                  </p>
                </div>
                <div style={{ width: '24px', height: '24px', borderRadius: borderRadius.full, border: sendCurrency.id === currency.id ? `2px solid ${colors.primary.main}` : `2px solid ${colors.semantic.border.medium}`, backgroundColor: sendCurrency.id === currency.id ? colors.primary.main : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {sendCurrency.id === currency.id && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Bottom Sheet - Seleccionar moneda de destino */}
      <BottomSheet
        isOpen={isReceiveCurrencySheetOpen}
        onClose={() => { setIsReceiveCurrencySheetOpen(false); setCurrencySearch(''); }}
        title="Moneda de destino"
        maxHeight={96}
        showGraber={true}
        zIndex={1100}
        fullScreen={true}
        rightIcon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke={colors.semantic.text.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        onRightIconClick={() => { setIsReceiveCurrencySheetOpen(false); setCurrencySearch(''); }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Barra de búsqueda - fija */}
          <div style={{ flexShrink: 0, backgroundColor: colors.semantic.background.white, paddingBottom: spacing[4] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], backgroundColor: colors.semantic.background.main, borderRadius: borderRadius.full, padding: `${spacing[3]} ${spacing[4]}` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke={colors.semantic.text.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
                placeholder="Buscar moneda o país..."
                style={{ flex: 1, fontSize: typography.fontSize.base, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', '), backgroundColor: 'transparent', border: 'none', outline: 'none', padding: 0 }}
              />
              {currencySearch && (
                <button onClick={() => setCurrencySearch('')} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke={colors.semantic.text.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Lista de monedas - scrolleable */}
          <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingBottom: `calc(${spacing[8]} + env(safe-area-inset-bottom))` }}>
            {/* Destinos populares */}
            {filteredPopular.length > 0 && (
              <>
                <p style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), marginBottom: spacing[2], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Destinos populares
                </p>
                {filteredPopular.map((currency, index) => (
                  <button
                    key={currency.id}
                    onClick={() => {
                      setReceiveCurrency(currency);
                      setIsReceiveCurrencySheetOpen(false);
                      setCurrencySearch('');
                    }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: spacing[3], padding: 0, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    
                    
                  >
                    <img src={getCurrencyFlag(currency.symbol)} alt={`Bandera ${currency.symbol}`} style={{ width: '40px', height: '40px', borderRadius: borderRadius.full, objectFit: 'cover', flexShrink: 0, marginTop: spacing[3], marginBottom: spacing[3] }} />
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${spacing[3]} 0`, borderBottom: index < filteredPopular.length - 1 ? `1px solid ${colors.semantic.border.light}` : 'none' }}>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0 }}>
                          {currency.name}
                        </p>
                        <p style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0, marginTop: spacing[1] }}>
                          {currency.symbol}
                        </p>
                      </div>
                      <div style={{ width: '24px', height: '24px', borderRadius: borderRadius.full, border: receiveCurrency.id === currency.id ? `2px solid ${colors.primary.main}` : `2px solid ${colors.semantic.border.medium}`, backgroundColor: receiveCurrency.id === currency.id ? colors.primary.main : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {receiveCurrency.id === currency.id && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Todas las monedas */}
            {filteredOther.length > 0 && (
              <>
                <p style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), marginBottom: spacing[2], marginTop: spacing[6], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Todas las monedas
                </p>
                {filteredOther.map((currency, index) => (
                  <button
                    key={currency.id}
                    onClick={() => {
                      setReceiveCurrency(currency);
                      setIsReceiveCurrencySheetOpen(false);
                      setCurrencySearch('');
                    }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: spacing[3], padding: 0, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    
                    
                  >
                    <img src={getCurrencyFlag(currency.symbol)} alt={`Bandera ${currency.symbol}`} style={{ width: '40px', height: '40px', borderRadius: borderRadius.full, objectFit: 'cover', flexShrink: 0, marginTop: spacing[3], marginBottom: spacing[3] }} />
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${spacing[3]} 0`, borderBottom: index < filteredOther.length - 1 ? `1px solid ${colors.semantic.border.light}` : 'none' }}>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, color: colors.semantic.text.primary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0 }}>
                          {currency.name}
                        </p>
                        <p style={{ fontSize: typography.fontSize.sm, color: colors.semantic.text.secondary, fontFamily: typography.fontFamily.sans.join(', '), margin: 0, marginTop: spacing[1] }}>
                          {currency.symbol}
                        </p>
                      </div>
                      <div style={{ width: '24px', height: '24px', borderRadius: borderRadius.full, border: receiveCurrency.id === currency.id ? `2px solid ${colors.primary.main}` : `2px solid ${colors.semantic.border.medium}`, backgroundColor: receiveCurrency.id === currency.id ? colors.primary.main : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {receiveCurrency.id === currency.id && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
