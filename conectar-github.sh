#!/bin/bash

# Script para conectar el repositorio local con GitHub

echo "🔗 Conectando repositorio local con GitHub..."
echo ""

# Verificar si ya existe un remoto
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Ya existe un remoto 'origin' configurado."
    git remote -v
    echo ""
    read -p "¿Deseas cambiarlo? (s/n): " respuesta
    if [ "$respuesta" != "s" ]; then
        echo "Operación cancelada."
        exit 0
    fi
    git remote remove origin
fi

# URL del repositorio
REPO_URL="https://github.com/jetogonzalez/Nexxdi-Send.git"

echo "📦 Agregando repositorio remoto..."
git remote add origin $REPO_URL

echo "✅ Repositorio remoto agregado:"
git remote -v

echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Verificar que tienes todos los cambios guardados:"
echo "   git status"
echo ""
echo "2. Si es tu primer push, ejecuta:"
echo "   git push -u origin main"
echo ""
echo "3. Para futuros cambios:"
echo "   git add ."
echo "   git commit -m 'Descripción del cambio'"
echo "   git push"
echo ""
