/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
import VueRouter from 'vue-router'

const routes = [{
  path: '/home',
  component: require('../pages/admin/dashboard.vue').default,
  name: 'dashboard',
}]

export default new VueRouter({
  routes,
  mode: 'history',
  base: '/admin',
})
