<template>
  <div>
    <el-col :span="4" class="freyja-left-nav">
      <transition
              name="custom-classes-transition"
              enter-active-class="animated slideInLeft"
      >
        <freyja-nav-menu v-show="isShowMenu"></freyja-nav-menu>
      </transition>
    </el-col>
    <el-col :span="20" :offset="4">
      <div class="container">
        <div class="header">
          <h1 class="no-link"><router-link :to="{name: 'home'}">bangbang93.blog()</router-link></h1>
          <freyja-navbar></freyja-navbar>
        </div>
        <div class="view">
          <transition
                  name="custom-classes-transition"
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut"
                  mode="out-in"
          >
            <router-view></router-view>
          </transition>
        </div>
        <div class="footer">
          <hr>
          <div>
            Powered by freyja,written by bangbang93
          </div>
        </div>
      </div>
    </el-col>
  </div>
</template>
<script>
  import 'animate.css'
  import {Col} from 'element-ui'

  export default {
    components: {
      FreyjaNavMenu: () => import('../components/home/nav-menu.vue'),
      ElCol       : Col,
    },
    data () {
      return {
        isShowMenu: false,
      }
    },
    mounted() {
      this.isShowMenu = true;
    }
  }
</script>
<style>
  body {
    background-color: #eee;
  }
  .container {
    width: 1000px;
    margin: auto;
    padding-bottom: 50px;
  }
  .footer {
    color: #ccc;
  }
  .animated {
    animation-duration: 0.3s;
  }
  .freyja-left-nav {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
  }
</style>
