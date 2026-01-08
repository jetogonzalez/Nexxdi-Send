#!/bin/bash

# Script para configurar Git en el proyecto Send App

echo "🚀 Configurando Git para Send App..."
echo ""

# Verificar si ya existe un repositorio Git
if [ -d ".git" ]; then
    echo "⚠️  Ya existe un repositorio Git en este directorio."
    read -p "¿Deseas reinicializarlo? (s/n): " respuesta
    if [ "$respuesta" != "s" ]; then
        echo "Operación cancelada."
        exit 0
    fi
    rm -rf .git
fi

# Inicializar repositorio Git
echo "📦 Inicializando repositorio Git..."
git init

# Configurar rama principal como 'main'
echo "🌿 Configurando rama principal como 'main'..."
git branch -M main

# Agregar todos los archivos
echo "📝 Agregando archivos al staging..."
git add .

# Hacer commit inicial
echo "💾 Creando commit inicial..."
git commit -m "Initial commit: Send App PWA con Astro y Firebase"

echo ""
echo "✅ Repositorio Git configurado exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Conectar con un repositorio remoto (GitHub, GitLab, etc.):"
echo "   git remote add origin <URL-DE-TU-REPOSITORIO>"
echo ""
echo "2. Subir el código al repositorio remoto:"
echo "   git push -u origin main"
echo ""
echo "3. O si ya tienes un repositorio remoto existente:"
echo "   git remote add origin <URL>"
echo "   git push -u origin main"
echo ""
