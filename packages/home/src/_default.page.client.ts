/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import {StateTree} from 'pinia'
import 'prismjs/themes/prism-okaidia.css'
import {PageContext} from 'vike/types'
import {createHome} from './entries'

import './utils/prism.ts'

export async function render(pageContext: PageContext & {initialStoreState: Record<string, StateTree>}): Promise<void> {
  const {app, router, store, pinia} = createHome()
  app.provide('pageContext', pageContext)
  if (pageContext.initialStoreState) {
    pinia.state.value = pageContext.initialStoreState
  }
  app.config.globalProperties.$pageContext = pageContext
  if (window.__INITIAL_STATE__) {
    // We initialize the store state with the data injected from the server
    store.replaceState(window.__INITIAL_STATE__)
  }
  await router.isReady()
  router.beforeResolve((to, _, next) => {
    const matched = to.matched.flatMap((e) => {
      if (e.components) {
        return Object.values(e.components)
      }
      return []
    })
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

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.mount('#app')
}

