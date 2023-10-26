<template>
  <div>
    <div class="freyja-article-title">
      <h3>{{ article.title }}</h3>
    </div>
    <div class="freyja-article-time">
      <span><i class="el-icon-time" /> {{ formatDate(article.createdAt) }}</span>
    </div>
    <hr class="split-line">
    <div class="freyja-article-content">
      <div
        ref="articleContent"
        class="freyja-article-content"
        v-html="article.html"
      />
    </div>
    <div class="freyja-article-tag no-link">
      <span
        v-for="tag in article.tags"
        :key="tag"
      >
        <router-link :to="{name: 'tag', params: {tag}}">
          <i class="fa fa-tag" /> {{ tag }}
        </router-link>
      </span>
    </div>
    <hr>
    <div class="freyja-article-comment">
      <freyja-article-comment
        :comments="comments"
        :article-id="article._id"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import lozad from 'lozad'
import prismjs from 'prismjs'
import {PageContext} from 'vike/types'
import {inject, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import FreyjaArticleComment from '../../components/home/article-comment.vue'
import {useArticleStore} from '../../store/article.ts'
import {useCommentStore} from '../../store/comment.ts'

const articleStore = useArticleStore()
const commentStore = useCommentStore()
const route = useRoute()

const articleId = route.params.id as string

onMounted(async () => {
  prismjs.highlightAll()
  lozad().observe()
  await commentStore.list(articleId, 1)
})

const pageContext = inject<PageContext>('pageContext')
await articleStore.get(articleId)
const article = articleStore.article
const comments = commentStore.comments
if (pageContext) {
  pageContext.exports.title = article.title
}

function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleString()
}
</script>
<style scoped lang="scss">
  .split-line {
    border: 0;
    height: 1px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
    width: 40%;
    margin-left: 0;
  }
  .freyja-article-tag {
    span {
      margin-right: 10px;
    }
  }
</style>
