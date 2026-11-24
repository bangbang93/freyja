<template>
  <div class="tag-page">
    <section class="tag-page-head">
      <div>
        <h1>标签 <span>{{ tags.length }}</span></h1>
        <p>整理内容主题，让文章更容易被找到。</p>
      </div>
    </section>
    <section
      v-loading="loading"
      class="tag-card"
    >
      <div class="tag-card-head">
        <h2>全部标签</h2>
        <span>选择已有标签，或输入名称创建</span>
      </div>
      <div
        v-if="errorMessage"
        class="tag-error"
      >
        {{ errorMessage }}
        <el-button
          text
          @click="loadTags"
        >
          重试
        </el-button>
      </div>
      <div class="tag-cloud">
        <FreyjaTagEditor
          :tags="tags"
          :selected-tags="tags"
          @tag-add="onTagAdd"
        />
      </div>
      <p class="tag-note">
        标签创建后可在文章编辑器中使用。
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import {ElMessage} from 'element-plus'
import {onMounted, ref} from 'vue'
import FreyjaTagEditor from '../../components/tag-editor.vue'

defineOptions({name: 'FreyjaTagList'})

const tags = ref<string[]>([])
const loading = ref(true)
const errorMessage = ref('')

onMounted(loadTags)

async function loadTags(): Promise<void> {
  loading.value = true
  errorMessage.value = ''
  try {
    const resp = await fetch('/api/admin/tag')
    if (!resp.ok) throw new Error('tag request failed')
    const body = await resp.json() as Array<{title: string}>
    tags.value = body.map((tag) => tag.title)
  } catch {
    errorMessage.value = '暂时无法加载标签。'
  } finally {
    loading.value = false
  }
}

async function onTagAdd(title: string): Promise<void> {
  if (tags.value.includes(title)) return
  try {
    const resp = await fetch(`/api/admin/tag/${encodeURIComponent(title)}`, {method: 'PUT'})
    if (resp.status !== 201 && resp.status !== 200) throw new Error('tag request failed')
    tags.value.push(title)
    ElMessage.success('标签已添加')
  } catch {
    ElMessage.error('添加标签失败')
  }
}
</script>

<style scoped>
.tag-page-head {
  margin-bottom: 22px;
}

.tag-page-head h1 {
  margin: 0;
  font-family: var(--fj-font-display);
  font-size: 29px;
  font-weight: 600;
}

.tag-page-head h1 span {
  display: inline-block;
  margin-left: 9px;
  padding: 4px 9px;
  border-radius: 20px;
  vertical-align: middle;
  color: var(--fj-text-secondary);
  background: var(--fj-pine-100);
  font: 13px var(--fj-font-body);
}

.tag-page-head p {
  margin: 7px 0 0;
  color: var(--fj-text-secondary);
  font-size: 13px;
}

.tag-card {
  min-height: 260px;
  border: 1px solid var(--fj-border);
  border-radius: 12px;
  background: var(--fj-bg-surface);
  box-shadow: var(--fj-shadow-sm);
}

.tag-card-head {
  display: flex;
  height: 58px;
  padding: 0 22px;
  border-bottom: 1px solid var(--fj-border);
  align-items: center;
  justify-content: space-between;
}

.tag-card-head h2 {
  margin: 0;
  font-size: 14px;
}

.tag-card-head span {
  color: var(--fj-text-tertiary);
  font-size: 11px;
}

.tag-cloud {
  padding: 28px 24px 20px;
}

.tag-cloud :deep(.el-tag) {
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
}

.tag-cloud :deep(.button-new-tag) {
  height: 32px;
  padding: 0 12px;
}

.tag-note {
  margin: 0;
  padding: 0 24px 24px;
  color: var(--fj-text-tertiary);
  font-size: 11px;
}

.tag-error {
  display: flex;
  padding: 8px 20px;
  align-items: center;
  justify-content: space-between;
  color: var(--fj-danger);
  background: var(--fj-danger-bg);
  font-size: 12px;
}

@media (max-width: 600px) {
  .tag-card-head span {
    display: none;
  }
}
</style>
