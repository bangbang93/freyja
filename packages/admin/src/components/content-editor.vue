<template>
  <div class="content-editor-page">
    <section class="editor-page-head">
      <div class="editor-heading">
        <router-link
          class="editor-back"
          :to="listRoute"
          aria-label="返回列表"
        >
          <el-icon><ArrowLeft /></el-icon>
        </router-link>
        <div>
          <h1>{{ heading }}</h1>
          <div
            class="editor-status"
            :class="{ 'is-dirty': dirty }"
          >
            {{ dirty ? '有尚未保存的修改' : '没有未保存的修改' }}
          </div>
        </div>
      </div>
      <div class="editor-page-actions">
        <router-link
          class="editor-return"
          :to="listRoute"
        >
          返回列表
        </router-link>
        <el-button
          type="primary"
          :loading="saving"
          :disabled="loading"
          @click="emit('save')"
        >
          <el-icon><Check /></el-icon>
          {{ saveLabel }}
        </el-button>
      </div>
    </section>

    <div
      v-if="errorMessage"
      class="editor-error"
      role="alert"
    >
      <el-icon><Warning /></el-icon>
      {{ errorMessage }}
    </div>

    <div
      class="editor-workspace"
      :class="{ 'has-settings': hasSettings }"
    >
      <section class="editor-card">
        <div class="editor-title-block">
          <input
            class="editor-title-input"
            :value="title"
            :placeholder="`输入${kind}标题…`"
            :disabled="loading"
            @input="onTitleInput"
            @blur="emit('title-blur')"
          >
          <div class="editor-name-row">
            <label for="content-name">{{ nameLabel }}</label>
            <input
              id="content-name"
              :value="name"
              :disabled="loading"
              @input="onNameInput"
              @blur="emit('name-blur')"
            >
            <slot name="name-suffix" />
          </div>
        </div>
        <MdEditor
          :model-value="content"
          :editable="!loading"
          @update:model-value="emit('update:content', $event)"
          @attach-add="emit('attach-add', $event)"
        />
        <div class="editor-footer">
          <span>Markdown · 已启用代码高亮</span>
          <span>{{ content.length }} 字</span>
        </div>
      </section>
      <aside
        v-if="hasSettings"
        class="editor-settings"
      >
        <slot name="settings" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ArrowLeft, Check, Warning} from '@element-plus/icons-vue'
import {computed, useSlots} from 'vue'
import MdEditor from './md-editor.vue'

const props = defineProps<{
  title: string
  name: string
  content: string
  kind: '文章' | '页面'
  editing: boolean
  nameLabel: string
  listRoute: string
  saveLabel: string
  dirty: boolean
  saving: boolean
  loading: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  'update:title': [value: string]
  'update:name': [value: string]
  'update:content': [value: string]
  'title-blur': []
  'name-blur': []
  'attach-add': [value: {id: string}]
  save: []
}>()
const slots = useSlots()
const heading = computed(() => `${props.editing ? '编辑' : '新建'}${props.kind}`)
const hasSettings = computed(() => Boolean(slots.settings))

function onTitleInput(event: Event): void {
  emit('update:title', (event.target as HTMLInputElement).value)
}

function onNameInput(event: Event): void {
  emit('update:name', (event.target as HTMLInputElement).value)
}
</script>

<style scoped>
.editor-page-head {
  display: flex;
  margin-bottom: 18px;
  align-items: center;
  justify-content: space-between;
}

.editor-heading {
  display: flex;
  align-items: center;
  gap: 13px;
}

.editor-back {
  display: grid;
  width: 36px;
  height: 36px;
  border: 1px solid #d4dbd4;
  border-radius: 8px;
  place-items: center;
  color: #627169;
  background: #fff;
}

.editor-back:hover {
  color: var(--fj-clay-600);
  border-color: var(--fj-clay-600);
}

.editor-page-head h1 {
  margin: 0;
  font-family: var(--fj-font-display);
  font-size: 25px;
  font-weight: 600;
}

.editor-status {
  display: flex;
  margin-top: 5px;
  align-items: center;
  gap: 5px;
  color: var(--fj-text-tertiary);
  font-size: 11px;
}

.editor-status::before {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--fj-success);
  content: '';
}

.editor-status.is-dirty::before {
  background: var(--fj-warning);
}

.editor-page-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.editor-return {
  display: flex;
  height: 39px;
  padding: 0 15px;
  border: 1px solid #cfd6cf;
  border-radius: 7px;
  align-items: center;
  color: #35423c;
  background: #fff;
  text-decoration: none;
}

.editor-return:hover {
  background: var(--fj-bg-subtle);
}

.editor-page-actions .el-button {
  height: 39px;
  padding: 0 16px;
}

.editor-error {
  display: flex;
  margin-bottom: 14px;
  padding: 11px 14px;
  border: 1px solid #efcccc;
  border-radius: 8px;
  align-items: center;
  gap: 8px;
  color: var(--fj-danger);
  background: var(--fj-danger-bg);
  font-size: 12px;
}

.editor-workspace {
  display: grid;
  align-items: start;
  gap: 18px;
  grid-template-columns: minmax(0, 1fr);
}

.editor-workspace.has-settings {
  grid-template-columns: minmax(0, 1fr) 280px;
}

.editor-card,
.editor-settings {
  overflow: hidden;
  border: 1px solid var(--fj-border);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 2px rgb(16 41 35 / 2%);
}

.editor-title-block {
  padding: 21px 24px 15px;
}

.editor-title-input {
  width: 100%;
  padding: 0 0 14px;
  border: 0;
  outline: 0;
  color: var(--fj-text-primary);
  background: transparent;
  font: 600 24px var(--fj-font-display);
}

.editor-title-input:focus-visible,
.editor-name-row input:focus-visible {
  border-radius: 2px;
  outline: 2px solid var(--fj-focus);
  outline-offset: 3px;
}

.editor-title-input::placeholder {
  color: #a0a8a3;
}

.editor-name-row {
  display: flex;
  height: 32px;
  border-top: 1px solid #edf0eb;
  align-items: flex-end;
  gap: 8px;
  color: #87918b;
  font-size: 11px;
}

.editor-name-row input {
  min-width: 0;
  border: 0;
  outline: 0;
  color: #627169;
  background: transparent;
  font: 11px var(--fj-font-mono);
  flex: 1;
}

.editor-title-input:disabled,
.editor-name-row input:disabled {
  cursor: wait;
}

.editor-footer {
  display: flex;
  height: 32px;
  padding: 0 14px;
  border-top: 1px solid var(--fj-border);
  align-items: center;
  justify-content: space-between;
  color: #919a95;
  background: #fafaf7;
  font-size: 10px;
}

@media (max-width: 1100px) {
  .editor-workspace.has-settings {
    grid-template-columns: minmax(0, 1fr) 250px;
  }
}

@media (max-width: 767px) {
  .editor-workspace.has-settings {
    grid-template-columns: 1fr;
  }

  .editor-settings {
    order: 2;
  }

  .editor-page-head h1 {
    font-size: 22px;
  }

  .editor-return {
    display: none;
  }

  .editor-title-block {
    padding: 18px;
  }

  .editor-title-input {
    font-size: 21px;
  }
}
</style>
