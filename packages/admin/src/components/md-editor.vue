<template>
  <div class="freyja-md-editor">
    <mavon-editor
      ref="editor"
      v-model="content"
      :ishljs="true"
      @change="onChange"
      @imgAdd="onImgAdd"
    />
  </div>
</template>
<script setup lang="ts">
import ky from 'ky'
import VueMavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import {computed, ref, unref} from 'vue'

const MavonEditor = VueMavonEditor.mavonEditor
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue', 'attachAdd'])
const content = computed({
  get() {
    return props.modelValue
  },
  set(val: string) {
    emit('update:modelValue', val)
  },
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment
const editor = ref<any>(null)

function onChange(val: string): void {
  emit('update:modelValue', val)
}

async function onImgAdd(filename: string, file: File): Promise<void> {
  const formData = new FormData()
  formData.append('filename', filename)
  formData.append('file', file)
  const resp = await ky.post('/api/admin/attachment', {
    body: formData,
  })
  const body = await resp.json<{path: string;_id: string}>()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  editor?.value?.$img2Url(filename, body.path)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  unref(editor)?.$refs['toolbar_left'].$imgUpdateByFilename(
    filename,
    body.path,
  )
  emit('attachAdd', {
    id: body._id,
    path: body.path,
    filename: file.name,
  })
}

</script>

<style>
.freyja-md-editor {
  height: 100%;
  width: 100%;
  min-height: 500px;
}
</style>
