import vuePlugin from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import {defineConfig} from 'vite'
import prismjs from 'vite-plugin-prismjs'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vuePlugin(),
    vike(),
    prismjs(),
  ],
})
