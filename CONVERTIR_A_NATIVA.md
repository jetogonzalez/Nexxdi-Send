# 📱 Convertir PWA a Apps Nativas con Capacitor

Esta guía te ayudará a convertir tu PWA en apps nativas iOS y Android usando Capacitor, para poder distribuirla a través de Firebase App Distribution.

## 🎯 ¿Por qué Capacitor?

- ✅ Convierte tu PWA en apps nativas iOS (.ipa) y Android (.apk)
- ✅ Mantiene todo tu código existente (Astro + React)
- ✅ Permite usar Firebase App Distribution
- ✅ Acceso a APIs nativas del dispositivo
- ✅ Puede publicarse en App Store y Google Play

## 📋 Prerequisitos

### Para iOS:
- Mac con macOS
- Xcode instalado (desde App Store)
- Cuenta de Apple Developer ($99/año) - **REQUERIDO para App Distribution**

### Para Android:
- Android Studio instalado
- Java JDK 11 o superior
- Cuenta de Google Play Developer ($25 una vez) - Opcional para App Distribution

## 🚀 Instalación de Capacitor

### Paso 1: Instalar Capacitor CLI y Core

```bash
cd /Users/jettogonzalez/Documents/Work/Nexxdi/Send/App
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
```

### Paso 2: Inicializar Capacitor

```bash
npx cap init
```

Cuando te pregunte:
- **App name:** Nexxdi Cash
- **App ID:** com.nexxdi.cash (o el que prefieras)
- **Web dir:** dist

### Paso 3: Agregar plataformas

```bash
npm run build
npx cap add ios
npx cap add android
```

### Paso 4: Sincronizar con plataformas nativas

```bash
npx cap sync
```

## 📱 Configurar iOS

### Paso 1: Abrir proyecto en Xcode

```bash
npx cap open ios
```

### Paso 2: Configurar certificados y provisioning

1. En Xcode, selecciona el proyecto "App" en el navegador
2. Ve a "Signing & Capabilities"
3. Selecciona tu equipo de desarrollo
4. Xcode generará automáticamente los certificados

### Paso 3: Configurar Bundle ID

- Debe coincidir con el App ID que configuraste en Capacitor
- Ejemplo: `com.nexxdi.send`

### Paso 4: Build para distribución

1. En Xcode, selecciona "Any iOS Device" o un dispositivo específico
2. Product → Archive
3. Una vez archivado, puedes exportar el .ipa

## 🤖 Configurar Android

### Paso 1: Abrir proyecto en Android Studio

```bash
npx cap open android
```

### Paso 2: Configurar firma de la app

1. En Android Studio, ve a Build → Generate Signed Bundle / APK
2. Selecciona "Android App Bundle" (recomendado) o "APK"
3. Crea un keystore si no tienes uno
4. Completa el formulario y genera el bundle/APK

## 🔥 Configurar Firebase App Distribution

### Paso 1: Activar App Distribution en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `nexxdi-send-jetto-gonzalez`
3. Ve a "Ejecución" → "App Distribution"
4. Click en "Comenzar"

### Paso 2: Instalar Firebase App Distribution CLI

```bash
npm install -g firebase-tools
firebase login
```

### Paso 3: Configurar grupos de testers

En Firebase Console → App Distribution → Testers & Groups:
- Crea grupos (ej: "beta-testers", "internal-team")
- Agrega emails de testers

### Paso 4: Distribuir iOS (.ipa)

```bash
# Después de generar el .ipa en Xcode
firebase appdistribution:distribute path/to/app.ipa \
  --app YOUR_IOS_APP_ID \
  --groups "beta-testers" \
  --release-notes "Versión inicial de Nexxdi Cash"
```

**Para obtener el App ID de iOS:**
- Ve a Firebase Console → Configuración del proyecto → Tus apps
- Copia el "ID de la app iOS"

### Paso 5: Distribuir Android (.aab o .apk)

```bash
# Para Android App Bundle (.aab) - RECOMENDADO
firebase appdistribution:distribute path/to/app-release.aab \
  --app YOUR_ANDROID_APP_ID \
  --groups "beta-testers" \
  --release-notes "Versión inicial de Nexxdi Cash"

# O para APK
firebase appdistribution:distribute path/to/app-release.apk \
  --app YOUR_ANDROID_APP_ID \
  --groups "beta-testers" \
  --release-notes "Versión inicial de Nexxdi Cash"
```

## 🔄 Workflow de Desarrollo

### Cada vez que hagas cambios:

1. **Build de la PWA:**
   ```bash
   npm run build
   ```

2. **Sincronizar con plataformas nativas:**
   ```bash
   npx cap sync
   ```

3. **Abrir en Xcode (iOS) o Android Studio (Android):**
   ```bash
   npx cap open ios
   # o
   npx cap open android
   ```

4. **Build y distribuir:**
   - iOS: Archive en Xcode → Exportar .ipa → Distribuir con Firebase CLI
   - Android: Build → Generate Signed Bundle → Distribuir con Firebase CLI

## 📝 Scripts Útiles para package.json

Agrega estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "build": "astro check && astro build",
    "build:sync": "npm run build && npx cap sync",
    "open:ios": "npx cap open ios",
    "open:android": "npx cap open android",
    "sync": "npx cap sync"
  }
}
```

## ⚠️ Consideraciones Importantes

### iOS:
- **Requiere cuenta de Apple Developer** ($99/año) para App Distribution
- Los testers deben tener sus UDIDs registrados (para desarrollo) o usar TestFlight (para distribución)
- App Distribution puede distribuir builds de desarrollo sin App Store

### Android:
- Puedes distribuir APKs directamente sin Google Play
- Los usuarios necesitan permitir "Fuentes desconocidas" en sus dispositivos
- App Distribution maneja esto automáticamente

## 🎯 Ventajas de App Distribution

- ✅ Distribución directa a testers sin App Store/Play Store
- ✅ Notificaciones automáticas por email
- ✅ Gestión de grupos de testers
- ✅ Release notes y feedback
- ✅ Estadísticas de instalación

## 📚 Recursos

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Firebase App Distribution Docs](https://firebase.google.com/docs/app-distribution)
- [iOS App Distribution Guide](https://developer.apple.com/distribute/)
- [Android App Distribution Guide](https://developer.android.com/studio/publish)

## 🆘 Troubleshooting

**Error: "No such file or directory" al hacer cap sync**
- Asegúrate de haber ejecutado `npm run build` primero

**Error: "Signing certificate not found" en iOS**
- Configura tu equipo de desarrollo en Xcode → Signing & Capabilities

**Error: "Keystore not found" en Android**
- Genera un keystore siguiendo los pasos de Android Studio
