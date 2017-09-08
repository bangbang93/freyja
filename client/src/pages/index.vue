<template>
  <div class="container">
    <div class="header">
      <h1>bangbang93.blog()</h1>
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
</template>
<script>
  import FreyjaNavbar from '../components/home/navbar.vue'
  import 'animate.css'

  export default {
    components: {FreyjaNavbar},
    data () {
      return {
        msg: 'hello vue'
      }
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
</style>
