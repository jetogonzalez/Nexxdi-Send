# 🤖 Configurar Android para App Distribution

Guía paso a paso para distribuir tu app Android a través de Firebase App Distribution (GRATIS).

## 📋 Prerequisitos

- ✅ Android Studio instalado (gratis)
- ✅ Java JDK 11 o superior
- ✅ Proyecto Capacitor ya configurado (✅ ya hecho)

## 🚀 Paso 1: Abrir proyecto en Android Studio

```bash
npm run open:android
```

O manualmente:
```bash
npx cap open android
```

## 🔐 Paso 2: Generar Keystore (firma de la app)

### Opción A: Desde Android Studio (Recomendado)

1. En Android Studio, ve a **Build → Generate Signed Bundle / APK**
2. Selecciona **"Android App Bundle"** (recomendado) o **"APK"**
3. Si no tienes un keystore, haz clic en **"Create new..."**
4. Completa el formulario:
   - **Key store path:** Elige una ubicación segura (ej: `~/android-keystore.jks`)
   - **Password:** Crea una contraseña segura (GUÁRDALA BIEN)
   - **Key alias:** `send-app-key`
   - **Key password:** Puede ser la misma que el keystore
   - **Validity:** 25 años (máximo)
   - **Certificate:** Completa tu información
5. Click **"OK"** para crear el keystore
6. Selecciona el keystore creado y completa las contraseñas
7. Selecciona **"release"** como build variant
8. Click **"Next"** y luego **"Finish"**

### Opción B: Desde línea de comandos

```bash
keytool -genkey -v -keystore ~/android-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias send-app-key
```

**IMPORTANTE:** Guarda el keystore y las contraseñas en un lugar seguro. Sin ellos NO podrás actualizar la app.

## 📝 Paso 3: Configurar signing en Android

Crea o edita el archivo `android/key.properties`:

```properties
storePassword=TU_PASSWORD_DEL_KEYSTORE
keyPassword=TU_PASSWORD_DEL_KEY
keyAlias=send-app-key
storeFile=/ruta/completa/al/keystore.jks
```

**Ejemplo:**
```properties
storePassword=miPassword123
keyPassword=miPassword123
keyAlias=send-app-key
storeFile=/Users/jettogonzalez/android-keystore.jks
```

Luego edita `android/app/build.gradle` para usar el keystore:

```gradle
// Al inicio del archivo, después de los plugins
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... configuración existente ...
    
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ... otras configuraciones ...
        }
    }
}
```

## 🔥 Paso 4: Configurar Firebase App Distribution

### 4.1 Activar App Distribution en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `nexxdi-send-jetto-gonzalez`
3. Ve a **"Ejecución"** → **"App Distribution"**
4. Click en **"Comenzar"** o **"Get started"**

### 4.2 Obtener el App ID de Android

1. En Firebase Console → **Configuración del proyecto** (⚙️)
2. Ve a la pestaña **"Tus apps"**
3. Busca la app Android o crea una nueva
4. Copia el **"ID de la app Android"** (formato: `1:988564691824:android:xxxxx`)

### 4.3 Crear grupos de testers

1. En Firebase Console → **App Distribution** → **"Testers & Groups"**
2. Click en **"Create group"**
3. Nombre: `beta-testers` o `internal-team`
4. Agrega emails de testers (puedes agregar más después)
5. Click **"Create"**

## 📦 Paso 5: Generar APK/AAB para distribución

### Opción A: Desde Android Studio

1. **Build → Generate Signed Bundle / APK**
2. Selecciona **"Android App Bundle"** (recomendado) o **"APK"**
3. Selecciona tu keystore y completa las contraseñas
4. Selecciona **"release"**
5. Click **"Next"** → **"Finish"**
6. El archivo se generará en: `android/app/release/app-release.aab` o `app-release.apk`

### Opción B: Desde línea de comandos

```bash
cd android
./gradlew bundleRelease  # Para generar .aab
# O
./gradlew assembleRelease  # Para generar .apk
```

El archivo estará en:
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- APK: `android/app/build/outputs/apk/release/app-release.apk`

## 🚀 Paso 6: Distribuir con Firebase CLI

### Instalar Firebase CLI (si no lo tienes)

```bash
npm install -g firebase-tools
firebase login
```

### Distribuir el APK/AAB

```bash
# Para Android App Bundle (.aab) - RECOMENDADO
firebase appdistribution:distribute android/app/build/outputs/bundle/release/app-release.aab \
  --app 1:988564691824:android:cb57f91b64973fe1104db5 \
  --groups "beta-testers" \
  --release-notes "Versión inicial de Nexxdi Cash para Android"

# O para APK
firebase appdistribution:distribute android/app/build/outputs/apk/release/app-release.apk \
  --app 1:988564691824:android:cb57f91b64973fe1104db5 \
  --groups "beta-testers" \
  --release-notes "Versión inicial de Nexxdi Cash para Android"
```

**Nota:** Reemplaza el `--app` con tu App ID real de Firebase.

## 📱 Paso 7: Los testers reciben la app

1. Los testers recibirán un **email** con el enlace de descarga
2. Pueden hacer clic en el enlace desde su dispositivo Android
3. Se descargará e instalará automáticamente
4. No necesitan habilitar "Fuentes desconocidas" (Firebase lo maneja)

## 🔄 Workflow de actualización

Cada vez que quieras actualizar la app:

1. **Hacer cambios en tu código**
2. **Build y sincronizar:**
   ```bash
   npm run build:sync
   ```
3. **Generar nuevo APK/AAB:**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
4. **Distribuir:**
   ```bash
   firebase appdistribution:distribute android/app/build/outputs/bundle/release/app-release.aab \
     --app TU_APP_ID \
     --groups "beta-testers" \
     --release-notes "Nueva versión con mejoras"
   ```

## 📝 Scripts útiles para package.json

Puedes agregar estos scripts:

```json
{
  "scripts": {
    "android:build": "cd android && ./gradlew bundleRelease",
    "android:distribute": "firebase appdistribution:distribute android/app/build/outputs/bundle/release/app-release.aab --app TU_APP_ID --groups beta-testers",
    "android:full": "npm run build:sync && npm run android:build && npm run android:distribute"
  }
}
```

## ⚠️ Importante

- **Guarda el keystore y las contraseñas:** Sin ellos NO podrás actualizar la app
- **Usa Android App Bundle (.aab):** Es más eficiente y recomendado por Google
- **Versiona tu app:** Incrementa el `versionCode` en `android/app/build.gradle` en cada release
- **Release notes:** Siempre incluye notas de versión para que los testers sepan qué cambió

## 🆘 Troubleshooting

**Error: "Keystore file not found"**
- Verifica la ruta en `key.properties`
- Usa ruta absoluta, no relativa

**Error: "App ID not found"**
- Verifica que hayas creado la app Android en Firebase Console
- Copia el App ID correcto desde Configuración del proyecto

**Error: "Permission denied" en gradlew**
- Ejecuta: `chmod +x android/gradlew`

## 📚 Recursos

- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Firebase App Distribution Docs](https://firebase.google.com/docs/app-distribution)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
