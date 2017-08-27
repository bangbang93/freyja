<template>
    <div>
        first {{hello}}
    </div>
</template>
<script>
    export default {
      asyncData ({store, route}) {
        return store.dispatch('fetchLatest')
      },
      data() {
        return {
          hello: this.$store.state.oni,
        }
      },
    }
</script>
<style lang="scss" scoped="">
    div {
        background: white;
    }
</style>
