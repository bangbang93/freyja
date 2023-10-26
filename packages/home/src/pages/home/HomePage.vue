<template>
  <div>
    <div class="freyja-article-title">
      <h3>{{ pageStore.page.title }}</h3>
    </div>
    <!--<div class="freyja-article-time">-->
    <!--<span><i class="el-icon-time"></i> {{page.createdAt | time}}</span>-->
    <!--</div>-->
    <hr class="split-line">
    <div class="freyja-article-content">
      <div
        ref="articleContent"
        class="freyja-article-content"
        v-html="pageStore.page.html"
      />
    </div>
    <!--<hr>-->
    <!--<div class="freyja-article-comment">-->
    <!--<freyja-article-comment :comments="comments" :articleId="page._id"></freyja-article-comment>-->
    <!--</div>-->
  </div>
</template>
<script lang="ts" setup>
import lozad from 'lozad'
import prismjs from 'prismjs'
import {onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {usePageStore} from '../../store/page.ts'

const pageStore = usePageStore()
const route = useRoute()

const name = route.params.name as string
await pageStore.get(name)

onMounted(() => {
  lozad().observe()
  prismjs.highlightAll()
})
</script>

<style scoped>
.split-line {
  border: 0;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.75),
    rgba(0, 0, 0, 0)
  );
  width: 40%;
  margin-left: 0;
}
</style>
