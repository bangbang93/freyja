/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/scss/font-awesome.scss'
import Vue from 'vue'
import VueFetch from 'vue-fetch'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from '../pages/admin/index.vue'
import router from '../router/admin'

Vue.use(Element)
Vue.use(VueRouter)
Vue.use(VueFetch)
Vue.use(Vuex)

// const store = createStore()

// sync(store, router)

export const app = new Vue({
  router,
  // store,
  render: (h) => h(App),
}).$mount('app')
