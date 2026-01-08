# 🔥 Configurar Firebase - Send App

Guía paso a paso para configurar Firebase Hosting en tu proyecto.

## Paso 1: Instalar Firebase CLI

Tienes dos opciones:

### Opción A: Instalación Global (Recomendado)

```bash
npm install -g firebase-tools
```

Si tienes problemas de permisos, usa `sudo`:
```bash
sudo npm install -g firebase-tools
```

### Opción B: Instalación Local (Alternativa)

```bash
npm install --save-dev firebase-tools
```

Luego usa `npx firebase` en lugar de `firebase` en los comandos.

## Paso 2: Iniciar Sesión en Firebase

```bash
firebase login
```

Esto abrirá tu navegador para autenticarte con tu cuenta de Google.

## Paso 3: Crear o Seleccionar Proyecto Firebase

### Si ya tienes un proyecto Firebase:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto o crea uno nuevo
3. Copia el **Project ID**

### Si necesitas crear un proyecto nuevo:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Add project" o "Crear proyecto"
3. Ingresa el nombre del proyecto (ej: "nexxdi-send")
4. Sigue los pasos (puedes desactivar Google Analytics si quieres)
5. Copia el **Project ID** que se muestra

## Paso 4: Configurar el Proyecto Local

### Opción A: Usar el Project ID que ya tienes

Edita el archivo `.firebaserc` y reemplaza `your-firebase-project-id` con tu Project ID real:

```json
{
  "projects": {
    "default": "tu-project-id-aqui"
  }
}
```

### Opción B: Inicializar Firebase Interactivamente

```bash
firebase init hosting
```

Cuando te pregunte:
- **¿Qué proyecto de Firebase quieres usar?** → Selecciona tu proyecto
- **¿Qué directorio público quieres usar?** → `dist` (donde Astro genera los archivos)
- **¿Configurar como SPA?** → `Yes` (Single Page Application)
- **¿Configurar GitHub para despliegues automáticos?** → `No` (por ahora)

## Paso 5: Activar Firebase Hosting

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Hosting** en el menú lateral
4. Click en **"Get started"** o **"Comenzar"**
5. Sigue las instrucciones (ya tienes `firebase.json` configurado)

## Paso 6: Obtener Configuración de Firebase para Variables de Entorno

1. En Firebase Console, ve a **Project Settings** (⚙️)
2. Scroll hasta **"Your apps"**
3. Si no tienes una app web, click en **"Add app"** → **Web** (</>)
4. Registra la app con un nombre (ej: "Send App Web")
5. Copia los valores de configuración:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-project.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Paso 7: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
   ```bash
   cp env.example .env
   ```

2. Edita `.env` y completa con tus valores de Firebase:

```env
PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
PUBLIC_FIREBASE_API_KEY=AIza...
PUBLIC_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
PUBLIC_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Paso 8: Verificar Configuración

Verifica que todo esté correcto:

```bash
# Ver configuración de Firebase
firebase projects:list

# Ver configuración del proyecto actual
cat .firebaserc

# Ver configuración de hosting
cat firebase.json
```

## Paso 9: Build y Deploy de Prueba

1. **Build del proyecto:**
   ```bash
   npm run build
   ```

2. **Preview local (opcional):**
   ```bash
   npm run preview
   ```
   Esto te permite ver cómo se verá tu app antes de desplegar.

3. **Deploy a Firebase:**
   ```bash
   npm run deploy
   ```
   
   O manualmente:
   ```bash
   firebase deploy --only hosting
   ```

4. **Ver tu app:**
   - Firebase te dará una URL como: `https://tu-project-id.web.app`
   - También estará en: `https://tu-project-id.firebaseapp.com`

## Paso 10: Configurar Dominio Personalizado (Opcional)

1. En Firebase Console → Hosting
2. Click en "Add custom domain"
3. Ingresa tu dominio
4. Sigue las instrucciones para verificar y configurar DNS

## Comandos Útiles

```bash
# Ver estado del proyecto
firebase projects:list

# Cambiar proyecto activo
firebase use --add

# Ver logs de deploy
firebase hosting:channel:list

# Desplegar solo hosting
firebase deploy --only hosting

# Desplegar a un canal de preview
firebase hosting:channel:deploy preview

# Ver ayuda
firebase help
```

## Estructura de Archivos Firebase

```
App/
├── .firebaserc          # Configuración del proyecto Firebase
├── firebase.json        # Configuración de Firebase Hosting
├── .env                 # Variables de entorno (NO subir a Git)
└── dist/                # Build de producción (generado por Astro)
```

## Troubleshooting

### Error: "Firebase project not found"
- Verifica que `.firebaserc` tenga el Project ID correcto
- Ejecuta `firebase use --add` y selecciona tu proyecto

### Error: "Hosting not initialized"
- Ve a Firebase Console y activa Hosting manualmente
- O ejecuta `firebase init hosting` de nuevo

### Error: "No such file or directory: dist"
- Ejecuta `npm run build` primero para generar la carpeta `dist`

### Error de permisos al instalar Firebase CLI
- Usa `sudo npm install -g firebase-tools`
- O instala localmente: `npm install --save-dev firebase-tools`

## Próximos Pasos

Después de configurar Firebase:

1. ✅ Configura tus variables de entorno en `.env`
2. ✅ Haz un build de prueba: `npm run build`
3. ✅ Despliega: `npm run deploy`
4. ✅ Verifica que tu app funcione en la URL de Firebase
5. ✅ Configura despliegues automáticos desde GitHub (opcional)

## Recursos

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Astro + Firebase](https://docs.astro.build/en/guides/deploy/firebase/)
