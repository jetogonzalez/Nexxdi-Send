# Configuración - Send App

Esta carpeta contiene los archivos de configuración centralizados para la aplicación.

## Archivos

### `design-tokens.ts`
Tokens de diseño centralizados:
- Colores (primarios, secundarios, estados)
- Tipografía (fuentes, tamaños, pesos)
- Espaciado
- Bordes y sombras
- Breakpoints para responsive
- Transiciones
- Z-index layers
- Temas (claro/oscuro)

**Uso:**
```typescript
import { colors, spacing, typography } from '@/config/design-tokens';

// En componentes
<div style={{ color: colors.primary[500], padding: spacing[4] }}>
  <h1 style={{ fontSize: typography.fontSize.xl }}>Título</h1>
</div>
```

### `env.ts`
Variables de entorno centralizadas y tipadas.

**Uso:**
```typescript
import { env, isDev, getApiUrl } from '@/config/env';

if (isDev) {
  console.log('Modo desarrollo');
}

const apiUrl = getApiUrl('/users');
```

### `.env.example`
Plantilla para variables de entorno. Copia este archivo a `.env` y completa los valores.

## Integración con Tailwind

Los tokens de diseño pueden ser integrados con Tailwind CSS en `tailwind.config.mjs`:

```javascript
import { colors, spacing, typography, borderRadius } from './src/config/design-tokens';

export default {
  theme: {
    extend: {
      colors: colors,
      spacing: spacing,
      fontSize: typography.fontSize,
      borderRadius: borderRadius,
    },
  },
}
```

## Integración con Figma

Para usar tokens desde Figma:

1. **Exporta tokens desde Figma:**
   - Usa plugins como "Figma Tokens" o "Design Tokens"
   - Exporta como JSON

2. **Convierte a TypeScript:**
   - Puedes crear un script para convertir el JSON de Figma
   - O manualmente actualiza `design-tokens.ts`

3. **Sincronización:**
   - Mantén los tokens sincronizados entre Figma y código
   - Considera usar herramientas como Style Dictionary

## Variables de Entorno

### Desarrollo Local

1. Copia `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Completa los valores en `.env`

3. Las variables estarán disponibles en `import.meta.env`

### Producción (Firebase Hosting)

Configura las variables en Firebase Console:
1. Ve a Firebase Console > Hosting
2. Configuración > Environment variables
3. Agrega las variables necesarias

O usa el archivo `.env.production` (no se sube a Git).

## Estructura Recomendada

```
src/config/
├── design-tokens.ts    # Tokens de diseño
├── env.ts              # Variables de entorno
└── README.md           # Esta documentación
```

## Mejores Prácticas

1. **Nunca subas `.env` a Git** - Ya está en `.gitignore`
2. **Usa tipos TypeScript** - Los tokens están tipados
3. **Mantén consistencia** - Usa siempre los tokens, no valores hardcodeados
4. **Documenta cambios** - Si cambias tokens, documenta el motivo
5. **Versiona tokens** - Considera versionar los tokens si cambian frecuentemente
