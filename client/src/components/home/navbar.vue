<template>
  <div>
    navbar
    <router-link :to="{name: 'home'}">first</router-link>
    <router-link to="2">second</router-link>
  </div>
</template>
<script>
  export default {
    name: 'FreyjaNavbar',
  }
</script>
