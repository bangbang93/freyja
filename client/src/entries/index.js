/**
 * Created by bangbang93 on 16/9/30.
 */
'use strict';
import Vue from 'vue';
import Element from 'element-ui';
import 'element-ui/lib/theme-default/index.css'
import App from '../pages/index.vue';
require('es6-promise').polyfill();

Vue.use(Element);

new Vue({
  el: 'app',
  render: h=>h(App)
});