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
    <article-list :articles="articles" />
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
<script lang="ts" setup>
import {ElButton} from 'element-plus'
import {computed, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import ArticleList from '../../components/home/article/article-list.vue'
import {IArticle, useHomeStore} from '../../store/home.ts'

const route = useRoute()
const homeStore = useHomeStore()
const articles = ref([] as IArticle[])

const page = typeof route.query.page === 'string' ? parseInt(route.query.page, 10) : 1
const tag = route.params.tag as string | undefined
const category = route.params.category as string | undefined
const keyword = route.params.keyword as string | undefined

watch(route, async () => {
  switch (route.name) {
    case 'home':
      articles.value = await homeStore.getArticles({page})
      break
    case 'category':
      articles.value = await homeStore.getArticles({
        page,
        category,
      })
      break
    case 'tag':
      articles.value = await homeStore.getArticles({
        page,
        tag,
      })
      break
    case 'search':
      articles.value = await homeStore.search({
        keyword: keyword ?? '',
        page,
      })
      break
    default:
      // no default
  }
}, {immediate: true})

const canGoBackward = computed(() => page > 1)
const canGoForward = computed(() => homeStore.articles.length === 20)

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
