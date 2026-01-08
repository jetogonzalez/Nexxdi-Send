#!/bin/bash

# Script para verificar cuando los cambios están desplegados en Firebase
# Uso: ./scripts/verificar-deploy.sh

URL="https://nexxdi-send-jetto-gonzalez.web.app"
MAX_ATTEMPTS=10
ATTEMPT=0
SLEEP_TIME=5

echo "🔍 Verificando despliegue en Firebase..."
echo "URL: $URL"
echo ""

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  ATTEMPT=$((ATTEMPT + 1))
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ ¡Despliegue exitoso! El sitio está disponible."
    echo "🌐 URL: $URL"
    echo ""
    echo "📱 Páginas disponibles:"
    echo "   - $URL/"
    echo "   - $URL/onboarding"
    echo "   - $URL/login"
    echo "   - $URL/home"
    exit 0
  else
    echo "⏳ Intento $ATTEMPT/$MAX_ATTEMPTS - Código HTTP: $HTTP_CODE (esperando...)"
    sleep $SLEEP_TIME
  fi
done

echo "❌ No se pudo verificar el despliegue después de $MAX_ATTEMPTS intentos"
exit 1
