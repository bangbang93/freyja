<template>
  <div class="attachment-page">
    <section class="attachment-page-head">
      <div>
        <h1>附件 <span>{{ total }}</span></h1>
        <p>管理文章中使用的图片与文件。</p>
      </div>
      <el-upload
        action="/api/admin/attachment"
        :with-credentials="true"
        :show-file-list="false"
        :on-change="updateUploadTask"
        :on-progress="onUploadProgress"
        :on-success="onUploadSuccess"
        :on-error="onUploadError"
        multiple
      >
        <el-button type="primary">
          <el-icon><Upload /></el-icon>
          上传文件
        </el-button>
      </el-upload>
    </section>

    <el-upload
      ref="dropzoneUpload"
      class="attachment-dropzone"
      action="/api/admin/attachment"
      :with-credentials="true"
      :show-file-list="false"
      :on-change="updateUploadTask"
      :on-progress="onUploadProgress"
      :on-success="onUploadSuccess"
      :on-error="onUploadError"
      drag
      multiple
    >
      <div class="dropzone-icon">
        <el-icon><Upload /></el-icon>
      </div>
      <div class="dropzone-copy">
        <b>将文件拖到这里，或 <em>点击选择文件</em></b>
        <span>支持图片与常见文档，上传后可在编辑器中引用</span>
      </div>
    </el-upload>

    <section
      v-if="uploadTasks.length"
      class="upload-tasks"
      aria-label="上传任务"
    >
      <div
        v-for="task in uploadTasks"
        :key="task.uid"
        class="upload-task"
      >
        <el-icon class="upload-task-icon">
          <Document />
        </el-icon>
        <div class="upload-task-main">
          <div class="upload-task-name">
            {{ task.name }}
          </div>
          <el-progress
            :percentage="task.percentage"
            :stroke-width="4"
            :show-text="false"
            :status="uploadProgressStatus(task)"
          />
        </div>
        <span
          class="upload-task-status"
          :class="`is-${task.status}`"
        >
          {{ uploadStatusText(task) }}
        </span>
        <el-button
          v-if="task.status === 'fail'"
          text
          type="primary"
          @click="retryUpload(task)"
        >
          <el-icon><Refresh /></el-icon>
          重试
        </el-button>
      </div>
    </section>

    <section
      v-loading="loading"
      class="attachment-results"
    >
      <div class="attachment-list-head">
        <h2>全部文件</h2>
        <span>按上传时间倒序</span>
      </div>
      <div
        v-if="errorMessage"
        class="attachment-error"
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
        v-if="!attachments.length && !loading && !errorMessage"
        class="attachment-empty"
      >
        还没有附件，上传第一个文件吧。
      </div>
      <div class="attachment-grid">
        <FreyjaAttachmentCard
          v-for="attachment in attachments"
          :key="attachment._id"
          :attachment="attachment"
        />
      </div>
      <div class="attachment-pagination">
        <span>共 {{ total }} 个文件 · 每页 {{ pageSize }} 个</span>
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
    </section>
  </div>
</template>

<script setup lang="ts">
import {Document, Refresh, Upload} from '@element-plus/icons-vue'
import {ElMessage, UploadFile, UploadInstance, UploadProgressEvent, UploadRawFile} from 'element-plus'
import {onMounted, ref} from 'vue'
import FreyjaAttachmentCard from '../../components/attachment-card.vue'

interface Attachment {
  _id: string
  path: string
  filename: string
  createdAt: string
}

interface UploadTask {
  uid: number
  name: string
  status: 'uploading' | 'success' | 'fail'
  percentage: number
  raw: UploadRawFile
}

defineOptions({name: 'FreyjaAttachmentList'})

const attachments = ref<Attachment[]>([])
const pageSize = 20
const total = ref(0)
const currentPage = ref(1)
const loading = ref(true)
const errorMessage = ref('')
const uploadTasks = ref<UploadTask[]>([])
const dropzoneUpload = ref<UploadInstance>()

onMounted(loadData)

async function loadData(): Promise<void> {
  loading.value = true
  errorMessage.value = ''
  try {
    const [listResp, countResp] = await Promise.all([
      fetch(`/api/admin/attachment?page=${currentPage.value}&limit=${pageSize}`),
      fetch('/api/admin/attachment/count'),
    ])
    if (!listResp.ok || !countResp.ok) throw new Error('attachment request failed')
    const [list, count] = await Promise.all([
      listResp.json() as Promise<Attachment[]>,
      countResp.json() as Promise<{count: number}>,
    ])
    attachments.value = list
    total.value = count.count
  } catch {
    errorMessage.value = '暂时无法加载附件列表。'
  } finally {
    loading.value = false
  }
}

function updateUploadTask(file: UploadFile): void {
  const task: UploadTask = {
    uid: file.uid,
    name: file.name,
    status: file.status === 'ready' ? 'uploading' : file.status,
    percentage: Math.round(file.percentage ?? 0),
    raw: file.raw!,
  }
  const index = uploadTasks.value.findIndex((item) => item.uid === file.uid)
  if (index === -1) {
    uploadTasks.value.unshift(task)
  } else {
    uploadTasks.value[index] = task
  }
}

function onUploadProgress(event: UploadProgressEvent, file: UploadFile): void {
  const task = uploadTasks.value.find((item) => item.uid === file.uid)!
  task.percentage = Math.round(event.percent)
  task.status = 'uploading'
}

