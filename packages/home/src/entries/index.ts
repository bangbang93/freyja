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
  const store = createRootStore()
  const app = createSSRApp(App)
  app.use(router)
  app.use(pinia)
  app.use(store)

  app.use(VueFetch)

  return {app, router, store, pinia}
}
