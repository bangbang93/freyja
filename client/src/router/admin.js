/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
import VueRouter from 'vue-router'

const routes = [{
  path: '/1',
  component: require('../pages/home/first.vue').default,
  name: 'first',
}, {
  path: '/2',
  component: require('../pages/home/second.vue').default,
  name: 'second'
}]

export default new VueRouter({
  routes,
  mode: 'history',
  base: '/admin',
})