async function onUploadSuccess(_response: unknown, file: UploadFile): Promise<void> {
  file.percentage = 100
  updateUploadTask(file)
  currentPage.value = 1
  await loadData()
  ElMessage.success(`${file.name} 上传成功`)
}

function onUploadError(_error: Error, file: UploadFile): void {
  updateUploadTask(file)
  ElMessage.error(`${file.name} 上传失败`)
}

function retryUpload(task: UploadTask): void {
  uploadTasks.value = uploadTasks.value.filter((item) => item.uid !== task.uid)
  dropzoneUpload.value!.handleStart(task.raw)
  dropzoneUpload.value!.submit()
}

function uploadStatusText(task: UploadTask): string {
  if (task.status === 'uploading') return `上传中 ${task.percentage}%`
  return task.status === 'success' ? '成功' : '失败'
}

function uploadProgressStatus(task: UploadTask): 'exception' | 'success' | undefined {
  if (task.status === 'fail') return 'exception'
  return task.status === 'success' ? 'success' : undefined
}
</script>

<style scoped>
.attachment-page-head {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  justify-content: space-between;
}

.attachment-page-head h1 {
  margin: 0;
  font-family: var(--fj-font-display);
  font-size: 29px;
  font-weight: 600;
}

.attachment-page-head h1 span {
  display: inline-block;
  margin-left: 9px;
  padding: 4px 9px;
  border-radius: 20px;
  vertical-align: middle;
  color: var(--fj-text-secondary);
  background: var(--fj-pine-100);
  font: 13px var(--fj-font-body);
}

.attachment-page-head p {
  margin: 7px 0 0;
  color: var(--fj-text-secondary);
  font-size: 13px;
}

.attachment-page-head .el-button {
  height: 40px;
  padding: 0 16px;
}

.attachment-dropzone {
  display: block;
  margin-bottom: 22px;
}

.attachment-dropzone :deep(.el-upload),
.attachment-dropzone :deep(.el-upload-dragger) {
  width: 100%;
}

.attachment-dropzone :deep(.el-upload-dragger) {
  display: flex;
  height: 100px;
  padding: 0;
  border-color: var(--fj-border-strong);
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: var(--fj-bg-subtle);
  transition: border-color var(--fj-duration-base), background-color var(--fj-duration-base);
}

.attachment-dropzone :deep(.el-upload-dragger:hover) {
  border-color: var(--fj-clay-600);
  background: var(--fj-clay-100);
}

.dropzone-icon {
  display: grid;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  place-items: center;
  color: var(--fj-pine-800);
  background: var(--fj-pine-100);
  font-size: 20px;
}

.dropzone-copy b,
.dropzone-copy span {
  display: block;
}

.dropzone-copy b {
  margin-bottom: 5px;
  color: var(--fj-text-regular);
  font-size: 13px;
  font-weight: 500;
}

.dropzone-copy em {
  color: var(--fj-clay-600);
  font-style: normal;
}

.dropzone-copy span {
  color: var(--fj-text-tertiary);
  font-size: 11px;
}

.upload-tasks {
  margin: -8px 0 20px;
  border: 1px solid var(--fj-border);
  border-radius: 10px;
  background: var(--fj-bg-surface);
}

.upload-task {
  display: flex;
  padding: 11px 14px;
  border-bottom: 1px solid var(--fj-border);
  align-items: center;
  gap: 12px;
}

.upload-task:last-child {
  border-bottom: 0;
}

.upload-task-icon {
  color: var(--fj-text-secondary);
  font-size: 18px;
  flex: none;
}

.upload-task-main {
  min-width: 0;
  flex: 1;
}

.upload-task-name {
  overflow: hidden;
  margin-bottom: 6px;
  color: var(--fj-text-regular);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-task-status {
  min-width: 82px;
  color: var(--fj-text-secondary);
  font-size: 11px;
  text-align: right;
}

.upload-task-status.is-success {
  color: var(--fj-success);
}

.upload-task-status.is-fail {
  color: var(--fj-danger);
}

.upload-task .el-button {
  margin-left: 0;
  flex: none;
}

.attachment-results {
  min-height: 240px;
}

.attachment-list-head {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
  justify-content: space-between;
}

.attachment-list-head h2 {
  margin: 0;
  font-size: 13px;
}

.attachment-list-head span {
  color: var(--fj-text-tertiary);
  font-size: 11px;
}

.attachment-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.attachment-error {
  display: flex;
  margin-bottom: 12px;
  padding: 8px 14px;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
  color: var(--fj-danger);
  background: var(--fj-danger-bg);
  font-size: 12px;
}

.attachment-empty {
  padding: 44px 20px;
  border: 1px solid var(--fj-border);
  border-radius: 12px;
  color: var(--fj-text-tertiary);
  background: var(--fj-bg-surface);
  font-size: 12px;
  text-align: center;
}

.attachment-pagination {
  display: flex;
  min-height: 60px;
  margin-top: 14px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.attachment-pagination > span {
  color: var(--fj-text-tertiary);
  font-size: 11px;
}

@media (max-width: 1100px) {
  .attachment-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .attachment-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dropzone-copy span {
    display: none;
  }

  .attachment-pagination > span {
    display: none;
  }

  .attachment-pagination {
    justify-content: center;
  }
}
</style>
