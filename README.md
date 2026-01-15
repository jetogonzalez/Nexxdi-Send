# Nexxdi Cash

Aplicación móvil construida con Astro, Capacitor y Firebase. Disponible como PWA y apps nativas iOS/Android.

## 🚀 Características

- ✅ PWA completa (instalable en iOS y Android)
- ✅ Apps nativas iOS y Android con Capacitor
- ✅ Service Worker para funcionamiento offline
- ✅ Optimizada para móviles
- ✅ Despliegue en Firebase Hosting
- ✅ Distribución mediante Firebase App Distribution
- ✅ Design tokens centralizados
- ✅ Onboarding flow con transiciones suaves

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
├── android/            # Proyecto Android nativo (Capacitor)
├── ios/                # Proyecto iOS nativo (Capacitor)
├── public/             # Archivos estáticos
│   ├── manifest.json   # Configuración PWA
│   ├── service-worker.js
│   └── img/            # Imágenes y assets
├── src/
│   ├── components/     # Componentes React
│   │   └── onboarding/ # Componentes de onboarding
│   ├── config/         # Configuración y tokens
│   │   ├── design-tokens.ts  # Tokens de diseño
│   │   └── env.ts      # Variables de entorno
│   ├── layouts/        # Layouts de Astro
│   ├── lib/            # Utilidades
│   │   ├── firebase.ts # Configuración Firebase
│   │   └── motion.ts   # Transiciones y animaciones
│   └── pages/          # Páginas (rutas)
├── astro.config.mjs    # Configuración de Astro
├── capacitor.config.ts # Configuración Capacitor
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

### Desarrollo Web
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build local
- `npm run deploy` - Build y deploy a Firebase

### Apps Nativas (Capacitor)
- `npm run build:sync` - Build y sincronizar con plataformas nativas
- `npm run open:ios` - Abrir proyecto iOS en Xcode
- `npm run open:android` - Abrir proyecto Android en Android Studio
- `npm run sync` - Sincronizar cambios con plataformas nativas
- `npm run android:build` - Generar Android App Bundle (.aab)
- `npm run android:build:apk` - Generar APK para Android

## 🔐 Variables de Entorno

Crea un archivo `.env` si necesitas variables de entorno:
```
PUBLIC_API_URL=https://api.example.com
```

## 📱 Distribución

### PWA (Web)
- URL: https://nexxdi-send-jetto-gonzalez.web.app
- Instalación: Desde Safari (iOS) o Chrome (Android)

### Apps Nativas
- **Android:** Ver `PASOS_RAPIDOS_ANDROID.md` para distribución con Firebase App Distribution
- **iOS:** Requiere cuenta de Apple Developer ($99/año). Ver `CONVERTIR_A_NATIVA.md`

## 📚 Documentación Adicional

- `PASOS_RAPIDOS_ANDROID.md` - Guía rápida para distribuir Android
- `CONFIGURAR_ANDROID.md` - Configuración completa de Android
- `CONVERTIR_A_NATIVA.md` - Guía completa para apps nativas
- `INSTALAR_EN_IPHONE.md` - Instrucciones de instalación PWA en iPhone
- `SEGURIDAD_REACT.md` - Información sobre seguridad React

## 📚 Recursos

- [Documentación Astro](https://docs.astro.build)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase App Distribution](https://firebase.google.com/docs/app-distribution)
- [PWA Guide](https://web.dev/progressive-web-apps/)

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
