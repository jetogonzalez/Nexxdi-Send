#!/bin/bash

# Script para limpiar el caché de Astro localmente
# Uso: ./scripts/clean-cache.sh

set -e

echo "🧹 Limpiando caché de Astro y build..."
echo ""

# Eliminar directorio .astro (caché de Astro)
if [ -d ".astro" ]; then
  echo "  ✓ Eliminando .astro/"
  rm -rf .astro
fi

# Eliminar directorio dist (builds)
if [ -d "dist" ]; then
  echo "  ✓ Eliminando dist/"
  rm -rf dist
fi

# Eliminar directorio .vite (caché de Vite)
if [ -d ".vite" ]; then
  echo "  ✓ Eliminando .vite/"
  rm -rf .vite
fi

# Eliminar archivos de caché de TypeScript
if [ -f "tsconfig.tsbuildinfo" ]; then
  echo "  ✓ Eliminando tsconfig.tsbuildinfo"
  rm -f tsconfig.tsbuildinfo
fi

# Limpiar caché de node_modules/.cache si existe
if [ -d "node_modules/.cache" ]; then
  echo "  ✓ Limpiando caché de node_modules"
  rm -rf node_modules/.cache
fi

# Limpiar caché de npm si existe
if [ -d ".npm" ]; then
  echo "  ✓ Limpiando caché de npm"
  rm -rf .npm
fi

echo ""
echo "✅ Caché limpiado exitosamente"
echo ""
echo "Ahora puedes ejecutar:"
echo "  npm run dev          # Para desarrollo local"
echo "  npm run build        # Para build de producción"
echo "  npm run deploy       # Para deploy a Firebase"
