<template>
  <ContentEditor
    v-model:title="page.title"
    v-model:name="page.name"
    v-model:content="page.content"
    kind="页面"
    :editing="Boolean(edit.id)"
    name-label="名称"
    list-route="/page"
    :save-label="edit.id ? '保存修改' : '发布页面'"
    :dirty="dirty"
    :saving="saving"
    :error-message="errorMessage"
    @attach-add="onAttachAdd"
    @save="submit"
  />
</template>

<script setup lang="ts">
import {ElMessage, ElMessageBox} from 'element-plus'
import {onMounted, reactive, ref, watch} from 'vue'
import {onBeforeRouteLeave, useRoute, useRouter} from 'vue-router'
import ContentEditor from '../../components/content-editor.vue'

defineOptions({name: 'FreyjaPageCreate'})

interface PageResponse {
  _id: string
  title: string
  content: string
  name: string
  attachments?: string[]
}

const route = useRoute()
const router = useRouter()
const page = reactive({title: '', content: '', name: ''})
const attachments = ref<string[]>([])
const edit = reactive({id: ''})
const dirty = ref(false)
const initialized = ref(false)
const saving = ref(false)
const errorMessage = ref('')

watch([page, attachments], () => {
  if (initialized.value) dirty.value = true
}, {deep: true})

onBeforeRouteLeave((_, __, next) => {
  if (!dirty.value) {
    next()
    return
  }
  ElMessageBox.confirm('页面没有保存，是否离开？', '离开页面编辑', {
    confirmButtonText: '离开',
    cancelButtonText: '继续编辑',
    type: 'warning',
  }).then(() => next()).catch(() => next(false))
})

onMounted(async () => {
  if (route.name === 'page.edit') {
    try {
      await initEdit(route.params.id as string)
    } catch {
      errorMessage.value = '暂时无法加载页面数据，请刷新后重试。'
    }
  }
  initialized.value = true
})

async function initEdit(id: string): Promise<void> {
  const resp = await fetch(`/api/admin/page/${id}`)
  if (!resp.ok) throw new Error('page request failed')
  const data = await resp.json() as PageResponse
  page.title = data.title
  page.content = data.content
  page.name = data.name
  attachments.value = data.attachments ?? []
  edit.id = data._id
}

async function submit(): Promise<void> {
  if (saving.value) return
  saving.value = true
  errorMessage.value = ''
  try {
    const resp = await fetch(edit.id ? `/api/admin/page/${edit.id}` : '/api/admin/page', {
      method: edit.id ? 'PUT' : 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({...page, attachments: attachments.value}),
    })
    if (resp.status !== 201 && resp.status !== 200) {
      const body = await resp.json() as {message?: string, msg?: string}
      errorMessage.value = body.msg ?? body.message ?? '保存失败。'
      return
    }
    dirty.value = false
    ElMessage.success('保存成功')
    await router.push({name: 'page.list'})
  } catch {
    errorMessage.value = '保存失败，请检查网络后重试。'
  } finally {
    saving.value = false
  }
}

function onAttachAdd({id}: {id: string}): void {
  attachments.value.push(id)
}
</script>
