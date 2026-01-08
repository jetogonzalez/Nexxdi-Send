# 🚀 Guía de Inicio Rápido - Send App

## Paso 1: Instalar Dependencias

```bash
cd /Users/jettogonzalez/Documents/Work/Nexxdi/Send/App
npm install
```

## Paso 2: Configurar Firebase

### 2.1 Instalar Firebase CLI (si no lo tienes)

```bash
npm install -g firebase-tools
```

### 2.2 Iniciar sesión en Firebase

```bash
firebase login
```

### 2.3 Crear/Seleccionar Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Activa **Firebase Hosting** en el proyecto
4. Copia el **Project ID**

### 2.4 Configurar el proyecto en tu código

Edita el archivo `.firebaserc` y reemplaza `your-firebase-project-id` con tu Project ID real.

O ejecuta:
```bash
firebase use --add
```
Y selecciona tu proyecto cuando te lo pida.

## Paso 3: Crear Iconos de la App

Necesitas crear estos iconos y colocarlos en `public/`:

- `icon-192.png` (192x192 píxeles)
- `icon-512.png` (512x512 píxeles)
- `favicon.svg` o `favicon.png`

**Herramientas recomendadas:**
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

## Paso 4: Probar Localmente

```bash
npm run dev
```

Abre `http://localhost:4321` en tu navegador.

## Paso 5: Build y Despliegue

### 5.1 Build de producción

```bash
npm run build
```

Esto creará la carpeta `dist/` con los archivos estáticos.

### 5.2 Desplegar a Firebase

```bash
npm run deploy
```

O manualmente:
```bash
firebase deploy --only hosting
```

### 5.3 Ver tu app en producción

Tu app estará disponible en:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

## Paso 6: Configurar Git

### 6.1 Inicializar repositorio

```bash
git init
git add .
git commit -m "Initial commit: Send App PWA con Astro"
```

### 6.2 Conectar con repositorio remoto

```bash
git remote add origin <URL-DE-TU-REPOSITORIO>
git branch -M main
git push -u origin main
```

## Paso 7: Instalar en Dispositivos Móviles

### Android (Chrome)

1. Abre la URL de tu app en Chrome
2. Toca el menú (3 puntos)
3. Selecciona "Añadir a pantalla de inicio"
4. La app aparecerá como una app nativa

### iOS (Safari)

1. Abre la URL en Safari (no en Chrome)
2. Toca el botón de compartir (cuadrado con flecha)
3. Selecciona "Añadir a pantalla de inicio"
4. La app aparecerá en el home screen

## 📝 Próximos Pasos

1. **Integrar diseños de Figma:**
   - Exporta assets desde Figma
   - Colócalos en `public/` o `src/assets/`
   - Crea componentes en `src/components/`

2. **Personalizar la app:**
   - Edita `src/pages/index.astro` para tu contenido
   - Modifica `public/manifest.json` con la información de tu app
   - Ajusta colores y estilos en `tailwind.config.mjs`

3. **Agregar más páginas:**
   - Crea nuevos archivos `.astro` en `src/pages/`
   - Astro crea rutas automáticamente basado en la estructura de carpetas

## 🆘 Problemas Comunes

**Error: "Firebase project not found"**
- Verifica que `.firebaserc` tenga el Project ID correcto
- Ejecuta `firebase use --add` de nuevo

**Error: "Service Worker no se registra"**
- Asegúrate de que `service-worker.js` esté en `public/`
- En desarrollo local, usa `http://localhost` (no `127.0.0.1`)

**La app no se instala en iOS**
- Debe abrirse desde Safari, no Chrome
- Verifica que `manifest.json` tenga todos los campos requeridos

## 📚 Recursos Útiles

- [Documentación Astro](https://docs.astro.build)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [PWA Checklist](https://web.dev/pwa-checklist/)
