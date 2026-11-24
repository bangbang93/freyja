<template>
  <div class="freyja-md-editor">
    <mavon-editor
      ref="editor"
      v-model="content"
      :ishljs="true"
      @img-add="onImgAdd"
    />
  </div>
</template>

<script setup lang="ts">
import {ElMessage} from 'element-plus'
import ky from 'ky'
import VueMavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import {computed, ref} from 'vue'

interface MavonEditorInstance {
  $img2Url: (filename: string, url: string) => void
  $refs: {
    toolbar_left: {
      $imgUpdateByFilename: (filename: string, path: string) => void
    }
  }
}

const MavonEditor = VueMavonEditor.mavonEditor
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})
const emit = defineEmits<{
  'update:modelValue': [value: string]
  attachAdd: [value: {id: string, path: string, filename: string}]
}>()
const content = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
const editor = ref<MavonEditorInstance | null>(null)

async function onImgAdd(filename: string, file: File): Promise<void> {
  const formData = new FormData()
  formData.append('filename', filename)
  formData.append('file', file)
  try {
    const resp = await ky.post('/api/admin/attachment', {body: formData})
    const body = await resp.json<{path: string, _id: string}>()
    editor.value?.$img2Url(filename, body.path)
    editor.value?.$refs.toolbar_left.$imgUpdateByFilename(filename, body.path)
    emit('attachAdd', {
      id: body._id,
      path: body.path,
      filename: file.name,
    })
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
</script>

<style>
.freyja-md-editor {
  width: 100%;
  min-height: 420px;
}

.freyja-md-editor .v-note-wrapper {
  z-index: 1;
  height: 420px;
  min-height: 420px;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.freyja-md-editor .v-note-wrapper .v-note-op {
  border-bottom: 1px solid var(--fj-border);
  background: var(--fj-bg-subtle);
  box-shadow: none;
}

.freyja-md-editor .v-note-wrapper .v-note-op .v-left-item,
.freyja-md-editor .v-note-wrapper .v-note-op .v-right-item {
  color: #5e6b64;
}

.freyja-md-editor .v-note-wrapper .v-note-panel {
  border: 0;
  box-shadow: none;
}

.freyja-md-editor .v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper .content-input {
  color: #46564d;
  font-family: var(--fj-font-mono);
  font-size: 12px;
  line-height: 1.9;
}

.freyja-md-editor .v-note-wrapper .v-note-panel .v-note-show .v-show-content {
  color: #3f4b45;
  background: #fff;
  font-size: 13px;
}

.freyja-md-editor .v-note-wrapper .v-note-panel .v-note-navigation-wrapper {
  border-left: 1px solid var(--fj-border);
}

@media (max-width: 767px) {
  .freyja-md-editor,
  .freyja-md-editor .v-note-wrapper {
    min-height: 460px;
  }
}
</style>
