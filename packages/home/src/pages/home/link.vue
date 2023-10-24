<template>
  <div>
    <ul>
      <li
        v-for="link in links"
        :key="link.name"
        class="no-link link-item"
      >
        <a
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
  name: 'HomeLink',
  asyncData({store}) {
    return store.dispatch('link/getLinks')
  },
  data() {
    return {
      links: this.$store.state.link.links,
    }
  },
}
</script>

<style lang="scss" scoped="scoped">
.link-item {
  line-height: 30px;
  a {
    color: #0088cc;
  }
}
</style>
