/// <reference types="vite/client" />

import {RouteLocationNormalizedLoaded} from 'vue-router'
import {Store} from 'vuex'

export interface IAsyncDataOptions {
  store: Store<object>
  route: RouteLocationNormalizedLoaded
}

declare module 'vue' {
  interface ComponentCustomOptions {
    asyncData?(context: IAsyncDataOptions): Promise<void> | void
  }

  interface ComponentCustomProperties {
    $store: Store<object>
  }
}

declare global {
  interface Window {
    __INITIAL_STATE__: object
  }
}