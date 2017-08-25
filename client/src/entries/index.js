/**
 * Created by bangbang93 on 16/9/30.
 */
'use strict';
import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from '../pages/index.vue'
import VueRouter from 'vue-router'
// import VueFetch from 'vue-fetch'
import {createRouter} from '../router/index'

// require('es6-promise').polyfill();

Vue.use(Element);
Vue.use(VueRouter);
// Vue.use(VueFetch);

const router = createRouter()

export function createApp() {
  const app = new Vue({
    router,
    render: (h)=>h(App),
  })
  return {app, router}
}
