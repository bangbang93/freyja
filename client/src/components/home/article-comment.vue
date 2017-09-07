<template>
  <div>
    <el-button size="small" @click="toggleEditor">发表评论</el-button>
    <div v-for="comment in comments">{{comment.context}}</div>
    <freyja-comment-editor v-if="showEditor" @close="onCloseEditor"></freyja-comment-editor>
  </div>
</template>
<script>
  import FreyjaCommentEditor from './comment-editor.vue'
  import {Button} from 'element-ui'

  export default {
    name      : "FreyjaArticleComment",
    components: {
      FreyjaCommentEditor,
      ElButton: Button,
    },
    props: {
      comments: {
        type: Array,
        required: true,
      }
    },
    data() {
      return {
        showEditor: false,
      }
    },
    methods: {
      toggleEditor() {
        this.showEditor = !this.showEditor
      },
      onCloseEditor() {
        this.showEditor = false
      }
    }
  }
</script>
