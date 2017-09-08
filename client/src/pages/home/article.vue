<template>
  <div>
    <div class="freyja-article-title">
      <h1>{{article.title}}</h1>
    </div>
    <div class="freyja-article-time">
      <span><i class="el-icon-time"></i> {{article.createdAt | time}}</span>
    </div>
    <hr class="split-line">
    <div class="freyja-article-content">
      <div class="freyja-article-content" ref="articleContent" v-html="article.html"></div>
    </div>
    <hr>
    <div class="freyja-article-comment">
      <freyja-article-comment :comments="comments"></freyja-article-comment>
    </div>
  </div>
</template>
<script>

  export default {
    asyncData({store, route}) {
      return store.dispatch('article/get', route.params.id)
    },
    components: {
      FreyjaArticleComment: () => import('../../components/home/article-comment.vue'),
    },
    filters: {
      time(time) {
        return new Date(time).toLocaleString()
      }
    },
    mounted() {
      this.highlight()
      const articleId = this.$route.params.id
      this.$store.dispatch('comment/list', {articleId, page: 1})
    },
    data() {
      return {
        article: this.$store.state.article.article,
        comments: this.$store.state.comment.comments,
      }
    },
    methods: {
      async highlight() {
        await import('prismjs/themes/prism-okaidia.css')
        const prismjs = await import('prismjs')
        prismjs.highlightAll()
      },
    }
  }
</script>
<style scoped>
  .split-line {
    border: 0;
    height: 1px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
    width: 40%;
    margin-left: 0;
  }
  .freyja-article-time {
    font-size: small;
    color: #666;
  }
</style>
