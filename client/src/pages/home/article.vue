<template>
  <div>
    <div class="freyja-article-title">
      <h3>{{article.title}}</h3>
    </div>
    <div class="freyja-article-time">
      <span><i class="el-icon-time"></i> {{article.createdAt | time}}</span>
    </div>
    <hr class="split-line">
    <div class="freyja-article-content">
      <div class="freyja-article-content" ref="articleContent" v-html="article.html"></div>
    </div>
    <div class="freyja-article-tag no-link">
      <span v-for="tag in article.tags" :key="tag">
        <router-link :to="{name: 'tag', params: {tag}}">
            <i class="fa fa-tag"></i> {{tag}}
        </router-link>
      </span>
    </div>
    <hr>
    <div class="freyja-article-comment">
      <freyja-article-comment :comments="comments" :articleId="article._id"></freyja-article-comment>
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
    mounted() {
      const articleId = this.$route.params.id
      this.$store.dispatch('comment/list', {articleId, page: 1})
    },
    updated() {
      this.highlight()
      import('lozad').then((lozad) => lozad().observe())
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
<style scoped lang="scss">
  .split-line {
    border: 0;
    height: 1px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
    width: 40%;
    margin-left: 0;
  }
  .freyja-article-tag {
    span {
      margin-right: 10px;
    }
  }
</style>
