#!/bin/bash

# Script completo para configurar Git y conectar con GitHub
# Ejecuta este script después de crear el repositorio en GitHub

echo "🚀 Configurando Git y conectando con GitHub..."
echo ""

# Verificar si ya existe un repositorio Git
if [ -d ".git" ]; then
    echo "✅ Repositorio Git ya existe"
else
    echo "📦 Inicializando repositorio Git..."
    git init
    git branch -M main
    echo "✅ Repositorio Git inicializado"
fi

echo ""
echo "📝 Agregando archivos al staging..."
git add .

echo ""
echo "💾 Creando commit inicial..."
git commit -m "Initial commit: Send App PWA con Astro y Firebase"

echo ""
echo "🔗 Conectando con GitHub..."

# Verificar si ya existe un remoto
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Ya existe un remoto 'origin'."
    git remote -v
    echo ""
    read -p "¿Deseas cambiarlo? (s/n): " respuesta
    if [ "$respuesta" = "s" ]; then
        git remote remove origin
        git remote add origin https://github.com/jetogonzalez/Nexxdi-Send.git
        echo "✅ Remoto actualizado"
    else
        echo "Manteniendo remoto existente"
    fi
else
    git remote add origin https://github.com/jetogonzalez/Nexxdi-Send.git
    echo "✅ Repositorio remoto agregado"
fi

echo ""
echo "📤 Subiendo código a GitHub..."
echo ""
echo "⚠️  Si es la primera vez, GitHub puede pedirte autenticación."
echo ""

git push -u origin main

echo ""
echo "✅ ¡Listo! Tu código está en GitHub"
echo ""
echo "🔗 Repositorio: https://github.com/jetogonzalez/Nexxdi-Send"
echo ""
