<template>
  <div
    v-loading="loading"
    class="dashboard-page"
  >
    <section class="dashboard-heading">
      <div>
        <div class="dashboard-date">
          {{ today }}
        </div>
        <h1>欢迎回来。</h1>
        <p>这里是你博客的最新动态。</p>
      </div>
      <router-link
        class="dashboard-create"
        :to="{ name: 'article.create' }"
      >
        <el-icon><EditPen /></el-icon>
        写新文章
      </router-link>
    </section>

    <div
      v-if="loadError"
      class="dashboard-error"
    >
      <span>{{ loadError }}</span>
      <el-button
        text
        @click="loadData"
      >
        重新加载
      </el-button>
    </div>

    <section class="dashboard-stats">
      <div class="dashboard-stat">
        <div class="stat-icon articles">
          <el-icon><Document /></el-icon>
        </div>
        <div>
          <strong>{{ articleCount }}</strong>
          <span>全部文章</span>
        </div>
      </div>
      <div class="dashboard-stat">
        <div class="stat-icon pages">
          <el-icon><Notebook /></el-icon>
        </div>
        <div>
          <strong>{{ pageCount }}</strong>
          <span>独立页面</span>
        </div>
      </div>
      <div class="dashboard-stat">
        <div class="stat-icon attachments">
          <el-icon><Picture /></el-icon>
        </div>
        <div>
          <strong>{{ attachmentCount }}</strong>
          <span>附件资源</span>
        </div>
      </div>
      <div class="dashboard-stat">
        <div class="stat-icon tags">
          <el-icon><CollectionTag /></el-icon>
        </div>
        <div>
          <strong>{{ tagCount }}</strong>
          <span>内容标签</span>
        </div>
      </div>
    </section>

    <div class="dashboard-grid">
      <section class="dashboard-card recent-articles">
        <div class="dashboard-card-head">
          <h2>最近文章</h2>
          <router-link :to="{ name: 'article.list' }">
            查看全部
            <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>
        <div
          v-if="!recentArticles.length && !loading"
          class="dashboard-empty"
        >
          还没有文章，从第一篇开始吧。
        </div>
        <router-link
          v-for="article in recentArticles"
          :key="article._id"
          class="recent-article"
          :to="{ name: 'article.edit', params: { id: article._id } }"
        >
          <div>
            <div class="recent-article-title">
              {{ article.title }}
            </div>
            <div class="recent-article-meta">
              <span>{{ article.author?.username || '—' }}</span>
              <span>{{ formatDate(article.createdAt) }}</span>
            </div>
          </div>
          <el-icon><ArrowRight /></el-icon>
        </router-link>
      </section>

      <div class="dashboard-side">
        <section class="dashboard-card">
          <div class="dashboard-card-head">
            <h2>快速开始</h2>
          </div>
          <div class="quick-links">
            <router-link :to="{ name: 'article.create' }">
              <span class="quick-icon"><el-icon><EditPen /></el-icon></span>
              <span class="quick-copy"><b>写一篇新文章</b><small>记录一个想法</small></span>
              <el-icon><ArrowRight /></el-icon>
            </router-link>
            <router-link :to="{ name: 'attachment.list' }">
              <span class="quick-icon"><el-icon><Picture /></el-icon></span>
              <span class="quick-copy"><b>上传附件</b><small>整理图片与文件</small></span>
              <el-icon><ArrowRight /></el-icon>
            </router-link>
          </div>
        </section>

        <section class="dashboard-card">
          <div class="dashboard-card-head">
            <h2>最新评论</h2>
            <router-link :to="{ name: 'comment.list' }">
              管理
              <el-icon><ArrowRight /></el-icon>
            </router-link>
          </div>
          <div class="recent-comments">
            <div
              v-if="!recentComments.length && !loading"
              class="dashboard-empty"
            >
              还没有评论。
            </div>
            <div
              v-for="comment in recentComments"
              :key="comment._id"
              class="recent-comment"
            >
              <p>“{{ comment.content }}”</p>
              <span>{{ comment.publisher.name || '匿名读者' }} · {{ formatDate(comment.createdAt) }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  CollectionTag,
  Document,
  EditPen,
  Notebook,
  Picture,
} from '@element-plus/icons-vue'
import {onMounted, ref} from 'vue'

defineOptions({name: 'FreyjaDashboard'})

interface ArticleSummary {
  _id: string
  title: string
  createdAt: string
  author?: {username: string}
}

interface CommentSummary {
  _id: string
  content: string
  createdAt: string
  publisher: {name?: string}
}

const loading = ref(true)
const loadError = ref('')
const articleCount = ref(0)
const pageCount = ref(0)
const attachmentCount = ref(0)
const tagCount = ref(0)
const recentArticles = ref<ArticleSummary[]>([])
const recentComments = ref<CommentSummary[]>([])
const today = new Intl.DateTimeFormat('zh-CN', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date())

onMounted(loadData)

async function getJson<T>(url: string): Promise<T> {
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`request failed: ${resp.status}`)
  return await resp.json() as T
}

async function loadData(): Promise<void> {
  loading.value = true
  loadError.value = ''
  try {
    const [articles, pages, attachments, tags, recent, comments] = await Promise.all([
      getJson<{count: number}>('/api/admin/article/count'),
      getJson<{count: number}>('/api/admin/page/count'),
      getJson<{count: number}>('/api/admin/attachment/count'),
      getJson<Array<{title: string}>>('/api/admin/tag'),
      getJson<ArticleSummary[]>('/api/admin/article?page=1&limit=4'),
      getJson<CommentSummary[]>('/api/admin/comment?page=1&limit=2'),
    ])
    articleCount.value = articles.count
    pageCount.value = pages.count
    attachmentCount.value = attachments.count
    tagCount.value = tags.length
    recentArticles.value = recent
    recentComments.value = comments
  } catch {
    loadError.value = '暂时无法加载概览数据。'
  } finally {
    loading.value = false
  }
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}
</script>

