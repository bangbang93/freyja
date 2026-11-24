<template>
  <div class="comment-page">
    <section class="comment-page-head">
      <div>
        <h1>评论</h1>
        <p>查看读者留言，维护友善的讨论空间。</p>
      </div>
      <span class="comment-warning">删除后无法恢复</span>
    </section>

    <section
      v-loading="initialLoading"
      class="comment-card"
    >
      <div class="comment-toolbar">
        <span>评论列表</span>
        <span>最新评论优先</span>
      </div>
      <div
        v-if="loadError"
        class="comment-error"
      >
        {{ loadError }}
        <el-button
          text
          @click="loadComments(false)"
        >
          重试
        </el-button>
      </div>
      <div
        v-if="!comments.length && !initialLoading && !loadError"
        class="comment-empty"
      >
        还没有评论。
      </div>
      <div class="comment-list">
        <article
          v-for="comment in comments"
          :key="comment._id"
          class="comment-row"
        >
          <div class="comment-person">
            <div class="comment-avatar">
              {{ displayName(comment).slice(0, 1) }}
            </div>
            <div>
              <b>{{ displayName(comment) }}</b>
              <span>读者</span>
            </div>
          </div>
          <div class="comment-content">
            {{ comment.content }}
          </div>
          <time class="comment-time">{{ formatDate(comment.createdAt) }}</time>
          <el-button
            text
            class="comment-delete"
            title="删除评论"
            :loading="deletingId === comment._id"
            @click="deleteComment(comment)"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </article>
      </div>
      <div
        v-if="hasMore"
        class="comment-more"
      >
        <el-button
          :loading="loadingMore"
          @click="loadComments(true)"
        >
          加载更多
        </el-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {Delete} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {onMounted, ref} from 'vue'

interface Comment {
  _id: string
  content: string
  createdAt: string
  publisher: {name?: string}
}

defineOptions({name: 'FreyjaCommentList'})

const comments = ref<Comment[]>([])
const currentPage = ref(0)
const pageSize = 20
const hasMore = ref(false)
const initialLoading = ref(true)
const loadingMore = ref(false)
const loadError = ref('')
const deletingId = ref('')

onMounted(() => loadComments(false))

async function loadComments(append: boolean): Promise<void> {
  const targetPage = append ? currentPage.value + 1 : 1
  if (append) {
    loadingMore.value = true
  } else {
    initialLoading.value = true
  }
  loadError.value = ''
  try {
    const resp = await fetch(`/api/admin/comment?page=${targetPage}&limit=${pageSize}`)
    if (!resp.ok) throw new Error('comment request failed')
    const list = await resp.json() as Comment[]
    comments.value = append ? [...comments.value, ...list] : list
    currentPage.value = targetPage
    hasMore.value = list.length === pageSize
  } catch {
    loadError.value = '暂时无法加载评论。'
  } finally {
    initialLoading.value = false
    loadingMore.value = false
  }
}

async function deleteComment(comment: Comment): Promise<void> {
  const confirmed = await ElMessageBox.confirm(
    '确定删除这条评论吗？删除后无法恢复。',
    '删除评论',
    {confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning'},
  ).then(() => true).catch(() => false)
  if (!confirmed) return

  deletingId.value = comment._id
  try {
    const resp = await fetch(`/api/admin/comment/${comment._id}`, {method: 'DELETE'})
    if (resp.status !== 204) throw new Error('delete failed')
    comments.value = comments.value.filter((item) => item._id !== comment._id)
    ElMessage.success('删除成功')
  } catch {
    ElMessage.error('删除失败')
  } finally {
    deletingId.value = ''
  }
}

function displayName(comment: Comment): string {
  return comment.publisher.name ?? '匿名读者'
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
.comment-page-head {
  display: flex;
  margin-bottom: 22px;
  align-items: center;
  justify-content: space-between;
}

.comment-page-head h1 {
  margin: 0;
  font-family: var(--fj-font-display);
  font-size: 29px;
  font-weight: 600;
}

.comment-page-head p {
  margin: 7px 0 0;
  color: var(--fj-text-secondary);
  font-size: 13px;
}

.comment-warning {
  padding: 7px 11px;
  border-radius: 6px;
  color: var(--fj-text-secondary);
  background: var(--fj-pine-100);
  font-size: 11px;
}

.comment-card {
  overflow: hidden;
  min-height: 220px;
  border: 1px solid var(--fj-border);
  border-radius: 12px;
  background: var(--fj-bg-surface);
  box-shadow: var(--fj-shadow-sm);
}

.comment-toolbar {
  display: flex;
  height: 58px;
  padding: 0 20px;
  border-bottom: 1px solid var(--fj-border);
  align-items: center;
  justify-content: space-between;
  color: var(--fj-text-secondary);
  font-size: 12px;
}

.comment-error {
  display: flex;
  padding: 8px 20px;
  align-items: center;
  justify-content: space-between;
  color: var(--fj-danger);
  background: var(--fj-danger-bg);
  font-size: 12px;
}

.comment-list {
  padding: 0 20px;
}

.comment-row {
  display: grid;
  min-height: 77px;
  border-bottom: 1px solid var(--fj-border);
  align-items: center;
  gap: 18px;
  grid-template-columns: 190px minmax(0, 1fr) 155px 40px;
}

.comment-person {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.comment-avatar {
  display: grid;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  place-items: center;
  color: var(--fj-pine-800);
  background: var(--fj-pine-100);
  font: 600 12px var(--fj-font-display);
  flex: none;
}

.comment-person b,
.comment-person span {
  display: block;
}

.comment-person b {
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 600;
}

.comment-person span {
  color: var(--fj-text-tertiary);
  font-size: 10px;
}

.comment-content {
  display: -webkit-box;
  overflow: hidden;
  color: var(--fj-text-regular);
  font-size: 12px;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.comment-time {
  color: var(--fj-text-secondary);
  font-size: 11px;
}

.comment-delete {
  width: 32px;
  height: 32px;
  margin: 0;
  color: var(--fj-text-tertiary);
}

.comment-delete:hover {
  color: var(--fj-danger);
  background: var(--fj-danger-bg);
}

.comment-more {
  display: flex;
  padding: 18px;
  justify-content: center;
}

.comment-empty {
  padding: 54px 20px;
  color: var(--fj-text-tertiary);
  font-size: 12px;
  text-align: center;
}

@media (max-width: 1023px) {
  .comment-row {
    gap: 12px;
    grid-template-columns: 150px minmax(0, 1fr) 120px 35px;
  }
}

@media (max-width: 767px) {
  .comment-row {
    padding: 15px 0;
    grid-template-columns: 130px minmax(0, 1fr) 35px;
  }

  .comment-time {
    display: none;
  }
}
</style>
