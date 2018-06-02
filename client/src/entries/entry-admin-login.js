/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict';
import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from '../pages/admin/login.vue'
import VueFetch from 'vue-fetch'

require('es6-promise').polyfill();

Vue.use(Element);
Vue.use(VueFetch);

// const store = createStore()

// sync(store, router)

const app = new Vue({
  render: (h)=>h(App),
}).$mount('app')
