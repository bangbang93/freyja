<template>
  <div>
    <ul>
      <li class="no-link link-item"  v-for="link in links" :key="link.name">
        <a :href="link.href" target="_blank" rel="nofollow" v-once>{{link.name}} <i class="fa fa-external-link-square"></i></a>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    asyncData({store}) {
      return store.dispatch('link/getLinks')
    },
    data() {
      return {
        links: this.$store.state.link.links
      }
    }
  }
</script>
<style scoped="scoped" lang="scss">
  .link-item {
    line-height: 30px;
    a {
      color: #0088cc;
    }
  }
</style>
