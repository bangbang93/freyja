/**
 * Created by bangbang93 on 16/9/30.
 */
'use strict'
import 'font-awesome/scss/font-awesome.scss'
import {createApp, createSSRApp, App as VueApp} from 'vue'
import VueFetch from 'vue-fetch'
import filters from '../filters/index'
import App from '../pages/index.vue'
import {createHomeRouter} from '../router'
import '../scss/style.scss'
import {createStore} from '../store'

interface ICreateHome {
  app: VueApp
  router: ReturnType<typeof createHomeRouter>
  store: ReturnType<typeof createStore>
}

const isSSR = typeof window === 'undefined'

export function createHome(): ICreateHome {
  const router = createHomeRouter()
  const store = createStore()
  const app = isSSR ? createSSRApp(App) : createApp(App)
  app.use(router)
  app.use(store)

  app.use(VueFetch)

  app.mixin({
    filters,
  })

  return {app, router, store}
}
