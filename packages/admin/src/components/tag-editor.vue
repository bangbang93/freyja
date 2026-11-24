<template>
  <div class="tag-container">
    <el-tag
      v-for="(tag, index) in selectedTags"
      :key="`${tag}-${index}`"
      :closable="closable"
      :close-transition="true"
      effect="light"
      @close="onClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-autocomplete
      v-if="isInputVisible"
      v-model="tagInput"
      size="small"
      :fetch-suggestions="searchTag"
      class="input-new-tag"
      placeholder="输入标签名称"
      @select="onSelectTag"
      @keydown.enter.prevent="onSelectTag(tagInput)"
      @blur="hideInput"
    />
    <el-button
      v-if="!isInputVisible"
      size="small"
      class="button-new-tag"
      @click="showInput"
    >
      ＋ 添加标签
    </el-button>
  </div>
</template>

<script setup lang="ts">
import {nextTick, ref} from 'vue'

const props = withDefaults(defineProps<{
  tags: string[]
  selectedTags: string[]
  closable?: boolean
}>(), {
  closable: false,
})

const emit = defineEmits<{
  'tag-add': [tag: string]
  'tag-close': [tag: string]
}>()
const tagInput = ref('')
const isInputVisible = ref(false)

async function showInput(): Promise<void> {
  isInputVisible.value = true
  await nextTick()
}

function hideInput(): void {
  isInputVisible.value = false
}

function onSelectTag(tag: {value: string} | string): void {
  const value = typeof tag === 'object' ? tag.value : tag
  if (!value) return
  emit('tag-add', value)
  tagInput.value = ''
}

function searchTag(query: string, callback: (tags: Array<{value: string}>) => void): void {
  callback(
    props.tags
      .filter((tag) => tag.includes(query))
      .map((tag) => ({value: tag})),
  )
}

function onClose(tag: string): void {
  emit('tag-close', tag)
}
</script>

<style scoped>
.tag-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.tag-container :deep(.el-tag) {
  border-color: #e0e7e0;
  color: #405b4e;
  background: #eef2ed;
}

.input-new-tag {
  width: 150px;
}

.button-new-tag {
  margin: 0;
  border-style: dashed;
  color: #6e7b74;
  background: #fafbf8;
}
</style>