<style scoped>
.dashboard-page {
  min-height: 600px;
}

.dashboard-heading {
  display: flex;
  margin-bottom: 22px;
  align-items: center;
  justify-content: space-between;
}

.dashboard-date {
  margin-bottom: 6px;
  color: var(--fj-clay-600);
  font-size: 11px;
  letter-spacing: .08em;
}

.dashboard-heading h1 {
  margin: 0;
  font-family: var(--fj-font-display);
  font-size: 29px;
  font-weight: 600;
  letter-spacing: .02em;
}

.dashboard-heading p {
  margin: 7px 0 0;
  color: var(--fj-text-secondary);
  font-size: 13px;
}

.dashboard-create {
  display: flex;
  height: 40px;
  padding: 0 17px;
  border-radius: 7px;
  align-items: center;
  gap: 8px;
  color: #fff;
  background: var(--fj-clay-600);
  box-shadow: 0 4px 12px rgb(185 71 50 / 12%);
  text-decoration: none;
}

.dashboard-create:hover {
  background: var(--fj-clay-700);
}

.dashboard-error {
  display: flex;
  margin-bottom: 16px;
  padding: 8px 14px;
  border: 1px solid #efcccc;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
  color: var(--fj-danger);
  background: var(--fj-danger-bg);
  font-size: 13px;
}

.dashboard-stats {
  display: grid;
  margin-bottom: 20px;
  gap: 14px;
  grid-template-columns: repeat(4, 1fr);
}

.dashboard-stat {
  display: flex;
  padding: 17px 20px;
  border: 1px solid var(--fj-border);
  border-radius: 11px;
  align-items: center;
  gap: 15px;
  background: #fff;
  box-shadow: 0 1px 2px rgb(16 41 35 / 2%);
}

.stat-icon {
  display: grid;
  width: 40px;
  height: 40px;
  border-radius: 9px;
  place-items: center;
  color: #365c4e;
  background: #eef2ed;
  font-size: 19px;
}

.stat-icon.pages {
  color: var(--fj-clay-600);
  background: var(--fj-clay-100);
}

.stat-icon.attachments {
  color: var(--fj-info);
  background: var(--fj-info-bg);
}

.stat-icon.tags {
  color: var(--fj-warning);
  background: var(--fj-warning-bg);
}

.dashboard-stat strong {
  display: block;
  font: 600 24px/1.1 Georgia, serif;
}

.dashboard-stat span:not(.stat-icon) {
  display: block;
  margin-top: 5px;
  color: var(--fj-text-secondary);
  font-size: 12px;
}

.dashboard-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: minmax(0, 1.65fr) minmax(280px, .85fr);
}

.dashboard-side {
  display: flex;
  gap: 20px;
  flex-direction: column;
}

.dashboard-card {
  overflow: hidden;
  border: 1px solid var(--fj-border);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 2px rgb(16 41 35 / 2%);
}

.dashboard-card-head {
  display: flex;
  height: 56px;
  padding: 0 20px;
  border-bottom: 1px solid #e7eae5;
  align-items: center;
  justify-content: space-between;
}

.dashboard-card-head h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.dashboard-card-head a {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--fj-text-secondary);
  font-size: 12px;
  text-decoration: none;
}

.dashboard-card-head a:hover {
  color: var(--fj-clay-600);
}

.recent-articles {
  min-height: 414px;
}

.recent-article {
  display: flex;
  min-height: 78px;
  padding: 13px 20px;
  border-bottom: 1px solid #edf0eb;
  align-items: center;
  justify-content: space-between;
  color: var(--fj-text-secondary);
  text-decoration: none;
}

.recent-article:hover {
  background: #fbfcf9;
}

.recent-article-title {
  overflow: hidden;
  margin-bottom: 6px;
  color: var(--fj-text-primary);
  font-size: 13px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-article-meta {
  display: flex;
  gap: 12px;
  color: var(--fj-text-tertiary);
  font-size: 11px;
}

.quick-links {
  padding: 5px 18px 13px;
}

.quick-links a {
  display: flex;
  padding: 11px 0;
  border-bottom: 1px solid #edf0eb;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.quick-links a:last-child {
  border-bottom: 0;
}

.quick-icon {
  display: grid;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  place-items: center;
  color: #52675e;
  background: var(--fj-bg-canvas);
}

.quick-copy {
  flex: 1;
}

.quick-copy b,
.quick-copy small {
  display: block;
}

.quick-copy b {
  font-size: 12px;
  font-weight: 500;
}

.quick-copy small {
  margin-top: 3px;
  color: var(--fj-text-tertiary);
  font-size: 10px;
}

.recent-comments {
  padding: 2px 18px 12px;
}

.recent-comment {
  padding: 12px 0;
  border-bottom: 1px solid #edf0eb;
}

.recent-comment:last-child {
  border-bottom: 0;
}

.recent-comment p {
  overflow: hidden;
  margin: 0 0 7px;
  font-size: 12px;
  line-height: 1.55;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-comment span {
  color: var(--fj-text-tertiary);
  font-size: 10px;
}

.dashboard-empty {
  padding: 34px 20px;
  color: var(--fj-text-tertiary);
  font-size: 12px;
  text-align: center;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .recent-articles {
    min-height: 0;
  }
}

@media (max-width: 600px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }

  .dashboard-heading {
    align-items: flex-start;
  }

  .dashboard-heading h1 {
    font-size: 25px;
  }

  .dashboard-create {
    padding: 0 12px;
  }
}
</style>
