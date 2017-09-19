<template>
  <div>
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
            <i v-if="article.commentCount === 0" class="el-icon-message">并没有评论</i>
            <i v-else class="el-icon-message">有{{article.commentCount}}条评论</i>
          </span>
        </div>
        <div class="freyja-article-summary freyja-article-content">
          <div v-html="article.summary"></div>
        </div>
        <hr>
      </article>
    </div>
    <div class="freyja-article-pager">
      <el-button class="freyja-article-pager-prev" @click="onPager(-1)" :disabled="!canGoBackward">
        <i class="el-icon-arrow-left"></i>
      </el-button>
      <el-button class="freyja-article-pager-next" @click="onPager(1)" :disabled="!canGoForward">
        <i class="el-icon-arrow-right"></i>
      </el-button>
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
      return store.dispatch('home/getArticles', store.state.home.page)
    },
    computed : {
      canGoBackward() {
        return this.$store.state.home.page > 1
      },
      canGoForward() {
        return this.$store.getters['home/articleCount'] === 20
      }
    },
    data () {
      return {
        articles: this.$store.state.home.articles,
        page    : 1
      }
    },
    mounted() {
      this.highlight()
    },
    methods   : {
      onPager (page) {
        return this.$store.dispatch('home/doPager', page)
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
