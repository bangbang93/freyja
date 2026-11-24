<template>
  <button
    class="attachment-card"
    type="button"
    @click="view"
  >
    <div class="attachment-thumb">
      <img
        v-if="isImage"
        :src="attachment.path"
        :alt="attachment.filename"
        loading="lazy"
      >
      <div
        v-else
        class="attachment-placeholder"
      >
        <el-icon><Document /></el-icon>
      </div>
      <span class="attachment-type">{{ fileType }}</span>
      <span class="attachment-open-icon"><el-icon><TopRight /></el-icon></span>
    </div>
    <div class="attachment-info">
      <div
        class="attachment-filename"
        :title="attachment.filename"
      >
        {{ attachment.filename }}
      </div>
      <div class="attachment-meta">
        <time>{{ formattedTime }}</time>
        <span>打开文件 <el-icon><TopRight /></el-icon></span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import {Document, TopRight} from '@element-plus/icons-vue'
import {computed} from 'vue'

interface Attachment {
  _id: string
  path: string
  filename: string
  createdAt: string
}

const props = defineProps<{
  attachment: Attachment
}>()
const isImage = computed(() => /\.(?:png|jpe?g|gif|webp|svg|avif)$/i.test(props.attachment.filename))
const fileType = computed(() => {
  const match = /\.(?<extension>[a-z0-9]+)$/i.exec(props.attachment.filename)
  return match?.groups?.extension.toUpperCase() ?? 'FILE'
})
const formattedTime = computed(() => new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date(props.attachment.createdAt)))

function view(): void {
  window.open(props.attachment.path, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
.attachment-card {
  overflow: hidden;
  width: 100%;
  padding: 0;
  border: 1px solid var(--fj-border);
  border-radius: 11px;
  color: var(--fj-text-primary);
  background: var(--fj-bg-surface);
  box-shadow: var(--fj-shadow-sm);
  text-align: left;
  cursor: pointer;
  transition:
    transform var(--fj-duration-base),
    box-shadow var(--fj-duration-base),
    border-color var(--fj-duration-base);
}

.attachment-card:hover {
  border-color: var(--fj-border-strong);
  box-shadow: var(--fj-shadow-md);
  transform: translateY(-2px);
}

.attachment-thumb {
  position: relative;
  height: 135px;
  background: var(--fj-pine-100);
}

.attachment-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.attachment-placeholder {
  display: grid;
  height: 100%;
  place-items: center;
  color: var(--fj-pine-800);
  font-size: 38px;
}

.attachment-type {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 6px;
  border-radius: 4px;
  color: var(--fj-text-regular);
  background: var(--fj-bg-surface);
  font-size: 9px;
}

.attachment-open-icon {
  position: absolute;
  top: 9px;
  right: 9px;
  display: grid;
  width: 27px;
  height: 27px;
  border-radius: 6px;
  place-items: center;
  color: var(--fj-text-inverse);
  background: var(--fj-pine-900);
  opacity: 0;
  transition: opacity var(--fj-duration-fast);
}

.attachment-card:hover .attachment-open-icon,
.attachment-card:focus-visible .attachment-open-icon {
  opacity: 1;
}

.attachment-info {
  padding: 12px 13px 13px;
}

.attachment-filename {
  overflow: hidden;
  margin-bottom: 7px;
  font-size: 12px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--fj-text-tertiary);
  font-size: 10px;
}

.attachment-meta span {
  display: flex;
  align-items: center;
  gap: 2px;
}
</style>
