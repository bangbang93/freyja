<template>
  <div>
    <div class="freyja-article-list">
      <article v-for="article in articles" :key="article._id">
        <h3 class="freyja-article-title">
          <router-link :to="{name: 'article', params: {id: article._id}}">
            {{article.title}}
          </router-link>
        </h3>
        <div class="freyja-article-time">
          <hr>
          <span><i class="el-icon-time"></i> {{article.createdAt | time}}</span>
        </div>
        <div class="freyja-article-summary">
          <freyja-markdown>{{article.summary}}</freyja-markdown>>
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
  import FreyjaMarkdown from '../../components/home/comment-editor.vue'

  export default {
    components: {
      FreyjaMarkdown,
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
        return this.$store.state.home.articleCount > 20
      }
    },
    data () {
      return {
        articles: this.$store.state.home.articles,
        page    : 1
      }
    },
    filters   : {
      time (time) {
        return new Date(time).toLocaleString()
      }
    },
    methods   : {
      onPager (page) {
        return this.$store.dispatch('home/doPager', page)
      }
    }
  }
</script>
<style lang="scss">
  .freyja-article-time {
    font-size: small;
    color: #666;
    hr {
      border: 0;
      height: 1px;
      background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
      width: 40%;
      margin-left: 0;
    }
  }

  .freyja-article-summary {
    color: #333;
    img {
      max-width: 100%;
    }
  }

  .freyja-article-title {
    color: #333;
    :link,
    :visited {
      color: #333;
      text-decoration: none;
    }
  }
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
</style>
