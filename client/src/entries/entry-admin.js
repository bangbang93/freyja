/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict';
import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from '../pages/admin/index.vue'
import VueRouter from 'vue-router'
import VueFetch from 'vue-fetch'
import router from '../router/admin'
// import {createStore} from '../store/index'
import Vuex from 'vuex'
// import {sync} from 'vuex-router-sync'

require('es6-promise').polyfill();

Vue.use(Element);
Vue.use(VueRouter);
Vue.use(VueFetch);
Vue.use(Vuex)

// const store = createStore()

// sync(store, router)

const app = new Vue({
  router,
  // store,
  render: (h)=>h(App),
}).$mount('app')
