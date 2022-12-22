/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import {compact} from 'lodash'
import {App} from 'vue'
import {createHome} from './index'

export async function createClient(): Promise<App> {
  const {app, router, store} = createHome()
  if (window.__INITIAL_STATE__) {
    // We initialize the store state with the data injected from the server
    store.replaceState(window.__INITIAL_STATE__)
  }
  await router.isReady()
  router.beforeResolve((to, from, next) => {
    const matched = compact(router.currentRoute.value.matched.flatMap((e) => e.components))
    // 这里如果有加载指示器(loading indicator)，就触发
    Promise.all(
      matched.map((c) => {
        if ('asyncData' in c && c?.asyncData) {
          return c.asyncData({store, route: to})
        }
        return null
      }),
    )
      .then(() => {
        // 停止加载指示器(loading indicator)
        next()
      })
      .catch(next)
  })

  app.mount('app')
  return app
}

createClient()
