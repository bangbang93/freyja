import {RouteLocationNormalizedLoaded} from 'vue-router'
import {Store} from 'vuex'

export interface IAsyncDataOptions {
  store: Store<any>
  route: RouteLocationNormalizedLoaded
}
