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

<script>
import {$emit, $off, $on, $once} from '../../utils/gogocodeTransfer'
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'FreyjaMdEditor',
  components: {
    mavonEditor,
  },
  props: {
    value: String,
  },
  emits: ['update:value', 'attachAdd'],
  data() {
    return {
      content: this.value,
    }
  },
  watch: {
    value() {
      this.content = this.value
    },
  },
  methods: {
    onChange(val, render) {
      $emit(this, 'update:value', val, render)
    },
    async onImgAdd(filename, file) {
      const formData = new FormData()
      formData.append('filename', filename)
      formData.append('file', file)
      const resp = await this.$fetch.post('/api/admin/attachment', formData)
      const body = await resp.json()
      this.$refs['editor'].$img2Url(filename, body.path)
      this.$refs['editor'].$refs['toolbar_left'].$imgUpdateByFilename(
        filename,
        body.path,
      )
      $emit(this, 'attachAdd', {
        id: body._id,
        url: body.path,
        filename: file.name,
      })
    },
  },
}
</script>

<style>
.freyja-md-editor {
  height: 100%;
}
</style>
