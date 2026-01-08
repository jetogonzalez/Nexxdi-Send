# Send App - PWA con Astro y Firebase

Aplicación móvil Progressive Web App (PWA) construida con Astro, lista para iOS y Android, desplegada en Firebase Hosting.

## 🚀 Características

- ✅ PWA completa (instalable en iOS y Android)
- ✅ Service Worker para funcionamiento offline
- ✅ Optimizada para móviles
- ✅ Despliegue en Firebase Hosting
- ✅ Lista para integrar diseños de Figma

## 📋 Prerequisitos

- Node.js 18+ y npm
- Cuenta de Firebase
- Git

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar Firebase:**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Activa Firebase Hosting
   - Copia tu Project ID

3. **Configurar proyecto Firebase:**
   - Edita `.firebaserc` y reemplaza `your-firebase-project-id` con tu Project ID
   - O ejecuta: `firebase use --add` y selecciona tu proyecto

4. **Iniciar desarrollo:**
```bash
npm run dev
```

La app estará disponible en `http://localhost:4321`

## 📱 Generar Iconos para PWA

Necesitas crear los iconos para la PWA. Puedes usar herramientas como:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

Coloca los iconos en `public/`:
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)
- `favicon.svg` o `favicon.png`

## 🏗️ Estructura del Proyecto

```
App/
├── public/              # Archivos estáticos
│   ├── manifest.json   # Configuración PWA
│   ├── service-worker.js
│   └── icon-*.png      # Iconos de la app
├── src/
│   ├── layouts/        # Layouts de Astro
│   ├── pages/          # Páginas (rutas)
│   └── components/     # Componentes React/Astro
├── astro.config.mjs    # Configuración de Astro
├── firebase.json       # Configuración Firebase Hosting
└── package.json
```

## 🎨 Integrar Diseños de Figma

1. **Exportar assets desde Figma:**
   - Exporta imágenes, iconos y fuentes
   - Colócalos en `public/` o `src/assets/`

2. **Usar tokens de diseño:**
   - Crea un archivo de configuración con colores, tipografías, etc.
   - Ejemplo: `src/config/design-tokens.ts`

3. **Componentes:**
   - Crea componentes reutilizables en `src/components/`
   - Puedes usar React o Astro components

## 📦 Build y Despliegue

1. **Build de producción:**
```bash
npm run build
```

2. **Desplegar a Firebase:**
```bash
npm run deploy
```

O manualmente:
```bash
firebase deploy --only hosting
```

3. **Ver tu app:**
   - La URL será: `https://your-project-id.web.app`
   - O tu dominio personalizado si lo configuraste

## 📱 Instalar en Dispositivos

### Android:
1. Abre la URL de tu app en Chrome
2. Menú → "Añadir a pantalla de inicio"
3. La app aparecerá como una app nativa

### iOS:
1. Abre la URL en Safari
2. Compartir → "Añadir a pantalla de inicio"
3. La app aparecerá en el home screen

## 🔧 Configuración Git

1. **Inicializar repositorio:**
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Conectar con repositorio remoto:**
```bash
git remote add origin <tu-repositorio-url>
git branch -M main
git push -u origin main
```

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build local
- `npm run deploy` - Build y deploy a Firebase

## 🔐 Variables de Entorno

Crea un archivo `.env` si necesitas variables de entorno:
```
PUBLIC_API_URL=https://api.example.com
```

## 📚 Recursos

- [Documentación Astro](https://docs.astro.build)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Astro + React](https://docs.astro.build/en/guides/integrations-guide/react/)

## 🐛 Troubleshooting

**Problema: Firebase no encuentra el proyecto**
- Verifica que `.firebaserc` tenga el Project ID correcto
- Ejecuta `firebase login` y `firebase use --add`

**Problema: Service Worker no funciona**
- Verifica que `service-worker.js` esté en `public/`
- Asegúrate de usar HTTPS en producción (Firebase lo proporciona automáticamente)

**Problema: App no se instala**
- Verifica que `manifest.json` esté correcto
- Asegúrate de tener los iconos requeridos
- En iOS, solo funciona desde Safari

## 📄 Licencia

MIT
