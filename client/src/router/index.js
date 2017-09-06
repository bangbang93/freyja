/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict';
import VueRouter from 'vue-router'

export function createRouter () {
  const routes = [{
    path: '/',
    component: require('../pages/home/home.vue').default,
    name: 'home',
  }, {
    path: '/2',
    component: require('../pages/home/second.vue').default,
    name: 'second'
  }]

  return new VueRouter({
    routes,
    mode: 'history',
    base: '/',
  })
}
