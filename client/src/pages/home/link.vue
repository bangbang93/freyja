<template>
  <div>
    <ul>
      <li
        v-for="link in links"
        :key="link.name"
        class="no-link link-item"
      >
        <a
          v-once
          :href="link.href"
          target="_blank"
          rel="nofollow"
        >{{ link.name }} <i class="fa fa-external-link-square" /></a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      links: this.$store.state.link.links,
    }
  },
  asyncData({store}) {
    return store.dispatch('link/getLinks')
  },
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
