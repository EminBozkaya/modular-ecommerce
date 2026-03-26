import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Tünel ve dış erişim için eklenen kısım:
  server: {
    host: true,      // Projenin yerel ağdaki (ve tüneldeki) diğer cihazlara açılmasını sağlar
    port: 5173,      // Sabit port kullanımı
    strictPort: true,
    allowedHosts: [
      '.ngrok-free.dev',
      'loca.lt',
      '.loca.lt'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5039',
        changeOrigin: true,
        secure: false, // self-signed cert kabul et
      },
    },
  }
})