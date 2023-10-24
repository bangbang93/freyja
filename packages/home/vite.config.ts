import vuePlugin from '@vitejs/plugin-vue'
import {fileURLToPath} from 'node:url'
import {defineConfig} from 'vite'
import vike from 'vike/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vuePlugin(),
    vike(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
