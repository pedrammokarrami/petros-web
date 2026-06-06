import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile()   // همه CSS/JS را inline می‌کند → خروجی یک فایل HTML
  ],
  build: {
    target: 'esnext',
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // همه چیز در یک chunk
        inlineDynamicImports: true
      }
    }
  }
});
