<template>
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
</template>

<script setup lang="ts">
import {ElButton} from 'element-plus'
import {computed} from 'vue'
import {IArticle} from '../../../store/home.ts'

const PAGE_SIZE = 20

const props = defineProps<{
  page: number
  articles: IArticle[]
}>()

const canGoBackward = computed(() => props.page > 1)
const canGoForward = computed(() => props.articles.length === PAGE_SIZE)
</script>


<style scoped lang="scss">
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
