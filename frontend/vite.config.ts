import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint';
import { VitePWA } from 'vite-plugin-pwa';

const PRODUCTION = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslint({
      fix: true,
    }),
    react(),
    VitePWA({
      workbox: {
        inlineWorkboxRuntime: true,
        navigateFallbackDenylist: [/^\/admin/, /^\/api/, /^\/account/, /^\/email/],
        modifyURLPrefix: {
          assets: PRODUCTION ? 'static/assets' : 'assets',
        },
      },
    }),
  ],
  publicDir: 'static',
  build: { manifest: true },
  base: PRODUCTION ? '/static' : '/',
});
