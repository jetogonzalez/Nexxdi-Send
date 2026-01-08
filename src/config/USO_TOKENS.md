# 📖 Guía de Uso - Tokens y Variables

## Design Tokens

### Uso en Componentes TypeScript/React

```typescript
import { colors, spacing, typography } from '@/config/design-tokens';

function MyComponent() {
  return (
    <div style={{ 
      color: colors.primary[500],
      padding: spacing[4],
      fontSize: typography.fontSize.xl 
    }}>
      Contenido
    </div>
  );
}
```

### Uso en Componentes Astro

```astro
---
import { colors, spacing } from '@/config/design-tokens';
---

<div style={`color: ${colors.primary[500]}; padding: ${spacing[4]};`}>
  Contenido
</div>
```

### Uso con Tailwind CSS

Los tokens están integrados en Tailwind, puedes usarlos directamente:

```html
<!-- Colores -->
<div class="bg-primary-500 text-white">Contenido</div>
<div class="bg-secondary-400">Contenido</div>

<!-- Espaciado -->
<div class="p-4 m-6">Contenido</div>

<!-- Tipografía -->
<h1 class="text-2xl font-bold">Título</h1>

<!-- Bordes -->
<div class="rounded-lg border-2">Contenido</div>

<!-- Sombras -->
<div class="shadow-lg">Contenido</div>
```

### Clases de Tailwind Disponibles

#### Colores
- `bg-primary-{50-900}` - Colores primarios
- `bg-secondary-{50-900}` - Colores secundarios
- `bg-success-{50,100,500,600,700}` - Colores de éxito
- `bg-error-{50,100,500,600,700}` - Colores de error
- `bg-warning-{50,100,500,600,700}` - Colores de advertencia
- `bg-info-{50,100,500,600,700}` - Colores informativos
- `bg-gray-{50-900}` - Escala de grises

#### Aliases Rápidos
- `bg-primary` = `bg-primary-500`
- `bg-secondary` = `bg-secondary-500`
- `bg-success` = `bg-success-500`
- `bg-error` = `bg-error-500`
- `bg-warning` = `bg-warning-500`
- `bg-info` = `bg-info-500`

## Variables de Entorno

### Configuración Inicial

1. Copia el archivo de ejemplo:
   ```bash
   cp env.example .env
   ```

2. Edita `.env` y completa los valores:
   ```env
   PUBLIC_API_URL=https://api.tu-dominio.com
   PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
   # ... etc
   ```

### Uso en Código

```typescript
import { env, isDev, getApiUrl } from '@/config/env';

// Acceder a variables
console.log(env.PUBLIC_API_URL);
console.log(env.PUBLIC_APP_NAME);

// Verificar entorno
if (isDev) {
  console.log('Modo desarrollo');
}

// Construir URLs de API
const usersUrl = getApiUrl('/users');
const postsUrl = getApiUrl('/posts');
```

### Variables Disponibles

#### API
- `env.PUBLIC_API_URL` - URL base de la API

#### Firebase
- `env.PUBLIC_FIREBASE_PROJECT_ID`
- `env.PUBLIC_FIREBASE_API_KEY`
- `env.PUBLIC_FIREBASE_AUTH_DOMAIN`
- `env.PUBLIC_FIREBASE_STORAGE_BUCKET`
- `env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `env.PUBLIC_FIREBASE_APP_ID`

#### App Info
- `env.PUBLIC_APP_NAME`
- `env.PUBLIC_APP_VERSION`
- `env.PUBLIC_APP_URL`

#### Feature Flags
- `env.PUBLIC_ENABLE_ANALYTICS` - Boolean
- `env.PUBLIC_ENABLE_DEBUG` - Boolean

#### Helpers
- `isDev` - true en desarrollo
- `isProd` - true en producción
- `getApiUrl(endpoint)` - Construye URL completa de API

## Ejemplos Prácticos

### Botón con Tokens

```astro
---
import { colors, spacing, borderRadius } from '@/config/design-tokens';
---

<button 
  style={`
    background-color: ${colors.primary[500]};
    color: ${colors.white};
    padding: ${spacing[3]} ${spacing[6]};
    border-radius: ${borderRadius.lg};
    border: none;
    cursor: pointer;
  `}
>
  Click me
</button>
```

### Componente React con Tokens

```tsx
import { colors, spacing } from '@/config/design-tokens';

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {children}
    </div>
  );
}
```

### Usar Variables de Entorno

```astro
---
import { env } from '@/config/env';
---

<meta name="app-version" content={env.PUBLIC_APP_VERSION} />
```

## Sincronización con Figma

Para mantener los tokens sincronizados con Figma:

1. Exporta tokens desde Figma usando plugins como "Figma Tokens"
2. Convierte el JSON exportado a TypeScript
3. Actualiza `design-tokens.ts` con los nuevos valores
4. Actualiza también `design-tokens.js` para Tailwind

## Mejores Prácticas

1. ✅ **Siempre usa tokens** - No valores hardcodeados
2. ✅ **Usa Tailwind cuando sea posible** - Más eficiente
3. ✅ **Importa solo lo necesario** - Tree-shaking
4. ✅ **Mantén consistencia** - Usa los mismos tokens en toda la app
5. ✅ **Documenta cambios** - Si cambias tokens, actualiza la documentación
