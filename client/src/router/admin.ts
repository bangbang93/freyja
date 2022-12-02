/**
 * Created by bangbang93 on 2017/9/3.
 */

'use strict'
import {createRouter, createWebHistory} from 'vue-router'

/* eslint-disable @typescript-eslint/no-require-imports */
const routes = [
  {
    path: '/home',
    component: require('../pages/admin/dashboard.vue').default,
    name: 'dashboard',
  },
  {
    path: '/article/create',
    component: require('../pages/admin/article/create.vue').default,
    name: 'article.create',
  },
  {
    path: '/articles',
    component: require('../pages/admin/article/list.vue').default,
    name: 'article.list',
  },
  {
    path: '/article/:id',
    component: require('../pages/admin/article/create.vue').default,
    name: 'article.edit',
  },
  {
    path: '/attachment',
    component: require('../pages/admin/attachment/list.vue').default,
    name: 'attachment.list',
  },
  {
    path: '/tag',
    component: require('../pages/admin/tag/list.vue').default,
    name: 'tag.list',
  },
  {
    path: '/comment',
    component: require('../pages/admin/comment/list.vue').default,
    name: 'comment.list',
  },
  {
    path: '/import/wordpress',
    component: require('../pages/admin/import/wordpress.vue').default,
    name: 'import.wordpress',
  },
  {
    path: '/page/create',
    component: require('../pages/admin/page/create.vue').default,
    name: 'page.create',
  },
  {
    path: '/page',
    component: require('../pages/admin/page/list.vue').default,
    name: 'page.list',
  },
  {
    path: '/page/:id',
    component: require('../pages/admin/page/create.vue').default,
    name: 'page.edit',
  },
]

export default createRouter({
  history: createWebHistory('/admin'),
  routes,
})
