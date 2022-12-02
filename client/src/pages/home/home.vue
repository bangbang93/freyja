<template>
  <div>
    <h2 v-if="category">
      分类: {{ category }}
    </h2>
    <h2 v-if="tag">
      标签: {{ tag }}
    </h2>
    <h2 v-if="keyword">
      关键字: {{ keyword }}
    </h2>
    <div class="freyja-article-list">
      <article
        v-for="article in articles"
        :key="article._id"
      >
        <h3 class="freyja-article-title">
          <router-link :to="{name: 'article', params: {id: article._id}}">
            {{ article.title }}
          </router-link>
        </h3>
        <div class="freyja-article-info freyja-article-time">
          <hr>
          <span class="time"><i class="el-icon-time" /> {{ article.createdAt | time }}</span>
          <span class="comments">
            <i
              v-if="article.commentCount === 0"
              class="fa fa-comments"
            >并没有评论</i>
            <i
              v-else
              class="fa fa-comments"
            >有{{ article.commentCount }}条评论</i>
          </span>
        </div>
        <div class="freyja-article-summary freyja-article-content">
          <div v-html="article.summary" />
        </div>
        <hr>
      </article>
    </div>
    <div class="freyja-article-pager">
      <router-link :to="{query: {page: page-1}}">
        <el-button
          class="freyja-article-pager-prev"
          :disabled="!canGoBackward"
        >
          <i class="el-icon-arrow-left" />
        </el-button>
      </router-link>
      <router-link :to="{query: {page: page+1}}">
        <el-button
          class="freyja-article-pager-next"
          :disabled="!canGoForward"
        >
          <i class="el-icon-arrow-right" />
        </el-button>
      </router-link>
      <div style="clear: both" />
    </div>
  </div>
</template>
<script>
import {ElButton} from 'element-plus'

function asyncData({store, route}) {
  switch (route.name) {
    case 'home':
      return store.dispatch('home/getArticles', {page: route.query.page || 1})
    case 'category':
      return store.dispatch('home/getArticles', {
        page: route.query.page || 1,
        category: route.params.category,
      })
    case 'tag':
      return store.dispatch('home/getArticles', {
        page: route.query.page || 1,
        tag: route.params.tag,
      })
    case 'search':
      return store.dispatch('home/search', {
        keyword: route.query.keyword,
        page: route.query.page || 1,
      })
    default:
  }
}

export default {
  name: 'HomeHome',
  components: {
    ElButton,
  },
  asyncData,
  data() {
    const result =  {
      articles: this.$store.state.home.articles,
      page: Number(this.$route.query.page) || 1,
      tag: this.$route.params.tag,
      category: this.$route.params.category,
      keyword: this.$route.params.keyword,
    }
    if (this.$route.name === 'search') {
      result.keyword = this.$route.query.keyword
    }
    return result
  },
  computed: {
    canGoBackward() {
      return this.page > 1
    },
    canGoForward() {
      return this.$store.getters['home/articleCount'] === 20
    },
  },
  watch: {
    $route() {
      this.page = Number(this.$route.query.page) || 1
      asyncData({store: this.$store, route: this.$route})
      this.keyword = this.$route.query.keyword
    },
  },
  mounted() {
    this.highlight()
    import('lozad').then((lozad) => lozad.default().observe())
  },
  updated() {
    this.highlight()
    import('lozad').then((lozad) => lozad.default().observe())
  },
  methods: {
    async highlight() {
      await import('prismjs/themes/prism-okaidia.css')
      const prismjs = await import('prismjs')
      prismjs.highlightAll()
    },
  },
}
</script>
<style lang="scss">
  .freyja-article-pager-prev {
    float: left;
    width: 300px;
    max-width: 40%;
  }
  .freyja-article-pager-next {
    float: right;
    width: 300px;
    max-width: 40%;
  }
  .freyja-article-info {
    .time {
      margin-right: 20px;
    }
  }
</style>
