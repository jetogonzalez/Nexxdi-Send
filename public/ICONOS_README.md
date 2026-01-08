# 📱 Iconos Requeridos para PWA

Para que tu PWA funcione correctamente, necesitas crear estos iconos y colocarlos en esta carpeta (`public/`):

## Iconos Requeridos

1. **icon-192.png**
   - Tamaño: 192x192 píxeles
   - Formato: PNG
   - Uso: Icono pequeño para la app

2. **icon-512.png**
   - Tamaño: 512x512 píxeles
   - Formato: PNG
   - Uso: Icono grande para la app

3. **favicon.svg** o **favicon.png**
   - Tamaño: 32x32 o 64x64 píxeles (si PNG)
   - Formato: SVG (recomendado) o PNG
   - Uso: Favicon del navegador

## Herramientas Recomendadas

### Opción 1: PWA Asset Generator (CLI)
```bash
npx pwa-asset-generator <tu-imagen-original.png> ./public --icon-only
```

### Opción 2: RealFaviconGenerator (Web)
1. Ve a https://realfavicongenerator.net/
2. Sube tu imagen
3. Descarga los iconos generados
4. Colócalos en `public/`

### Opción 3: Figma Export
Si tienes los diseños en Figma:
1. Crea un frame de 512x512px
2. Exporta como PNG
3. Redimensiona a 192x192 para el icono pequeño
4. Guarda ambos en `public/`

## Notas Importantes

- Los iconos deben tener fondo sólido o transparente
- Para mejor compatibilidad, usa iconos con forma cuadrada
- Los iconos deben verse bien tanto en modo claro como oscuro
- En iOS, el icono se mostrará con esquinas redondeadas automáticamente

## Verificación

Después de agregar los iconos, verifica que:
- ✅ `public/icon-192.png` existe
- ✅ `public/icon-512.png` existe
- ✅ `public/favicon.svg` o `favicon.png` existe
- ✅ Los tamaños son correctos
