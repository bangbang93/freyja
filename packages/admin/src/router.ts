/**
 * Created by bangbang93 on 2017/9/3.
 */

'use strict'
import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const AdminRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    component: () => import('./pages/dashboard.vue'),
    name: 'dashboard',
  },
  {
    path: '/article/create',
    component: () => import('./pages/article/create.vue'),
    name: 'article.create',
  },
  {
    path: '/articles',
    component: () => import('./pages/article/list.vue'),
    name: 'article.list',
  },
  {
    path: '/article/:id',
    component: () => import('./pages/article/create.vue'),
    name: 'article.edit',
  },
  {
    path: '/attachment',
    component: () => import('./pages/attachment/list.vue'),
    name: 'attachment.list',
  },
  {
    path: '/tag',
    component: () => import('./pages/tag/list.vue'),
    name: 'tag.list',
  },
  {
    path: '/comment',
    component: () => import('./pages/comment/list.vue'),
    name: 'comment.list',
  },
  {
    path: '/import/wordpress',
    component: () => import('./pages/import/wordpress.vue'),
    name: 'import.wordpress',
  },
  {
    path: '/page/create',
    component: () => import('./pages/page/create.vue'),
    name: 'page.create',
  },
  {
    path: '/page',
    component: () => import('./pages/page/list.vue'),
    name: 'page.list',
  },
  {
    path: '/page/:id',
    component: () => import('./pages/page/create.vue'),
    name: 'page.edit',
  },
]

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('./pages/index.vue'),
    children: AdminRoutes,
  },
  {
    path: '/login',
    component: () => import('./pages/login.vue'),
  },
]

export default createRouter({
  history: createWebHistory('/admin'),
  routes,
})
