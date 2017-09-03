/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict';
import VueRouter from 'vue-router'

export function createRouter () {
  const routes = [{
    path: '/1',
    component: require('../pages/home/first.vue').default,
    name: 'first',
    alias: '/'
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
