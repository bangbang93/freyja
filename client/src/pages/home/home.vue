<template>
    <div>
        <div v-for="article in articles" :key="article._id">
            <h3>{{article.title}}</h3>
            <p>{{article.summary}}</p>
            <hr>
        </div>
    </div>
</template>
<script>
    export default {
      asyncData ({store, route}) {
        return store.dispatch('home/getArticles', store.state.home.page)
      },
      data() {
        return {
          articles: this.$store.state.home.articles,
          page: 1
        }
      },
    }
</script>
<style lang="scss" scoped="">
</style>
