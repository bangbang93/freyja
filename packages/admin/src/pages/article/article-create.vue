<template>
  <ContentEditor
    v-model:title="article.title"
    v-model:name="article.slug"
    v-model:content="article.content"
    kind="文章"
    :editing="Boolean(edit.id)"
    name-label="别名"
    list-route="/articles"
    :save-label="edit.id ? '保存修改' : '发布文章'"
    :dirty="dirty"
    :saving="saving"
    :loading="!initialized"
    :error-message="errorMessage"
    @title-blur="onTitleBlur"
    @name-blur="onSlugBlur"
    @attach-add="onAttachAdd"
    @save="submit"
  >
    <template #name-suffix>
      <span class="auto-slug">{{ autoSlug ? '自动生成' : '手动设置' }}</span>
    </template>
    <template #settings>
      <div class="settings-head">
        <h2>文章设置</h2>
      </div>
      <section class="settings-section">
        <div class="settings-label">
          分类 <span>可多选</span>
        </div>
        <el-tree
          ref="categories"
          :data="categoriesTree"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          empty-text="暂无分类"
          @check="dirty = true"
        />
      </section>
      <section class="settings-section">
        <div class="settings-label">
          标签 <span>选择或创建</span>
        </div>
        <FreyjaTagEditor
          :tags="tags"
          :selected-tags="article.tags"
          closable
          @tag-add="onTagAdd"
          @tag-close="onTagClose"
        />
      </section>
      <section class="settings-section">
        <div class="settings-label">
          附件
        </div>
        <div class="attachment-note">
          <el-icon><Picture /></el-icon>
          <span>在编辑器工具栏上传图片，附件会自动关联到本文。</span>
        </div>
      </section>
    </template>
  </ContentEditor>
</template>

<script setup lang="ts">
import {Picture} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox, ElTree} from 'element-plus'
import limax from 'limax'
import {computed, nextTick, onMounted, reactive, ref, watch} from 'vue'
import {onBeforeRouteLeave, useRoute, useRouter} from 'vue-router'
import ContentEditor from '../../components/content-editor.vue'
import FreyjaTagEditor from '../../components/tag-editor.vue'

interface Tree {
  id: string
  label: string
  children: Tree[]
}

interface CategoryResponse {
  _id: string
  name: string
  children?: CategoryResponse[]
}

interface ArticleResponse {
  _id: string
  title: string
  content: string
  slug: string
  tags?: string[]
  categories?: string[]
  attachments?: string[]
}

const route = useRoute()
const router = useRouter()
const article = reactive({
  title: '',
  content: '',
  slug: '',
  tags: [] as string[],
  categories: [] as string[],
})
const attachments = ref<string[]>([])
const tags = ref<string[]>([])
const edit = reactive({id: ''})
const categories = ref<InstanceType<typeof ElTree> | null>(null)
const categoryItems = ref<CategoryResponse[]>([])
const autoSlug = ref(true)
const dirty = ref(false)
const initialized = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const categoriesTree = computed(() => categoryItems.value.map(walk))

watch([article, attachments], () => {
  if (initialized.value) dirty.value = true
}, {deep: true})

onBeforeRouteLeave((_, __, next) => {
  if (!dirty.value) {
    next()
    return
  }
  ElMessageBox.confirm('文章没有保存，是否离开？', '离开文章编辑', {
    confirmButtonText: '离开',
    cancelButtonText: '继续编辑',
    type: 'warning',
  }).then(() => next()).catch(() => next(false))
})

onMounted(async () => {
  try {
    await initData()
    if (route.name === 'article.edit') await initEdit(route.params.id as string)
  } catch {
    errorMessage.value = '暂时无法加载文章数据，请刷新后重试。'
  } finally {
    initialized.value = true
  }
})

function walk(root: CategoryResponse): Tree {
  return {
    id: root._id,
    label: root.name,
    children: (root.children ?? []).map(walk),
  }
}

