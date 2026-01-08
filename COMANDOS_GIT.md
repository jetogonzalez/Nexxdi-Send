# 🚀 Comandos para Conectar con GitHub

Ya que creaste el repositorio `Nexxdi-Send` en GitHub, ejecuta estos comandos:

## Opción 1: Script Automático (Más Fácil)

```bash
cd /Users/jettogonzalez/Documents/Work/Nexxdi/Send/App
./setup-git-completo.sh
```

Este script hace todo automáticamente:
- ✅ Inicializa Git
- ✅ Agrega todos los archivos
- ✅ Crea el commit inicial
- ✅ Conecta con GitHub
- ✅ Sube el código

## Opción 2: Comandos Manuales

Si prefieres hacerlo paso a paso:

```bash
cd /Users/jettogonzalez/Documents/Work/Nexxdi/Send/App

# 1. Inicializar Git
git init
git branch -M main

# 2. Agregar todos los archivos
git add .

# 3. Crear commit inicial
git commit -m "Initial commit: Send App PWA con Astro y Firebase"

# 4. Conectar con GitHub
git remote add origin https://github.com/jetogonzalez/Nexxdi-Send.git

# 5. Subir código
git push -u origin main
```

## ⚠️ Si GitHub Pide Autenticación

### Opción A: Personal Access Token (Recomendado)

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Genera un nuevo token con permisos `repo`
3. Cuando Git pida usuario/contraseña:
   - Usuario: `jetogonzalez`
   - Contraseña: `TU_TOKEN_AQUI`

### Opción B: SSH (Más Seguro a Largo Plazo)

Si prefieres usar SSH:

```bash
# Cambiar remoto a SSH
git remote set-url origin git@github.com:jetogonzalez/Nexxdi-Send.git

# Luego hacer push
git push -u origin main
```

## Verificar que Funcionó

Después de ejecutar los comandos, verifica:

```bash
# Ver estado
git status

# Ver remoto configurado
git remote -v

# Ver historial
git log --oneline
```

Luego visita: https://github.com/jetogonzalez/Nexxdi-Send

Deberías ver todos tus archivos allí.

## Próximos Pasos

Una vez que el código esté en GitHub:

1. **Desarrollar localmente:**
   ```bash
   npm run dev
   ```

2. **Hacer cambios y subirlos:**
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push
   ```

3. **Desplegar a Firebase:**
   ```bash
   npm run deploy
   ```

## 🆘 Problemas Comunes

**Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/jetogonzalez/Nexxdi-Send.git
```

**Error: "Permission denied"**
- Verifica que tengas acceso al repositorio
- Usa un Personal Access Token en lugar de contraseña

**Error: "failed to push some refs"**
- Si creaste el repositorio con README, haz pull primero:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```
