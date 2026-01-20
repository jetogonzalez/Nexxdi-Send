"use client";

import { useState, useEffect, useRef } from 'react';
import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';
import { BottomSheet } from '../ui/BottomSheet';
import { SliderToBlock } from '../ui/SliderToBlock';
import { formatCurrency } from '../../lib/formatBalance';
import { RecentMovements } from './RecentMovements';
import { useMovements } from '../../hooks/useMovements';
import { useBalances } from '../../hooks/useBalances';
import { useExchangeRates } from '../../hooks/useExchangeRates';

interface CashViewProps {
  isBalanceVisible?: boolean;
  usdBalance?: number;
  copBalance?: number;
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
// PAÍSES EXCLUIDOS (alto riesgo para transferencias financieras internacionales):
// - Venezuela (VES) - Sanciones OFAC
// - Rusia (RUB) - Sanciones UE/OFAC
// - Corea del Norte (KPW) - Sanciones ONU
// - Irán (IRR) - Sanciones OFAC
// - Siria (SYP) - Sanciones ONU/OFAC
// - Cuba (CUP) - Sanciones OFAC
// - Belarus (BYN) - Sanciones UE/OFAC
// - Myanmar/Birmania (MMK) - Sanciones OFAC
// - Afganistán (AFN) - FATF lista negra, control talibán
// - Somalia (SOS) - FATF, Al-Shabaab
// - Yemen (YER) - Guerra civil, sanciones Houthi
// - Sudán del Sur (SSP) - Sanciones ONU, guerra civil
// - Libia (LYD) - Sanciones ONU, guerra civil
// - Líbano (LBP) - Crisis financiera, sanciones Hezbollah
// - Iraq (IQD) - Alto riesgo, sanciones parciales
// - Eritrea (ERN) - Sanciones ONU
// - Zimbabwe (ZWL) - Sanciones, hiperinflación
// - Congo (CDF) - Zona de conflicto
// - Burundi (BIF) - Inestabilidad política
// - Rep. Centroafricana (XAF parcial) - Sanciones ONU
// - Nicaragua (NIO) - Sanciones OFAC (régimen Ortega)
const allWorldCurrencies: DestinationCurrency[] = [
  // A
  { id: 'aed', name: 'Dírham de los Emiratos Árabes', symbol: 'AED', country: 'AE' },
  { id: 'all', name: 'Lek albanés', symbol: 'ALL', country: 'AL' },
  { id: 'amd', name: 'Dram armenio', symbol: 'AMD', country: 'AM' },
  { id: 'ang', name: 'Florín antillano neerlandés', symbol: 'ANG', country: 'CW' },
  { id: 'aoa', name: 'Kwanza angoleño', symbol: 'AOA', country: 'AO' },
  { id: 'ars', name: 'Peso argentino', symbol: 'ARS', country: 'AR' },
  { id: 'aud', name: 'Dólar australiano', symbol: 'AUD', country: 'AU' },
  { id: 'awg', name: 'Florín arubeño', symbol: 'AWG', country: 'AW' },
  { id: 'azn', name: 'Manat azerbaiyano', symbol: 'AZN', country: 'AZ' },
  // B
  { id: 'bam', name: 'Marco convertible de Bosnia', symbol: 'BAM', country: 'BA' },
  { id: 'bbd', name: 'Dólar de Barbados', symbol: 'BBD', country: 'BB' },
  { id: 'bdt', name: 'Taka bangladesí', symbol: 'BDT', country: 'BD' },
  { id: 'bgn', name: 'Lev búlgaro', symbol: 'BGN', country: 'BG' },
  { id: 'bhd', name: 'Dinar bahreiní', symbol: 'BHD', country: 'BH' },
  { id: 'bmd', name: 'Dólar bermudeño', symbol: 'BMD', country: 'BM' },
  { id: 'bnd', name: 'Dólar de Brunéi', symbol: 'BND', country: 'BN' },
  { id: 'bob', name: 'Boliviano', symbol: 'BOB', country: 'BO' },
  { id: 'brl', name: 'Real brasileño', symbol: 'BRL', country: 'BR' },
  { id: 'bsd', name: 'Dólar bahameño', symbol: 'BSD', country: 'BS' },
  { id: 'btn', name: 'Ngultrum butanés', symbol: 'BTN', country: 'BT' },
  { id: 'bwp', name: 'Pula botsuano', symbol: 'BWP', country: 'BW' },
  { id: 'bzd', name: 'Dólar beliceño', symbol: 'BZD', country: 'BZ' },
  // C
  { id: 'cad', name: 'Dólar canadiense', symbol: 'CAD', country: 'CA' },
  { id: 'chf', name: 'Franco suizo', symbol: 'CHF', country: 'CH' },
  { id: 'clp', name: 'Peso chileno', symbol: 'CLP', country: 'CL' },
  { id: 'cny', name: 'Yuan chino', symbol: 'CNY', country: 'CN' },
  { id: 'cop', name: 'Peso colombiano', symbol: 'COP', country: 'CO' },
  { id: 'crc', name: 'Colón costarricense', symbol: 'CRC', country: 'CR' },
  { id: 'czk', name: 'Corona checa', symbol: 'CZK', country: 'CZ' },
  // D
  { id: 'djf', name: 'Franco yibutiano', symbol: 'DJF', country: 'DJ' },
  { id: 'dkk', name: 'Corona danesa', symbol: 'DKK', country: 'DK' },
  { id: 'dop', name: 'Peso dominicano', symbol: 'DOP', country: 'DO' },
  { id: 'dzd', name: 'Dinar argelino', symbol: 'DZD', country: 'DZ' },
  // E
  { id: 'egp', name: 'Libra egipcia', symbol: 'EGP', country: 'EG' },
  { id: 'etb', name: 'Birr etíope', symbol: 'ETB', country: 'ET' },
  { id: 'eur', name: 'Euro', symbol: 'EUR', country: 'EU' },
  // F
  { id: 'fjd', name: 'Dólar fiyiano', symbol: 'FJD', country: 'FJ' },
  { id: 'fkp', name: 'Libra malvinense', symbol: 'FKP', country: 'FK' },
  // G
  { id: 'gbp', name: 'Libra esterlina', symbol: 'GBP', country: 'GB' },
  { id: 'gel', name: 'Lari georgiano', symbol: 'GEL', country: 'GE' },
  { id: 'ghs', name: 'Cedi ghanés', symbol: 'GHS', country: 'GH' },
  { id: 'gip', name: 'Libra de Gibraltar', symbol: 'GIP', country: 'GI' },
  { id: 'gmd', name: 'Dalasi gambiano', symbol: 'GMD', country: 'GM' },
  { id: 'gtq', name: 'Quetzal guatemalteco', symbol: 'GTQ', country: 'GT' },
  { id: 'gyd', name: 'Dólar guyanés', symbol: 'GYD', country: 'GY' },
  // H
  { id: 'hkd', name: 'Dólar de Hong Kong', symbol: 'HKD', country: 'HK' },
  { id: 'hnl', name: 'Lempira hondureño', symbol: 'HNL', country: 'HN' },
  { id: 'hrk', name: 'Kuna croata', symbol: 'HRK', country: 'HR' },
  { id: 'htg', name: 'Gourde haitiano', symbol: 'HTG', country: 'HT' },
  { id: 'huf', name: 'Florín húngaro', symbol: 'HUF', country: 'HU' },
  // I
  { id: 'idr', name: 'Rupia indonesia', symbol: 'IDR', country: 'ID' },
  { id: 'ils', name: 'Nuevo shekel israelí', symbol: 'ILS', country: 'IL' },
  { id: 'inr', name: 'Rupia india', symbol: 'INR', country: 'IN' },
  { id: 'isk', name: 'Corona islandesa', symbol: 'ISK', country: 'IS' },
  // J
  { id: 'jmd', name: 'Dólar jamaiquino', symbol: 'JMD', country: 'JM' },
  { id: 'jod', name: 'Dinar jordano', symbol: 'JOD', country: 'JO' },
  { id: 'jpy', name: 'Yen japonés', symbol: 'JPY', country: 'JP' },
  // K
  { id: 'kes', name: 'Chelín keniano', symbol: 'KES', country: 'KE' },
  { id: 'kgs', name: 'Som kirguís', symbol: 'KGS', country: 'KG' },
  { id: 'khr', name: 'Riel camboyano', symbol: 'KHR', country: 'KH' },
  { id: 'kmf', name: 'Franco comorense', symbol: 'KMF', country: 'KM' },
  { id: 'krw', name: 'Won surcoreano', symbol: 'KRW', country: 'KR' },
  { id: 'kwd', name: 'Dinar kuwaití', symbol: 'KWD', country: 'KW' },
  { id: 'kyd', name: 'Dólar de las Islas Caimán', symbol: 'KYD', country: 'KY' },
  { id: 'kzt', name: 'Tenge kazajo', symbol: 'KZT', country: 'KZ' },
  // L
  { id: 'lak', name: 'Kip laosiano', symbol: 'LAK', country: 'LA' },
  { id: 'lkr', name: 'Rupia de Sri Lanka', symbol: 'LKR', country: 'LK' },
  { id: 'lrd', name: 'Dólar liberiano', symbol: 'LRD', country: 'LR' },
  { id: 'lsl', name: 'Loti lesotense', symbol: 'LSL', country: 'LS' },
  // M
  { id: 'mad', name: 'Dírham marroquí', symbol: 'MAD', country: 'MA' },
  { id: 'mdl', name: 'Leu moldavo', symbol: 'MDL', country: 'MD' },
  { id: 'mga', name: 'Ariary malgache', symbol: 'MGA', country: 'MG' },
  { id: 'mkd', name: 'Denar macedonio', symbol: 'MKD', country: 'MK' },
  { id: 'mnt', name: 'Tugrik mongol', symbol: 'MNT', country: 'MN' },
  { id: 'mop', name: 'Pataca de Macao', symbol: 'MOP', country: 'MO' },
  { id: 'mru', name: 'Uguiya mauritano', symbol: 'MRU', country: 'MR' },
  { id: 'mur', name: 'Rupia mauriciana', symbol: 'MUR', country: 'MU' },
  { id: 'mvr', name: 'Rufiyaa maldiva', symbol: 'MVR', country: 'MV' },
  { id: 'mwk', name: 'Kwacha malauí', symbol: 'MWK', country: 'MW' },
  { id: 'mxn', name: 'Peso mexicano', symbol: 'MXN', country: 'MX' },
  { id: 'myr', name: 'Ringgit malayo', symbol: 'MYR', country: 'MY' },
  { id: 'mzn', name: 'Metical mozambiqueño', symbol: 'MZN', country: 'MZ' },
  // N
  { id: 'nad', name: 'Dólar namibio', symbol: 'NAD', country: 'NA' },
  { id: 'ngn', name: 'Naira nigeriano', symbol: 'NGN', country: 'NG' },
  { id: 'nok', name: 'Corona noruega', symbol: 'NOK', country: 'NO' },
  { id: 'npr', name: 'Rupia nepalí', symbol: 'NPR', country: 'NP' },
  { id: 'nzd', name: 'Dólar neozelandés', symbol: 'NZD', country: 'NZ' },
  // O
  { id: 'omr', name: 'Rial omaní', symbol: 'OMR', country: 'OM' },
  // P
  { id: 'pab', name: 'Balboa panameño', symbol: 'PAB', country: 'PA' },
  { id: 'pen', name: 'Sol peruano', symbol: 'PEN', country: 'PE' },
  { id: 'pgk', name: 'Kina de Papúa Nueva Guinea', symbol: 'PGK', country: 'PG' },
  { id: 'php', name: 'Peso filipino', symbol: 'PHP', country: 'PH' },
  { id: 'pkr', name: 'Rupia pakistaní', symbol: 'PKR', country: 'PK' },
  { id: 'pln', name: 'Zloty polaco', symbol: 'PLN', country: 'PL' },
  { id: 'pyg', name: 'Guaraní paraguayo', symbol: 'PYG', country: 'PY' },
  // Q
  { id: 'qar', name: 'Riyal catarí', symbol: 'QAR', country: 'QA' },
  // R
  { id: 'ron', name: 'Leu rumano', symbol: 'RON', country: 'RO' },
  { id: 'rsd', name: 'Dinar serbio', symbol: 'RSD', country: 'RS' },
  { id: 'rwf', name: 'Franco ruandés', symbol: 'RWF', country: 'RW' },
  // S
  { id: 'sar', name: 'Riyal saudí', symbol: 'SAR', country: 'SA' },
  { id: 'sbd', name: 'Dólar de las Islas Salomón', symbol: 'SBD', country: 'SB' },
  { id: 'scr', name: 'Rupia de Seychelles', symbol: 'SCR', country: 'SC' },
  { id: 'sek', name: 'Corona sueca', symbol: 'SEK', country: 'SE' },
  { id: 'sgd', name: 'Dólar de Singapur', symbol: 'SGD', country: 'SG' },
  { id: 'shp', name: 'Libra de Santa Helena', symbol: 'SHP', country: 'SH' },
  { id: 'sle', name: 'Leone de Sierra Leona', symbol: 'SLE', country: 'SL' },
  { id: 'srd', name: 'Dólar surinamés', symbol: 'SRD', country: 'SR' },
  { id: 'std', name: 'Dobra santotomense', symbol: 'STD', country: 'ST' },
  { id: 'svc', name: 'Colón salvadoreño', symbol: 'SVC', country: 'SV' },
  { id: 'szl', name: 'Lilangeni suazi', symbol: 'SZL', country: 'SZ' },
  // T
  { id: 'thb', name: 'Baht tailandés', symbol: 'THB', country: 'TH' },
  { id: 'tjs', name: 'Somoni tayiko', symbol: 'TJS', country: 'TJ' },
  { id: 'tmt', name: 'Manat turcomano', symbol: 'TMT', country: 'TM' },
  { id: 'tnd', name: 'Dinar tunecino', symbol: 'TND', country: 'TN' },
  { id: 'top', name: 'Paʻanga tongano', symbol: 'TOP', country: 'TO' },
  { id: 'try', name: 'Lira turca', symbol: 'TRY', country: 'TR' },
  { id: 'ttd', name: 'Dólar de Trinidad y Tobago', symbol: 'TTD', country: 'TT' },
  { id: 'twd', name: 'Nuevo dólar taiwanés', symbol: 'TWD', country: 'TW' },
  { id: 'tzs', name: 'Chelín tanzano', symbol: 'TZS', country: 'TZ' },
  // U
  { id: 'uah', name: 'Grivna ucraniana', symbol: 'UAH', country: 'UA' },
  { id: 'ugx', name: 'Chelín ugandés', symbol: 'UGX', country: 'UG' },
  { id: 'usd', name: 'Dólar estadounidense', symbol: 'USD', country: 'US' },
  { id: 'uyu', name: 'Peso uruguayo', symbol: 'UYU', country: 'UY' },
  { id: 'uzs', name: 'Som uzbeko', symbol: 'UZS', country: 'UZ' },
  // V
  { id: 'vnd', name: 'Dong vietnamita', symbol: 'VND', country: 'VN' },
  { id: 'vuv', name: 'Vatu vanuatuense', symbol: 'VUV', country: 'VU' },
  // W
  { id: 'wst', name: 'Tala samoano', symbol: 'WST', country: 'WS' },
  // X
  { id: 'xcd', name: 'Dólar del Caribe Oriental', symbol: 'XCD', country: 'AG' },
  { id: 'xof', name: 'Franco CFA de África Occidental', symbol: 'XOF', country: 'SN' },
  { id: 'xpf', name: 'Franco CFP', symbol: 'XPF', country: 'PF' },
  // Z
  { id: 'zar', name: 'Rand sudafricano', symbol: 'ZAR', country: 'ZA' },
  { id: 'zmw', name: 'Kwacha zambiano', symbol: 'ZMW', country: 'ZM' },
].sort((a, b) => a.name.localeCompare(b.name, 'es'));

// Mapeo de países a sus monedas (para búsqueda por nombre de país)
// Incluye países que usan monedas extranjeras (ej: Ecuador usa USD, Eurozona usa EUR)
const countryToCurrencyMap: Record<string, string[]> = {
  // Países que usan USD
  'ecuador': ['usd'],
  'el salvador': ['usd'],
  'panamá': ['usd', 'pab'],
  'panama': ['usd', 'pab'],
  'estados unidos': ['usd'],
  'united states': ['usd'],
  'usa': ['usd'],
  'puerto rico': ['usd'],
  'islas vírgenes': ['usd'],
  'guam': ['usd'],
  'timor oriental': ['usd'],
  'palau': ['usd'],
  'micronesia': ['usd'],
  'islas marshall': ['usd'],
  'zimbabue': ['usd'], // Usa USD oficialmente
  
  // Países de la Eurozona
  'alemania': ['eur'],
  'germany': ['eur'],
  'francia': ['eur'],
  'france': ['eur'],
  'italia': ['eur'],
  'italy': ['eur'],
  'españa': ['eur'],
  'spain': ['eur'],
  'portugal': ['eur'],
  'países bajos': ['eur'],
  'holanda': ['eur'],
  'netherlands': ['eur'],
  'bélgica': ['eur'],
  'belgium': ['eur'],
  'austria': ['eur'],
  'grecia': ['eur'],
  'greece': ['eur'],
  'irlanda': ['eur'],
  'ireland': ['eur'],
  'finlandia': ['eur'],
  'finland': ['eur'],
  'luxemburgo': ['eur'],
  'luxembourg': ['eur'],
  'eslovenia': ['eur'],
  'slovenia': ['eur'],
  'eslovaquia': ['eur'],
  'slovakia': ['eur'],
  'estonia': ['eur'],
  'letonia': ['eur'],
  'latvia': ['eur'],
  'lituania': ['eur'],
  'lithuania': ['eur'],
  'chipre': ['eur'],
  'cyprus': ['eur'],
  'malta': ['eur'],
  'croacia': ['eur'],
  'croatia': ['eur'],
  'andorra': ['eur'],
  'mónaco': ['eur'],
  'monaco': ['eur'],
  'san marino': ['eur'],
  'vaticano': ['eur'],
  'kosovo': ['eur'],
  'montenegro': ['eur'],
  
  // Países latinoamericanos (nombre español → moneda)
  'argentina': ['ars'],
  'brasil': ['brl'],
  'brazil': ['brl'],
  'chile': ['clp'],
  'colombia': ['cop'],
  'perú': ['pen'],
  'peru': ['pen'],
  'méxico': ['mxn'],
  'mexico': ['mxn'],
  'uruguay': ['uyu'],
  'paraguay': ['pyg'],
  'bolivia': ['bob'],
  'venezuela': ['ves'], // Aunque está bloqueado
  'costa rica': ['crc'],
  'guatemala': ['gtq'],
  'honduras': ['hnl'],
  'república dominicana': ['dop'],
  'dominican republic': ['dop'],
  'cuba': ['cup'],
  'jamaica': ['jmd'],
  'haití': ['htg'],
  'haiti': ['htg'],
  'nicaragua': ['nio'],
  'belice': ['bzd'],
  'belize': ['bzd'],
  'guyana': ['gyd'],
  'surinam': ['srd'],
  'suriname': ['srd'],
  'trinidad y tobago': ['ttd'],
  'trinidad': ['ttd'],
  'barbados': ['bbd'],
  'bahamas': ['bsd'],
  
  // Europa (fuera del Euro)
  'reino unido': ['gbp'],
  'united kingdom': ['gbp'],
  'uk': ['gbp'],
  'gran bretaña': ['gbp'],
  'inglaterra': ['gbp'],
  'england': ['gbp'],
  'escocia': ['gbp'],
  'scotland': ['gbp'],
  'gales': ['gbp'],
  'wales': ['gbp'],
  'suiza': ['chf'],
  'switzerland': ['chf'],
  'noruega': ['nok'],
  'norway': ['nok'],
  'suecia': ['sek'],
  'sweden': ['sek'],
  'dinamarca': ['dkk'],
  'denmark': ['dkk'],
  'polonia': ['pln'],
  'poland': ['pln'],
  'república checa': ['czk'],
  'czech republic': ['czk'],
  'chequia': ['czk'],
  'hungría': ['huf'],
  'hungary': ['huf'],
  'rumania': ['ron'],
  'romania': ['ron'],
  'bulgaria': ['bgn'],
  'serbia': ['rsd'],
  'ucrania': ['uah'],
  'ukraine': ['uah'],
  'rusia': ['rub'],
  'russia': ['rub'],
  'islandia': ['isk'],
  'iceland': ['isk'],
  'albania': ['all'],
  'macedonia': ['mkd'],
  'moldavia': ['mdl'],
  'moldova': ['mdl'],
  'georgia': ['gel'],
  'armenia': ['amd'],
  'azerbaiyán': ['azn'],
  'azerbaijan': ['azn'],
  'bielorrusia': ['byn'],
  'belarus': ['byn'],
  
  // Asia
  'japón': ['jpy'],
  'japan': ['jpy'],
  'china': ['cny'],
  'corea del sur': ['krw'],
  'south korea': ['krw'],
  'corea': ['krw'],
  'korea': ['krw'],
  'india': ['inr'],
  'indonesia': ['idr'],
  'tailandia': ['thb'],
  'thailand': ['thb'],
  'vietnam': ['vnd'],
  'filipinas': ['php'],
  'philippines': ['php'],
  'malasia': ['myr'],
  'malaysia': ['myr'],
  'singapur': ['sgd'],
  'singapore': ['sgd'],
  'hong kong': ['hkd'],
  'taiwán': ['twd'],
  'taiwan': ['twd'],
  'pakistán': ['pkr'],
  'pakistan': ['pkr'],
  'bangladesh': ['bdt'],
  'sri lanka': ['lkr'],
  'nepal': ['npr'],
  'camboya': ['khr'],
  'cambodia': ['khr'],
  'laos': ['lak'],
  'myanmar': ['mmk'],
  'birmania': ['mmk'],
  'mongolia': ['mnt'],
  'kazajistán': ['kzt'],
  'kazakhstan': ['kzt'],
  'uzbekistán': ['uzs'],
  'uzbekistan': ['uzs'],
  'kirguistán': ['kgs'],
  'kyrgyzstan': ['kgs'],
  'tayikistán': ['tjs'],
  'tajikistan': ['tjs'],
  'turkmenistán': ['tmt'],
  'turkmenistan': ['tmt'],
  
  // Medio Oriente
  'israel': ['ils'],
  'turquía': ['try'],
  'turkey': ['try'],
  'arabia saudita': ['sar'],
  'saudi arabia': ['sar'],
  'emiratos árabes': ['aed'],
  'uae': ['aed'],
  'dubai': ['aed'],
  'abu dhabi': ['aed'],
  'qatar': ['qar'],
  'kuwait': ['kwd'],
  'bahréin': ['bhd'],
  'bahrain': ['bhd'],
  'omán': ['omr'],
  'oman': ['omr'],
  'jordania': ['jod'],
  'jordan': ['jod'],
  'líbano': ['lbp'],
  'lebanon': ['lbp'],
  'irak': ['iqd'],
  'iraq': ['iqd'],
  'irán': ['irr'],
  'iran': ['irr'],
  
  // África
  'sudáfrica': ['zar'],
  'south africa': ['zar'],
  'egipto': ['egp'],
  'egypt': ['egp'],
  'nigeria': ['ngn'],
  'marruecos': ['mad'],
  'morocco': ['mad'],
  'argelia': ['dzd'],
  'algeria': ['dzd'],
  'túnez': ['tnd'],
  'tunisia': ['tnd'],
  'kenia': ['kes'],
  'kenya': ['kes'],
  'tanzania': ['tzs'],
  'etiopía': ['etb'],
  'ethiopia': ['etb'],
  'ghana': ['ghs'],
  'uganda': ['ugx'],
  'ruanda': ['rwf'],
  'rwanda': ['rwf'],
  'senegal': ['xof'],
  'costa de marfil': ['xof'],
  'camerún': ['xaf'],
  'cameroon': ['xaf'],
  
  // Oceanía
  'australia': ['aud'],
  'nueva zelanda': ['nzd'],
  'new zealand': ['nzd'],
  'fiji': ['fjd'],
  
  // Canadá
  'canadá': ['cad'],
  'canada': ['cad'],
};

// Función para buscar monedas por nombre de país
const searchCurrenciesByCountry = (searchTerm: string): string[] => {
  const searchLower = searchTerm.toLowerCase().trim();
  const matchedCurrencyIds: string[] = [];
  
  for (const [countryName, currencyIds] of Object.entries(countryToCurrencyMap)) {
    if (countryName.includes(searchLower) || searchLower.includes(countryName)) {
      matchedCurrencyIds.push(...currencyIds);
    }
  }
  
  return [...new Set(matchedCurrencyIds)]; // Eliminar duplicados
};

// Mapeo de códigos de moneda a banderas de país
const getCurrencyFlag = (currencySymbol: string): string => {
  // Buscar en la lista completa de monedas
  const currency = allWorldCurrencies.find(c => c.symbol === currencySymbol);
  if (currency) {
    return `/img/icons/country-flags/${currency.country}.svg`;
  }
  
  // Fallback para monedas comunes
  const currencyToFlag: Record<string, string> = {
    'USD': 'US',
    'EUR': 'EU',
    'GBP': 'GB',
    'COP': 'CO',
    'MXN': 'MX',
    'PEN': 'PE',
  };
  
  const countryCode = currencyToFlag[currencySymbol] || 'US';
  return `/img/icons/country-flags/${countryCode}.svg`;
};

export function CashView({ isBalanceVisible = true, usdBalance: initialUsdBalance = 5678.90, copBalance: initialCopBalance = 1500000.50 }: CashViewProps) {
  const [isTransferSheetOpen, setIsTransferSheetOpen] = useState(false);
  const [isCurrencySheetOpen, setIsCurrencySheetOpen] = useState(false);
  const [isSendSheetOpen, setIsSendSheetOpen] = useState(false);
  const [isExchangeSheetOpen, setIsExchangeSheetOpen] = useState(false);
  const [isSendCurrencySheetOpen, setIsSendCurrencySheetOpen] = useState(false);
  const [isReceiveCurrencySheetOpen, setIsReceiveCurrencySheetOpen] = useState(false);
  const [isExchangeFromCurrencySheetOpen, setIsExchangeFromCurrencySheetOpen] = useState(false);
  const [isExchangeToCurrencySheetOpen, setIsExchangeToCurrencySheetOpen] = useState(false);
  const [exchangeCurrencySearch, setExchangeCurrencySearch] = useState('');
  
  // Estados para cambio de moneda
  const [exchangeFromCurrency, setExchangeFromCurrency] = useState<CurrencyOption>({ id: 'usd', name: 'Dólar estadounidense', symbol: 'USD', balance: '' });
  const [exchangeToCurrency, setExchangeToCurrency] = useState<CurrencyOption>({ id: 'cop', name: 'Peso colombiano', symbol: 'COP', balance: '' });
  const [exchangeFromAmount, setExchangeFromAmount] = useState<string>('100');
  const [exchangeToAmount, setExchangeToAmount] = useState<string>('');
  const [exchangeLastEditedField, setExchangeLastEditedField] = useState<'from' | 'to'>('from');
  const [receiveCurrencySearch, setReceiveCurrencySearch] = useState('');
  const { movements, addMovement } = useMovements();
  
  // Hook para saldos dinámicos con persistencia en sessionStorage
  const { 
    usdBalance, 
    copBalance, 
    exchangeCurrency: performExchange,
    isLoaded: balancesLoaded 
  } = useBalances(initialUsdBalance, initialCopBalance);
  
  // Hook para tasas de cambio en tiempo real (actualiza cada 60 segundos)
  const { 
    rates, 
    getRate, 
    convert, 
    isLoading: isLoadingRates, 
    lastUpdated: ratesLastUpdated,
    refreshRates,
    error: ratesError 
  } = useExchangeRates('USD', 60000);
  
  // Monedas disponibles con valores dinámicos
  const currencies: CurrencyOption[] = [
    { id: 'usd', name: 'Dólar estadounidense', symbol: 'USD', balance: formatCurrency(usdBalance, 'USD', false) },
    { id: 'cop', name: 'Peso colombiano', symbol: 'COP', balance: formatCurrency(copBalance, 'COP', false) },
  ];
  
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(currencies[0]);
  
  // Actualizar selectedCurrency cuando cambien los saldos
  useEffect(() => {
    const updatedCurrency = currencies.find(c => c.id === selectedCurrency.id);
    if (updatedCurrency && updatedCurrency.balance !== selectedCurrency.balance) {
      setSelectedCurrency(updatedCurrency);
    }
  }, [usdBalance, copBalance]);
  
  // Estados para el envío de dinero
  const [sendAmount, setSendAmount] = useState<string>('100');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [lastEditedField, setLastEditedField] = useState<'send' | 'receive'>('send');
  const [sendCurrency, setSendCurrency] = useState<CurrencyOption>(currencies[0]); // USD por defecto
  const [receiveCurrency, setReceiveCurrency] = useState<CurrencyOption>(currencies[1]); // COP por defecto
  
  // Obtener tasa de cambio dinámica entre las monedas seleccionadas
  const exchangeRate = getRate(sendCurrency.symbol, receiveCurrency.symbol);
  
  // Timer para validez de la tasa de cambio (60 segundos = 1 minuto)
  const [rateTimer, setRateTimer] = useState(60);
  
  // Refs y estados para auto-escalar el tamaño de fuente de los inputs
  const sendInputRef = useRef<HTMLInputElement>(null);
  const receiveInputRef = useRef<HTMLInputElement>(null);
  const sendContainerRef = useRef<HTMLDivElement>(null);
  const receiveContainerRef = useRef<HTMLDivElement>(null);
  // Un solo estado de fuente para ambos inputs (se sincronizan)
  const [inputFontSize, setInputFontSize] = useState(36); // 4xl = 36px
  
  // Tamaños de fuente mínimo y máximo
  const MIN_FONT_SIZE = 18;
  const MAX_FONT_SIZE = 36;
  
  // Función para calcular el tamaño de fuente óptimo para un valor
  const calculateOptimalFontSizeForValue = (
    containerRef: React.RefObject<HTMLDivElement>,
    value: string
  ): number => {
    if (!containerRef.current) return MAX_FONT_SIZE;
    
    // Obtener el ancho disponible del contenedor
    const containerWidth = containerRef.current.offsetWidth;
    
    // Crear un elemento temporal para medir el texto
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
    
    // Reducir el tamaño hasta que el texto quepa
    while (newSize >= MIN_FONT_SIZE) {
      measureSpan.style.fontSize = `${newSize}px`;
      if (measureSpan.offsetWidth <= containerWidth - 10) { // 10px de margen
        break;
      }
      newSize -= 2;
    }
    
    document.body.removeChild(measureSpan);
    return Math.max(newSize, MIN_FONT_SIZE);
  };
  
  // Efecto unificado para ajustar el tamaño de ambos inputs simultáneamente
  useEffect(() => {
    // Calcular valores a mostrar
    const sendDisplayValue = lastEditedField === 'send' 
      ? sendAmount 
      : formatCurrency(calculateSendAmount(), sendCurrency.symbol as 'USD' | 'COP', false);
    
    const receiveDisplayValue = lastEditedField === 'receive' 
      ? receiveAmount 
      : formatCurrency(calculateReceiveAmount(), receiveCurrency.symbol as 'USD' | 'COP', false);
    
    // Calcular tamaño óptimo para cada input
    const sendOptimalSize = calculateOptimalFontSizeForValue(sendContainerRef, sendDisplayValue);
    const receiveOptimalSize = calculateOptimalFontSizeForValue(receiveContainerRef, receiveDisplayValue);
    
    // Usar el tamaño más pequeño para ambos inputs (para que se sincronicen)
    const unifiedSize = Math.min(sendOptimalSize, receiveOptimalSize);
    
    if (unifiedSize !== inputFontSize) {
      setInputFontSize(unifiedSize);
    }
  }, [sendAmount, receiveAmount, lastEditedField, sendCurrency.symbol, receiveCurrency.symbol, exchangeRate, isSendSheetOpen]);
  
  useEffect(() => {
    if (!isSendSheetOpen) return;
    
    const interval = setInterval(() => {
      setRateTimer((prev) => {
        if (prev <= 1) {
          // Reiniciar el timer y actualizar tasas desde la API
          refreshRates();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isSendSheetOpen, refreshRates]);
  
  // Resetear timer cuando se abre el sheet
  useEffect(() => {
    if (isSendSheetOpen) {
      setRateTimer(60);
      refreshRates(); // Actualizar tasas al abrir el sheet
    }
  }, [isSendSheetOpen, refreshRates]);
  
  // Parsear valor formateado a número
  const parseFormattedValue = (value: string): number => {
    if (!value) return 0;
    // Remover puntos (separadores de miles) y reemplazar coma por punto decimal
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  };

  // Calcular monto que recibe basado en el monto enviado (usando tasa dinámica)
  const calculateReceiveAmount = () => {
    const amount = parseFormattedValue(sendAmount);
    if (sendCurrency.symbol === receiveCurrency.symbol) {
      return amount;
    }
    // Usar la función convert del hook para cualquier par de monedas
    return convert(amount, sendCurrency.symbol, receiveCurrency.symbol);
  };

  // Calcular monto a enviar basado en el monto recibido (usando tasa dinámica)
  const calculateSendAmount = () => {
    const amount = parseFormattedValue(receiveAmount);
    if (sendCurrency.symbol === receiveCurrency.symbol) {
      return amount;
    }
    // Usar la función convert del hook para cualquier par de monedas
    return convert(amount, receiveCurrency.symbol, sendCurrency.symbol);
  };

  // Formatear número con separadores de miles (punto) y decimales (coma)
  const formatWithThousands = (value: string, currency: CurrencyOption): string => {
    if (value === '') return '';
    
    // Separar parte entera y decimal
    const parts = value.split(',');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    // Formatear parte entera con puntos como separadores de miles
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Reconstruir el número
    if (decimalPart !== undefined) {
      return formattedInteger + ',' + decimalPart;
    }
    return formattedInteger;
  };

  // Validar y formatear monto según la moneda
  // Límites de dígitos: COP = 10 dígitos, USD = 7 dígitos
  const getMaxDigits = (currency: string): number => {
    return currency === 'COP' ? 10 : 7;
  };
  
  const validateAmount = (value: string, currency: CurrencyOption): string => {
    // Permitir vacío
    if (value === '') return '';
    
    const maxDigits = getMaxDigits(currency.symbol);
    
    // Remover puntos (separadores de miles) para procesar
    let cleanValue = value.replace(/\./g, '');
    
    // Reemplazar coma por marcador temporal para decimales
    cleanValue = cleanValue.replace(',', '.');
    
    // Remover caracteres no numéricos excepto punto decimal
    cleanValue = cleanValue.replace(/[^0-9.]/g, '');
    
    // Evitar múltiples puntos decimales
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limitar dígitos según la moneda
    let integerPart = parts[0];
    if (integerPart.length > maxDigits) {
      integerPart = integerPart.substring(0, maxDigits);
    }
    
    // Para COP: no permitir decimales
    if (currency.symbol === 'COP') {
      cleanValue = integerPart;
    } else {
      // Para otras monedas: máximo 2 decimales
      if (parts.length === 2) {
        const decimalPart = parts[1].substring(0, 2);
        cleanValue = integerPart + '.' + decimalPart;
      } else {
        cleanValue = integerPart;
      }
    }
    
    // Convertir punto decimal a coma para formato español
    cleanValue = cleanValue.replace('.', ',');
    
    // Aplicar formato de miles
    return formatWithThousands(cleanValue, currency);
  };

  // Manejar cambio en monto de envío
  const handleSendAmountChange = (value: string) => {
    const validatedValue = validateAmount(value, sendCurrency);
    setSendAmount(validatedValue);
    setLastEditedField('send');
  };

  // Manejar cambio en monto de recepción
  const handleReceiveAmountChange = (value: string) => {
    const validatedValue = validateAmount(value, receiveCurrency);
    setReceiveAmount(validatedValue);
    setLastEditedField('receive');
  };

  // Intercambiar monedas
  const swapCurrencies = () => {
    const tempCurrency = sendCurrency;
    setSendCurrency(receiveCurrency);
    setReceiveCurrency(tempCurrency);
  };

  // Obtener valores a mostrar
  const getDisplaySendAmount = () => {
    if (lastEditedField === 'send') {
      return sendAmount;
    }
    return formatCurrency(calculateSendAmount(), sendCurrency.symbol as 'USD' | 'COP', false);
  };

  const getDisplayReceiveAmount = () => {
    if (lastEditedField === 'receive') {
      return receiveAmount;
    }
    return formatCurrency(calculateReceiveAmount(), receiveCurrency.symbol as 'USD' | 'COP', false);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: spacing[4],
        backgroundColor: colors.semantic.background.main,
      }}
    >
      {/* Título de la sección */}
      <h1
        style={{
          fontSize: typography.sectionTitle.fontSize,
          fontWeight: typography.sectionTitle.fontWeight,
          lineHeight: typography.sectionTitle.lineHeight,
          color: typography.sectionTitle.color,
          fontFamily: typography.sectionTitle.fontFamily,
          marginBottom: '1.5rem',
        }}
      >
        Cash
      </h1>

      {/* Card de Balance */}
      <div
        style={{
          width: '100%',
          backgroundColor: colors.semantic.background.white,
          borderRadius: borderRadius['3xl'],
          padding: spacing[6],
          marginBottom: '1.5rem',
        }}
      >
        <p
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.semantic.text.secondary,
            fontFamily: typography.fontFamily.sans.join(', '),
            margin: 0,
            marginBottom: spacing[2],
          }}
        >
          Saldo disponible
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Balance value */}
          <span
            style={{
              fontSize: '2.5rem',
              fontWeight: typography.fontWeight.extrabold,
              color: colors.semantic.text.primary,
              fontFamily: typography.fontFamily.sans.join(', '),
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            {isBalanceVisible ? selectedCurrency.balance : '•••••'}
          </span>
          
          {/* Currency selector button - same style as Enviar dinero */}
          <button
            onClick={() => setIsCurrencySheetOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: borderRadius.full,
              padding: `${spacing[2]} ${spacing[4]}`,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            <img
              src={getCurrencyFlag(selectedCurrency.symbol)}
              alt={`Bandera ${selectedCurrency.symbol}`}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: borderRadius.full,
                objectFit: 'cover',
              }}
            />
            <span
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.semantic.text.primary,
                fontFamily: typography.fontFamily.sans.join(', '),
              }}
            >
              {selectedCurrency.symbol}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke={colors.semantic.text.secondary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Botones de acción principales */}
      <div
        style={{
          display: 'flex',
          gap: 'clamp(16px, 5vw, 40px)',
          marginBottom: '1.5rem',
          justifyContent: 'center',
        }}
      >
        {/* Botón Agregar saldo */}
        <button
          onClick={() => {
            // TODO: Implementar flujo de agregar saldo
            console.log('Agregar saldo');
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[2],
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: borderRadius.full,
              backgroundColor: colors.semantic.background.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/img/icons/global/add.svg"
              alt="Agregar saldo"
              style={{
                width: '24px',
                height: '24px',
                display: 'block',
              }}
            />
          </div>
          <span
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.primary,
              fontFamily: typography.fontFamily.sans.join(', '),
            }}
          >
            Agregar saldo
          </span>
        </button>

        {/* Botón Recibir */}
        <button
          onClick={() => setIsTransferSheetOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[2],
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: borderRadius.full,
              backgroundColor: colors.semantic.background.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/img/icons/global/receive.svg"
              alt="Recibir"
              style={{
                width: '24px',
                height: '24px',
                display: 'block',
              }}
            />
          </div>
          <span
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.primary,
              fontFamily: typography.fontFamily.sans.join(', '),
            }}
          >
            Recibir
          </span>
        </button>

