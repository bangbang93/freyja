<template>
  <div>
    <el-col
      v-if="menuWidth !== 1"
      :span="menuWidth"
      class="freyja-left-nav"
    >
      <transition
        name="custom-classes-transition"
        enter-active-class="animated slideInLeft"
      >
        <freyja-nav-menu v-show="isShowMenu" />
      </transition>
    </el-col>
    <el-col
      :span="containerWidth"
      :offset="menuWidth"
    >
      <div class="container">
        <div class="header">
          <h1 class="no-link">
            <router-link :to="{ name: 'home' }">
              bangbang93.blog()
            </router-link>
          </h1>
        </div>
        <div class="view">
          <router-view v-slot="{ Component }">
            <Suspense>
              <transition
                name="custom-classes-transition"
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
                mode="out-in"
              >
                <component :is="Component" />
              </transition>
            </Suspense>
          </router-view>
        </div>
        <div class="footer">
          <hr>
          <div class="no-link">
            Powered by
            <a href="https://github.com/bangbang93/freyja">Freyja</a>.
            Contribute by <a href="https://weibo.com/bangbang93">bangbang93</a>.
          </div>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script lang="ts">
import 'animate.css'
import {ElCol as Col} from 'element-plus'
import {defineComponent} from 'vue'
import FreyjaNavMenu from '../components/home/nav-menu.vue'

export default defineComponent({
  name: 'PageIndex',
  components: {
    FreyjaNavMenu,
    ElCol: Col,
  },
  data() {
    const menuWidth = 4
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
    },
  },
  mounted() {
    const mq = window.matchMedia('(max-width: 999px)')
    mq.addEventListener('change', this.onWidthChange.bind(this))
    this.onWidthChange(mq)
    this.isShowMenu = true
    this.$store.state.origin = ''
  },
  methods: {
    onWidthChange(mq: MediaQueryListEvent | MediaQueryList) {
      if (mq.matches) {
        this.menuWidth = 1
      } else {
        this.menuWidth = 4
      }
    },
  },
})
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
