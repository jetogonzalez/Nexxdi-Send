import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      include: ['**/react', '**/*.tsx', '**/*.jsx'],
    }),
    tailwind({
      applyBaseStyles: true,
    }),
  ],
  output: 'static',
  server: {
    port: 3001,
  },
  build: {
    assets: 'assets',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
});
