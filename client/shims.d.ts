import {Store} from 'vuex'
import {IAsyncDataOptions} from './types'

declare module 'vue' {
  interface ComponentCustomOptions {
    asyncData?(context: IAsyncDataOptions): Promise<void> | void
  }

  interface ComponentCustomProperties {
    $store: Store<any>
  }
}

declare global {
  interface Window {
    __INITIAL_STATE__: any
  }
}
