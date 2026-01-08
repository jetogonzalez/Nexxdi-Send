# Hook use3DTilt - Efecto 3D Sutil para Imágenes

Hook reutilizable que aplica un efecto 3D sutil a imágenes basado en la orientación del dispositivo (gyroscope).

## Características

- ✅ Rotación 3D basada en device orientation (beta/gamma)
- ✅ Máxima rotación configurable (default: 12 grados)
- ✅ Suavizado con low-pass filter para movimiento estable
- ✅ Dead zone para evitar micro movimientos
- ✅ Sombra dinámica que cambia con la rotación
- ✅ Soporte para permisos iOS (con botón CTA)
- ✅ Fallback a DeviceMotionEvent si DeviceOrientationEvent no está disponible
- ✅ Optimizado para 60fps con requestAnimationFrame

## Uso Básico

```tsx
import { use3DTilt } from '../../hooks/use3DTilt';

function MyComponent() {
  const {
    tiltState,
    isSupported,
    permissionGranted,
    requestPermission,
    style,
  } = use3DTilt({
    maxTilt: 12,
    smoothing: 0.15,
    perspective: 1000,
    deadZone: 0.5,
    enableShadow: true,
  });

  return (
    <div>
      <img
        src="/image.png"
        style={permissionGranted ? style : {}}
      />
      {isSupported && !permissionGranted && (
        <button onClick={requestPermission}>
          Habilitar movimiento 3D
        </button>
      )}
    </div>
  );
}
```

## Configuración

### Parámetros

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `maxTilt` | `number` | `12` | Máxima rotación en grados (recomendado: 10-15) |
| `smoothing` | `number` | `0.15` | Factor de suavizado 0-1 (más bajo = más suave, recomendado: 0.1-0.2) |
| `perspective` | `number` | `1000` | Profundidad de perspectiva en píxeles |
| `deadZone` | `number` | `0.5` | Zona muerta en grados para ignorar micro movimientos |
| `enableShadow` | `boolean` | `true` | Habilitar sombra dinámica |

### Ajustar Intensidad

**Más intenso:**
```tsx
use3DTilt({
  maxTilt: 15,        // Más rotación
  smoothing: 0.2,     // Menos suave (más rápido)
  deadZone: 0.3,     // Menos zona muerta
})
```

**Más sutil:**
```tsx
use3DTilt({
  maxTilt: 8,         // Menos rotación
  smoothing: 0.1,    // Más suave (más lento)
  deadZone: 1.0,     // Más zona muerta
})
```

### Ajustar Suavizado

El parámetro `smoothing` controla qué tan rápido responde el efecto:

- **0.1**: Muy suave, movimiento lento y fluido (recomendado para efecto premium)
- **0.15**: Balanceado (default)
- **0.2**: Más rápido, menos suave
- **0.3+**: Muy rápido, puede sentirse brusco

## Retorno del Hook

```typescript
interface Use3DTiltReturn {
  tiltState: {
    rotateX: number;    // Rotación en X (grados)
    rotateY: number;    // Rotación en Y (grados)
    shadowX: number;    // Offset de sombra X
    shadowY: number;    // Offset de sombra Y
  };
  isSupported: boolean;        // Si el dispositivo soporta motion sensors
  permissionGranted: boolean;   // Si se otorgó permiso (iOS)
  requestPermission: () => void; // Función para solicitar permiso
  style: React.CSSProperties;   // Estilos CSS listos para usar
}
```

## Permisos iOS

En iOS 13+, se requiere permiso explícito del usuario para acceder a device orientation. El hook detecta automáticamente si se necesita permiso y expone `requestPermission()` que debe ser llamado desde un gesto del usuario (click, touch, etc.).

```tsx
{isSupported && !permissionGranted && (
  <button onClick={requestPermission}>
    ✨ Habilitar movimiento 3D
  </button>
)}
```

## Rendimiento

- Usa `requestAnimationFrame` para actualizaciones a 60fps
- Low-pass filter para suavizado sin jitter
- Dead zone para evitar cálculos innecesarios
- `willChange: 'transform'` para optimización del navegador

## Compatibilidad

- ✅ Safari iOS 13+
- ✅ Chrome Android
- ✅ Firefox Mobile
- ✅ Edge Mobile
- ⚠️ Fallback automático si los sensores no están disponibles

## Ejemplo Completo

Ver `src/components/onboarding/OnboardingFlow.tsx` para un ejemplo completo de implementación.
