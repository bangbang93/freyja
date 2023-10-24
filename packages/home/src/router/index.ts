/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import {createMemoryHistory, createRouter, createWebHistory, Router} from 'vue-router'

export function createHomeRouter(): Router {
  const routes = [
    {
      path: '/',
      component: import('../pages/home/home.vue'),
      name: 'home',
    },
    {
      path: '/article/:id',
      component: import('../pages/home/article.vue'),
      name: 'article',
    },
    {
      path: '/page/link',
      component: import('../pages/home/link.vue'),
      name: 'link',
    },
    {
      path: '/page/:name',
      component: import('../pages/home/page.vue'),
      name: 'general-page',
    },
    {
      path: '/tag/:tag',
      component: import('../pages/home/home.vue'),
      name: 'tag',
    },
    {
      path: '/category/:category',
      component: import('../pages/home/home.vue'),
      name: 'category',
    },
    {
      path: '/search',
      component: import('../pages/home/home.vue'),
      name: 'search',
    },
  ]

  // routes.push({
  //   path: '*',
  //   meta: {status: 404},
  //   component: import('../components/home/not-found.vue'),
  // })

  return createRouter({
    history: typeof window === 'undefined' ? createMemoryHistory('/') : createWebHistory('/'),
    routes,
    scrollBehavior(_, __, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      return {left: 0, top: 0}
    },
  })
}