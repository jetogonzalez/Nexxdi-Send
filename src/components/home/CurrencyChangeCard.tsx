import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { useState, useEffect } from 'react';
import { getCurrencyHistory, getCurrentRate, getRate24HoursAgo, calculatePercentageChange, type CurrencyRate } from '../../lib/currencyApi';

interface CurrencyChangeCardProps {
  currencyName: string; // Nombre de la moneda (ej: "Peso colombiano")
  currencyCode: string; // Código de la moneda (ej: "COP")
  vsCurrency?: string; // Moneda de comparación (ej: "USD")
  timeFrame?: string; // Marco temporal (ej: "hoy")
  autoUpdate?: boolean; // Si debe actualizarse automáticamente
  updateInterval?: number; // Intervalo de actualización en segundos (default: 20 para tiempo real)
}

/**
 * Card que muestra información de cambio de moneda con gráfico
 * Border radius: 24px
 * Fondo blanco
 * Muestra valor, porcentaje de cambio y gráfico de línea
 */
export function CurrencyChangeCard({
  currencyName,
  currencyCode,
  vsCurrency = 'USD',
  timeFrame = 'hoy',
  autoUpdate = true,
  updateInterval = 20, // 20 segundos para actualización en tiempo real
}: CurrencyChangeCardProps) {
  const [currentRate, setCurrentRate] = useState<number>(0);
  const [rate24HoursAgo, setRate24HoursAgo] = useState<number>(0); // Tasa de hace 24 horas para calcular porcentaje
  const [historyData, setHistoryData] = useState<CurrencyRate[]>([]);
  const [chartData, setChartData] = useState<number[]>([]); // Datos del gráfico que crece hacia la derecha
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales y configurar actualización automática
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener tasa actual, tasa de hace 24 horas e historial en paralelo
        const [current, rateYesterday, history] = await Promise.all([
          getCurrentRate(vsCurrency, currencyCode),
          getRate24HoursAgo(vsCurrency, currencyCode),
          getCurrencyHistory(vsCurrency, currencyCode),
        ]);
        
        // Validar que la tasa actual sea válida (mayor a 0)
        // La API retorna: 1 USD = current COP (como Google/Wise)
        if (!current || current <= 0 || isNaN(current)) {
          throw new Error(`Tasa de cambio inválida: ${current}`);
        }
        
        setCurrentRate(current);
        setRate24HoursAgo(rateYesterday);
        
        // Validar y usar historial REAL de la API
        if (history.length > 0) {
          // Filtrar solo tasas válidas
          const validHistory = history.filter((item) => item.rate > 0 && !isNaN(item.rate));
          if (validHistory.length > 0) {
            // Usar los datos históricos REALES de la API
            setHistoryData(validHistory);
            
            // Inicializar gráfica con datos históricos REALES + tasa actual
            // Todos los datos vienen de la misma fuente (API) y tienen el mismo descuento aplicado
            const historicalRates = validHistory.map((item) => item.rate);
            const allRates = [...historicalRates, current]; // Agregar tasa actual al final (7 días + hoy = 8 puntos)
            
            // Usar todos los datos de la semana (máximo 8 puntos: 7 días históricos + tasa actual)
            setChartData(allRates);
          } else {
            // Solo usar fallback si realmente no hay datos válidos
            console.warn('No hay datos históricos válidos de la API');
            const fallbackHistory = Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i)); // Últimos 7 días
              // Usar variación determinística basada en el índice para consistencia
              const variation = (Math.sin(i * 0.5) * 0.01); // Variación determinística
              return {
                date: date.toISOString().split('T')[0],
                rate: current * (1 + variation),
              };
            });
            setHistoryData(fallbackHistory);
            setChartData(fallbackHistory.map((item) => item.rate));
          }
        } else {
          // Solo usar fallback si realmente no hay historial
          console.warn('No hay historial disponible de la API');
          const fallbackHistory = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i)); // Últimos 7 días
            const variation = (Math.random() - 0.5) * 0.02; // ±1% variación
            return {
              date: date.toISOString().split('T')[0],
              rate: current * (1 + variation),
            };
          });
          setHistoryData(fallbackHistory);
          setChartData(fallbackHistory.map((item) => item.rate));
        }
      } catch (err) {
        console.error('Error loading currency data:', err);
        setError('Error al cargar datos');
        // Usar datos de ejemplo válidos en caso de error: 1 USD = 4080 COP
        const fallbackRate = 4080 * 1.005; // Aplicar descuento del 0.5%
        setCurrentRate(fallbackRate);
        setRate24HoursAgo(fallbackRate * 0.998); // Tasa de ayer ligeramente menor para variación
        // Generar historial de ejemplo realista (7 días) con variación determinística
        const fallbackHistory = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i)); // Últimos 7 días
          // Usar variación determinística basada en el índice para consistencia
          const variation = (Math.sin(i * 0.5) * 0.01); // Variación determinística
          return {
            date: date.toISOString().split('T')[0],
            rate: fallbackRate * (1 + variation),
          };
        });
        setHistoryData(fallbackHistory);
        // Incluir tasa actual al final para tener 8 puntos (7 días + hoy)
        const fallbackRates = fallbackHistory.map((item) => item.rate);
        setChartData([...fallbackRates, fallbackRate]);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Configurar actualización automática si está habilitada
    if (autoUpdate) {
      const intervalMs = updateInterval * 1000; // Convertir segundos a milisegundos
      const intervalId = setInterval(loadData, intervalMs);
      
      return () => clearInterval(intervalId);
    }
  }, [vsCurrency, currencyCode, autoUpdate, updateInterval]);

  // Calcular cambio porcentual basado en datos REALES de la API
  // Comparar el valor actual vs el de hace 7 días (primer valor del historial de una semana)
  // Esto asegura que el porcentaje corresponda a los datos reales mostrados en la gráfica
  const changePercentage = historyData.length >= 2
    ? calculatePercentageChange(
        currentRate, // Valor actual (más reciente)
        historyData[0].rate // Primer valor del historial (hace 7 días)
      )
    : currentRate > 0 && rate24HoursAgo > 0
    ? calculatePercentageChange(currentRate, rate24HoursAgo) // Fallback: usar tasa actual vs hace 24h
    : 0;

  const changeDirection: 'up' | 'down' = changePercentage >= 0 ? 'up' : 'down';

  // Formatear el valor con separadores de miles
  const formattedValue = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(currentRate);

  // Formatear el porcentaje
  const formattedPercentage = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(changePercentage));

  // Color del cambio (verde específico para positivo, rojo para negativo)
  const changeColor = changeDirection === 'up' ? '#0BBD2B' : colors.error[500];
  
  // Color del icono: igual al del porcentaje pero un poco más oscuro
  // Usar brightness para oscurecer el color del porcentaje
  const iconColor = changeColor;

  // Usar datos del gráfico que crece hacia la derecha
  const displayChartData = chartData.length > 0 
    ? chartData
    : [4080, 4075, 4085, 4070, 4080]; // Datos de fallback si no hay datos
  
  // Constantes del gráfico usando tokens
  const chartWidth = 100; // Ancho fijo del gráfico: 100px (reducido de 120px)
  const padding = 2; // Padding interno para evitar que la línea toque los bordes
  
  // Calcular altura proporcional basada en los datos
  const maxValue = Math.max(...displayChartData);
  const minValue = Math.min(...displayChartData);
  const range = maxValue - minValue;
  
  // Determinar la tendencia basada en el cambio porcentual
  // Si el cambio es negativo (baja), la gráfica debe mostrar una tendencia descendente consistente
  const firstValue = displayChartData[0];
  const lastValue = displayChartData[displayChartData.length - 1];
  const isDescendingTrend = changePercentage < 0 || firstValue > lastValue;
  
  // Si el rango es muy pequeño o cero, usar un rango mínimo para que se vea variación
  const effectiveRange = range > 0 ? range : maxValue * 0.01; // 1% del valor máximo como mínimo
  
  // Altura fija de 40px para mejor visualización
  const chartHeight = 40;
  
  // Crear puntos del gráfico con suavizado
  // Los puntos se distribuyen horizontalmente en los 120px
  const points = displayChartData.map((val, index) => {
    const divisor = Math.max(displayChartData.length - 1, 1);
    const x = (index / divisor) * (chartWidth - padding * 2) + padding;
    
    // Normalizar verticalmente: el valor más bajo va abajo, el más alto arriba
    let normalizedVal;
    if (effectiveRange > 0) {
      normalizedVal = ((val - minValue) / effectiveRange) * (chartHeight - padding * 2);
    } else {
      normalizedVal = (chartHeight - padding * 2) / 2; // Centro si no hay variación
    }
    
    // Calcular posición Y sin ajustes artificiales - mostrar los datos reales
    let y = chartHeight - normalizedVal - padding;
    
    // Asegurar que el valor mínimo esté en la parte inferior y el máximo en la superior
    y = Math.max(padding, Math.min(chartHeight - padding, y));
    
    return { x, y };
  });
  
  // Crear path suave usando curvas de Bézier para un aspecto más limpio
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      if (next) {
        // Usar curvas de Bézier para suavizar
        const cp1x = prev.x + (curr.x - prev.x) / 2;
        const cp1y = prev.y;
        const cp2x = curr.x - (next.x - curr.x) / 2;
        const cp2y = curr.y;
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
      } else {
        path += ` L ${curr.x},${curr.y}`;
      }
    }
    
    return path;
  };
  
  const pathData = createSmoothPath(points);

  // Skeleton loader elegante que simula el contenido
  if (loading && currentRate === 0) {
    return (
      <div
        style={{
          width: '100%',
          borderRadius: borderRadius['3xl'],
          backgroundColor: colors.semantic.background.white,
          padding: spacing[8], // 32px de padding (igual que el contenido real)
          display: 'flex',
          alignItems: 'flex-end', // Alineado abajo (igual que el contenido real)
          justifyContent: 'flex-start', // Alineado a la izquierda
          gap: spacing[4], // 16px de espacio entre secciones (ajustado)
          marginBottom: spacing[6],
          height: '180px', // Altura fija para el skeleton (ajustada de 146px)
          boxSizing: 'border-box',
        }}
      >
        {/* Sección izquierda - Skeleton del contenido (solo tres líneas) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[2], // 8px entre líneas
            flex: 1,
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
          }}
        >
          {/* Primera línea */}
          <div
            style={{
              width: '140px',
              height: '16px',
              backgroundColor: colors.semantic.text.secondary,
              borderRadius: borderRadius.base,
              opacity: 0.12,
            }}
          />
          {/* Segunda línea */}
          <div
            style={{
              width: '180px',
              height: '24px',
              backgroundColor: colors.semantic.text.secondary,
              borderRadius: borderRadius.base,
              opacity: 0.12,
            }}
          />
          {/* Tercera línea */}
          <div
            style={{
              width: '100px',
              height: '14px',
              backgroundColor: colors.semantic.text.secondary,
              borderRadius: borderRadius.base,
              opacity: 0.12,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        borderRadius: borderRadius['3xl'], // 24px
        backgroundColor: colors.semantic.background.white,
        padding: spacing[8], // 32px de padding (más grande)
        display: 'flex',
        alignItems: 'flex-end', // Alineado abajo
        justifyContent: 'flex-start', // Alineado a la izquierda
        gap: spacing[4], // 16px de espacio entre secciones
        marginBottom: spacing[6], // 24px de margin inferior
        boxSizing: 'border-box',
      }}
    >
      {/* Sección izquierda - Información de la moneda */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[0.5], // 2px entre elementos (reducido para el espacio entre valor y porcentaje)
          flex: 1,
          alignItems: 'flex-start', // Alineado a la izquierda
          justifyContent: 'flex-end', // Alineado abajo
        }}
      >
        {/* Nombre de la moneda - Título */}
        <div
          style={{
            fontFamily: typography.fontFamily.sans.join(', '), // Manrope
            fontSize: typography.fontSize.lg, // 18px (1.125rem)
            fontWeight: typography.fontWeight.bold, // 700 (Bold)
            color: colors.semantic.text.primary,
            lineHeight: spacing[6], // 24px (1.5rem)
            letterSpacing: '0%',
            height: spacing[6], // 24px (1.5rem)
            marginBottom: spacing[2], // 8px adicionales de espacio debajo del título para separarlo del valor
          }}
        >
          {currencyName}
        </div>

        {/* Valor principal - Moneda */}
        <div
          style={{
            fontFamily: typography.fontFamily.sans.join(', '), // Manrope
            fontSize: typography.fontSize['2xl'], // 24px (1.5rem)
            fontWeight: typography.fontWeight.extrabold, // 800 (ExtraBold)
            color: colors.semantic.text.primary, // #101828 (mismo que text.primary)
            lineHeight: spacing[8], // 32px (2rem)
            letterSpacing: '-0.04em', // -4%
            marginBottom: 0, // Sin margin adicional, el gap del contenedor lo maneja
            whiteSpace: 'nowrap', // Evitar que se parta en múltiples líneas
          }}
        >
          {currencyCode === 'COP' 
            ? `1 ${vsCurrency} = ${formattedValue} ${currencyCode}`
            : `${formattedValue} ${currencyCode}`
          }
        </div>

        {/* Indicador de cambio - Debajo del valor principal */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[3], // 12px entre elementos (aumentado para el espacio entre porcentaje y link)
            alignItems: 'flex-start',
          }}
        >
          {/* Primera línea: icono porcentaje vs USD hoy */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1], // 4px entre icono y texto
              fontFamily: typography.fontFamily.sans.join(', '), // Manrope
              fontSize: typography.fontSize.xs, // 12px (0.75rem)
              fontWeight: typography.fontWeight.normal, // 400 (Regular) - se sobrescribe en los spans hijos
              color: colors.semantic.text.secondary,
              lineHeight: '18px', // 18px (1.5 * 12px)
              letterSpacing: '0%',
            }}
          >
            <div style={{ color: changeColor, display: 'flex', alignItems: 'center' }}>
              {changeDirection === 'up' ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                  <path d="M16.5 5.25L10.5985 11.1515C10.3015 11.4485 10.153 11.597 9.98176 11.6526C9.83113 11.7016 9.66887 11.7016 9.51824 11.6526C9.34699 11.597 9.19849 11.4485 8.90147 11.1515L6.84853 9.09853C6.55152 8.80152 6.40301 8.65301 6.23176 8.59737C6.08113 8.54842 5.91887 8.54842 5.76824 8.59737C5.59699 8.65301 5.44848 8.80152 5.15147 9.09853L1.5 12.75M16.5 5.25H11.25M16.5 5.25V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                  <path d="M22 17L14.1314 9.13137C13.7354 8.73535 13.5373 8.53735 13.309 8.46316C13.1082 8.3979 12.8918 8.3979 12.691 8.46316C12.4627 8.53735 12.2646 8.73535 11.8686 9.13137L9.13137 11.8686C8.73535 12.2646 8.53735 12.4627 8.30902 12.5368C8.10817 12.6021 7.89183 12.6021 7.69098 12.5368C7.46265 12.4627 7.26465 12.2646 6.86863 11.8686L2 7M22 17H15M22 17V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span style={{ color: changeColor, fontWeight: typography.fontWeight.bold, fontFamily: typography.fontFamily.sans.join(', ') }}>
              {formattedPercentage}%
            </span>
            <span style={{ fontWeight: typography.fontWeight.medium, fontSize: '13px' }}>vs {vsCurrency} hace 7 días</span>
          </div>
          
          {/* Segunda línea: Link "Calcula tu cambio →" */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // Aquí puedes agregar la lógica para abrir el calculador de cambio
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: typography.fontFamily.sans.join(', '), // Manrope
              fontSize: typography.fontSize.sm, // 14px (0.875rem) - aumentado de xs (12px)
              fontWeight: typography.fontWeight.bold, // Bold
              color: colors.semantic.text.primary,
              textDecoration: 'underline',
              textUnderlineOffset: '4px', // Espacio entre el texto y el underline
              textDecorationThickness: '1px', // Grosor del underline
              lineHeight: '20px', // Ajustado para el nuevo tamaño
              letterSpacing: '0%',
              cursor: 'pointer',
              padding: 0, // Sin padding
              margin: 0, // Sin margin
              borderRadius: borderRadius.full, // Border radius completo
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Calcula tu cambio →
          </a>
        </div>
      </div>

      {/* Sección derecha - Gráfico de línea que crece hacia la derecha */}
      <div
        style={{
          width: `${chartWidth}px`, // Ancho fijo: 120px
          height: `${chartHeight}px`, // Altura fija: 40px
          display: 'flex',
          alignItems: 'center', // Centrado verticalmente
          justifyContent: 'flex-end', // Alineado a la derecha
          position: 'relative',
          marginBottom: '8px', // Ajuste de posición vertical
        }}
      >
        <svg
          width={chartWidth}
          height={chartHeight}
          style={{ overflow: 'visible' }}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradiente lineal desde el color primario hasta transparente en la base */}
            <linearGradient id={`chartGradient-${currencyCode}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.primary.main} stopOpacity="1" />
              <stop offset="100%" stopColor={colors.primary.main} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Área del gráfico con gradiente (relleno debajo de la línea) */}
          {points.length > 0 && (
            <path
              d={`${pathData} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`}
              fill={`url(#chartGradient-${currencyCode})`}
              opacity="0.3"
              style={{
                transition: 'd 0.3s ease-out', // Animación suave cuando cambia
              }}
            />
          )}
          
          {/* Línea del gráfico con curva suave */}
          <path
            d={pathData}
            fill="none"
            stroke={colors.primary.main} // Color primario del proyecto
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: 'd 0.3s ease-out', // Animación suave cuando cambia
            }}
          />
        </svg>
      </div>
    </div>
  );
}
