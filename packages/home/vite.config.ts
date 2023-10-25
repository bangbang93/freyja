import vuePlugin from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import {defineConfig} from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vuePlugin(),
    vike(),
  ],
})
