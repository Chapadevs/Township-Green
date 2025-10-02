import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDevelopment = mode === 'development'
  const isProduction = mode === 'production'

  return {
    plugins: [react()],
    base: '/',
    
    // Development server configuration
    server: {
      port: 5173,
      host: true,
      open: true
    },

    // Preview server configuration
    preview: {
      port: 4173,
      host: true
    },

    // Build configuration
    build: {
      outDir: isDevelopment ? 'dist-dev' : 'dist',
      sourcemap: isDevelopment ? true : false,
      minify: isProduction ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            emailjs: ['@emailjs/browser']
          }
        }
      }
    },

    // Define global constants
    define: {
      __DEV__: isDevelopment,
      __PROD__: isProduction
    }
  }
})