# Regla Global de Formato de Moneda

## Formato Estándar

**REGLA APLICADA EN TODO EL PRODUCTO:**

- **Puntos (.)** para separar miles y millones
- **Coma (,)** para separar decimales/centavos
- **Ejemplo:** `1.000.000,23 USD`

## Uso

### Para balances visibles/ocultos:
```typescript
import { formatBalance } from '@/lib/formatBalance';

formatBalance(1000000.23, true);  // "1.000.000,23 USD"
formatBalance(1000000.23, false); // "••• USD"
```

### Para valores monetarios generales:
```typescript
import { formatCurrency } from '@/lib/formatBalance';

formatCurrency(1000000.23);           // "1.000.000,23 USD"
formatCurrency(1000000.23, 'EUR');    // "1.000.000,23 EUR"
formatCurrency(1000000.23, 'USD', false); // "1.000.000,23"
```

## Ejemplos de Formato

- `2344.02` → `2.344,02 USD`
- `1000000.50` → `1.000.000,50 USD`
- `500.75` → `500,75 USD`
- `1234567.89` → `1.234.567,89 USD`

## Notas

- Esta regla se aplica a **todos los valores de saldo** en el producto
- Siempre muestra 2 decimales
- Los separadores de miles se aplican automáticamente
