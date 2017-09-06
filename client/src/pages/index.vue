<template>
  <div>
    <h1>bangbang93.blog()</h1>

    <router-link :to="{name: 'home'}">first</router-link>
    <router-link to="2">second</router-link>
    <router-view></router-view>
  </div>
</template>
<style>
  body {
    background-color: #eee;
  }
</style>
<script>
  export default {
    data () {
      return {
        msg: 'hello vue'
      }
    }
  }
</script>
