# Componentes

Aquí puedes crear tus componentes React o Astro.

## Componentes React

Crea archivos `.tsx` o `.jsx` para componentes React:

```tsx
// src/components/Button.tsx
import { useState } from 'react';

export function Button() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Click {count}</button>;
}
```

Úsalos en páginas Astro:

```astro
---
import { Button } from '../components/Button';
---

<Button client:load />
```

## Componentes Astro

Crea archivos `.astro` para componentes Astro (más ligeros, sin JavaScript por defecto):

```astro
---
// src/components/Card.astro
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="card">
  <h2>{title}</h2>
  <slot />
</div>
```

Úsalos directamente:

```astro
---
import Card from '../components/Card.astro';
---

<Card title="Mi Card">
  Contenido aquí
</Card>
```
