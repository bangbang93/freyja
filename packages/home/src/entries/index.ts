/**
 * Created by bangbang93 on 16/9/30.
 */
'use strict'
import 'font-awesome/scss/font-awesome.scss'
import {createPinia} from 'pinia'
import 'prismjs'
import {createSSRApp, App as VueApp} from 'vue'
import VueFetch from 'vue-fetch'
import App from '../pages/index.page.vue'
import {createHomeRouter} from '../router'
import '../scss/style.scss'
import {createRootStore} from '../store'

interface ICreateHome {
  app: VueApp
  router: ReturnType<typeof createHomeRouter>
  store: ReturnType<typeof createRootStore>
  pinia: ReturnType<typeof createPinia>
}

export function createHome(): ICreateHome {
  const router = createHomeRouter()
  const pinia = createPinia()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const store = createRootStore()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const app = createSSRApp(App)
  app.use(router)
  app.use(pinia)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.use(store)

  app.use(VueFetch)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return {app, router, store, pinia}
}
