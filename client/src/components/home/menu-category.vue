<template>
  <div @mouseenter="onMouseEnter">
    <slot />
  </div>
</template>
<script>
export default {
  name: 'FreyjaMenuCategory',
  data() {
    this.$store.dispatch('home/getCategories')
    return {
      categories: this.$store.state.home.categories,
    }
  },
  mounted() {

  },
  methods: {
    onMouseEnter() {
      // eslint-disable-next-line no-console
      console.log('213')
    },
  },
}
</script>
