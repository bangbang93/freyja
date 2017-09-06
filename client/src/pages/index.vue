<template>
  <div class="container">
    <h1>bangbang93.blog()</h1>
    <freyja-navbar></freyja-navbar>
    <router-view></router-view>
  </div>
</template>
<script>
  import FreyjaNavbar from '../components/home/navbar.vue'

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
  }
</style>
