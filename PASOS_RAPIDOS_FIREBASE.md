# 🚀 Pasos Rápidos - Configurar Firebase

## Opción 1: Script Automático (Más Fácil)

Ejecuta el script interactivo:

```bash
cd /Users/jettogonzalez/Documents/Work/Nexxdi/Send/App
./configurar-firebase-paso-a-paso.sh
```

El script te guiará paso a paso.

## Opción 2: Manual (Paso a Paso)

### Paso 1: Ir a Firebase Console

1. Click en **"Ir a la consola"** (botón verde arriba a la derecha)
2. O ve directamente a: https://console.firebase.google.com/

### Paso 2: Crear o Seleccionar Proyecto

**Si NO tienes proyecto:**
1. Click en **"Crear proyecto"** o **"Add project"**
2. Nombre: `nexxdi-send` (o el que prefieras)
3. Sigue los pasos
4. Puedes desactivar Google Analytics si quieres
5. Click en **"Crear proyecto"**

**Si YA tienes proyecto:**
1. Selecciona tu proyecto de la lista

### Paso 3: Activar Firebase Hosting

1. En el menú lateral izquierdo, busca **"Hosting"**
2. Click en **"Comenzar"** o **"Get started"**
3. Sigue las instrucciones (ya tienes `firebase.json` configurado)

### Paso 4: Obtener Configuración de Firebase

1. Click en el **⚙️ (Configuración)** → **"Configuración del proyecto"**
2. Scroll hasta **"Tus aplicaciones"** o **"Your apps"**
3. Si NO tienes una app web:
   - Click en **"Agregar app"** o **"Add app"**
   - Selecciona el ícono **Web** (</>)
   - Nombre: `Send App Web`
   - Click en **"Registrar app"**
4. **Copia estos valores** (aparecen en un código JavaScript):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",                    // ← Copia este
  authDomain: "xxx.firebaseapp.com",    // ← Copia este
  projectId: "xxx",                     // ← Copia este
  storageBucket: "xxx.appspot.com",     // ← Copia este
  messagingSenderId: "123456789",       // ← Copia este
  appId: "1:123456789:web:abc123"       // ← Copia este
};
```

### Paso 5: Configurar Archivo .firebaserc

Edita el archivo `.firebaserc` y reemplaza `your-firebase-project-id` con tu **Project ID**:

```json
{
  "projects": {
    "default": "tu-project-id-aqui"
  }
}
```

**El Project ID lo encuentras en:**
- Configuración del proyecto (⚙️) → parte superior
- O en la URL: `console.firebase.google.com/project/TU-PROJECT-ID`

### Paso 6: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
   ```bash
   cp env.example .env
   ```

2. Edita `.env` y completa con los valores que copiaste:

```env
PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
PUBLIC_FIREBASE_API_KEY=AIza...
PUBLIC_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
PUBLIC_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Paso 7: Iniciar Sesión en Firebase CLI

```bash
# Si instalaste globalmente
firebase login

# Si instalaste localmente
npx firebase login
```

Esto abrirá tu navegador para autenticarte.

### Paso 8: Verificar Configuración

```bash
# Ver proyectos disponibles
npx firebase projects:list

# Verificar proyecto actual
cat .firebaserc
```

### Paso 9: Build y Deploy

```bash
# Build del proyecto
npm run build

# Deploy a Firebase
npm run deploy
```

O manualmente:
```bash
npx firebase deploy --only hosting
```

### Paso 10: Ver tu App

Después del deploy, Firebase te dará una URL como:
- `https://tu-project-id.web.app`
- `https://tu-project-id.firebaseapp.com`

## ✅ Checklist

- [ ] Proyecto creado/seleccionado en Firebase Console
- [ ] Firebase Hosting activado
- [ ] Configuración de Firebase copiada (apiKey, authDomain, etc.)
- [ ] `.firebaserc` actualizado con Project ID
- [ ] `.env` creado y completado con valores de Firebase
- [ ] Iniciado sesión con `firebase login` o `npx firebase login`
- [ ] Build ejecutado: `npm run build`
- [ ] Deploy ejecutado: `npm run deploy`

## 🆘 Ayuda

- **No encuentro el Project ID:** Ve a Configuración del proyecto (⚙️) → está en la parte superior
- **No veo la opción Hosting:** Asegúrate de estar en el proyecto correcto
- **Error al hacer deploy:** Verifica que `npm run build` haya generado la carpeta `dist/`
- **Más ayuda:** Lee `CONFIGURAR_FIREBASE.md`

## 📝 Archivos Importantes

- `.firebaserc` → Project ID de Firebase
- `.env` → Variables de entorno (NO subir a Git)
- `firebase.json` → Configuración de Hosting (ya está listo)
- `src/lib/firebase.ts` → Configuración en código
