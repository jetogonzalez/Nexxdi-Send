#!/bin/bash

# Script para configurar Firebase paso a paso

echo "🔥 Configurando Firebase para Send App..."
echo ""

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null && ! command -v npx firebase &> /dev/null; then
    echo "⚠️  Firebase CLI no está instalado."
    echo ""
    echo "Instalando Firebase CLI localmente..."
    npm install --save-dev firebase-tools
    echo "✅ Firebase CLI instalado"
    echo ""
    echo "💡 Nota: Usa 'npx firebase' en lugar de 'firebase' para los comandos"
    FIREBASE_CMD="npx firebase"
else
    FIREBASE_CMD="firebase"
fi

echo ""
echo "📋 Pasos para configurar Firebase:"
echo ""
echo "1. Iniciar sesión en Firebase:"
echo "   $FIREBASE_CMD login"
echo ""
echo "2. Crear o seleccionar proyecto en Firebase Console:"
echo "   https://console.firebase.google.com/"
echo ""
echo "3. Copiar el Project ID de tu proyecto"
echo ""
echo "4. Editar .firebaserc y reemplazar 'your-firebase-project-id' con tu Project ID"
echo ""
echo "5. Activar Firebase Hosting en Firebase Console"
echo ""
echo "6. Obtener configuración de Firebase (Project Settings > Your apps)"
echo ""
echo "7. Configurar variables de entorno:"
echo "   cp env.example .env"
echo "   # Edita .env con tus valores de Firebase"
echo ""
echo "8. Build y deploy:"
echo "   npm run build"
echo "   npm run deploy"
echo ""
echo "📖 Para más detalles, lee CONFIGURAR_FIREBASE.md"
echo ""
