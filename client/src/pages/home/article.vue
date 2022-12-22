<template>
  <div>
    <div class="freyja-article-title">
      <h3>{{ article.title }}</h3>
    </div>
    <div class="freyja-article-time">
      <span><i class="el-icon-time" /> {{ article.createdAt }}</span>
    </div>
    <hr class="split-line">
    <div class="freyja-article-content">
      <div
        ref="articleContent"
        class="freyja-article-content"
        v-html="article.html"
      />
    </div>
    <div class="freyja-article-tag no-link">
      <span
        v-for="tag in article.tags"
        :key="tag"
      >
        <router-link :to="{name: 'tag', params: {tag}}">
          <i class="fa fa-tag" /> {{ tag }}
        </router-link>
      </span>
    </div>
    <hr>
    <div class="freyja-article-comment">
      <freyja-article-comment
        :comments="comments"
        :article-id="article._id"
      />
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import FreyjaArticleComment from '../../components/home/article-comment.vue'

export default defineComponent({
  name: 'HomeArticle',
  components: {
    FreyjaArticleComment,
  },
  async asyncData({store, route}) {
    await store.dispatch('article/get', route.params.id)
  },
  data() {
    return {
      article: this.$store.state.article.article,
      comments: this.$store.state.comment.comments,
    }
  },
  mounted() {
    this.highlight()
    const articleId = this.$route.params.id
    this.$store.dispatch('comment/list', {articleId, page: 1})
  },
  updated() {
    this.highlight()
    import('lozad').then((lozad) => lozad.default().observe())
  },
  methods: {
    async highlight() {
      const prismjs = await import('prismjs')
      prismjs.highlightAll()
    },
    formatDate(date: Date | string): string {
      if (typeof date === 'string') {
        date = new Date(date)
      }
      return date.toLocaleString()
    },
  },
})
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
