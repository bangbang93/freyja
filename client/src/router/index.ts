/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import {createRouter, createWebHistory, Router} from 'vue-router'

/* eslint-disable @typescript-eslint/no-require-imports */
export function createHomeRouter(): Router {
  const routes = [
    {
      path: '/',
      component: require('../pages/home/home.vue').default,
      name: 'home',
    },
    {
      path: '/article/:id',
      component: require('../pages/home/article.vue').default,
      name: 'article',
    },
    {
      path: '/page/link',
      component: require('../pages/home/link.vue').default,
      name: 'link',
    },
    {
      path: '/page/:name',
      component: require('../pages/home/page.vue').default,
      name: 'general-page',
    },
    {
      path: '/tag/:tag',
      component: require('../pages/home/home.vue').default,
      name: 'tag',
    },
    {
      path: '/category/:category',
      component: require('../pages/home/home.vue').default,
      name: 'category',
    },
    {
      path: '/search',
      component: require('../pages/home/home.vue').default,
      name: 'search',
    },
  ]

  // routes.push({
  //   path: '*',
  //   meta: {status: 404},
  //   component: require('../components/home/not-found.vue').default,
  // })

  return createRouter({
    history: createWebHistory('/'),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      return {left: 0, top: 0}
    },
  })
}
