/// <reference types="vite/client" />

import {StateTree} from 'pinia'
import {PageContext} from 'vike/types'
import {RouteLocationNormalizedLoaded} from 'vue-router'
import {Store} from 'vuex'
import {State} from './src/store'

export interface IAsyncDataOptions {
  store: Store<State>
  route: RouteLocationNormalizedLoaded
}

declare module 'vue' {
  interface ComponentCustomOptions {
    asyncData?(context: IAsyncDataOptions): Promise<void> | void
  }

  interface ComponentCustomProperties {
    $store: Store<State>
    $pageContext: PageContext
  }
}

declare global {
  interface Window {
    __INITIAL_STATE__: object
    __pinia: Record<string, StateTree>
  }
}

declare module 'vuex' {
  export * from 'vuex/types/index.d.ts'
  export * from 'vuex/types/helpers.d.ts'
  export * from 'vuex/types/logger.d.ts'
  export * from 'vuex/types/vue.d.ts'
}
