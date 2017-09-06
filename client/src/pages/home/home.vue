<template>
    <div>
        <div class="freyja-article-list">
            <article v-for="article in articles" :key="article._id">
                <h3>
                    <a :href="'/article/' + article._id">
                        {{article.title}}
                    </a>
                </h3>
                <div class="freyja-article-time">
                    <hr>
                    <span><i class="el-icon-time"></i> {{article.createdAt | time}}</span>
                </div>
                <div class="freyja-article-summary">
                    <pre>{{article.summary}}</pre>
                </div>
                <hr>
            </article>
        </div>
        <div class="freyja-article-pager">
            <el-button class="freyja-article-pager-prev" @click="onPager(-1)">
                <i class="el-icon-arrow-left"></i>
            </el-button>
            <el-button class="freyja-article-pager-next" @click="onPager(1)">
                <i class="el-icon-arrow-right"></i>
            </el-button>
        </div>
    </div>
</template>
<script>
    import 'element-ui/lib/theme-default/index.css'
    import {Icon, Button} from 'element-ui'
    export default {
      components: {
        ElButton: Button,
      },
      asyncData ({store, route}) {
        return store.dispatch('home/getArticles', store.state.home.page)
      },
      data() {
        return {
          articles: this.$store.state.home.articles,
          page: 1
        }
      },
      filters: {
        time(time) {
          return new Date(time).toLocaleString()
        }
      },
      methods: {
        onPager(page) {
          return this.$store.dispatch('home/doPager', page)
        }
      }
    }
</script>
<style lang="scss" scoped="">
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
</style>
