<template>
  <div class="container">
    <div class="header">
      <h1>bangbang93.blog()</h1>
      <freyja-navbar></freyja-navbar>
    </div>
    <div class="view">
      <router-view></router-view>
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
</style>
