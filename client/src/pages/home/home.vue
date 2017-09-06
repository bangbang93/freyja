<template>
    <div>
        <div class="freyja-article-list">
            <article v-for="article in articles" :key="article._id">
                <h3>{{article.title}}</h3>
                <p>{{article.summary}}</p>
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
      methods: {
        onPager(page) {
          return this.$store.dispatch('home/doPager', page)
        }
      }
    }
</script>
<style lang="scss" scoped="">
</style>