async function initData(): Promise<void> {
  const [tagResp, categoryResp] = await Promise.all([
    fetch('/api/admin/tag'),
    fetch('/api/category/tree'),
  ])
  if (!tagResp.ok || !categoryResp.ok) throw new Error('editor data request failed')
  const [tagBody, categoryBody] = await Promise.all([
    tagResp.json() as Promise<Array<{title: string}>>,
    categoryResp.json() as Promise<CategoryResponse[]>,
  ])
  tags.value = tagBody.map((tag) => tag.title)
  categoryItems.value = categoryBody
}

async function initEdit(id: string): Promise<void> {
  const resp = await fetch(`/api/admin/article/${id}`)
  if (!resp.ok) throw new Error('article request failed')
  const data = await resp.json() as ArticleResponse
  article.title = data.title
  article.content = data.content
  article.slug = data.slug
  article.tags = data.tags ?? []
  article.categories = data.categories ?? []
  attachments.value = data.attachments ?? []
  edit.id = data._id
  autoSlug.value = !data.slug
  await nextTick()
  categories.value?.setCheckedKeys(article.categories)
}

async function submit(): Promise<void> {
  if (saving.value) return
  saving.value = true
  errorMessage.value = ''
  const data = {
    ...article,
    attachments: attachments.value,
    categories: categories.value!.getCheckedKeys() as string[],
  }
  try {
    const resp = await fetch(edit.id ? `/api/admin/article/${edit.id}` : '/api/admin/article', {
      method: edit.id ? 'PUT' : 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
    if (resp.status !== 201 && resp.status !== 200) {
      const body = await resp.json() as {message?: string, msg?: string}
      errorMessage.value = body.msg ?? body.message ?? '保存失败。'
      return
    }
    dirty.value = false
    ElMessage.success('保存成功')
    await router.push({name: 'article.list'})
  } catch {
    errorMessage.value = '保存失败，请检查网络后重试。'
  } finally {
    saving.value = false
  }
}

function onAttachAdd({id}: {id: string}): void {
  attachments.value.push(id)
}

function onTagClose(tag: string): void {
  article.tags.splice(article.tags.indexOf(tag), 1)
}

async function onTagAdd(value: string): Promise<void> {
  if (article.tags.includes(value)) return
  try {
    const resp = await fetch(`/api/admin/tag/${encodeURIComponent(value)}`, {method: 'PUT'})
    if (resp.status !== 201 && resp.status !== 200) throw new Error('tag request failed')
    article.tags.push(value)
    if (!tags.value.includes(value)) tags.value.push(value)
  } catch {
    errorMessage.value = '添加标签失败。'
  }
}

function onTitleBlur(): void {
  if (autoSlug.value) article.slug = limax(article.title)
}

function onSlugBlur(): void {
  autoSlug.value = !article.slug
  onTitleBlur()
}
</script>

<style scoped>
.settings-head {
  display: flex;
  height: 50px;
  margin: 0 18px;
  border-bottom: 1px solid #e8ece6;
  align-items: center;
}

.settings-head h2 {
  margin: 0;
  font-size: 13px;
}

.settings-section {
  margin: 0 18px;
  padding: 17px 0;
  border-bottom: 1px solid #e8ece6;
}

.settings-section:last-child {
  border-bottom: 0;
}

.settings-label {
  display: flex;
  margin-bottom: 12px;
  justify-content: space-between;
  color: #6f7b74;
  font-size: 11px;
  font-weight: 600;
}

.settings-label span {
  color: #98a09b;
  font-weight: 400;
}

.auto-slug {
  padding: 3px 6px;
  border-radius: 4px;
  color: var(--fj-success);
  background: var(--fj-success-bg);
  font-size: 10px;
  white-space: nowrap;
}

.attachment-note {
  display: flex;
  padding: 10px;
  border-radius: 7px;
  align-items: flex-start;
  gap: 8px;
  color: #78847d;
  background: var(--fj-bg-subtle);
  font-size: 10px;
  line-height: 1.55;
}

.attachment-note .el-icon {
  margin-top: 2px;
  color: #75867b;
  flex: none;
}
</style>
