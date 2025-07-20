import { execSync } from 'child_process';
import path from 'path';
import reactOxc from '@vitejs/plugin-react-oxc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const COMMIT_HASH = execSync('git rev-parse --short HEAD').toString().trim();

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactOxc(), svgr()],
  define: {
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(COMMIT_HASH),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Split vendor libraries into separate chunks
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (
              id.includes('@mui/material') ||
              id.includes('@mui/icons-material') ||
              id.includes('@mui/x-date-pickers') ||
              id.includes('@emotion/react') ||
              id.includes('@emotion/styled') ||
              id.includes('@fontsource')
            ) {
              return 'vendor-mui';
            }
            if (
              id.includes('i18next') ||
              id.includes('react-i18next') ||
              id.includes('i18next-http-backend') ||
              id.includes('i18next-browser-languagedetector')
            ) {
              return 'vendor-i18n';
            }
            if (id.includes('mapbox-gl') || id.includes('@types/mapbox-gl')) {
              return 'vendor-maps';
            }
            if (id.includes('ag-grid')) {
              return 'vendor-grid';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            if (
              id.includes('zod') ||
              id.includes('notistack') ||
              id.includes('date-fns') ||
              id.includes('vite-plugin-svgr')
            ) {
              return 'vendor-utils';
            }
            return 'vendor-other';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
});
