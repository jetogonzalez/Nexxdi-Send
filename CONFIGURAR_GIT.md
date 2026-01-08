# 🔧 Configurar Git para Send App

## Opción 1: Usar el Script Automático (Recomendado)

Ejecuta el script que creamos:

```bash
cd /Users/jettogonzalez/Documents/Work/Nexxdi/Send/App
chmod +x configurar-git.sh
./configurar-git.sh
```

## Opción 2: Configuración Manual

### Paso 1: Inicializar Repositorio Git

```bash
cd /Users/jettogonzalez/Documents/Work/Nexxdi/Send/App
git init
```

### Paso 2: Configurar Rama Principal

```bash
git branch -M main
```

### Paso 3: Agregar Archivos

```bash
git add .
```

### Paso 4: Crear Commit Inicial

```bash
git commit -m "Initial commit: Send App PWA con Astro y Firebase"
```

## Conectar con Repositorio Remoto

### Si creas un nuevo repositorio en GitHub/GitLab:

1. **Crea el repositorio** en GitHub/GitLab (sin inicializar con README)

2. **Conecta tu repositorio local con el remoto:**

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
```

O si usas SSH:
```bash
git remote add origin git@github.com:TU-USUARIO/TU-REPOSITORIO.git
```

3. **Sube tu código:**

```bash
git push -u origin main
```

### Si ya tienes un repositorio existente:

```bash
# Ver repositorios remotos actuales
git remote -v

# Agregar nuevo remoto (si no existe)
git remote add origin <URL-DE-TU-REPOSITORIO>

# O cambiar la URL del remoto existente
git remote set-url origin <NUEVA-URL>

# Subir código
git push -u origin main
```

## Configuración de Usuario Git (si no está configurada)

Si es la primera vez que usas Git en esta máquina:

```bash
# Configurar nombre
git config --global user.name "Tu Nombre"

# Configurar email
git config --global user.email "tu.email@ejemplo.com"
```

## Verificar Estado

```bash
# Ver estado del repositorio
git status

# Ver historial de commits
git log --oneline

# Ver repositorios remotos configurados
git remote -v
```

## Comandos Útiles

```bash
# Ver cambios pendientes
git status

# Agregar archivos específicos
git add archivo1.ts archivo2.ts

# Crear commit con mensaje
git commit -m "Descripción del cambio"

# Ver diferencias
git diff

# Ver historial
git log

# Subir cambios al remoto
git push

# Descargar cambios del remoto
git pull
```

## Estructura de Commits Recomendada

Usa mensajes de commit descriptivos:

```bash
git commit -m "feat: agregar componente de login"
git commit -m "fix: corregir error en service worker"
git commit -m "style: actualizar colores del tema"
git commit -m "docs: actualizar README"
```

## .gitignore

El archivo `.gitignore` ya está configurado para ignorar:
- `node_modules/`
- `dist/`
- `.env`
- Archivos del sistema (`.DS_Store`, etc.)
- Archivos de Firebase locales

## ⚠️ Notas Importantes

1. **No subas archivos sensibles:**
   - Nunca subas `.env` con credenciales
   - No subas tokens de API o claves privadas

2. **Firebase:**
   - El archivo `.firebaserc` puede estar en Git (solo contiene el Project ID)
   - No subas archivos de configuración con credenciales privadas

3. **Primera vez:**
   - Si es tu primer commit, configura tu usuario Git primero

## 🆘 Problemas Comunes

**Error: "fatal: not a git repository"**
- Ejecuta `git init` primero

**Error: "remote origin already exists"**
- Usa `git remote set-url origin <NUEVA-URL>` para cambiarlo
- O elimínalo con `git remote remove origin` y agrégalo de nuevo

**Error: "Permission denied"**
- Verifica que tengas permisos de escritura en el directorio
- Si usas SSH, verifica tus claves SSH
