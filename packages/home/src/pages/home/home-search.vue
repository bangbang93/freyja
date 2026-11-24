<template>
  <div>
    <h2>
      关键字: {{ keyword }}
    </h2>
    <article-list :articles="articles" />
    <article-pager
      :articles="articles"
      :page="page"
    />
  </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import ArticleList from '../../components/home/article/article-list.vue'
import ArticlePager from '../../components/home/article/article-pager.vue'
import {IArticle, useHomeStore} from '../../store/home.ts'
import {sanitizePage} from '../../utils/page.ts'

const route = useRoute()
const homeStore = useHomeStore()

const page = computed(() => sanitizePage(route.query.page))
const keyword = computed(() => route.query.keyword?.toString() ?? '')
const articles = ref([] as IArticle[])
let latestRequestId = 0

async function load(): Promise<void> {
  const requestId = ++latestRequestId
  const list = await homeStore.search({
    keyword: keyword.value,
    page: page.value,
  })
  if (requestId === latestRequestId) {
    articles.value = list
  }
}

watch(() => route.query, async () => {
  await load()
})
await load()
</script>
