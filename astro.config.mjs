import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true,
    }),
  ],
  output: 'static',
  server: {
    port: 3001,
    // Ajustes de caché para desarrollo local
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  },
  build: {
    assets: 'assets',
    // Optimizar caché en producción
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
      // Ajustar caché de Vite para desarrollo
      cacheDir: '.vite',
    },
    // Configuración de caché para desarrollo local
    server: {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  },
});
