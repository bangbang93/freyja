<template>
  <div>
    <el-col v-if="menuWidth !== 1" :span="menuWidth" class="freyja-left-nav">
      <transition
              name="custom-classes-transition"
              enter-active-class="animated slideInLeft"
      >
        <freyja-nav-menu v-show="isShowMenu"></freyja-nav-menu>
      </transition>
    </el-col>
    <el-col :span="containerWidth" :offset="menuWidth">
      <div class="container">
        <div class="header">
          <h1 class="no-link"><router-link :to="{name: 'home'}">bangbang93.blog()</router-link></h1>
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
      let menuWidth = 1
      if (typeof window !== 'undefined') {
        const mq = window.matchMedia( "(min-width: 1000px)" )
        mq.addListener(onWidthChange)
        onWidthChange(mq)
        function onWidthChange(mq) {
          if (mq.matches) {
            menuWidth = 4
          }
        }
      }
      return {
        isShowMenu: false,
        menuWidth,
      }
    },
    computed: {
      containerWidth() {
        if (this.menuWidth === 4) {
          return 20
        }
        return 22
      }
    },
    mounted() {
      this.isShowMenu = true
      this.$store.state.origin = ''
    }
  }
</script>
<style>
  body {
    background-color: #eee;
  }
  .container {
    max-width: 1000px;
    margin: auto;
    padding-bottom: 50px;
  }
  .footer {
    color: #ccc;
  }
  .animated {
    animation-duration: 0.3s;
  }
  @media (min-width: 1000px) {
    .freyja-left-nav {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
    }
  }
  @media (max-width: 999px) {
    .freyja-left-nav {
      display: none;
    }
  }
</style>
