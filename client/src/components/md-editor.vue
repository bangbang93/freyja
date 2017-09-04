<template>
  <div class="freyja-md-editor">
    <mavon-editor v-model="content" @change="onChange" @imgAdd="onImgAdd" ref="editor"></mavon-editor>
  </div>
</template>
<script>
  import {mavonEditor} from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'

  export default {
    name: 'FreyjaMdEditor',
    components: {
      mavonEditor,
    },
    props: {
      value: String
    },
    data() {
      return {
        content: this.value,
      }
    },
    methods: {
      onChange(val, render) {
        this.$emit('input', val, render)
      },
      async onImgAdd(filename, file) {
        const formData = new FormData();
        formData.append('filename', filename)
        formData.append('file', file)
        const resp = await this.$fetch.post('/api/admin/attachment', formData)
        const body = await resp.json()
        this.$refs['editor'].$img2Url(filename, body.path)
        this.$refs['editor'].$refs['toolbar_left'].$imgUpdateByFilename(filename, body.path)
      }
    }
  }
</script>
<style>
  .freyja-md-editor {
    height: 100%;
  }
</style>
