import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const AdminRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    component: () => import('./pages/dashboard.vue'),
    name: 'dashboard',
    meta: {section: '工作台', title: '概览'},
  },
  {
    path: '/article/create',
    component: () => import('./pages/article/article-create.vue'),
    name: 'article.create',
    meta: {section: '内容 / 文章', title: '新建文章'},
  },
  {
    path: '/articles',
    component: () => import('./pages/article/list.vue'),
    name: 'article.list',
    meta: {section: '内容', title: '文章'},
  },
  {
    path: '/article/:id',
    component: () => import('./pages/article/article-create.vue'),
    name: 'article.edit',
    meta: {section: '内容 / 文章', title: '编辑文章'},
  },
  {
    path: '/attachment',
    component: () => import('./pages/attachment/list.vue'),
    name: 'attachment.list',
    meta: {section: '资源与互动', title: '附件'},
  },
  {
    path: '/tag',
    component: () => import('./pages/tag/list.vue'),
    name: 'tag.list',
    meta: {section: '资源与互动', title: '标签'},
  },
  {
    path: '/comment',
    component: () => import('./pages/comment/list.vue'),
    name: 'comment.list',
    meta: {section: '资源与互动', title: '评论'},
  },
  {
    path: '/page/create',
    component: () => import('./pages/page/create.vue'),
    name: 'page.create',
    meta: {section: '内容 / 页面', title: '新建页面'},
  },
  {
    path: '/page',
    component: () => import('./pages/page/list.vue'),
    name: 'page.list',
    meta: {section: '内容', title: '页面'},
  },
  {
    path: '/page/:id',
    component: () => import('./pages/page/create.vue'),
    name: 'page.edit',
    meta: {section: '内容 / 页面', title: '编辑页面'},
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
