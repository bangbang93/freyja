import {RouteLocationNormalizedLoaded} from 'vue-router'
import {Store} from 'vuex'

declare module 'vue' {
  interface ComponentCustomOptions {
    asyncData(context: {store: Store; route: RouteLocationNormalizedLoaded}): Promise<void>
  }

  interface ComponentCustomProperties {
    $store: Store<any>
  }
}
