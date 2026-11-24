<template>
  <div class="content-list-page">
    <section class="list-page-head">
      <div>
        <h1>{{ config.title }} <span>{{ total }}</span></h1>
        <p>{{ config.description }}</p>
      </div>
      <div class="list-page-actions">
        <el-button
          :loading="rerendering"
          title="重新渲染全部"
          aria-label="重新渲染全部"
          @click="rerenderAll"
        >
          <el-icon><Refresh /></el-icon>
          <span class="rerender-label">重新渲染全部</span>
        </el-button>
        <router-link
          class="list-create"
          :to="{ name: config.createRoute }"
        >
          <el-icon><Plus /></el-icon>
          新建{{ config.title }}
        </router-link>
      </div>
    </section>

    <section
      v-loading="loading"
      class="list-card"
    >
      <div class="list-toolbar">
        <span>共 <b>{{ total }}</b> {{ config.unit }}</span>
        <span>按发布时间倒序</span>
      </div>
      <div
        v-if="errorMessage"
        class="list-error"
      >
        {{ errorMessage }}
        <el-button
          text
          @click="loadData"
        >
          重试
        </el-button>
      </div>
      <div
        v-if="!items.length && !loading && !errorMessage"
        class="list-empty"
      >
        <el-icon><Document /></el-icon>
        <h2>还没有{{ config.title }}</h2>
        <p>从新建{{ config.title }}开始。</p>
        <router-link :to="{ name: config.createRoute }">
          新建{{ config.title }}
        </router-link>
      </div>
      <template v-else>
        <div class="list-table-wrap">
          <table class="content-table">
            <colgroup>
              <col>
              <col class="author-column">
              <col class="date-column">
              <col class="action-column">
            </colgroup>
            <thead>
              <tr>
                <th>标题</th>
                <th>作者</th>
                <th>发布时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in items"
                :key="item._id"
              >
                <td>
                  <div class="content-title">
                    {{ item.title }}
                  </div>
                  <div class="content-alias">
                    {{ type === 'article' ? item.slug : item.name }}
                  </div>
                </td>
                <td>
                  <div class="content-author">
                    <span>{{ item.author?.username.slice(0, 1).toUpperCase() || '·' }}</span>
                    {{ item.author?.username || '—' }}
                  </div>
                </td>
                <td class="content-date">
                  {{ formatDate(item.createdAt) }}
                </td>
                <td>
                  <div class="content-actions">
                    <el-button
                      text
                      title="编辑"
                      @click="editItem(item)"
                    >
                      <el-icon><EditPen /></el-icon>
                    </el-button>
                    <el-button
                      text
                      class="delete-button"
                      title="删除"
                      :loading="deletingId === item._id"
                      @click="deleteItem(item)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="list-pagination">
          <span>共 {{ total }} {{ config.unit }} · 每页 {{ pageSize }} {{ config.unit }}</span>
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            :hide-on-single-page="true"
            layout="prev, pager, next"
            background
            @current-change="loadData"
          />
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import {Delete, Document, EditPen, Plus, Refresh} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'

interface ContentItem {
  _id: string
  title: string
  slug?: string
  name?: string
  createdAt: string
  author?: {username: string}
}

const props = defineProps<{
  type: 'article' | 'page'
}>()
const router = useRouter()
const items = ref<ContentItem[]>([])
const pageSize = 20
const total = ref(0)
const currentPage = ref(1)
const loading = ref(true)
const errorMessage = ref('')
const deletingId = ref('')
const rerendering = ref(false)
const config = computed(() => props.type === 'article'
  ? {
      title: '文章',
      description: '管理、编辑与重新渲染你的文章。',
      unit: '篇',
      endpoint: '/api/admin/article',
      createRoute: 'article.create',
      editRoute: 'article.edit',
    }
  : {
      title: '页面',
      description: '管理独立页面与其发布内容。',
      unit: '个页面',
      endpoint: '/api/admin/page',
      createRoute: 'page.create',
      editRoute: 'page.edit',
    })

onMounted(loadData)

async function loadData(): Promise<void> {
  loading.value = true
  errorMessage.value = ''
  try {
    const [listResp, countResp] = await Promise.all([
      fetch(`${config.value.endpoint}?page=${currentPage.value}`),
      fetch(`${config.value.endpoint}/count`),
    ])
    if (!listResp.ok || !countResp.ok) throw new Error('list request failed')
    const [list, count] = await Promise.all([
      listResp.json() as Promise<ContentItem[]>,
      countResp.json() as Promise<{count: number}>,
    ])
    items.value = list
    total.value = count.count
  } catch {
    errorMessage.value = `暂时无法加载${config.value.title}列表。`
  } finally {
    loading.value = false
  }
}

function editItem(item: ContentItem): void {
  void router.push({
    name: config.value.editRoute,
    params: {id: item._id},
  })
}

