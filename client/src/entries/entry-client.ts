/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import {App} from 'vue'
import {createHome} from './index'

export async function createClient(): Promise<App> {
  const {app, router, store} = createHome()
  await router.isReady()
  router.beforeResolve((to, from, next) => {
    const matched = router.currentRoute.value.matched.flatMap((e) => e.components)
    // 这里如果有加载指示器(loading indicator)，就触发
    Promise.all(
      matched.map((c) => {
        if (c && 'asyncData' in c) {
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

  app.mount('#app')
  return app
}
