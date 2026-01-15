# 🚀 Pasos Rápidos para Distribuir Android

## ✅ Lo que ya está hecho:
- ✅ Capacitor instalado y configurado
- ✅ Proyecto Android creado
- ✅ Configuración de signing preparada en `build.gradle`

## 📝 Pasos siguientes:

### 1. Abrir proyecto en Android Studio

```bash
npm run open:android
```

### 2. Generar Keystore (solo la primera vez)

En Android Studio:
1. **Build → Generate Signed Bundle / APK**
2. Selecciona **"Android App Bundle"** (recomendado)
3. Click **"Create new..."** para crear keystore
4. Completa el formulario:
   - **Key store path:** `~/android-keystore.jks` (o donde prefieras)
   - **Password:** Crea una contraseña (GUÁRDALA)
   - **Key alias:** `send-app-key`
   - **Validity:** 25 años
5. Guarda el keystore en un lugar seguro

### 3. Crear archivo key.properties

Crea el archivo `android/key.properties`:

```properties
storePassword=TU_PASSWORD
keyPassword=TU_PASSWORD
keyAlias=send-app-key
storeFile=/Users/jettogonzalez/android-keystore.jks
```

**Reemplaza:**
- `TU_PASSWORD` con la contraseña que creaste
- La ruta del `storeFile` con la ruta real de tu keystore

### 4. Activar Firebase App Distribution

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Proyecto: `nexxdi-send-jetto-gonzalez`
3. **Ejecución → App Distribution → Comenzar**

### 5. Obtener App ID de Android

1. Firebase Console → ⚙️ **Configuración del proyecto**
2. Pestaña **"Tus apps"**
3. Si no hay app Android, crea una nueva
4. Copia el **"ID de la app Android"** (formato: `1:988564691824:android:xxxxx`)

### 6. Crear grupo de testers

1. Firebase Console → **App Distribution → Testers & Groups**
2. **Create group**
3. Nombre: `beta-testers`
4. Agrega emails de testers
5. **Create**

### 7. Generar y distribuir

```bash
# Build y sincronizar cambios
npm run build:sync

# Generar Android App Bundle
npm run android:build

# Distribuir (reemplaza TU_APP_ID con el ID real)
firebase appdistribution:distribute android/app/build/outputs/bundle/release/app-release.aab \
  --app TU_APP_ID \
  --groups "beta-testers" \
  --release-notes "Versión inicial de Nexxdi Cash"
```

## 📱 Los testers recibirán:
- Email con enlace de descarga
- Pueden instalar directamente desde el enlace
- No necesitan habilitar "Fuentes desconocidas"

## 🔄 Para actualizar la app:

```bash
# 1. Hacer cambios en el código
# 2. Build y sync
npm run build:sync

# 3. Generar nuevo bundle
npm run android:build

# 4. Distribuir (incrementa versionCode en build.gradle primero)
firebase appdistribution:distribute android/app/build/outputs/bundle/release/app-release.aab \
  --app TU_APP_ID \
  --groups "beta-testers" \
  --release-notes "Nueva versión con mejoras"
```

## ⚠️ IMPORTANTE:
- **Guarda el keystore y contraseñas:** Sin ellos NO podrás actualizar la app
- **Incrementa versionCode:** En `android/app/build.gradle` antes de cada release
- **No subas key.properties a Git:** Ya está en .gitignore

## 🆘 Problemas comunes:

**"Keystore file not found"**
- Verifica la ruta en `key.properties`
- Usa ruta absoluta (completa)

**"App ID not found"**
- Verifica que creaste la app Android en Firebase
- Copia el App ID correcto

**"Permission denied" en gradlew**
```bash
chmod +x android/gradlew
```
