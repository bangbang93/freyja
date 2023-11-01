<template>
  <div>
    <h2>
      标签: {{ tag }}
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

const route = useRoute()
const homeStore = useHomeStore()
const articles = ref([] as IArticle[])

const page = typeof route.query.page === 'string' ? parseInt(route.query.page, 10) : 1
const tag = route.params.tag.toString() ?? ''


articles.value = await homeStore.getArticles({
  page,
  tag,
})

</script>
