import vuePlugin from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import {defineConfig} from 'vite'
import prismjs from 'vite-plugin-prismjs'
import path from 'path'
import {fileURLToPath} from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [
    vuePlugin(),
    vike(),
    prismjs({
      languages: 'all',
      theme: 'okaidia',
      css: true,
    }),
  ],
})
