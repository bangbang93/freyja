<template>
  <div @mouseenter="onMouseEnter">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'FreyjaMenuCategory',
    data() {
      this.$store.dispatch('home/getCategories')
      return {
        categories: this.$store.state.home.categories
      }
    },
    mounted() {

    },
    methods: {
      onMouseEnter() {
        console.log('213')
      }
    }
  }
</script>
