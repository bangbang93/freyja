<template>
  <div class="freyja-md-editor">
    <mavon-editor v-model="content" @change="onChange" @imgAdd="onImgAdd"></mavon-editor>
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
      onImgAdd(filename, file) {
        console.log(filename, file);
      }
    }
  }
</script>
<style>
  .freyja-md-editor {
    height: 100%;
  }
</style>
