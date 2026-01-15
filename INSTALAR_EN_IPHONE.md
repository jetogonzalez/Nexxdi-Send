# 📱 Instalar Nexxdi Cash en iPhone

## Opción 1: Instalar como PWA (Progressive Web App) - RECOMENDADO

Tu app ya es una PWA, así que puedes instalarla directamente desde Safari.

### Pasos:

1. **Abre Safari en tu iPhone** (NO Chrome, debe ser Safari)

2. **Ve a la URL de tu app:**
   ```
   https://nexxdi-send-jetto-gonzalez.web.app
   ```

3. **Toca el botón de compartir** (cuadrado con flecha hacia arriba) en la parte inferior

4. **Desplázate hacia abajo** y busca **"Añadir a pantalla de inicio"** o **"Add to Home Screen"**

5. **Toca "Añadir"** o **"Add"**

6. **¡Listo!** La app aparecerá en tu pantalla de inicio como una app nativa

### Ventajas de PWA:
- ✅ No necesitas App Store
- ✅ Instalación instantánea
- ✅ Funciona offline (con service worker)
- ✅ Se actualiza automáticamente
- ✅ No requiere certificados ni provisioning

---

## Opción 2: Firebase App Distribution (Para Apps Nativas)

**Nota:** Firebase App Distribution es para apps nativas (iOS con Swift/Objective-C o React Native), NO para PWAs.

Si en el futuro quieres crear una app nativa iOS, aquí está la guía:

### Configurar Firebase App Distribution para iOS:

1. **Ve a Firebase Console:**
   - https://console.firebase.google.com/project/nexxdi-send-jetto-gonzalez

2. **Activa App Distribution:**
   - Menú lateral → **"Ejecución"** → **"App Distribution"**
   - Click en **"Comenzar"** o **"Get started"**

3. **Para apps iOS nativas necesitarás:**
   - Un proyecto Xcode
   - Certificados de desarrollo de Apple
   - Provisioning profiles
   - Build de la app (.ipa)

4. **Subir build:**
   ```bash
   # Si tienes una app nativa iOS
   firebase appdistribution:distribute app.ipa \
     --app YOUR_IOS_APP_ID \
     --groups "testers"
   ```

### Limitaciones:
- ⚠️ App Distribution es SOLO para apps nativas
- ⚠️ Requiere cuenta de desarrollador de Apple ($99/año)
- ⚠️ Requiere certificados y provisioning profiles

---

## Recomendación: Usa PWA

Para tu caso actual (Astro PWA), **la mejor opción es instalar como PWA** desde Safari. Es más simple, gratis y funciona perfectamente.

### Verificar que la PWA funciona:

1. Abre la URL en Safari en tu iPhone
2. Verifica que aparezca el botón "Añadir a pantalla de inicio"
3. Si no aparece, verifica que:
   - Estás usando Safari (no Chrome)
   - La URL es HTTPS (Firebase ya lo proporciona)
   - El manifest.json está correcto

---

## Tu App está en:

🌐 **Web:** https://nexxdi-send-jetto-gonzalez.web.app

📱 **Para instalar en iPhone:**
1. Abre Safari
2. Ve a la URL de arriba
3. Compartir → "Añadir a pantalla de inicio"

---

## Troubleshooting

**No aparece "Añadir a pantalla de inicio":**
- Asegúrate de usar Safari (no Chrome)
- Verifica que estés en HTTPS
- Revisa que el manifest.json esté correcto

**La app no funciona offline:**
- Verifica que el service worker esté registrado
- Revisa la consola del navegador por errores

**Quieres distribuir a otros usuarios:**
- Comparte la URL: https://nexxdi-send-jetto-gonzalez.web.app
- Ellos pueden instalarla igual desde Safari
