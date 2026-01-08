#!/bin/bash

# Script para crear archivo .env con la configuración de Firebase

echo "📝 Creando archivo .env con configuración de Firebase..."
echo ""

cat > .env << 'EOF'
# ============================================
# Variables de Entorno - Send App
# ============================================
# Configuración de Firebase para Nexxdi Send
# ============================================

# ============================================
# Firebase Configuration
# ============================================
PUBLIC_FIREBASE_PROJECT_ID=nexxdi-send-jetto-gonzalez
PUBLIC_FIREBASE_API_KEY=AIzaSyBfvvg0iy9211jHzNJSuDrnT7pnk-s5uWo
PUBLIC_FIREBASE_AUTH_DOMAIN=nexxdi-send-jetto-gonzalez.firebaseapp.com
PUBLIC_FIREBASE_STORAGE_BUCKET=nexxdi-send-jetto-gonzalez.firebasestorage.app
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=988564691824
PUBLIC_FIREBASE_APP_ID=1:988564691824:web:cb57f91b64973fe1104db5
PUBLIC_FIREBASE_MEASUREMENT_ID=G-45QB4Q5B8F

# ============================================
# App Information
# ============================================
PUBLIC_APP_NAME=Send App
PUBLIC_APP_VERSION=1.0.0
PUBLIC_APP_URL=https://nexxdi-send-jetto-gonzalez.web.app

# ============================================
# API Configuration
# ============================================
PUBLIC_API_URL=https://api.example.com

# ============================================
# Feature Flags
# ============================================
PUBLIC_ENABLE_ANALYTICS=true
PUBLIC_ENABLE_DEBUG=false
EOF

echo "✅ Archivo .env creado exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Instalar dependencias: npm install"
echo "   2. Probar localmente: npm run dev"
echo "   3. Build: npm run build"
echo "   4. Deploy: npm run deploy"
echo ""
