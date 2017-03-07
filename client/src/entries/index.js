/**
 * Created by bangbang93 on 16/9/30.
 */
'use strict';
import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from '../pages/index.vue'
import VueRouter from 'vue-router'
import VueFetch from 'vue-fetch'

require('es6-promise').polyfill();

import FirstPage from '../pages/home/first.vue'
import SecondPage from '../pages/home/second.vue'

Vue.use(Element);
Vue.use(VueRouter);
Vue.use(VueFetch);

const routes = [{
  path: '/1',
  component: FirstPage,
  name: 'first',
  alias: '/'
}, {
  path: '/2',
  component: SecondPage,
  name: 'second'
},
  {
    path: '*',
    redirect: '/profile'
  }];

const router = new VueRouter({
  routes,
  mode: 'history',
  base: '/',
});

const app = new Vue({
  router,
  render: (h)=>h(App),
}).$mount('app');