        {/* Botón Cambiar */}
        <button
          onClick={() => {
            // Preseleccionar monedas basado en la moneda seleccionada actualmente
            const fromCurrency = currencies.find(c => c.id === selectedCurrency.id) || currencies[0];
            const toCurrency = currencies.find(c => c.id !== selectedCurrency.id) || currencies[1];
            setExchangeFromCurrency(fromCurrency);
            setExchangeToCurrency(toCurrency);
            setIsExchangeSheetOpen(true);
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[2],
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: borderRadius.full,
              backgroundColor: colors.semantic.background.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/img/icons/global/fx.svg"
              alt="Cambiar"
              style={{
                width: '24px',
                height: '24px',
                display: 'block',
              }}
            />
          </div>
          <span
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.primary,
              fontFamily: typography.fontFamily.sans.join(', '),
            }}
          >
            Cambiar
          </span>
        </button>

        {/* Botón Enviar */}
        <button
          onClick={() => setIsSendSheetOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[2],
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: borderRadius.full,
              backgroundColor: colors.semantic.background.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/img/icons/global/send.svg"
              alt="Enviar"
              style={{
                width: '24px',
                height: '24px',
                display: 'block',
              }}
            />
          </div>
          <span
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.normal,
              color: colors.semantic.text.primary,
              fontFamily: typography.fontFamily.sans.join(', '),
            }}
          >
            Enviar
          </span>
        </button>
      </div>

      {/* Sección de últimos movimientos */}
      <div
        style={{
          backgroundColor: colors.semantic.background.white,
          borderRadius: borderRadius['3xl'],
          padding: spacing[6],
        }}
      >
        {/* Header con título y botón Ver todo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing[4],
          }}
        >
          <h2
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.semantic.text.primary,
              fontFamily: typography.fontFamily.sans.join(', '),
              margin: 0,
              padding: 0,
            }}
          >
            Últimos movimientos
          </h2>
          
          {/* Botón Ver todo */}
          <button
            type="button"
            style={{
              padding: `${spacing[2]} ${spacing[4]}`,
              borderRadius: borderRadius.full,
              backgroundColor: 'rgba(0, 0, 0, 0.0627)',
              color: colors.semantic.text.primary,
              border: 'none',
              fontFamily: typography.fontFamily.sans.join(', '),
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.bold,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            Ver todo
          </button>
        </div>
        
        {/* Movimientos de Cash */}
        <RecentMovements 
          movements={movements} 
          isBalanceVisible={isBalanceVisible} 
          maxItems={3}
          filterBySource="cash"
        />
      </div>

      {/* Bottom Sheet para Enviar/Recibir */}
      <BottomSheet
        isOpen={isTransferSheetOpen}
        onClose={() => setIsTransferSheetOpen(false)}
        title="Transferir dinero"
        showGraber={true}
        rightIcon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke={colors.semantic.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        onRightIconClick={() => setIsTransferSheetOpen(false)}
      >
        <div
          style={{
            padding: `${spacing[4]} ${spacing[6]} ${spacing[6]}`,
          }}
        >
          {/* Opción Enviar */}
          <button
            onClick={() => {
              // TODO: Implementar flujo de envío
              console.log('Enviar dinero');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[4],
              padding: spacing[4],
              backgroundColor: colors.semantic.background.main,
              borderRadius: borderRadius['2xl'],
              border: 'none',
              cursor: 'pointer',
              marginBottom: spacing[3],
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.background.main;
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: borderRadius.full,
                backgroundColor: colors.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M12 5L6 11M12 5L18 11"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <p
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  margin: 0,
                }}
              >
                Enviar dinero
              </p>
              <p
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.semantic.text.secondary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  margin: 0,
                  marginTop: spacing[0.5],
                }}
              >
                Transfiere a cualquier cuenta
              </p>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginLeft: 'auto', opacity: 0.4 }}
            >
              <path
                d="M9 18L15 12L9 6"
                stroke={colors.semantic.text.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Opción Recibir */}
          <button
            onClick={() => {
              // TODO: Implementar flujo de recepción
              console.log('Recibir dinero');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[4],
              padding: spacing[4],
              backgroundColor: colors.semantic.background.main,
              borderRadius: borderRadius['2xl'],
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.background.main;
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: borderRadius.full,
                backgroundColor: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 19V5M12 19L6 13M12 19L18 13"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <p
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  margin: 0,
                }}
              >
                Recibir dinero
              </p>
              <p
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.semantic.text.secondary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  margin: 0,
                  marginTop: spacing[0.5],
                }}
              >
                Comparte tu código QR o datos
              </p>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginLeft: 'auto', opacity: 0.4 }}
            >
              <path
                d="M9 18L15 12L9 6"
                stroke={colors.semantic.text.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </BottomSheet>

      {/* Bottom Sheet para seleccionar moneda */}
      <BottomSheet
        isOpen={isCurrencySheetOpen}
        onClose={() => setIsCurrencySheetOpen(false)}
        title="Seleccionar moneda"
        showGraber={true}
        rightIcon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke={colors.semantic.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        onRightIconClick={() => setIsCurrencySheetOpen(false)}
      >
        <div
          style={{
            padding: 0,
          }}
        >
          {currencies.map((currency, index) => (
            <button
              key={currency.id}
              onClick={() => {
                setSelectedCurrency(currency);
                setIsCurrencySheetOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
                padding: 0,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {/* Bandera de la moneda */}
              <img
                src={getCurrencyFlag(currency.symbol)}
                alt={`Bandera ${currency.symbol}`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: borderRadius.full,
                  objectFit: 'cover',
                  flexShrink: 0,
                  marginTop: spacing[4],
                  marginBottom: spacing[4],
                }}
              />
              {/* Contenedor del texto y radio con divider */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `${spacing[4]} 0`,
                  borderBottom: index < currencies.length - 1 ? `1px solid ${colors.semantic.border.light}` : 'none',
                }}
              >
                {/* Información de la moneda */}
                <div style={{ textAlign: 'left' }}>
                  <p
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.semantic.text.primary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      margin: 0,
                    }}
                  >
                    {currency.name}
                  </p>
                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.semantic.text.secondary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      margin: 0,
                      marginTop: spacing['0.5'],
                    }}
                  >
                    {isBalanceVisible ? currency.balance : '•••'} {currency.symbol}
                  </p>
                </div>
                {/* Radio button a la derecha */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: borderRadius.full,
                    border: selectedCurrency.id === currency.id 
                      ? `2px solid ${colors.primary.main}` 
                      : `2px solid ${colors.semantic.border.medium}`,
                    backgroundColor: selectedCurrency.id === currency.id 
                      ? colors.primary.main 
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  {selectedCurrency.id === currency.id && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
          
          {/* Botón secundario para agregar nueva moneda */}
          <button
            onClick={() => {
              // TODO: Implementar flujo de agregar moneda
              console.log('Agregar nueva moneda');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[2],
              padding: spacing[4],
              marginTop: spacing[4],
              backgroundColor: 'rgba(0, 0, 0, 0.063)',
              border: 'none',
              borderRadius: borderRadius.full,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.063)';
            }}
            onPointerDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke={colors.semantic.text.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.semantic.text.primary,
                fontFamily: typography.fontFamily.sans.join(', '),
              }}
            >
              Agregar nueva moneda
            </span>
          </button>
        </div>
      </BottomSheet>

      {/* Bottom Sheet Full Screen - Enviar Dinero */}
      <BottomSheet
        isOpen={isSendSheetOpen}
        onClose={() => setIsSendSheetOpen(false)}
        title="Enviar dinero"
        maxHeight={96}
        showGraber={true}
        zIndex={1050}
        rightIcon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke={colors.semantic.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        onRightIconClick={() => setIsSendSheetOpen(false)}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[4],
            paddingBottom: spacing[8],
            marginTop: '1.5rem',
          }}
        >
          {/* Contenedor de inputs con swap button */}
          <div>
            {/* Sección: Tú envías */}
            <div
              style={{
                backgroundColor: colors.semantic.background.main,
                borderRadius: '24px',
                padding: spacing[6],
              }}
            >
              <p
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  marginBottom: spacing[2],
                }}
              >
                Tú envías
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[4],
                }}
              >
                {/* Input de monto */}
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
                    }}
                    placeholder="0"
                  />
                </div>
                
                {/* Selector de moneda */}
                <button
                  onClick={() => setIsSendCurrencySheetOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    backgroundColor: colors.semantic.background.white,
                    borderRadius: borderRadius.full,
                    padding: `${spacing[2]} ${spacing[4]}`,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <img
                    src={getCurrencyFlag(sendCurrency.symbol)}
                    alt={sendCurrency.name}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: borderRadius.full,
                      objectFit: 'cover',
                    }}
                  />
                  <span
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.semantic.text.primary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                    }}
                  >
                    {sendCurrency.symbol}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke={colors.semantic.text.secondary}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              
              {/* Saldo disponible y límites */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: spacing[3],
                }}
              >
                <p
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.semantic.text.secondary,
                    fontFamily: typography.fontFamily.sans.join(', '),
                    margin: 0,
                  }}
                >
                  Saldo disponible: <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary }}>
                    {sendCurrency.symbol === 'USD' 
                      ? formatCurrency(usdBalance, 'USD', false) 
                      : formatCurrency(copBalance, 'COP', false)} {sendCurrency.symbol}
                  </span>
                </p>
              </div>
              <p
                style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.semantic.text.secondary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  margin: 0,
                  marginTop: spacing[1],
                }}
              >
                {sendCurrency.symbol === 'USD' 
                  ? 'Mín. 10 USD · Máx. 5.000 USD'
                  : `Mín. ${formatCurrency(10 * getRate('USD', 'COP'), 'COP', false)} COP · Máx. ${formatCurrency(5000 * getRate('USD', 'COP'), 'COP', false)} COP`
                }
              </p>
            </div>

            {/* Botón de intercambiar monedas - centrado con 8px de gap entre secciones */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                height: spacing[2], // 8px de gap visible
                position: 'relative',
                zIndex: 10,
              }}
            >
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
              onPointerDown={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(0.95)';
              }}
              onPointerUp={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 16L7 4M7 4L3 8M7 4L11 8M17 8L17 20M17 20L21 16M17 20L13 16"
                  stroke={colors.semantic.text.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            </div>

            {/* Sección: Destinatario recibe */}
            <div
              style={{
                backgroundColor: colors.semantic.background.main,
                borderRadius: '24px',
                padding: spacing[6],
              }}
            >
              <p
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  marginBottom: spacing[2],
                }}
              >
                Destinatario recibe
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[4],
                }}
              >
                {/* Input de monto destino */}
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
                    }}
                    placeholder="0"
                  />
                </div>
                
                {/* Selector de moneda destino */}
                <button
                  onClick={() => setIsReceiveCurrencySheetOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    backgroundColor: colors.semantic.background.white,
                    borderRadius: borderRadius.full,
                    padding: `${spacing[2]} ${spacing[4]}`,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <img
                    src={getCurrencyFlag(receiveCurrency.symbol)}
                    alt={receiveCurrency.name}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: borderRadius.full,
                      objectFit: 'cover',
                    }}
                  />
                  <span
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.semantic.text.primary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                    }}
                  >
                    {receiveCurrency.symbol}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke={colors.semantic.text.secondary}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Resumen con tasa de cambio - estilo InfoBanner */}
          <div
            style={{
              backgroundColor: 'rgb(110 147 221 / 12%)',
              border: '1px solid rgb(110 147 221 / 20%)',
              borderRadius: '24px',
              padding: spacing[6],
              marginTop: spacing[2],
            }}
          >
            {/* Título del resumen */}
            <p
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.semantic.text.primary,
                fontFamily: typography.fontFamily.sans.join(', '),
                marginBottom: spacing[3],
              }}
            >
              Resumen de conversión
            </p>
            
            {/* Tasa de cambio */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing[2],
              }}
            >
              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                }}
              >
                Tasa de cambio
              </span>
              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                }}
              >
                {exchangeRate >= 1 
                  ? `1 ${sendCurrency.symbol} = ${formatCurrency(exchangeRate, receiveCurrency.symbol, false)} ${receiveCurrency.symbol}`
                  : `1 ${receiveCurrency.symbol} = ${formatCurrency(1 / exchangeRate, sendCurrency.symbol, false)} ${sendCurrency.symbol}`
                }
              </span>
            </div>
            
            {/* Timer de validez */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                }}
              >
                Válido por
              </span>
              <span
                style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.bold,
                  color: '#92400E',
                  fontFamily: typography.fontFamily.sans.join(', '),
                  backgroundColor: '#FEF3C7',
                  padding: `${spacing[1]} ${spacing[2]}`,
                  borderRadius: borderRadius.full,
                }}
              >
                {rateTimer}s
              </span>
            </div>
          </div>

          {/* Botón Continuar */}
          <button
            onClick={() => {
              // TODO: Implementar flujo de envío
              console.log('Continuar envío:', {
                amount: sendAmount,
                sendCurrency: sendCurrency.symbol,
                receiveCurrency: receiveCurrency.symbol,
                receiveAmount: calculateReceiveAmount(),
              });
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
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.button.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.semantic.button.primary;
            }}
            onPointerDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold,
                color: 'white',
                fontFamily: typography.fontFamily.sans.join(', '),
              }}
            >
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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke={colors.semantic.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
                padding: 0,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {/* Bandera de la moneda */}
              <img
                src={getCurrencyFlag(currency.symbol)}
                alt={`Bandera ${currency.symbol}`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: borderRadius.full,
                  objectFit: 'cover',
                  flexShrink: 0,
                  marginTop: spacing[4],
                  marginBottom: spacing[4],
                }}
              />
              {/* Contenedor del texto y radio con divider */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `${spacing[4]} 0`,
                  borderBottom: index < currencies.length - 1 ? `1px solid ${colors.semantic.border.light}` : 'none',
                }}
              >
                {/* Información de la moneda */}
                <div style={{ textAlign: 'left' }}>
                  <p
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.semantic.text.primary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      margin: 0,
                    }}
                  >
                    {currency.name}
                  </p>
                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.semantic.text.secondary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      margin: 0,
                      marginTop: spacing['0.5'],
                    }}
                  >
                    {currency.balance} {currency.symbol}
                  </p>
                </div>
                {/* Radio button a la derecha */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: borderRadius.full,
                    border: sendCurrency.id === currency.id 
                      ? `2px solid ${colors.primary.main}` 
                      : `2px solid ${colors.semantic.border.medium}`,
                    backgroundColor: sendCurrency.id === currency.id 
                      ? colors.primary.main 
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  {sendCurrency.id === currency.id && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Bottom Sheet - Seleccionar moneda de recepción */}
      <BottomSheet
        isOpen={isReceiveCurrencySheetOpen}
        onClose={() => {
          setIsReceiveCurrencySheetOpen(false);
          setReceiveCurrencySearch('');
        }}
        title="Moneda a recibir"
        showGraber={false}
        zIndex={1100}
        fullScreen={true}
        rightIcon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke={colors.semantic.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        onRightIconClick={() => {
          setIsReceiveCurrencySheetOpen(false);
          setReceiveCurrencySearch('');
        }}
      >
        <div 
          style={{ 
            padding: 0, 
            paddingBottom: `calc(${spacing[10]} + env(safe-area-inset-bottom))`, // Padding inferior + safe area
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Buscador */}
          <div style={{ 
            position: 'sticky', 
            top: 0, 
            backgroundColor: colors.semantic.background.white,
            paddingBottom: spacing[4],
            zIndex: 10,
          }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
                backgroundColor: colors.semantic.background.main,
                borderRadius: borderRadius.full,
                padding: `${spacing[3]} ${spacing[4]}`,
              }}
            >
              {/* Icono de búsqueda */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                  stroke={colors.semantic.text.secondary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar moneda o país..."
                value={receiveCurrencySearch}
                onChange={(e) => setReceiveCurrencySearch(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: typography.fontSize.base,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  color: colors.semantic.text.primary,
                }}
              />
              {receiveCurrencySearch && (
                <button
                  onClick={() => setReceiveCurrencySearch('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke={colors.semantic.text.secondary}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filtrar monedas según búsqueda */}
          {(() => {
            const searchLower = receiveCurrencySearch.toLowerCase();
            
            // Buscar monedas que coincidan por nombre de país
            const countryMatchedIds = searchCurrenciesByCountry(receiveCurrencySearch);
            
            // Función para verificar si una moneda coincide con la búsqueda
            const matchesCurrency = (c: DestinationCurrency) => 
              c.name.toLowerCase().includes(searchLower) || 
              c.symbol.toLowerCase().includes(searchLower) ||
              countryMatchedIds.includes(c.id);
            
            const filteredPopular = popularDestinations.filter(matchesCurrency);
            const popularIds = popularDestinations.map(p => p.id);
            const otherCurrencies = allWorldCurrencies.filter(c => !popularIds.includes(c.id));
            const filteredOther = otherCurrencies.filter(matchesCurrency);

            // Función para renderizar un item de moneda
            // Solo estados: seleccionado y focus (sin hover ni otros efectos)
            const renderCurrencyItem = (currency: DestinationCurrency, isLast: boolean) => (
              <button
                key={currency.id}
                onClick={() => {
                  setReceiveCurrency({
                    id: currency.id,
                    name: currency.name,
                    symbol: currency.symbol,
                    balance: '',
                  });
                  setIsReceiveCurrencySheetOpen(false);
                  setReceiveCurrencySearch('');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                  padding: 0,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent', // Eliminar highlight en móviles
                }}
              >
                {/* Bandera de la moneda */}
                <img
                  src={`/img/icons/country-flags/${currency.country}.svg`}
                  alt={`Bandera ${currency.symbol}`}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: borderRadius.full,
                    objectFit: 'cover',
                    flexShrink: 0,
                    marginTop: spacing[4],
                    marginBottom: spacing[4],
                  }}
                />
                {/* Contenedor del texto y radio con divider */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: `${spacing[4]} 0`,
                    borderBottom: !isLast ? `1px solid ${colors.semantic.border.light}` : 'none',
                  }}
                >
                  {/* Información de la moneda */}
                  <div style={{ textAlign: 'left' }}>
                    <p
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.semantic.text.primary,
                        fontFamily: typography.fontFamily.sans.join(', '),
                        margin: 0,
                      }}
                    >
                      {currency.name}
                    </p>
                    <p
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.semantic.text.secondary,
                        fontFamily: typography.fontFamily.sans.join(', '),
                        margin: 0,
                        marginTop: spacing['0.5'],
                      }}
                    >
                      {currency.symbol}
                    </p>
                  </div>
                  {/* Radio button a la derecha - solo estado seleccionado */}
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: borderRadius.full,
                      border: receiveCurrency.symbol === currency.symbol 
                        ? `2px solid ${colors.primary.main}` 
                        : `2px solid ${colors.semantic.border.medium}`,
                      backgroundColor: receiveCurrency.symbol === currency.symbol 
                        ? colors.primary.main 
                        : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {receiveCurrency.symbol === currency.symbol && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );

            return (
              <>
                {/* Sección: Destinos populares */}
                {filteredPopular.length > 0 && (
                  <>
                    <p
                      style={{
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.semantic.text.secondary,
                        fontFamily: typography.fontFamily.sans.join(', '),
                        margin: 0,
                        marginTop: '1.5rem',
                        marginBottom: spacing[2],
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Destinos populares
                    </p>
                    {filteredPopular.map((currency, index) => 
                      renderCurrencyItem(currency, index === filteredPopular.length - 1)
                    )}
                  </>
                )}

                {/* Sección: Todas las monedas */}
                {filteredOther.length > 0 && (
                  <>
                    <p
                      style={{
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.semantic.text.secondary,
                        fontFamily: typography.fontFamily.sans.join(', '),
                        margin: 0,
                        marginTop: filteredPopular.length > 0 ? spacing[6] : 0,
                        marginBottom: spacing[2],
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Todas las monedas
                    </p>
                    {filteredOther.map((currency, index) => 
                      renderCurrencyItem(currency, index === filteredOther.length - 1)
                    )}
                  </>
                )}

                {/* Sin resultados */}
                {filteredPopular.length === 0 && filteredOther.length === 0 && (
                  <div
                    style={{
                      padding: spacing[8],
                      textAlign: 'center',
                    }}
                  >
                    <p
                      style={{
                        fontSize: typography.fontSize.base,
                        color: colors.semantic.text.secondary,
                        fontFamily: typography.fontFamily.sans.join(', '),
                        margin: 0,
                      }}
                    >
                      No se encontraron monedas
                    </p>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </BottomSheet>

      {/* Bottom Sheet Full Screen - Cambiar Moneda */}
      <BottomSheet
        isOpen={isExchangeSheetOpen}
        onClose={() => {
          setIsExchangeSheetOpen(false);
          setExchangeFromAmount('100');
          setExchangeToAmount('');
          setExchangeLastEditedField('from');
        }}
        title="Cambiar moneda"
        maxHeight={96}
        showGraber={true}
        zIndex={1050}
        rightIcon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke={colors.semantic.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        onRightIconClick={() => {
          setIsExchangeSheetOpen(false);
          setExchangeFromAmount('100');
          setExchangeToAmount('');
          setExchangeLastEditedField('from');
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[4],
            paddingBottom: spacing[8],
            marginTop: '1.5rem',
          }}
        >
          {/* Contenedor de inputs con swap button */}
          <div>
            {/* Sección: Cuenta origen */}
            <div
              style={{
                backgroundColor: colors.semantic.background.main,
                borderRadius: '24px',
                padding: spacing[6],
              }}
            >
              <p
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  marginBottom: spacing[2],
                }}
              >
                Cuenta origen
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[4],
                }}
              >
                {/* Input de monto */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={exchangeLastEditedField === 'from' ? exchangeFromAmount : formatCurrency(
                      convert(parseFormattedValue(exchangeToAmount), exchangeToCurrency.symbol, exchangeFromCurrency.symbol),
                      exchangeFromCurrency.symbol as 'USD' | 'COP',
                      false
                    )}
                    onChange={(e) => {
                      const validated = validateAmount(e.target.value, exchangeFromCurrency);
                      setExchangeFromAmount(validated);
                      setExchangeLastEditedField('from');
                    }}
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
                    }}
                    placeholder="0"
                  />
                </div>
                
                {/* Selector de moneda */}
                <button
                  onClick={() => setIsExchangeFromCurrencySheetOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    backgroundColor: colors.semantic.background.white,
                    borderRadius: borderRadius.full,
                    padding: `${spacing[2]} ${spacing[4]}`,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <img
                    src={getCurrencyFlag(exchangeFromCurrency.symbol)}
                    alt={exchangeFromCurrency.name}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: borderRadius.full,
                      objectFit: 'cover',
                    }}
                  />
                  <span
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.semantic.text.primary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                    }}
                  >
                    {exchangeFromCurrency.symbol}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke={colors.semantic.text.secondary}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              
              {/* Saldo disponible y límites */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: spacing[3],
                }}
              >
                <p
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.semantic.text.secondary,
                    fontFamily: typography.fontFamily.sans.join(', '),
                    margin: 0,
                  }}
                >
                  Saldo disponible: <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.semantic.text.primary }}>
                    {exchangeFromCurrency.symbol === 'USD' 
                      ? formatCurrency(usdBalance, 'USD', false) 
                      : formatCurrency(copBalance, 'COP', false)} {exchangeFromCurrency.symbol}
                  </span>
                </p>
              </div>
              <p
                style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.semantic.text.secondary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  margin: 0,
                  marginTop: spacing[1],
                }}
              >
                {exchangeFromCurrency.symbol === 'USD' 
                  ? `Mín. 10 USD · Máx. ${formatCurrency(usdBalance, 'USD', false)} USD`
                  : `Mín. ${formatCurrency(10 * getRate('USD', 'COP'), 'COP', false)} COP · Máx. ${formatCurrency(copBalance, 'COP', false)} COP`
                }
              </p>
            </div>

            {/* Botón de intercambiar monedas - centrado con 8px de gap entre secciones */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                height: spacing[2], // 8px de gap visible
                position: 'relative',
                zIndex: 10,
              }}
            >
            <button
              onClick={() => {
                const tempCurrency = exchangeFromCurrency;
                setExchangeFromCurrency(exchangeToCurrency);
                setExchangeToCurrency(tempCurrency);
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
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              onPointerDown={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(0.95)';
              }}
              onPointerUp={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 16L7 4M7 4L3 8M7 4L11 8M17 8L17 20M17 20L21 16M17 20L13 16"
                  stroke={colors.semantic.text.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            </div>

            {/* Sección: Cuenta destino */}
            <div
              style={{
                backgroundColor: colors.semantic.background.main,
                borderRadius: '24px',
                padding: spacing[6],
              }}
            >
              <p
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  marginBottom: spacing[2],
                }}
              >
                Cuenta destino
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[4],
                }}
              >
                {/* Input de monto destino */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={exchangeLastEditedField === 'to' ? exchangeToAmount : formatCurrency(
                      convert(parseFormattedValue(exchangeFromAmount), exchangeFromCurrency.symbol, exchangeToCurrency.symbol),
                      exchangeToCurrency.symbol as 'USD' | 'COP',
                      false
                    )}
                    onChange={(e) => {
                      const validated = validateAmount(e.target.value, exchangeToCurrency);
                      setExchangeToAmount(validated);
                      setExchangeLastEditedField('to');
                    }}
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
                    }}
                    placeholder="0"
                  />
                </div>
                
                {/* Selector de moneda destino */}
                <button
                  onClick={() => setIsExchangeToCurrencySheetOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    backgroundColor: colors.semantic.background.white,
                    borderRadius: borderRadius.full,
                    padding: `${spacing[2]} ${spacing[4]}`,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <img
                    src={getCurrencyFlag(exchangeToCurrency.symbol)}
                    alt={exchangeToCurrency.name}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: borderRadius.full,
                      objectFit: 'cover',
                    }}
                  />
                  <span
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.semantic.text.primary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                    }}
                  >
                    {exchangeToCurrency.symbol}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke={colors.semantic.text.secondary}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Resumen con tasa de cambio - estilo InfoBanner */}
          <div
            style={{
              backgroundColor: 'rgb(110 147 221 / 12%)',
              border: '1px solid rgb(110 147 221 / 20%)',
              borderRadius: '24px',
              padding: spacing[6],
              marginTop: spacing[2],
            }}
          >
            {/* Título del resumen */}
            <p
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.semantic.text.primary,
                fontFamily: typography.fontFamily.sans.join(', '),
                marginBottom: spacing[3],
              }}
            >
              Resumen de conversión
            </p>
            
            {/* Tasa de cambio */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing[2],
              }}
            >
              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                }}
              >
                Tasa de cambio
              </span>
              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                }}
              >
                {(() => {
                  const rate = getRate(exchangeFromCurrency.symbol, exchangeToCurrency.symbol);
                  return rate >= 1 
                    ? `1 ${exchangeFromCurrency.symbol} = ${formatCurrency(rate, exchangeToCurrency.symbol, false)} ${exchangeToCurrency.symbol}`
                    : `1 ${exchangeToCurrency.symbol} = ${formatCurrency(1 / rate, exchangeFromCurrency.symbol, false)} ${exchangeFromCurrency.symbol}`;
                })()}
              </span>
            </div>
            
            {/* Timer de validez */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.semantic.text.primary,
                  fontFamily: typography.fontFamily.sans.join(', '),
                }}
              >
                Válido por
              </span>
              <span
                style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.bold,
                  color: '#92400E',
                  fontFamily: typography.fontFamily.sans.join(', '),
                  backgroundColor: '#FEF3C7',
                  padding: `${spacing[1]} ${spacing[2]}`,
                  borderRadius: borderRadius.full,
                }}
              >
                {rateTimer}s
              </span>
            </div>
          </div>

          {/* Slider para confirmar cambio */}
          <div style={{ marginTop: spacing[4] }}>
            <SliderToBlock
              mode="exchange"
              onComplete={() => {
                const fromAmount = parseFormattedValue(exchangeFromAmount);
                const toAmount = convert(fromAmount, exchangeFromCurrency.symbol, exchangeToCurrency.symbol);
                const fromSymbol = exchangeFromCurrency.symbol as 'USD' | 'COP';
                const toSymbol = exchangeToCurrency.symbol as 'USD' | 'COP';
                
                // 1. Realizar el cambio de saldos
                performExchange(fromSymbol, toSymbol, fromAmount, toAmount);
                
                // 2. Agregar movimiento de salida (negativo)
                const now = new Date();
                addMovement({
                  name: `Cambio de moneda · ${fromSymbol} → ${toSymbol}`,
                  amount: -fromAmount,
                  currency: fromSymbol,
                  date: now,
                  logoUrl: '/img/icons/global/fx.svg',
                  type: 'transfer',
                  source: 'cash',
                });
                
                // 3. Agregar movimiento de entrada (positivo) - 1 segundo después
                const entryDate = new Date(now.getTime() + 1000);
                addMovement({
                  name: `Conversión recibida · ${fromSymbol} → ${toSymbol}`,
                  amount: toAmount,
                  currency: toSymbol,
                  date: entryDate,
                  logoUrl: '/img/icons/global/fx.svg',
                  type: 'deposit',
                  source: 'cash',
                });
                
                console.log('Cambio completado:', {
                  from: fromAmount,
                  fromCurrency: fromSymbol,
                  to: toAmount,
                  toCurrency: toSymbol,
                });
              }}
              onCloseSheet={() => {
                setIsExchangeSheetOpen(false);
                setExchangeFromAmount('100');
                setExchangeToAmount('');
                setExchangeLastEditedField('from');
              }}
              onShowToast={(message) => {
                console.log('Toast:', message);
              }}
              disabled={parseFormattedValue(exchangeFromAmount) <= 0}
            />
          </div>
        </div>
      </BottomSheet>

      {/* Bottom Sheet - Seleccionar moneda origen (cambio) */}
      <BottomSheet
        isOpen={isExchangeFromCurrencySheetOpen}
        onClose={() => setIsExchangeFromCurrencySheetOpen(false)}
        title="Cuenta origen"
        showGraber={true}
        zIndex={1100}
        rightIcon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke={colors.semantic.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        onRightIconClick={() => setIsExchangeFromCurrencySheetOpen(false)}
      >
        <div style={{ padding: 0 }}>
          {currencies.map((currency, index) => (
            <button
              key={currency.id}
              onClick={() => {
                // Si selecciona la misma moneda que está en destino, intercambiar
                if (currency.id === exchangeToCurrency.id) {
                  setExchangeToCurrency(exchangeFromCurrency);
                }
                setExchangeFromCurrency(currency);
                setIsExchangeFromCurrencySheetOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
                padding: 0,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {/* Bandera de la moneda */}
              <img
                src={getCurrencyFlag(currency.symbol)}
                alt={`Bandera ${currency.symbol}`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: borderRadius.full,
                  objectFit: 'cover',
                  flexShrink: 0,
                  marginTop: spacing[4],
                  marginBottom: spacing[4],
                }}
              />
              {/* Contenedor del texto y radio con divider */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `${spacing[4]} 0`,
                  borderBottom: index < currencies.length - 1 ? `1px solid ${colors.semantic.border.light}` : 'none',
                }}
              >
                {/* Información de la moneda */}
                <div style={{ textAlign: 'left' }}>
                  <p
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.semantic.text.primary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      margin: 0,
                    }}
                  >
                    {currency.name}
                  </p>
                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.semantic.text.secondary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      margin: 0,
                      marginTop: spacing['0.5'],
                    }}
                  >
                    {currency.balance} {currency.symbol}
                  </p>
                </div>
                {/* Radio button a la derecha */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: borderRadius.full,
                    border: exchangeFromCurrency.id === currency.id 
                      ? `2px solid ${colors.primary.main}` 
                      : `2px solid ${colors.semantic.border.medium}`,
                    backgroundColor: exchangeFromCurrency.id === currency.id 
                      ? colors.primary.main 
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  {exchangeFromCurrency.id === currency.id && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Bottom Sheet - Seleccionar moneda destino (cambio) */}
      <BottomSheet
        isOpen={isExchangeToCurrencySheetOpen}
        onClose={() => setIsExchangeToCurrencySheetOpen(false)}
        title="Cuenta destino"
        showGraber={true}
        zIndex={1100}
        rightIcon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke={colors.semantic.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        onRightIconClick={() => setIsExchangeToCurrencySheetOpen(false)}
      >
        <div style={{ padding: 0 }}>
          {currencies.map((currency, index) => (
            <button
              key={currency.id}
              onClick={() => {
                // Si selecciona la misma moneda que está en origen, intercambiar
                if (currency.id === exchangeFromCurrency.id) {
                  setExchangeFromCurrency(exchangeToCurrency);
                }
                setExchangeToCurrency(currency);
                setIsExchangeToCurrencySheetOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
                padding: 0,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {/* Bandera de la moneda */}
              <img
                src={getCurrencyFlag(currency.symbol)}
                alt={`Bandera ${currency.symbol}`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: borderRadius.full,
                  objectFit: 'cover',
                  flexShrink: 0,
                  marginTop: spacing[4],
                  marginBottom: spacing[4],
                }}
              />
              {/* Contenedor del texto y radio con divider */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `${spacing[4]} 0`,
                  borderBottom: index < currencies.length - 1 ? `1px solid ${colors.semantic.border.light}` : 'none',
                }}
              >
                {/* Información de la moneda */}
                <div style={{ textAlign: 'left' }}>
                  <p
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.semantic.text.primary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      margin: 0,
                    }}
                  >
                    {currency.name}
                  </p>
                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.semantic.text.secondary,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      margin: 0,
                      marginTop: spacing['0.5'],
                    }}
                  >
                    {currency.balance} {currency.symbol}
                  </p>
                </div>
                {/* Radio button a la derecha */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: borderRadius.full,
                    border: exchangeToCurrency.id === currency.id 
                      ? `2px solid ${colors.primary.main}` 
                      : `2px solid ${colors.semantic.border.medium}`,
                    backgroundColor: exchangeToCurrency.id === currency.id 
                      ? colors.primary.main 
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  {exchangeToCurrency.id === currency.id && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
