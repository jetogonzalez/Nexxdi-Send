# Componentes de Onboarding

Componentes reutilizables para el flujo de onboarding.

## Componentes

### `OnboardingStep`
Componente base para cada paso del onboarding.

**Props:**
- `step`: Número del paso actual (1-indexed)
- `totalSteps`: Total de pasos
- `title`: Título del paso
- `description`: Descripción opcional
- `children`: Contenido del paso
- `onNext`: Callback cuando se hace clic en "Siguiente"
- `onPrevious`: Callback cuando se hace clic en "Anterior"
- `onSkip`: Callback cuando se hace clic en "Saltar"
- `showNext`: Mostrar botón siguiente (default: true)
- `showPrevious`: Mostrar botón anterior (default: true)
- `showSkip`: Mostrar botón saltar (default: false)

**Ejemplo de uso:**

```tsx
<OnboardingStep
  step={1}
  totalSteps={3}
  title="Bienvenido"
  description="Te guiaremos paso a paso"
  onNext={() => setStep(2)}
>
  <div>Contenido del paso 1</div>
</OnboardingStep>
```

## Próximos pasos

Cuando recibas los diseños de Figma:
1. Crea componentes específicos para cada paso
2. Usa los tokens de diseño de `src/config/design-tokens.ts`
3. Implementa las animaciones y transiciones según el diseño
4. Asegúrate de que sea responsive para móviles
