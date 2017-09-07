<template>
  <div>
    <h1>{{article.title}}</h1>
    <vue-markdown class="freyja-article-content" ref="articleContent">{{article.content}}</vue-markdown>
  </div>
</template>
<script>
  import FreyjaMarkdown from '../../components/home/markdown.vue'
  import VueMarkdown from 'vue-markdown'

  export default {
    asyncData({store, route}) {
      return store.dispatch('article/get', route.params.id)
    },
    components: {
      FreyjaMarkdown,
      VueMarkdown,
    },
    mounted() {
      this.highlight()
    },
    data() {
      return {
        article: this.$store.state.article.article,
      }
    },
    methods: {
      async highlight() {
        await import('prismjs/themes/prism-okaidia.css')
        const prismjs = await import('prismjs')
        prismjs.highlightAll()
      }
    }
  }
</script>
