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
    path: '/article/:id',
    component: require('../pages/home/article.vue').default,
    name: 'article',
  }]

  routes.push({
    path: '*',
    meta: {status: 404},
    component: require('../components/home/not-found.vue').default,
  })

  return new VueRouter({
    routes,
    mode: 'history',
    base: '/',
  })
}
