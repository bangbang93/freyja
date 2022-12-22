/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import {NotFound} from 'http-errors'
import {App} from 'vue'
import {createHome} from './index'

export default async function createSSRClient(context: Record<string, unknown>): Promise<App> {
  const {app, router, store} = createHome()
  await router.push(context.url as string)

  await router.isReady()
  const matchedComponents = router.currentRoute.value.matched.flatMap((e) => {
    if (e.components) {
      return Object.values(e.components)
    }
    return []
  })
  if (!matchedComponents.length) {
    throw new NotFound('no such route')
  }
  await Promise.all(
    matchedComponents.map((Component) => {
      if (!Component) return Promise.resolve()
      if ('asyncData' in Component && Component.asyncData) {
        store.commit('setOrigin', context.origin)
        store.commit('setReferer', context.referer)
        return Component.asyncData({
          store,
          route: router.currentRoute.value,
        })
      }
      return null
    }),
  )

  context.state = store.state
  if (router.currentRoute.value.meta.status) {
    context.status = router.currentRoute.value.meta.status
  }
  return app
}
