<template>
  <div>
    <h1>{{article.title}}</h1>
    <vue-markdown class="freyja-article-content" ref="articleContent">{{article.content}}</vue-markdown>
  </div>
</template>
<script>
  import VueMarkdown from 'vue-markdown'
  import prismjs from 'prismjs'
  import 'prismjs/themes/prism-okaidia.css'

  export default {
    asyncData({store, route}) {
      return store.dispatch('article/get', route.params.id)
    },
    components: {
      VueMarkdown,
    },
    mounted() {
      const el = this.$refs['articleContent'].$el
      prismjs.highlightAll()
    },
    data() {
      return {
        article: this.$store.state.article.article,
      }
    }
  }
</script>
