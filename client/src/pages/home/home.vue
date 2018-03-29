<template>
  <div>
    <h2 v-if="category">
      分类: {{category}}
    </h2>
    <h2 v-if="tag">
      标签: {{tag}}
    </h2>
    <div class="freyja-article-list">
      <article v-for="article in articles" :key="article._id">
        <h3 class="freyja-article-title">
          <router-link :to="{name: 'article', params: {id: article._id}}">
            {{article.title}}
          </router-link>
        </h3>
        <div class="freyja-article-info freyja-article-time">
          <hr>
          <span class="time"><i class="el-icon-time"></i> {{article.createdAt | time}}</span>
          <span class="comments">
            <i v-if="article.commentCount === 0" class="fa fa-comments">并没有评论</i>
            <i class="fa fa-comments" v-else>有{{article.commentCount}}条评论</i>
          </span>
        </div>
        <div class="freyja-article-summary freyja-article-content">
          <div v-html="article.summary"></div>
        </div>
        <hr>
      </article>
    </div>
    <div class="freyja-article-pager">
      <router-link :to="{query: {page: this.page-1}}">
        <el-button class="freyja-article-pager-prev" :disabled="!canGoBackward">
          <i class="el-icon-arrow-left"></i>
        </el-button>
      </router-link>
      <router-link :to="{query: {page: this.page+1}}">
        <el-button class="freyja-article-pager-next" :disabled="!canGoForward">
          <i class="el-icon-arrow-right"></i>
        </el-button>
      </router-link>
      <div style="clear: both"></div>
    </div>
  </div>
</template>
<script>
  import 'element-ui/lib/theme-default/index.css'
  import { Icon, Button } from 'element-ui'

  export default {
    components: {
      ElButton: Button,
    },
    asyncData ({store, route}) {
      switch (route.name) {
        case 'home':
          return store.dispatch('home/getArticles', {page: route.query.page || 1})
        case 'category':
          return store.dispatch('home/getArticles', {
            page: route.query.page || 1,
            category: route.params.category
          })
        case 'tag':
          return store.dispatch('home/getArticles', {
            page: route.query.page || 1,
            tag: route.params.tag
          })
      }
    },
    computed : {
      canGoBackward() {
        return this.page > 1
      },
      canGoForward() {
        return this.$store.getters['home/articleCount'] === 20
      }
    },
    data () {
      return {
        articles: this.$store.state.home.articles,
        page    : Number(this.$route.query.page) || 1,
        tag: this.$route.params.tag,
        category: this.$route.params.category,
      }
    },
    watch: {
      $route() {
        this.page = Number(this.$route.query.page) || 1
        this.onPager()
      }
    },
    updated() {
      this.highlight()
      import('lozad').then((lozad) => lozad().observe())
    },
    methods   : {
      onPager (page) {
        return this.$store.dispatch('home/getArticles', {page: this.page})
      },
      async highlight() {
        await import('prismjs/themes/prism-okaidia.css')
        const prismjs = await import('prismjs')
        prismjs.highlightAll()
      },
    }
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
