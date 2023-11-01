<template>
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
        <span class="time"><i class="el-icon-time" /> {{ formatDate(article.createdAt) }}</span>
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
</template>
<script lang="ts" setup>
import lozad from 'lozad'
import prismjs from 'prismjs'
import {onMounted, onUpdated} from 'vue'
import {IArticle} from '../../../store/home.ts'

defineProps<{
  articles: IArticle[]
}>()


onMounted(() => {
  highlight()
  const observer = lozad()
  observer.observe()
})

onUpdated(() => {
  highlight()
})

function highlight(): void {
  prismjs.highlightAll()
}

function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleString()
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
