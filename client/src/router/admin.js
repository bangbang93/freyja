/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
import VueRouter from 'vue-router'

const routes = [{
  path: '/home',
  component: require('../pages/admin/dashboard.vue').default,
  name: 'dashboard',
}, {
  path: '/article/create',
  component: require('../pages/admin/article/create.vue').default,
  name: 'article.create',
}, {
  path: '/articles',
  component: require('../pages/admin/article/list.vue').default,
  name: 'article.list',
}, {
  path: '/article/:id',
  component: require('../pages/admin/article/create.vue').default,
  name: 'article.edit',
}, {
  path: '/attachment',
  component: require('../pages/admin/attachment/list.vue').default,
  name: 'attachment.list',
}, {
  path: '/tag',
  component: require('../pages/admin/tag/list.vue').default,
  name: 'tag.list',
}, {
  path: '/import/wordpress',
  component: require('../pages/admin/import/wordpress.vue').default,
  name: 'import.wordpress',
}]

export default new VueRouter({
  routes,
  mode: 'history',
  base: '/admin',
})
