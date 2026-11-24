<template>
  <div>
    <h2>
      分类: {{ category }}
    </h2>
    <article-list :articles="articles" />
    <article-pager
      :articles="articles"
      :page="page"
    />
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import {useRoute} from 'vue-router'
import ArticleList from '../../components/home/article/article-list.vue'
import ArticlePager from '../../components/home/article/article-pager.vue'
import {IArticle, useHomeStore} from '../../store/home.ts'
import {sanitizePage} from '../../utils/page.ts'

const route = useRoute()
const homeStore = useHomeStore()
const articles = ref([] as IArticle[])

const page = sanitizePage(route.query.page)
const category = route.params.category.toString() ?? ''

articles.value = await homeStore.getArticles({
  page,
  category,
})

</script>