async function deleteItem(item: ContentItem): Promise<void> {
  const confirmed = await ElMessageBox.confirm(
    `确定删除「${item.title}」吗？删除后无法恢复。`,
    `删除${config.value.title}`,
    {confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning'},
  ).then(() => true).catch(() => false)
  if (!confirmed) return

  deletingId.value = item._id
  try {
    const resp = await fetch(`${config.value.endpoint}/${item._id}`, {method: 'DELETE'})
    if (resp.status !== 204) throw new Error('delete failed')
    ElMessage.success('删除成功')
    if (items.value.length === 1 && currentPage.value > 1) currentPage.value -= 1
    await loadData()
  } catch {
    ElMessage.error('删除失败')
  } finally {
    deletingId.value = ''
  }
}

async function rerenderAll(): Promise<void> {
  const confirmed = await ElMessageBox.confirm(
    `将重新渲染全部${config.value.title}，是否继续？`,
    '重新渲染全部',
    {confirmButtonText: '开始渲染', cancelButtonText: '取消', type: 'info'},
  ).then(() => true).catch(() => false)
  if (!confirmed) return

  rerendering.value = true
  try {
    const resp = await fetch(`${config.value.endpoint}/rerender-all`)
    if (!resp.ok) throw new Error('rerender failed')
    ElMessage.success('渲染成功')
  } catch {
    ElMessage.error('渲染失败')
  } finally {
    rerendering.value = false
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
.list-page-head {
  display: flex;
  margin-bottom: 22px;
  align-items: center;
  justify-content: space-between;
}

.list-page-head h1 {
  margin: 0;
  font-family: var(--fj-font-display);
  font-size: 29px;
  font-weight: 600;
  letter-spacing: .03em;
}

.list-page-head h1 span {
  display: inline-block;
  margin-left: 9px;
  padding: 4px 9px;
  border-radius: 20px;
  vertical-align: middle;
  color: #7d8881;
  background: #e7eae5;
  font: 13px var(--fj-font-body);
}

.list-page-head p {
  margin: 7px 0 0;
  color: var(--fj-text-secondary);
  font-size: 13px;
}

.list-page-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.list-page-actions .el-button {
  height: 40px;
  padding: 0 15px;
}

.list-create {
  display: flex;
  height: 40px;
  padding: 0 16px;
  border-radius: 7px;
  align-items: center;
  gap: 7px;
  color: #fff;
  background: var(--fj-clay-600);
  box-shadow: 0 4px 12px rgb(185 71 50 / 12%);
  text-decoration: none;
}

.list-create:hover {
  background: var(--fj-clay-700);
}

.list-card {
  overflow: hidden;
  min-height: 210px;
  border: 1px solid var(--fj-border);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 2px rgb(16 41 35 / 2%);
}

.list-toolbar {
  display: flex;
  height: 58px;
  padding: 0 20px;
  border-bottom: 1px solid var(--fj-border);
  align-items: center;
  justify-content: space-between;
  color: #7b8780;
  font-size: 12px;
}

.list-toolbar b {
  color: #3e4a44;
  font-weight: 500;
}

.list-error {
  display: flex;
  padding: 10px 20px;
  align-items: center;
  justify-content: space-between;
  color: var(--fj-danger);
  background: var(--fj-danger-bg);
  font-size: 12px;
}

.list-table-wrap {
  overflow-x: auto;
}

.content-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.content-table th {
  height: 43px;
  padding: 0 18px;
  border-bottom: 1px solid var(--fj-border);
  color: #7c8781;
  background: var(--fj-bg-subtle);
  font-size: 11px;
  font-weight: 500;
  text-align: left;
}

.content-table th:first-child,
.content-table td:first-child {
  padding-left: 22px;
}

.content-table th:last-child {
  text-align: right;
}

.content-table td {
  height: 68px;
  padding: 0 18px;
  border-bottom: 1px solid #edf0eb;
  font-size: 13px;
}

.content-table tbody tr:hover {
  background: #fbfcf9;
}

.author-column {
  width: 170px;
}

.date-column {
  width: 180px;
}

.action-column {
  width: 104px;
}

.content-title {
  overflow: hidden;
  color: #26332d;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content-alias {
  overflow: hidden;
  margin-top: 5px;
  color: #929b96;
  font: 10px var(--fj-font-mono);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content-author {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #58645e;
  font-size: 12px;
}

.content-author > span {
  display: grid;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  place-items: center;
  color: #4e675b;
  background: #edf1ec;
  font-size: 10px;
}

.content-date {
  color: #6e7a73;
  font-size: 12px;
}

.content-actions {
  display: flex;
  justify-content: flex-end;
  gap: 3px;
}

.content-actions .el-button {
  width: 31px;
  height: 31px;
  margin: 0;
  padding: 0;
  color: #6c7972;
}

.content-actions .el-button:hover {
  color: var(--fj-pine-800);
  background: #edf1ec;
}

.content-actions .delete-button:hover {
  color: var(--fj-danger);
  background: var(--fj-danger-bg);
}

.list-pagination {
  display: flex;
  min-height: 62px;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.list-pagination > span {
  color: #87918b;
  font-size: 11px;
}

.list-empty {
  padding: 50px 20px;
  color: var(--fj-text-secondary);
  text-align: center;
}

.list-empty > .el-icon {
  color: #a3ada6;
  font-size: 30px;
}

.list-empty h2 {
  margin: 12px 0 6px;
  color: var(--fj-text-primary);
  font-family: var(--fj-font-display);
  font-size: 20px;
}

.list-empty p {
  margin: 0 0 18px;
  font-size: 12px;
}

.list-empty a {
  color: var(--fj-clay-600);
  font-size: 13px;
}

@media (max-width: 767px) {
  .list-page-head {
    align-items: flex-start;
  }

  .list-page-actions .el-button {
    width: 40px;
    padding: 0;
  }

  .list-page-actions .rerender-label {
    display: none;
  }

  .author-column,
  .content-table th:nth-child(2),
  .content-table td:nth-child(2) {
    display: none;
  }

  .date-column {
    width: 140px;
  }

  .action-column {
    width: 90px;
  }

  .list-pagination > span {
    display: none;
  }

  .list-pagination {
    justify-content: center;
  }
}
</style>
