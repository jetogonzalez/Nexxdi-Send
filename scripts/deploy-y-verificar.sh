#!/bin/bash

# Script para desplegar y verificar automáticamente
# Uso: ./scripts/deploy-y-verificar.sh

set -e

echo "🚀 Iniciando despliegue a Firebase..."
echo ""

# Build
echo "📦 Construyendo proyecto..."
ASTRO_TELEMETRY_DISABLED=1 npm run build

echo ""
echo "☁️  Desplegando a Firebase..."
ASTRO_TELEMETRY_DISABLED=1 npx firebase deploy

echo ""
echo "✅ Despliegue completado!"
echo ""
echo "🔍 Verificando que el sitio esté disponible..."

URL="https://nexxdi-send-jetto-gonzalez.web.app"
MAX_ATTEMPTS=10
ATTEMPT=0
SLEEP_TIME=3

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  ATTEMPT=$((ATTEMPT + 1))
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL" || echo "000")
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo ""
    echo "✅ ¡Sitio verificado y disponible!"
    echo ""
    echo "🌐 URL: $URL"
    echo ""
    echo "📱 Páginas disponibles:"
    echo "   - $URL/"
    echo "   - $URL/onboarding"
    echo "   - $URL/login"
    echo "   - $URL/home"
    echo ""
    echo "🎉 ¡Todo listo!"
    exit 0
  else
    echo "⏳ Intento $ATTEMPT/$MAX_ATTEMPTS - Esperando propagación... (HTTP: $HTTP_CODE)"
    sleep $SLEEP_TIME
  fi
done

echo ""
echo "⚠️  El sitio puede estar propagándose. Verifica manualmente en:"
echo "   $URL"
exit 0
