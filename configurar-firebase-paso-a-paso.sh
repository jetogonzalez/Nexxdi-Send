#!/bin/bash

# Script interactivo para configurar Firebase paso a paso

echo "🔥 Configuración de Firebase - Send App"
echo "========================================"
echo ""

# Paso 1: Verificar si Firebase CLI está disponible
if command -v firebase &> /dev/null; then
    FIREBASE_CMD="firebase"
elif command -v npx &> /dev/null; then
    FIREBASE_CMD="npx firebase"
    echo "✅ Usando Firebase CLI a través de npx"
else
    echo "⚠️  Firebase CLI no encontrado. Instalando..."
    npm install --save-dev firebase-tools
    FIREBASE_CMD="npx firebase"
fi

echo ""
echo "📋 PASOS A SEGUIR:"
echo ""
echo "1️⃣  INICIAR SESIÓN EN FIREBASE"
echo "   Ejecuta: $FIREBASE_CMD login"
echo "   (Esto abrirá tu navegador para autenticarte)"
echo ""
read -p "¿Ya iniciaste sesión? (s/n): " logged_in

if [ "$logged_in" != "s" ]; then
    echo ""
    echo "🔐 Iniciando sesión..."
    $FIREBASE_CMD login
fi

echo ""
echo "2️⃣  CREAR O SELECCIONAR PROYECTO"
echo ""
echo "   Opción A: Crear proyecto nuevo"
echo "   - Ve a: https://console.firebase.google.com/"
echo "   - Click en 'Crear proyecto' o 'Add project'"
echo "   - Ingresa nombre: nexxdi-send (o el que prefieras)"
echo "   - Sigue los pasos"
echo ""
echo "   Opción B: Usar proyecto existente"
echo "   - Ve a: https://console.firebase.google.com/"
echo "   - Selecciona tu proyecto"
echo ""
read -p "¿Ya tienes un proyecto creado/seleccionado? (s/n): " project_ready

if [ "$project_ready" != "s" ]; then
    echo ""
    echo "⏳ Esperando a que crees/selecciones el proyecto..."
    echo "   Presiona Enter cuando hayas terminado..."
    read
fi

echo ""
echo "3️⃣  OBTENER PROJECT ID"
echo ""
echo "   En Firebase Console:"
echo "   - Ve a Configuración del proyecto (⚙️)"
echo "   - El Project ID está en la parte superior"
echo "   - Ejemplo: nexxdi-send-12345"
echo ""
read -p "Ingresa tu Project ID: " project_id

if [ -z "$project_id" ]; then
    echo "❌ Project ID no puede estar vacío"
    exit 1
fi

# Actualizar .firebaserc
echo ""
echo "📝 Actualizando .firebaserc..."
cat > .firebaserc << EOF
{
  "projects": {
    "default": "$project_id"
  }
}
EOF

echo "✅ .firebaserc actualizado con Project ID: $project_id"

echo ""
echo "4️⃣  ACTIVAR FIREBASE HOSTING"
echo ""
echo "   En Firebase Console:"
echo "   - Ve a 'Hosting' en el menú lateral"
echo "   - Click en 'Comenzar' o 'Get started'"
echo "   - Sigue las instrucciones"
echo ""
read -p "¿Ya activaste Firebase Hosting? (s/n): " hosting_ready

if [ "$hosting_ready" != "s" ]; then
    echo ""
    echo "⏳ Esperando a que actives Hosting..."
    echo "   Presiona Enter cuando hayas terminado..."
    read
fi

echo ""
echo "5️⃣  OBTENER CONFIGURACIÓN DE FIREBASE"
echo ""
echo "   En Firebase Console:"
echo "   - Ve a Configuración del proyecto (⚙️)"
echo "   - Scroll hasta 'Tus aplicaciones'"
echo "   - Si no tienes app web, click en 'Agregar app' → Web (</>)"
echo "   - Registra la app con nombre: Send App Web"
echo "   - Copia los valores de configuración"
echo ""
echo "   Necesitarás estos valores:"
echo "   - apiKey"
echo "   - authDomain"
echo "   - projectId"
echo "   - storageBucket"
echo "   - messagingSenderId"
echo "   - appId"
echo ""

read -p "¿Tienes la configuración lista? (s/n): " config_ready

if [ "$config_ready" = "s" ]; then
    echo ""
    echo "📝 Configurando variables de entorno..."
    echo ""
    
    read -p "API Key: " api_key
    read -p "Auth Domain: " auth_domain
    read -p "Storage Bucket: " storage_bucket
    read -p "Messaging Sender ID: " sender_id
    read -p "App ID: " app_id
    
    # Crear archivo .env si no existe
    if [ ! -f .env ]; then
        cp env.example .env
    fi
    
    # Actualizar .env (usando sed o similar)
    echo ""
    echo "✅ Valores guardados. Edita .env manualmente para completar la configuración."
    echo ""
    echo "Valores a agregar en .env:"
    echo "PUBLIC_FIREBASE_PROJECT_ID=$project_id"
    echo "PUBLIC_FIREBASE_API_KEY=$api_key"
    echo "PUBLIC_FIREBASE_AUTH_DOMAIN=$auth_domain"
    echo "PUBLIC_FIREBASE_STORAGE_BUCKET=$storage_bucket"
    echo "PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$sender_id"
    echo "PUBLIC_FIREBASE_APP_ID=$app_id"
else
    echo ""
    echo "📝 Puedes configurar las variables después editando el archivo .env"
    echo "   Copia env.example a .env y completa los valores"
fi

echo ""
echo "6️⃣  BUILD Y DEPLOY"
echo ""
echo "   Cuando estés listo:"
echo "   npm run build"
echo "   npm run deploy"
echo ""
echo "✅ Configuración básica completada!"
echo ""
echo "📖 Para más detalles, lee CONFIGURAR_FIREBASE.md"
