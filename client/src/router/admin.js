/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
import VueRouter from 'vue-router'

const routes = [{
  path: '/login',
  component: require('../pages/admin/login.vue').default,
  name: 'login',
}]

export default new VueRouter({
  routes,
  mode: 'history',
  base: '/admin',
})
